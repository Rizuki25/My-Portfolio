-- Jalankan satu kali di Supabase Dashboard > SQL Editor.
-- File ini bukan migration CLI; jika nanti memakai CLI, tarik skema remote lebih dulu.
-- Tahap awal: hanya data untuk section Projects yang disiapkan.

begin;

create table public.projects (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  kind text not null,
  year smallint not null,
  featured boolean not null default false,
  description text not null,
  problem text,
  solution text,
  impact jsonb not null default '[]'::jsonb
    check (jsonb_typeof(impact) = 'array'),
  stack text[] not null default '{}'::text[],
  links jsonb not null default '[]'::jsonb
    check (jsonb_typeof(links) = 'array'),
  metrics text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Pengunjung hanya dapat membaca proyek yang sudah dipublikasikan.
-- Tidak ada izin tulis untuk peran browser.
revoke all on table public.projects from public, anon, authenticated;
grant select on table public.projects to anon, authenticated;

create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (is_published = true);

commit;
