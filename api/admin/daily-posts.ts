import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const json = async (req: any) => {
  if (!req?.body) return null;
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return null;
  }
};

const timingSafeEqual = (a: string, b: string) => {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
};

const requireEnv = (key: string) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
};

const parseDataUrl = (dataUrl: string) => {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error('Invalid dataUrl');
  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], 'base64')
  };
};

export default async function handler(req: any, res: any) {
  try {
    const supabaseUrl = requireEnv('SUPABASE_URL');
    const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
    const adminToken = requireEnv('ADMIN_TOKEN');

    const body = await json(req);
    const token = body?.token || '';
    if (!token || !timingSafeEqual(String(token), String(adminToken))) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    if (req.method === 'POST') {
      const caption = String(body?.caption || '').trim();
      const color = String(body?.color || 'bg-white');
      const fileName = String(body?.fileName || 'image');
      const dataUrl = String(body?.dataUrl || '');
      const { contentType, buffer } = parseDataUrl(dataUrl);

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

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, id: inserted.data.id }));
      return;
    }

    if (req.method === 'DELETE') {
      const postId = String(body?.postId || '');
      if (!postId) throw new Error('Missing postId');

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

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (e: any) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: e?.message || 'Bad request' }));
  }
}

