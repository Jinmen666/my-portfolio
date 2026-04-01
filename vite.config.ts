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
        name: 'admin-api',
        configureServer(server) {
          const respond = (res: any, status: number, payload: unknown) => {
            res.statusCode = status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          };

          const parseBody = async (req: any) => {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            const raw = Buffer.concat(chunks).toString('utf8') || '{}';
            return JSON.parse(raw);
          };

          const verifyToken = (token: string, adminToken: string) => {
            if (!token || !adminToken) return false;
            try {
              const aa = Buffer.from(token);
              const bb = Buffer.from(adminToken);
              return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
            } catch {
              return false;
            }
          };

          // Daily Posts API
          server.middlewares.use('/api/admin/daily-posts', async (req, res) => {
            try {
              const { ADMIN_TOKEN: adminToken, SUPABASE_URL: supabaseUrl, SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } = env;
              if (!adminToken || !supabaseUrl || !serviceRoleKey) return respond(res, 500, { error: 'Missing env vars' });

              const body = await parseBody(req);
              if (!verifyToken(String(body?.token || ''), String(adminToken))) return respond(res, 401, { error: 'Unauthorized' });

              const supabase = createClient(supabaseUrl, serviceRoleKey);

              if (req.method === 'POST') {
                const { caption, color = 'bg-white', fileName = 'image', dataUrl } = body;
                const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
                if (!match) return respond(res, 400, { error: 'Invalid dataUrl' });
                const buffer = Buffer.from(match[2], 'base64');
                const imagePath = `admin/${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${fileName.split('.').pop() || 'png'}`;

                const { error: uploadError } = await supabase.storage.from('daily-images').upload(imagePath, buffer, { contentType: match[1] });
                if (uploadError) throw uploadError;

                const imageUrl = supabase.storage.from('daily-images').getPublicUrl(imagePath).data.publicUrl;
                const { data, error: insertError } = await supabase.from('daily_posts').insert({
                  user_id: crypto.randomUUID(),
                  caption, image_path: imagePath, image_url: imageUrl, color
                }).select('id').single();
                if (insertError) throw insertError;

                return respond(res, 200, { ok: true, id: data.id });
              }

              if (req.method === 'DELETE') {
                const { postId } = body;
                const { data: row, error: fetchError } = await supabase.from('daily_posts').select('image_path').eq('id', postId).single();
                if (fetchError) throw fetchError;

                await supabase.storage.from('daily-images').remove([row.image_path]);
                const { error: delError } = await supabase.from('daily_posts').delete().eq('id', postId);
                if (delError) throw delError;

                return respond(res, 200, { ok: true });
              }
              respond(res, 405, { error: 'Method not allowed' });
            } catch (e: any) { respond(res, 400, { error: e.message }); }
          });

          // Articles API
          server.middlewares.use('/api/admin/articles', async (req, res) => {
            try {
              const { ADMIN_TOKEN: adminToken, SUPABASE_URL: supabaseUrl, SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } = env;
              if (!adminToken || !supabaseUrl || !serviceRoleKey) return respond(res, 500, { error: 'Missing env vars' });

              const body = await parseBody(req);
              if (!verifyToken(String(body?.token || ''), String(adminToken))) return respond(res, 401, { error: 'Unauthorized' });

              const supabase = createClient(supabaseUrl, serviceRoleKey);

              if (req.method === 'POST') {
                const { title, summary, content, color = 'bg-white', fileName = 'cover', dataUrl } = body;
                const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
                if (!match) return respond(res, 400, { error: 'Invalid dataUrl' });
                const buffer = Buffer.from(match[2], 'base64');
                const coverPath = `covers/${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${fileName.split('.').pop() || 'png'}`;

                const { error: uploadError } = await supabase.storage.from('article-covers').upload(coverPath, buffer, { contentType: match[1] });
                if (uploadError) throw uploadError;

                const coverUrl = supabase.storage.from('article-covers').getPublicUrl(coverPath).data.publicUrl;
                const { data, error: insertError } = await supabase.from('articles').insert({
                  user_id: crypto.randomUUID(),
                  title, summary, content, cover_path: coverPath, cover_url: coverUrl, color
                }).select('id').single();
                if (insertError) throw insertError;

                return respond(res, 200, { ok: true, id: data.id });
              }

              if (req.method === 'DELETE') {
                const { articleId } = body;
                const { data: row, error: fetchError } = await supabase.from('articles').select('cover_path').eq('id', articleId).single();
                if (fetchError) throw fetchError;

                await supabase.storage.from('article-covers').remove([row.cover_path]);
                const { error: delError } = await supabase.from('articles').delete().eq('id', articleId);
                if (delError) throw delError;

                return respond(res, 200, { ok: true });
              }
              respond(res, 405, { error: 'Method not allowed' });
             } catch (e: any) { respond(res, 400, { error: e.message }); }
           });

           // Projects API
           server.middlewares.use('/api/admin/projects', async (req, res) => {
             try {
               const { ADMIN_TOKEN: adminToken, SUPABASE_URL: supabaseUrl, SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } = env;
               if (!adminToken || !supabaseUrl || !serviceRoleKey) return respond(res, 500, { error: 'Missing env vars' });

               const body = await parseBody(req);
               if (!verifyToken(String(body?.token || ''), String(adminToken))) return respond(res, 401, { error: 'Unauthorized' });

               const supabase = createClient(supabaseUrl, serviceRoleKey);

               if (req.method === 'POST') {
                 const { title, description, projectUrl, color = 'bg-white', fileName = 'project', dataUrl } = body;
                 const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
                 if (!match) return respond(res, 400, { error: 'Invalid dataUrl' });
                 const buffer = Buffer.from(match[2], 'base64');
                 const imagePath = `projects/${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${fileName.split('.').pop() || 'png'}`;

                 const { error: uploadError } = await supabase.storage.from('project-images').upload(imagePath, buffer, { contentType: match[1] });
                 if (uploadError) throw uploadError;

                 const imageUrl = supabase.storage.from('project-images').getPublicUrl(imagePath).data.publicUrl;
                 const { data, error: insertError } = await supabase.from('projects').insert({
                   user_id: crypto.randomUUID(),
                   title, description, project_url: projectUrl, image_path: imagePath, image_url: imageUrl, color
                 }).select('id').single();
                 if (insertError) throw insertError;

                 return respond(res, 200, { ok: true, id: data.id });
               }

               if (req.method === 'DELETE') {
                 const { projectId } = body;
                 const { data: row, error: fetchError } = await supabase.from('projects').select('image_path').eq('id', projectId).single();
                 if (fetchError) throw fetchError;

                 await supabase.storage.from('project-images').remove([row.image_path]);
                 const { error: delError } = await supabase.from('projects').delete().eq('id', projectId);
                 if (delError) throw delError;

                 return respond(res, 200, { ok: true });
               }
               respond(res, 405, { error: 'Method not allowed' });
             } catch (e: any) { respond(res, 400, { error: e.message }); }
           });

           // Profile API
           server.middlewares.use('/api/admin/profile', async (req, res) => {
             try {
               const { ADMIN_TOKEN: adminToken, SUPABASE_URL: supabaseUrl, SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } = env;
               if (!adminToken || !supabaseUrl || !serviceRoleKey) return respond(res, 500, { error: 'Missing env vars' });

               const body = await parseBody(req);
               if (!verifyToken(String(body?.token || ''), String(adminToken))) return respond(res, 401, { error: 'Unauthorized' });

               const supabase = createClient(supabaseUrl, serviceRoleKey);

               if (req.method === 'POST') {
                 const { profile, avatarFile } = body;
                 let avatarUrl = profile.avatar_url;

                 if (avatarFile) {
                   const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(avatarFile.dataUrl);
                   if (match) {
                     const buffer = Buffer.from(match[2], 'base64');
                     const avatarPath = `admin/avatar-${Date.now()}.${avatarFile.fileName.split('.').pop() || 'png'}`;
                     const { error: uploadError } = await supabase.storage.from('avatars').upload(avatarPath, buffer, { contentType: match[1], upsert: true });
                     if (!uploadError) {
                       avatarUrl = supabase.storage.from('avatars').getPublicUrl(avatarPath).data.publicUrl;
                     }
                   }
                 }

                 const { data, error } = await supabase.from('profile').upsert({
                   ...profile,
                   avatar_url: avatarUrl,
                   user_id: '00000000-0000-0000-0000-000000000000', // Use a fixed system admin ID for local dev
                   updated_at: new Date().toISOString()
                 }, { onConflict: 'user_id' }).select().single();

                 if (error) throw error;
                 return respond(res, 200, { ok: true, data });
               }
               respond(res, 405, { error: 'Method not allowed' });
             } catch (e: any) { respond(res, 400, { error: e.message }); }
           });

           // Experiences API
           server.middlewares.use('/api/admin/experiences', async (req, res) => {
             try {
               const { ADMIN_TOKEN: adminToken, SUPABASE_URL: supabaseUrl, SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } = env;
               if (!adminToken || !supabaseUrl || !serviceRoleKey) return respond(res, 500, { error: 'Missing env vars' });

               const body = await parseBody(req);
               if (!verifyToken(String(body?.token || ''), String(adminToken))) return respond(res, 401, { error: 'Unauthorized' });

               const supabase = createClient(supabaseUrl, serviceRoleKey);

               if (req.method === 'POST') {
                 const { experience } = body;
                 const { data, error } = await supabase.from('experiences').upsert({
                   ...experience,
                   user_id: '00000000-0000-0000-0000-000000000000'
                 }).select().single();
                 if (error) throw error;
                 return respond(res, 200, { ok: true, data });
               }

               if (req.method === 'DELETE') {
                 const { id } = body;
                 const { error } = await supabase.from('experiences').delete().eq('id', id);
                 if (error) throw error;
                 return respond(res, 200, { ok: true });
               }
               respond(res, 405, { error: 'Method not allowed' });
             } catch (e: any) { respond(res, 400, { error: e.message }); }
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
