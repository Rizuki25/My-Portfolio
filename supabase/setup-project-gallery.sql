-- Jalankan setelah setup-projects-admin.sql di Supabase SQL Editor.
-- Foto disimpan sebagai file di Storage; urutan, URL, dan teks alternatif
-- disimpan di kolom projects.images sebagai array JSONB.

begin;

alter table public.projects
  add column if not exists images jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.projects'::regclass
      and conname = 'projects_images_array'
  ) then
    alter table public.projects
      add constraint projects_images_array
      check (jsonb_typeof(images) = 'array');
  end if;
end $$;

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'portfolio-project-images',
    'portfolio-project-images',
    true,
    6291456,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Portfolio admins can view project image objects" on storage.objects;
create policy "Portfolio admins can view project image objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'portfolio-project-images'
  and exists (
    select 1 from public.portfolio_admins
    where user_id = (select auth.uid())
  )
);

drop policy if exists "Portfolio admins can upload project images" on storage.objects;
create policy "Portfolio admins can upload project images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-project-images'
  and exists (
    select 1 from public.portfolio_admins
    where user_id = (select auth.uid())
  )
);

commit;
