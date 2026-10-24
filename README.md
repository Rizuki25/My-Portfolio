# My-Porftolio — Bento Grid / Neo-Brutalist Tech Editorial

Website portfolio satu halaman dengan **Vite + React + Tailwind CSS v4**.
Layout **portrait**: satu kolom sempit yang mengalir lurus dari atas ke bawah
(`01 Home` → `07 Contact`). Pada layar besar tiap section melebar jadi bento
2–3 kolom **tanpa mengubah urutan**.

---

## Menjalankan

```bash
npm install     # sekali di awal
npm run dev     # http://127.0.0.1:5173
npm run build   # hasil produksi ke dist/
npm run preview # pratinjau hasil build di http://127.0.0.1:4173
```

---

## Mengganti isi konten

Isi portofolio dikelola lewat dashboard admin di `/#/admin`. Menu **Identitas, Home,
About, Experience, Projects, Skills, Education, dan Contact** mencakup konten
yang tampil di seluruh halaman. Teks awal ada di
[`src/data/content.js`](src/data/content.js); jika suatu bagian belum disimpan
ke Supabase, situs menampilkan contoh lokal tersebut. Setelah bagian disimpan,
data Supabase akan tampil pada muat ulang berikutnya.

Projects punya tabel sendiri agar tiap proyek bisa disimpan sebagai draft atau
diterbitkan. Bagian lain disimpan satu dokumen per tab di `site_content` dan
langsung tampil di situs setelah disimpan. Foto profil dan tautan CV memakai
URL pada menu Identitas; unggah file dari dashboard tersedia untuk foto Projects.

| Ekspor | Untuk section | Isi |
|---|---|---|
| `profile` | Home, NavBar, Footer, Contact | Nama, peran, email, telepon, lokasi, sosial media, `monogram` (3 huruf), `avatarUrl` |
| `stats` | Home | 4 angka rekap (`value`, `label`, `sub`) |
| `siteMeta` | Home, Projects, Footer, section headers | Judul halaman, edisi, kolofon, deskripsi section, arsip dan proses Projects |
| `about` | About | `heading`, `paragraphs[]`, `facts[]`, `principles[]`, `currently[]` |
| `experience` | Experience | Array riwayat kerja: `period`, `role`, `company`, `highlights[]`, `stack[]`, `current` |
| `experienceMeta` | Experience | Ringkasan rentang, industri, dan mode kerja |
| `projects` | Projects | Contoh lokal yang hanya dipakai jika variabel Supabase belum dikonfigurasi |
| `skillGroups` | Skills | Kelompok keahlian, tiap skill punya `level` 1–5 |
| `toolbox` | Skills | Daftar alat, dirender sebagai grid tag |
| `education` | Education | Pendidikan formal |
| `certifications` | Education | Sertifikasi |
| `awards` | Education | Penghargaan |
| `educationMeta` | Education | Keterangan verifikasi pendidikan |
| `contact` | Contact | Heading, layanan, FAQ |
| `sections` | NavBar | Urutan & nomor section tetap di kode; ubah jika menambah/menghapus menu situs |

> Jumlah item di tiap array bebas ditambah/dikurangi — grid menyesuaikan otomatis.
> `href: '#'` berarti tautan placeholder; ganti dengan URL asli.

---

## Dashboard admin dan Supabase

Buka `http://127.0.0.1:5173/#/admin` setelah menjalankan `npm run dev`.
Menu selain Projects menyediakan formulir untuk mengubah teks, angka, daftar,
tautan, dan urutannya. Perubahan yang belum disimpan tetap ada saat berpindah
tab selama halaman belum dimuat ulang. Projects mendukung tambah, ubah, hapus,
draft, publikasi, urutan proyek, dan galeri foto.

Konfigurasi lokal ada di
`.env.local` (diabaikan Git); contoh nama variabel ada di `.env.example`.
`VITE_SUPABASE_URL` harus berisi URL dasar proyek, misalnya
`https://your-project.supabase.co`, tanpa `/rest/v1/`.
`VITE_SUPABASE_PUBLISHABLE_KEY` berisi publishable key dari Supabase.
Mulai ulang `npm run dev` setelah mengubah file env.

### Mengaktifkan login admin

1. Pastikan [`supabase/setup-projects.sql`](supabase/setup-projects.sql) sudah
   dijalankan di Supabase SQL Editor.
2. Jalankan [`supabase/setup-projects-admin.sql`](supabase/setup-projects-admin.sql)
   di SQL Editor. Script ini membuat daftar admin serta aturan RLS untuk
   membaca draft dan menulis Projects.
