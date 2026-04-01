create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  description text not null default '',
  image_path text not null,
  image_url text not null,
  project_url text not null default '',
  color text not null default 'bg-white',
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Policies for projects
drop policy if exists "Projects are viewable by everyone" on public.projects;
create policy "Projects are viewable by everyone" on public.projects
for select using (true);

drop policy if exists "Only site admin can insert projects" on public.projects;
create policy "Only site admin can insert projects" on public.projects
for insert to authenticated
with check (
  auth.uid() = user_id
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

drop policy if exists "Only site admin can update projects" on public.projects;
create policy "Only site admin can update projects" on public.projects
for update to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()))
with check (
  auth.uid() = user_id
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

drop policy if exists "Only site admin can delete projects" on public.projects;
create policy "Only site admin can delete projects" on public.projects
for delete to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

-- Storage for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Project images are viewable by everyone" on storage.objects;
create policy "Project images are viewable by everyone" on storage.objects
for select using (bucket_id = 'project-images');

drop policy if exists "Only site admin can upload project images" on storage.objects;
create policy "Only site admin can upload project images" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'project-images'
  and owner = auth.uid()
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

drop policy if exists "Only site admin can delete project images" on storage.objects;
create policy "Only site admin can delete project images" on storage.objects
for delete to authenticated
using (
  bucket_id = 'project-images'
  and owner = auth.uid()
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);
