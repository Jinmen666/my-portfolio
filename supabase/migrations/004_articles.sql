create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  summary text not null default '',
  content text not null,
  cover_path text not null,
  cover_url text not null,
  color text not null default 'bg-white',
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  user_id uuid not null,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.articles enable row level security;
alter table public.article_comments enable row level security;

-- Policies for articles
drop policy if exists "Articles are viewable by everyone" on public.articles;
create policy "Articles are viewable by everyone" on public.articles
for select using (true);

drop policy if exists "Only site admin can insert articles" on public.articles;
create policy "Only site admin can insert articles" on public.articles
for insert to authenticated
with check (
  auth.uid() = user_id
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

drop policy if exists "Only site admin can update articles" on public.articles;
create policy "Only site admin can update articles" on public.articles
for update to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()))
with check (
  auth.uid() = user_id
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

drop policy if exists "Only site admin can delete articles" on public.articles;
create policy "Only site admin can delete articles" on public.articles
for delete to authenticated
using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

-- Policies for article comments
drop policy if exists "Article comments are viewable by everyone" on public.article_comments;
create policy "Article comments are viewable by everyone" on public.article_comments
for select using (true);

drop policy if exists "Anyone can insert article comments" on public.article_comments;
create policy "Anyone can insert article comments" on public.article_comments
for insert with check (true);

-- Storage for article covers
insert into storage.buckets (id, name, public)
values ('article-covers', 'article-covers', true)
on conflict (id) do update set public = true;

drop policy if exists "Article covers are viewable by everyone" on storage.objects;
create policy "Article covers are viewable by everyone" on storage.objects
for select using (bucket_id = 'article-covers');

drop policy if exists "Only site admin can upload article covers" on storage.objects;
create policy "Only site admin can upload article covers" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'article-covers'
  and owner = auth.uid()
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

drop policy if exists "Only site admin can delete article covers" on storage.objects;
create policy "Only site admin can delete article covers" on storage.objects
for delete to authenticated
using (
  bucket_id = 'article-covers'
  and owner = auth.uid()
  and exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);