3. Jalankan [`supabase/setup-site-content.sql`](supabase/setup-site-content.sql)
   di SQL Editor. Script ini membuat tabel untuk tujuh menu konten selain
   Projects, beserta aturan baca publik dan tulis khusus admin.
4. Jalankan [`supabase/setup-project-gallery.sql`](supabase/setup-project-gallery.sql)
   di SQL Editor untuk menambah kolom foto, bucket Storage, dan izin unggah admin.
5. Di Supabase Dashboard, buka **Authentication → Users** dan buat satu akun
   **email + password** untuk Anda. Akun Dashboard Supabase tidak otomatis
   menjadi akun Auth aplikasi.
6. Buka [`supabase/grant-portfolio-admin.sql`](supabase/grant-portfolio-admin.sql),
   ganti `GANTI_DENGAN_EMAIL_ANDA@example.com` dengan email akun tersebut,
   lalu jalankan script di SQL Editor. Script akan gagal jika email belum ada.
7. Masuk di `/#/admin` dengan akun itu. Tidak ada pendaftaran publik pada
   dashboard ini.

Jika setup admin untuk Projects sudah selesai, jalankan langkah **3** untuk
formulir bagian lain dan langkah **4** untuk galeri foto. Buka tiap tab, ganti isi contoh lokal,
lalu klik **Simpan bagian**. Menyimpan tab Identitas akan memperbarui nama dan
kontak di beberapa bagian situs sekaligus.

Dengan konfigurasi Supabase aktif, section Projects di website hanya mengambil
baris yang `is_published = true`. Draft tidak muncul. Jika belum ada proyek
terbit, section menampilkan pesan kosong. Jika koneksi gagal, section
menampilkan pesan gagal memuat sehingga proyek lokal tidak tersaji sebagai
proyek terbit. Data contoh lokal hanya tampil saat env Supabase belum diisi.

### Foto slider Projects

Draft **tetap tersimpan di tabel `projects`**, tetapi tidak muncul di halaman
utama sampai kotak **Tampilkan di portofolio** dicentang dan proyek disimpan
lagi. Dashboard admin dapat membaca draft; pengunjung hanya dapat membaca
proyek terbit.

Kolom **Masalah**, **Solusi**, dan **Angka dampak** tampil pada proyek terbit,
baik kartu biasa maupun proyek unggulan. Kartu **Arsip** di akhir section
Projects adalah tautan ke kumpulan karya lain, bukan daftar proyek otomatis.
Ubah judul, deskripsi, teks tombol, dan URL-nya melalui dashboard **Home →
Metadata situs → Kartu arsip Projects**, lalu simpan bagian Home. Ganti URL
contoh `#` dengan tujuan yang benar, misalnya profil GitHub Anda.

Section Projects mempertahankan tampilan kartu unggulan yang lebar dan kartu
proyek biasa yang ringkas. **Satu proyek terbit tampil setiap kali**; jika ada
lebih dari satu, pengunjung bisa berpindah dengan panah, penanda slide, tombol
panah keyboard saat fokus pada slider, atau geser di layar sentuh. Galeri foto
di dalam proyek tetap mempunyai kontrolnya sendiri.

Slider Skills berpindah antar **kelompok keahlian**, bukan antar-item di dalam
kartu. Pada desktop tampil tiga kartu kelompok per halaman, tablet dua, dan
ponsel satu. Semua item keahlian dalam kartu yang aktif tetap terlihat.

Setelah menjalankan `setup-project-gallery.sql`, muat ulang dashboard. Untuk
proyek baru, simpan sebagai draft dahulu. Pilih proyek dari daftar, lalu unggah
foto JPG, PNG, WebP, atau AVIF (maksimal 6 MB per foto), atau masukkan URL
gambar. Isi deskripsi setiap gambar, atur urutan dengan tombol panah, dan klik
**Simpan draft** lagi. Slider akan tampil setelah proyek diterbitkan.

File foto disimpan di bucket publik `portfolio-project-images`; kolom
`projects.images` menyimpan URL, deskripsi, dan urutan gambar. Foto dalam
bucket publik dapat diakses jika URL-nya diketahui, termasuk foto milik draft.
Menghapus foto dari galeri hanya melepasnya dari proyek; file di Storage tidak
otomatis dihapus.

Untuk deployment, isi dua variabel `VITE_` tersebut di pengaturan environment
hosting lalu bangun ulang website. Jangan gunakan secret key atau password
database di frontend.

---

## Sistem desain

Token warna didefinisikan di `@theme` dalam [`src/index.css`](src/index.css).
Tailwind v4 memancarkannya sebagai CSS variable, sehingga utilities seperti
`bg-paper` / `text-ink` / `border-ink` merujuk `var(--color-…)`. Karena itu
**mode gelap cukup meng-override variable di bawah `.dark`** — seluruh palet
terbalik tanpa menulis ulang satu pun class.

