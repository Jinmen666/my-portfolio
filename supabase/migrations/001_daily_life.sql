create extension if not exists "pgcrypto";

create table if not exists public.daily_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  caption text not null default '',
  image_path text not null,
  image_url text not null,
  color text not null default 'bg-white',
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.daily_posts(id) on delete cascade,
  user_id uuid not null,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.daily_posts enable row level security;
alter table public.daily_comments enable row level security;

drop policy if exists "Daily posts are viewable by everyone" on public.daily_posts;
drop policy if exists "Authenticated can insert own posts" on public.daily_posts;
drop policy if exists "Users can update own posts" on public.daily_posts;
drop policy if exists "Users can delete own posts" on public.daily_posts;

create policy "Daily posts are viewable by everyone" on public.daily_posts
for select using (true);

create policy "Authenticated can insert own posts" on public.daily_posts
for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own posts" on public.daily_posts
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own posts" on public.daily_posts
for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists "Daily comments are viewable by everyone" on public.daily_comments;
drop policy if exists "Authenticated can insert own comments" on public.daily_comments;
drop policy if exists "Users can update own comments" on public.daily_comments;
drop policy if exists "Users can delete own comments" on public.daily_comments;

create policy "Daily comments are viewable by everyone" on public.daily_comments
for select using (true);

create policy "Authenticated can insert own comments" on public.daily_comments
for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own comments" on public.daily_comments
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own comments" on public.daily_comments
for delete to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('daily-images', 'daily-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Daily images are viewable by everyone" on storage.objects;
drop policy if exists "Authenticated can upload daily images" on storage.objects;
drop policy if exists "Users can update own daily images" on storage.objects;
drop policy if exists "Users can delete own daily images" on storage.objects;

create policy "Daily images are viewable by everyone" on storage.objects
for select using (bucket_id = 'daily-images');

create policy "Authenticated can upload daily images" on storage.objects
for insert to authenticated
with check (bucket_id = 'daily-images' and owner = auth.uid());

create policy "Users can update own daily images" on storage.objects
for update to authenticated
using (bucket_id = 'daily-images' and owner = auth.uid())
with check (bucket_id = 'daily-images' and owner = auth.uid());

create policy "Users can delete own daily images" on storage.objects
for delete to authenticated
using (bucket_id = 'daily-images' and owner = auth.uid());

