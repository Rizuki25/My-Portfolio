-- Portfolio CMS schema. Run once in Supabase Dashboard → SQL Editor.
create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  profile_key text not null unique default 'main',
  full_name text not null,
  role_label text,
  hero_kicker text,
  hero_title text,
  hero_emphasis text,
  bio text,
  about_text text,
  email text,
  location text,
  photo_path text,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  items text[] not null default '{}',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  start_label text not null,
  role text not null,
  company text not null,
  description text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  summary text not null,
  tags text[] not null default '{}',
  accent text not null default 'amber' check (accent in ('amber', 'mint', 'violet')),
  image_path text,
  case_study_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  issuer text not null,
  issued_year integer not null check (issued_year between 1900 and 2100),
  accent text not null default 'gold' check (accent in ('gold', 'blue', 'red')),
  image_path text,
  credential_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  period_label text not null,
  detail text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  metric text not null,
  description text not null,
  context text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index experiences_published_sort_order_idx on public.experiences (is_published, sort_order);
create index projects_published_sort_order_idx on public.projects (is_published, sort_order);
create index certificates_published_sort_order_idx on public.certificates (is_published, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger skill_groups_set_updated_at before update on public.skill_groups for each row execute function public.set_updated_at();
create trigger experiences_set_updated_at before update on public.experiences for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger certificates_set_updated_at before update on public.certificates for each row execute function public.set_updated_at();
create trigger education_set_updated_at before update on public.education for each row execute function public.set_updated_at();
create trigger achievements_set_updated_at before update on public.achievements for each row execute function public.set_updated_at();

-- SECURITY DEFINER allows policies to check the private admin allow-list safely.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

grant usage on schema public to anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.profiles, public.skill_groups, public.experiences, public.projects, public.certificates, public.education, public.achievements to anon;
grant select, insert, update, delete on public.profiles, public.skill_groups, public.experiences, public.projects, public.certificates, public.education, public.achievements to authenticated;
grant execute on function public.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.skill_groups enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.education enable row level security;
alter table public.achievements enable row level security;

create policy "Admins can view their own allow-list entry" on public.admin_users for select to authenticated using ((select auth.uid()) = user_id);

create policy "Public can read published profile" on public.profiles for select to anon, authenticated using (is_published);
create policy "Admins can manage profile" on public.profiles for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Public can read published skill groups" on public.skill_groups for select to anon, authenticated using (is_published);
create policy "Admins can manage skill groups" on public.skill_groups for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Public can read published experiences" on public.experiences for select to anon, authenticated using (is_published);
create policy "Admins can manage experiences" on public.experiences for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Public can read published projects" on public.projects for select to anon, authenticated using (is_published);
create policy "Admins can manage projects" on public.projects for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Public can read published certificates" on public.certificates for select to anon, authenticated using (is_published);
create policy "Admins can manage certificates" on public.certificates for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Public can read published education" on public.education for select to anon, authenticated using (is_published);
create policy "Admins can manage education" on public.education for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Public can read published achievements" on public.achievements for select to anon, authenticated using (is_published);
create policy "Admins can manage achievements" on public.achievements for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Initial content matching the current site.
insert into public.profiles (profile_key, full_name, role_label, hero_kicker, hero_title, hero_emphasis, bio, about_text, email, location)
values ('main', 'Fahzri Rizqie', 'engineer', 'Engineering with intent.', 'Making complex', 'systems feel simple.', 'I''m Fahzri, an engineer who turns messy constraints into clear systems, better products, and work that holds up in the real world.', 'Whether I''m on the factory floor or inside a design review, I look for the signal beneath the noise—and build from there.', 'hello@fahzri.engineer', 'Bandung, Indonesia')
on conflict (profile_key) do update set full_name = excluded.full_name;

insert into public.skill_groups (title, items, sort_order) values
  ('Core engineering', array['Systems thinking', 'Design review', 'Root-cause analysis', 'FMEA'], 1),
  ('Tools & methods', array['SolidWorks', 'MATLAB', 'Python', 'Lean / Six Sigma'], 2),
  ('Working style', array['Field-first', 'Clear documentation', 'Calm under pressure', 'Mentoring'], 3)
on conflict (title) do nothing;

insert into public.experiences (start_label, role, company, description, sort_order)
select * from (values
  ('2023 — now', 'Process Improvement Engineer', 'Nusantara Manufacturing', 'Own continuous improvement across two production lines, partnering with operators to make better work easier to do.', 1),
  ('2021 — 2023', 'Product Development Engineer', 'Arcform Labs', 'Took early-stage hardware concepts through design reviews, prototyping, testing, and supplier handoff.', 2),
  ('2020 — 2021', 'Engineering Intern', 'PT Karya Teknik', 'Built a foundation in drawing standards, shop-floor problem solving, and the discipline of good documentation.', 3)
) as seed(start_label, role, company, description, sort_order)
where not exists (select 1 from public.experiences);

insert into public.projects (slug, title, category, summary, tags, accent, sort_order) values
  ('line-04-less-friction', 'Line 04 / less friction', 'Manufacturing systems', 'Reworked a high-mix assembly cell into a visual, measurable system—cutting changeover time by 31%.', array['Process design', 'Time study', '-31% changeover'], 'amber', 1),
  ('gridwatch-live-signals', 'Gridwatch / live signals', 'Energy & monitoring', 'A lightweight energy dashboard that turns machine-level data into decisions the floor team can act on.', array['Python', 'IoT', 'Realtime dashboard'], 'mint', 2),
  ('aero-housing-made-lighter', 'Aero housing / made lighter', 'Product development', 'Led the redesign of a protective enclosure from first sketch to pilot run without losing serviceability.', array['CAD', 'DFMA', '-18% mass'], 'violet', 3)
on conflict (slug) do nothing;

insert into public.certificates (code, title, issuer, issued_year, accent, sort_order) values
  ('LSS-G', 'Lean Six Sigma Green Belt', 'IASSC', 2024, 'gold', 1),
  ('CAD-P', 'Professional CAD Specialist', 'Dassault Systèmes', 2023, 'blue', 2),
  ('PMP-F', 'Project Fundamentals', 'PMI', 2022, 'red', 3)
on conflict (code) do nothing;

insert into public.education (institution, degree, period_label, detail, sort_order)
select 'Institut Teknologi Bandung', 'Bachelor of Mechanical Engineering', '2016 — 2020', 'GPA 3.72 / 4.00 · Focus: product design, manufacturing systems, materials', 1
where not exists (select 1 from public.education);

insert into public.achievements (metric, description, context, sort_order)
select * from (values
  ('31%', 'faster changeovers', 'Line 04, 2024', 1),
  ('18%', 'lighter enclosure', 'Aero housing, 2023', 2),
  ('1st', 'campus design challenge', 'National finalist, 2019', 3)
) as seed(metric, description, context, sort_order)
where not exists (select 1 from public.achievements);

-- Create a public "portfolio-assets" bucket manually in Storage before using image_path.
-- Then add Storage upload policies for authenticated admins in the dashboard phase.
