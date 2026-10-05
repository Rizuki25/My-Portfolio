-- Jalankan di Supabase Dashboard > SQL Editor setelah setup-projects.sql.
-- Dashboard memakai Supabase Auth; hanya user yang tercatat di
-- public.portfolio_admins boleh melihat draft dan mengubah Projects.

begin;

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.portfolio_admins enable row level security;
revoke all on table public.portfolio_admins from public, anon, authenticated;
grant select on table public.portfolio_admins to authenticated;

drop policy if exists "Admins can see own membership" on public.portfolio_admins;
create policy "Admins can see own membership"
on public.portfolio_admins
for select
to authenticated
using (user_id = (select auth.uid()));

-- Pengunjung tetap hanya dapat membaca proyek terbit lewat policy lama.
revoke insert, update, delete on table public.projects from public, anon;
grant select, insert, update, delete on table public.projects to authenticated;

drop policy if exists "Admins can read all projects" on public.projects;
create policy "Admins can read all projects"
on public.projects
for select
to authenticated
using (
  exists (
    select 1 from public.portfolio_admins
    where user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
on public.projects
for insert
to authenticated
with check (
  exists (
    select 1 from public.portfolio_admins
    where user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
on public.projects
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

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
on public.projects
for delete
to authenticated
using (
  exists (
    select 1 from public.portfolio_admins
    where user_id = (select auth.uid())
  )
);

commit;
