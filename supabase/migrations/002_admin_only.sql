create table if not exists public.site_admins (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;

drop policy if exists "Site admins can view themselves" on public.site_admins;
create policy "Site admins can view themselves" on public.site_admins
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Daily posts are viewable by everyone" on public.daily_posts;
drop policy if exists "Authenticated can insert own posts" on public.daily_posts;
drop policy if exists "Users can update own posts" on public.daily_posts;
drop policy if exists "Users can delete own posts" on public.daily_posts;

create policy "Daily posts are viewable by everyone" on public.daily_posts
for select using (true);

create policy "Only site admin can insert posts" on public.daily_posts
for insert to authenticated
with check (
  auth.uid() = user_id
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

create policy "Only site admin can update posts" on public.daily_posts
for update to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()))
with check (
  auth.uid() = user_id
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

create policy "Only site admin can delete posts" on public.daily_posts
for delete to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

drop policy if exists "Daily comments are viewable by everyone" on public.daily_comments;
drop policy if exists "Authenticated can insert own comments" on public.daily_comments;
drop policy if exists "Users can update own comments" on public.daily_comments;
drop policy if exists "Users can delete own comments" on public.daily_comments;

create policy "Daily comments are viewable by everyone" on public.daily_comments
for select using (true);

create policy "Only site admin can insert comments" on public.daily_comments
for insert to authenticated
with check (
  auth.uid() = user_id
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

create policy "Only site admin can update comments" on public.daily_comments
for update to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()))
with check (
  auth.uid() = user_id
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

create policy "Only site admin can delete comments" on public.daily_comments
for delete to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

drop policy if exists "Daily images are viewable by everyone" on storage.objects;
drop policy if exists "Authenticated can upload daily images" on storage.objects;
drop policy if exists "Users can update own daily images" on storage.objects;
drop policy if exists "Users can delete own daily images" on storage.objects;

create policy "Daily images are viewable by everyone" on storage.objects
for select using (bucket_id = 'daily-images');

create policy "Only site admin can upload daily images" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'daily-images'
  and owner = auth.uid()
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

create policy "Only site admin can update daily images" on storage.objects
for update to authenticated
using (
  bucket_id = 'daily-images'
  and owner = auth.uid()
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
)
with check (
  bucket_id = 'daily-images'
  and owner = auth.uid()
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

create policy "Only site admin can delete daily images" on storage.objects
for delete to authenticated
using (
  bucket_id = 'daily-images'
  and owner = auth.uid()
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

