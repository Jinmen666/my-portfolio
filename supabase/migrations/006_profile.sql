-- Profile table for "About Me" page
create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  name text not null default '',
  major text not null default '',
  job text not null default '',
  bio text not null default '',
  intro_title text not null default 'Welcome to',
  intro_name text not null default '西门的个界!',
  id_no text not null default '',
  statement text not null default '',
  recent_reading text not null default '',
  recent_watching text not null default '',
  recent_interest text not null default '',
  avatar_url text not null default '',
  updated_at timestamptz not null default now()
);

-- Timeline/Experience table for "Earth Online"
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date text not null,
  title text not null,
  description text not null default '',
  type text not null default 'main', -- 'main' or 'side'
  icon_type text not null default 'rocket',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profile enable row level security;
alter table public.experiences enable row level security;

-- Policies for profile
drop policy if exists "Profile is viewable by everyone" on public.profile;
create policy "Profile is viewable by everyone" on public.profile
for select using (true);

drop policy if exists "Only site admin can update profile" on public.profile;
create policy "Only site admin can update profile" on public.profile
for update to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

drop policy if exists "Only site admin can insert profile" on public.profile;
create policy "Only site admin can insert profile" on public.profile
for insert to authenticated
with check (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

-- Policies for experiences
drop policy if exists "Experiences are viewable by everyone" on public.experiences;
create policy "Experiences are viewable by everyone" on public.experiences
for select using (true);

drop policy if exists "Only site admin can manage experiences" on public.experiences;
create policy "Only site admin can manage experiences" on public.experiences
for all to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

-- Storage for profile avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "Avatars are viewable by everyone" on storage.objects;
create policy "Avatars are viewable by everyone" on storage.objects
for select using (bucket_id = 'avatars');

drop policy if exists "Only site admin can upload avatars" on storage.objects;
create policy "Only site admin can upload avatars" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'avatars'
  and owner = auth.uid()
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);
