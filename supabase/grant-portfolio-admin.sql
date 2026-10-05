-- 1. Buat akun email + password di Authentication > Users terlebih dahulu.
-- 2. Ganti alamat email di bawah, lalu jalankan di SQL Editor.
-- 3. Jika email belum ditemukan, script akan gagal tanpa memberi akses.

do $$
declare
  admin_id uuid;
begin
  select id into admin_id
  from auth.users
  where lower(email) = lower('GANTI_DENGAN_EMAIL_ANDA@example.com');

  if admin_id is null then
    raise exception 'User Auth dengan email tersebut belum ditemukan';
  end if;

  insert into public.portfolio_admins (user_id)
  values (admin_id)
  on conflict (user_id) do nothing;
end;
$$;
