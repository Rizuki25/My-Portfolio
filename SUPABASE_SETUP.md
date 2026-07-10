# Menghubungkan Supabase

## 1. Buat proyek

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Di **Connect**, salin **Project URL** dan **Publishable key**. Jangan gunakan atau salin `service_role` key ke proyek frontend.
3. Salin `.env.example` menjadi `.env.local`, lalu isi kedua nilai tersebut.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

## 2. Buat database

1. Buka **SQL Editor** pada proyek Supabase.
2. Salin seluruh isi `supabase/migrations/202607100001_portfolio.sql`.
3. Jalankan satu kali. Query ini membuat tabel, data awal dari portfolio saat ini, indeks, trigger `updated_at`, serta Row Level Security (RLS).

## 3. Buat akun admin

1. Di **Authentication → Users**, buat satu pengguna dengan email dan password milik Anda.
2. Salin UUID pengguna tersebut.
3. Jalankan query berikut di SQL Editor, mengganti UUID-nya:

```sql
insert into public.admin_users (user_id)
values ('UUID_PENGGUNA_ANDA');
```

Hanya pengguna yang tercatat di `admin_users` yang akan dapat mengubah konten lewat dashboard nanti.

## 4. Uji koneksi publik

```powershell
npm.cmd run dev
```

Saat halaman `/` dibuka, aplikasi mengambil `skill_groups`, `experiences`, `projects`, dan `certificates` dari Supabase. Bila `.env.local` belum diisi atau database belum siap, aplikasi tetap menampilkan data lokal sehingga desain tidak blank.

## 5. Aset gambar

Buat bucket public bernama `portfolio-assets` di **Storage** untuk foto profil, proyek, dan sertifikat. Lalu jalankan isi `supabase/migrations/202607100002_portfolio_assets_policies.sql` di SQL Editor. Public bucket cocok untuk visual yang memang tampil di portofolio; policy tersebut membatasi upload, penggantian, dan penghapusan hanya untuk admin.

## 6. Gallery gambar proyek

Untuk proyek Supabase yang sudah dibuat sebelumnya, jalankan seluruh isi `supabase/migrations/202607100003_project_image_gallery.sql` di **SQL Editor**. Migrasi ini menambahkan kolom gallery gambar pada Projects dan otomatis menjadikan gambar proyek lama sebagai slide pertama.

## Alur data

```text
Anda login ke /admin (tahap berikutnya)
          ↓
Supabase Auth memverifikasi identitas
          ↓
RLS mengecek public.admin_users
          ↓
Dashboard menulis data ke tabel portfolio
          ↓
Halaman / membaca data published saat dimuat ulang
          ↓
Vercel menampilkan konten terbaru tanpa deploy ulang
```

`service_role key` tidak dibutuhkan di browser dan tidak boleh diletakkan pada variabel `NEXT_PUBLIC_*`.
