-- Data uji dari konten portofolio saat ini, disimpan sebagai draft.
-- Jalankan satu kali di Supabase Dashboard > SQL Editor.
-- Tautan '#' tidak disalin karena masih berupa placeholder.

insert into public.projects (
  id,
  name,
  kind,
  year,
  featured,
  description,
  problem,
  solution,
  impact,
  stack,
  links,
  sort_order,
  is_published
)
values (
  'aruna-ui',
  'Aruna UI',
  'Design System',
  2024,
  true,
  'Design system multi-brand berisi 74 komponen React yang terdokumentasi penuh di Storybook. Mendukung theming runtime, mode gelap, dan token desain yang disinkronkan langsung dari Figma.',
  'Tiga produk internal punya gaya UI berbeda-beda; tiap fitur baru dikerjakan dua kali.',
  'Menyusun lapisan token (color, spacing, typography) yang dikonsumsi Tailwind config, lalu membangun komponen headless di atasnya.',
  '[{"k":"Waktu develop fitur","v":"−40%"},{"k":"Komponen","v":"74"},{"k":"Adopsi tim","v":"6 produk"}]'::jsonb,
  array['React', 'TypeScript', 'Tailwind CSS', 'Storybook', 'Radix UI', 'Changesets'],
  '[]'::jsonb,
  1,
  false
)
on conflict (id) do nothing;

select id, name, featured, is_published
from public.projects
where id = 'aruna-ui';