| Token | Light | Dark | Peran |
|---|---|---|---|
| `paper` | `#f7ede5` | `#211f1d` | Latar krem pucat |
| `paper-2` | `#b4c471` | `#394329` | Kartu dan strip hijau sage |
| `card` | `#fff7f1` | `#2c2a27` | Permukaan kartu krem |
| `ink` | `#292724` | `#f7ede5` | Border + teks utama |
| `ink-soft` | `#4b4640` | `#d3c7b9` | Teks sekunder |
| `acid` | `#ffbf2c` | `#5a4315` | Kartu dan hover kuning |
| `acid-deep` | `#e99116` | `#9b6a1a` | Bayangan dan garis aksen |
| `acid-text` | `#ffbf2c` | `#8b4d00` | Teks aksen di kartu inverse |
| `flag` | `#f37b08` | `#ffad55` | Kartu dan badge oranye |
| `flag-text` | `#813000` | `#ffba70` | Label oranye dengan kontras tinggi |
| `on-flag` | `#292724` | `#292724` | Teks pada bidang oranye |
| `azure` | `#813000` | `#ffba70` | Fokus keyboard |

Nama token `acid` dan `flag` dipertahankan agar class komponen yang sudah ada
tetap bekerja. Palet sekarang mengikuti referensi ilustrasi: krem, kuning,
oranye, sage, dan charcoal. Warna label oranye dipisah dari warna bidangnya
agar teks kecil tetap mudah dibaca.

**Tipografi** (Google Fonts, dimuat di `index.html`)

- `Archivo Black` → `font-display` — heading besar, rapat, kapital
- `Space Grotesk` → `font-sans` — body text
- `JetBrains Mono` → `font-mono` — label, metadata, tanggal, tag

**Utility brutalist kustom** (didefinisikan dengan `@utility` di `index.css`)

| Utility | Fungsi |
|---|---|
| `brutal-card` | Border 3px + hard shadow `5px 5px 0` tanpa blur |
| `brutal-lift` / `brutal-press` | Terangkat saat hover / menekan saat active |
| `brutal-acid` `brutal-ink` `brutal-paper` `brutal-paper2` `brutal-flag` | Varian permukaan kartu |
| `bg-blueprint` `bg-halftone` `bg-hatch` | Pola latar editorial |
| `text-outline` | Teks outline (stroke tinta, fill transparan) |
| `label-mono` | Label metadata mono kapital |
| `no-scrollbar` | Sembunyikan scrollbar (strip nav) |

---

## Motion

Seluruh gerak memakai properti komposit (`translate`, `scale`, `rotate`, `opacity`)
sehingga tidak memicu reflow. `translate`/`scale` dipakai — **bukan** `transform` —
supaya reveal tidak bertabrakan dengan `hover:brutal-lift` (berbasis `transform`)
pada kartu yang sama. Konsekuensinya, kartu bisa muncul lalu tetap terangkat saat hover.

| Efek | Pemicu | Catatan |
|---|---|---|
| Reveal kartu | mati saat section masuk viewport (sekali jalan) | `useReveal` + class `.reveal`; jeda lewat `delay` |
| Varian arah | prop `variant` di `BentoCell` | `left` · `right` · `down` · `scale` · `blur` · `none` |
| Judul tersingkap | section ter-reveal | `.mask-line`, delay per baris lewat `--line-delay` |
| Garis section tumbuh | scroll (`animation-timeline: view()`) | `[data-scroll-rule]`; fallback statis bila tak didukung |
| Parallax nama footer | scroll | `[data-parallax="slow"]` |
| Angka statistik berjalan | angka masuk viewport | `CountUp.jsx`, format `5+` / `38` dipertahankan |
| Pita teks berjalan | terus-menerus, berhenti saat hover | `MarqueeBand.jsx` |
| Sorot kursor + tilt 3D | pointer presisi | `data-spotlight` · `data-tilt="7"`; mati di layar sentuh |
| Tukar slide proyek/skill | tombol, dot, geser, tombol panah | `swap-next` / `swap-prev`, arah mengikuti navigasi |
| Segmen level skill | kartu skill tampil | `.level-seg` + `--seg` |
| Rail section & tombol naik | posisi scroll | `PageChrome.jsx` (rail hanya ≥1280px) |

**Aksesibilitas.** `prefers-reduced-motion: reduce` mematikan semua animasi dan
langsung menampilkan konten (tidak ada yang tertinggal transparan). Tanpa
JavaScript, `<noscript>` di `index.html` melakukan hal yang sama.

