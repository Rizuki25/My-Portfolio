-- Jalankan di Supabase SQL Editor setelah setup-projects-admin.sql.
-- Setiap bagian selain Projects disimpan sebagai satu dokumen JSONB.
-- Baris dapat dibuat dari dashboard saat bagian tersebut pertama kali disimpan.

begin;

create table if not exists public.site_content (
  section_key text primary key check (
    section_key in ('identity', 'home', 'about', 'experience', 'skills', 'education', 'contact')
  ),
  content jsonb not null check (jsonb_typeof(content) = 'object')
);

alter table public.site_content enable row level security;
revoke all on table public.site_content from public, anon, authenticated;
grant select on table public.site_content to anon, authenticated;
grant insert, update on table public.site_content to authenticated;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content"
on public.site_content
for insert
to authenticated
with check (
  exists (
    select 1 from public.portfolio_admins
    where user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
on public.site_content
for update
to authenticated
using (
  exists (
    select 1 from public.portfolio_admins
    where user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.portfolio_admins
    where user_id = (select auth.uid())
  )
);

commit;
