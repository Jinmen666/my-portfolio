import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import crypto from 'crypto';
import {defineConfig, loadEnv} from 'vite';
import { createClient } from '@supabase/supabase-js';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      {
        name: 'admin-daily-api',
        configureServer(server) {
          server.middlewares.use('/api/admin/daily-posts', async (req, res) => {
            const respond = (status: number, payload: unknown) => {
              res.statusCode = status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload));
            };

            try {
              const adminToken = env.ADMIN_TOKEN;
              const supabaseUrl = env.SUPABASE_URL;
              const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

              if (!adminToken || !supabaseUrl || !serviceRoleKey) {
                respond(500, { error: 'Missing env vars for admin api' });
                return;
              }

              const chunks: Buffer[] = [];
              for await (const chunk of req) {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
              }
              const raw = Buffer.concat(chunks).toString('utf8') || '{}';
              const body = JSON.parse(raw);

              const token = String(body?.token || '');
              const aa = Buffer.from(token);
              const bb = Buffer.from(String(adminToken));
              if (!token || aa.length !== bb.length || !crypto.timingSafeEqual(aa, bb)) {
                respond(401, { error: 'Unauthorized' });
                return;
              }

              const supabase = createClient(supabaseUrl, serviceRoleKey);

              if (req.method === 'POST') {
                const caption = String(body?.caption || '').trim();
                const color = String(body?.color || 'bg-white');
                const fileName = String(body?.fileName || 'image');
                const dataUrl = String(body?.dataUrl || '');

                const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
                if (!match) {
                  respond(400, { error: 'Invalid dataUrl' });
                  return;
                }
                const contentType = match[1];
                const buffer = Buffer.from(match[2], 'base64');

                const ext = (fileName.split('.').pop() || '').toLowerCase();
                const safeExt = ext && ext.length <= 10 ? ext : 'png';
                const imagePath = `admin/${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${safeExt}`;

                const uploaded = await supabase.storage.from('daily-images').upload(imagePath, buffer, {
                  contentType,
                  upsert: false,
                  cacheControl: '3600'
                });
                if (uploaded.error) throw uploaded.error;

                const imageUrl = supabase.storage.from('daily-images').getPublicUrl(imagePath).data.publicUrl;
                const inserted = await supabase
                  .from('daily_posts')
                  .insert({
                    user_id: crypto.randomUUID(),
                    caption,
                    image_path: imagePath,
                    image_url: imageUrl,
                    color
                  })
                  .select('id')
                  .single();
                if (inserted.error) throw inserted.error;

                respond(200, { ok: true, id: inserted.data.id });
                return;
              }

              if (req.method === 'DELETE') {
                const postId = String(body?.postId || '');
                if (!postId) {
                  respond(400, { error: 'Missing postId' });
                  return;
                }

                const row = await supabase
                  .from('daily_posts')
                  .select('image_path')
                  .eq('id', postId)
                  .single();
                if (row.error) throw row.error;

                const removed = await supabase.storage.from('daily-images').remove([row.data.image_path]);
                if (removed.error) throw removed.error;

                const del = await supabase.from('daily_posts').delete().eq('id', postId);
                if (del.error) throw del.error;

                respond(200, { ok: true });
                return;
              }

              respond(405, { error: 'Method not allowed' });
            } catch (e: any) {
              respond(400, { error: e?.message || 'Bad request' });
            }
          });
        },
      },
      react(),
      tailwindcss(),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