---

## Struktur

```
My-Porftolio/
├─ index.html                  # meta, Google Fonts, skrip anti-flash tema
├─ vite.config.js              # plugin React + @tailwindcss/vite, port 5173
├─ package.json
└─ src/
   ├─ main.jsx
   ├─ App.jsx                  # merangkai NavBar + 7 section + Footer
   ├─ index.css                # DESIGN SYSTEM: token, utility, animasi
   ├─ data/
   │  ├─ content.js            # konten contoh lokal
   │  └─ contentGroups.js      # pemetaan tab admin dan data situs
   ├─ admin/                  # login dan editor konten
   ├─ contexts/ContentContext.jsx  # membaca konten Supabase untuk situs
   ├─ hooks/
   │  ├─ useTheme.js           # dark/light + localStorage
   │  ├─ useReveal.js          # scroll reveal + varian arah + MutationObserver
   │  ├─ usePointerFX.js       # sorot kursor & tilt 3D (delegation, rAF)
   │  ├─ useScrolled.js        # status header menempel
   │  ├─ useScrollProgress.js  # garis progres di nav
   │  └─ useActiveSection.js   # penanda section aktif di nav
   ├─ components/
   │  ├─ BentoCell.jsx         # unit dasar layout (prop: tone, span, hover, variant, delay)
   │  ├─ SectionHeader.jsx     # nomor + judul + rule editorial
   │  ├─ BrutalButton.jsx      # tombol/link brutalist
   │  ├─ CountUp.jsx           # angka statistik berjalan
   │  ├─ MarqueeBand.jsx       # pita teks berjalan
   │  ├─ PageChrome.jsx        # rail section + kembali ke atas
   │  ├─ Tag.jsx               # chip metadata
   │  ├─ Primitives.jsx        # SectionShell, BentoGrid, Label, Rule, IndexBadge, CornerMark
   │  ├─ NavBar.jsx
   │  └─ Footer.jsx
   └─ sections/
      ├─ Home.jsx  ├─ About.jsx     ├─ Experience.jsx  ├─ Projects.jsx
      ├─ Skills.jsx ├─ Education.jsx └─ Contact.jsx
```

### Pola grid

`BentoGrid` menghasilkan `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
Tiap `BentoCell` mengatur lebarnya lewat prop `span`:

```jsx
<BentoCell span="sm:col-span-2 lg:col-span-3" tone="acid" pad="lg" hover delay={60}>
  …
</BentoCell>
```

- `tone` → `card` (default) · `paper` · `paper2` · `acid` · `ink` · `flag`
- `pad` → `none` · `sm` · `md` (default) · `lg`
- `hover` → aktifkan efek angkat + tekan
- `variant` → arah reveal: `left` · `right` · `down` · `scale` · `blur` · `none`
- `delay` → jeda kemunculan (ms) untuk efek reveal bertingkat

---

## Interaksi

- **Dark/Light toggle** di kanan atas. Pilihan disimpan di `localStorage`
  (`portfolio-theme`), dan skrip kecil di `index.html` memasangnya sebelum React
  mount supaya tidak ada *flash* tema salah. Tanpa preferensi tersimpan,
  mengikuti `prefers-color-scheme` sistem.
- **Scroll reveal** — tiap kartu muncul saat masuk viewport (sekali jalan),
  dengan varian arah dan jeda bertingkat.
- **Scroll-linked** — garis judul section tumbuh saat masuk layar, nama besar di
  footer bergerak pelan (parallax), dan rail section di kanan menandai posisi.
- **Hover** — kartu terangkat 3px dan shadow-nya membesar; menekan saat diklik.
  Kartu identitas menyorot mengikuti kursor, potret memiringkan diri (tilt 3D).
- **Angka statistik** berjalan dari nol saat kartu rekap masuk layar.
- **Pita teks** di antara Home dan About berhenti bergerak saat di-hover.
- **Garis progres scroll** di dasar nav + tombol kembali ke atas setelah 10%.
- **Salin email** satu klik di section Contact.
- **FAQ akordeon** dengan transisi tinggi berbasis `grid-template-rows`.
- **`prefers-reduced-motion`** dihormati: semua animasi & transisi dimatikan.

---

## Deploy

`npm run build` menghasilkan `dist/` statis — bisa langsung di-drop ke
Netlify, Vercel, Cloudflare Pages, atau GitHub Pages.

Untuk GitHub Pages di bawah sub-path, tambahkan `base` di `vite.config.js`:

```js
export default defineConfig({
  base: '/nama-repo/',
  // …
})
```
