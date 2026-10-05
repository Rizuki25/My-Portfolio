/**
 * ============================================================================
 *  PUSAT KONTEN PORTFOLIO
 * ============================================================================
 *  Data awal saat bagian situs belum disimpan lewat dashboard admin.
 *  Setelah tersimpan, konten dari Supabase menjadi sumber utama.
 *
 *  Tips:
 *   - `href: '#'` berarti tautan placeholder, isi dengan URL asli Anda.
 *   - `level` pada skills = 1..5 (dirender sebagai bar segmen brutalist).
 *   - Tambah/kurangi item array bebas; layout menyesuaikan otomatis.
 * ============================================================================
 */

export const profile = {
  name: 'Raka Aditya Nugraha',
  firstName: 'Raka',
  lastName: 'Nugraha',
  monogram: 'RAN',
  role: 'Front-End Engineer',
  roleAlt: 'UI Developer',
  tagline:
    'Saya membangun antarmuka web yang cepat, tegas, dan mudah dirawat — dari desain sistem sampai piksel terakhir.',
  location: 'Jakarta, Indonesia',
  timezone: 'GMT+7 / WIB',
  email: 'halo@rakanugraha.dev',
  phone: '+62 812 0000 0000',
  availability: 'Terbuka untuk freelance & full-time',
  statusNote: 'Biasa merespons dalam 1×24 jam',
  yearsExp: 5,
  resumeUrl: '#',
  avatarUrl: null, // isi dengan '/foto.jpg' bila punya; null = monogram brutalist
  socials: [
    { label: 'GitHub', handle: '@rakanugraha', href: '#', note: '62 repositori publik' },
    { label: 'LinkedIn', handle: 'in/rakanugraha', href: '#', note: '1.200+ koneksi' },
    { label: 'Dribbble', handle: '@rakanugraha', href: '#', note: 'UI & design system' },
    { label: 'X / Twitter', handle: '@raka_builds', href: '#', note: 'Catatan harian ngoding' },
  ],
}

/** Statistik ringkas di section Home */
export const stats = [
  { value: '5+', label: 'Tahun pengalaman', sub: 'sejak 2020' },
  { value: '38', label: 'Project shipped', sub: 'web & dashboard' },
  { value: '12', label: 'Klien & tim', sub: 'startup sampai enterprise' },
  { value: '99', label: 'Skor Lighthouse', sub: 'performance avg.' },
]

export const about = {
  heading: 'Engineer yang berpikir seperti editor.',
  paragraphs: [
    'Saya Raka — front-end engineer berbasis di Jakarta. Lima tahun terakhir saya habiskan membangun produk web untuk startup fintech, agensi, dan tim internal enterprise. Fokus saya satu: menerjemahkan desain yang rumit jadi antarmuka yang ringan, konsisten, dan bisa dipakai siapa saja.',
    'Saya paling hidup di persimpangan antara desain dan rekayasa — menyusun design system, memperdebatkan spasi 4px, lalu memangkas bundle size separuhnya. Saya percaya antarmuka yang baik terasa seperti editorial yang rapi: ada hierarki, ada ritme, tidak ada yang berteriak tanpa alasan.',
    'Di luar layar, saya menulis catatan teknis, mengoleksi majalah desain lama, dan sesekali jadi pembicara di meetup front-end lokal.',
  ],
  facts: [
    { k: 'Berbasis di', v: 'Jakarta, Indonesia' },
    { k: 'Fokus', v: 'Front-End & Design System' },
    { k: 'Bahasa', v: 'Indonesia (native), Inggris (profesional)' },
    { k: 'Mode kerja', v: 'Remote / Hybrid / WFO' },
    { k: 'Editor', v: 'VS Code + Neovim' },
    { k: 'Prinsip', v: 'Kejelasan > dekorasi' },
  ],
  principles: [
    {
      n: '01',
      t: 'Kecepatan adalah fitur',
      d: 'Performa bukan tahap optimasi di akhir, tapi keputusan desain dari awal.',
    },
    {
      n: '02',
      t: 'Sistem, bukan halaman',
      d: 'Komponen yang konsisten memangkas bug dan mempercepat tim, bukan cuma satu rilis.',
    },
    {
      n: '03',
      t: 'Aksesibel itu wajib',
      d: 'Semantik, keyboard, dan kontras adalah fondasi — bukan pelengkap.',
    },
    {
      n: '04',
      t: 'Tulis untuk dibaca',
      d: 'Kode dan dokumentasi yang jelas adalah bentuk hormat pada rekan satu tim.',
    },
  ],
  currently: [
    'Membangun design system multi-brand di Tokopedia Finance',
    'Belajar Rust lewat proyek CLI kecil-kecilan',
    'Membaca "Refactoring UI" untuk ketiga kalinya',
    'Mentoring 3 junior developer setiap minggu',
  ],
}

export const experience = [
  {
    period: '2023 — Sekarang',
    role: 'Senior Front-End Engineer',
    company: 'Nusantara Fintech',
    location: 'Jakarta / Hybrid',
    type: 'Full-time',
    current: true,
    summary:
      'Memimpin pengembangan design system dan dashboard internal untuk tim operasional 200+ orang.',
    highlights: [
      'Membangun design system "Aruna UI" (74 komponen) yang memangkas waktu develop fitur baru hingga 40%.',
      'Memimpin migrasi dari Create React App ke Vite — build time turun dari 4 menit ke 38 detik.',
      'Menurunkan Largest Contentful Paint dari 3,8 s menjadi 1,2 s pada aplikasi customer-facing.',
      'Membimbing 3 front-end junior dan menjalankan review kultur dokumentasi tim.',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Storybook', 'Vitest'],
  },
  {
    period: '2021 — 2023',
    role: 'Front-End Engineer',
    company: 'Studio Kala Kreatif',
    location: 'Bandung / Remote',
    type: 'Full-time',
    current: false,
    summary:
      'Mengembangkan 15+ website klien — dari company profile hingga e-commerce headless.',
    highlights: [
      'Membangun template e-commerce headless (Next.js + Shopify) yang dipakai ulang untuk 6 klien.',
      'Mengimplementasikan animasi berbasis scroll dengan GSAP tanpa mengorbankan skor Lighthouse.',
      'Berkoordinasi langsung dengan desainer dan klien untuk menjaga fidelity implementasi.',
    ],
    stack: ['Next.js', 'Shopify', 'GSAP', 'SCSS', 'Sanity CMS'],
  },
  {
    period: '2020 — 2021',
    role: 'Junior Web Developer',
    company: 'Pijar Digital Agency',
    location: 'Yogyakarta',
    type: 'Full-time',
    current: false,
    summary: 'Titik awal karier — membangun landing page dan sistem internal sederhana.',
    highlights: [
      'Mengembangkan 20+ landing page kampanye dengan deadline ketat.',
      'Mengotomasi pembuatan laporan mingguan klien dengan skrip Node.js.',
    ],
    stack: ['JavaScript', 'Vue 2', 'Laravel Blade', 'Bootstrap'],
  },
  {
    period: '2019 — 2020',
    role: 'Web Developer Intern',
    company: 'Balai Riset Informatika',
    location: 'Yogyakarta',
    type: 'Internship',
    current: false,
    summary: 'Riset dan prototipe antarmuka visualisasi data akademik.',
    highlights: [
      'Membangun prototipe dashboard visualisasi data dengan D3.js.',
      'Menyusun dokumentasi komponen untuk dipakai tim riset berikutnya.',
    ],
    stack: ['D3.js', 'jQuery', 'PHP'],
  },
]

export const experienceMeta = {
  range: '2019 — kini',
  industries: 'Fintech, Agensi, Riset',
  workModes: 'Hybrid & Remote',
}

export const projects = [
  {
    id: 'aruna-ui',
    index: '01',
    name: 'Aruna UI',
    kind: 'Design System',
    year: '2024',
    featured: true,
    description:
      'Design system multi-brand berisi 74 komponen React yang terdokumentasi penuh di Storybook. Mendukung theming runtime, mode gelap, dan token desain yang disinkronkan langsung dari Figma.',
    problem:
      'Tiga produk internal punya gaya UI berbeda-beda; tiap fitur baru dikerjakan dua kali.',
    solution:
      'Menyusun lapisan token (color, spacing, typography) yang dikonsumsi Tailwind config, lalu membangun komponen headless di atasnya.',
    impact: [
      { k: 'Waktu develop fitur', v: '−40%' },
      { k: 'Komponen', v: '74' },
      { k: 'Adopsi tim', v: '6 produk' },
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook', 'Radix UI', 'Changesets'],
    links: [
      { label: 'Live Demo', href: '#' },
      { label: 'Source Code', href: '#' },
      { label: 'Case Study', href: '#' },
    ],
  },
  {
    id: 'ledger-dash',
    index: '02',
    name: 'Ledger Dash',
    kind: 'Dashboard Fintech',
    year: '2024',
    featured: true,
    description:
      'Dashboard analitik transaksi real-time untuk tim operasional. Menampilkan 1,2 juta baris data dengan virtualized table, filter kompleks, dan ekspor laporan terjadwal.',
    problem: 'Tim ops menunggu 20 detik untuk memuat tabel transaksi berisi ratusan ribu baris.',
    solution:
      'Virtualisasi baris, debounce filter, dan pemindahan agregasi ke web worker agar UI tetap responsif.',
    impact: [
      { k: 'Waktu render tabel', v: '20s → 0,4s' },
      { k: 'Baris data', v: '1,2 jt' },
      { k: 'Pengguna harian', v: '180+' },
    ],
    stack: ['React', 'TanStack Table', 'TanStack Query', 'Web Workers', 'Recharts'],
    links: [
      { label: 'Live Demo', href: '#' },
      { label: 'Source Code', href: '#' },
    ],
  },
  {
    id: 'kopi-kawan',
    index: '03',
    name: 'Kopi Kawan',
    kind: 'E-Commerce Headless',
    year: '2023',
    featured: false,
    description:
      'Toko kopi single-origin dengan checkout Shopify dan front-end Next.js. Skor Lighthouse 100 di empat kategori.',
    stack: ['Next.js', 'Shopify Hydrogen', 'Tailwind CSS', 'Framer Motion'],
    links: [
      { label: 'Live Site', href: '#' },
      { label: 'Source Code', href: '#' },
    ],
    metrics: 'Lighthouse 100 / 100 / 100 / 100',
  },
  {
    id: 'aksara',
    index: '04',
    name: 'Aksara',
    kind: 'Aplikasi Edukasi',
    year: '2023',
    featured: false,
    description:
      'Aplikasi belajar aksara Nusantara dengan kuis interaktif, mode offline-first, dan audio pelafalan.',
    stack: ['React', 'PWA', 'IndexedDB', 'Howler.js'],
    links: [
      { label: 'Live Demo', href: '#' },
      { label: 'Source Code', href: '#' },
    ],
    metrics: '4.000+ pengguna aktif bulanan',
  },
  {
    id: 'brutalist-kit',
    index: '05',
    name: 'Brutalist Kit',
    kind: 'Open Source',
    year: '2022',
    featured: false,
    description:
      'Pustaka komponen Tailwind bergaya neo-brutalist. 1,1k bintang di GitHub dan dipakai di 40+ proyek.',
    stack: ['Tailwind CSS', 'Astro', 'TypeScript'],
    links: [
      { label: 'Dokumentasi', href: '#' },
      { label: 'Source Code', href: '#' },
    ],
    metrics: '1,1k GitHub stars',
  },
  {
    id: 'sinyal',
    index: '06',
    name: 'Sinyal',
    kind: 'Side Project',
    year: '2022',
    featured: false,
    description:
      'Papan pantau status layanan publik kota dengan notifikasi Telegram. Eksperimen visualisasi data real-time.',
    stack: ['Vue 3', 'D3.js', 'Supabase', 'Telegram Bot API'],
    links: [{ label: 'Source Code', href: '#' }],
    metrics: 'Eksperimen pribadi',
  },
]

/**
 * `level` = 1..5 → dirender sebagai 5 blok segmen brutalist.
 */
export const skillGroups = [
  {
    title: 'Bahasa & Core',
    icon: '</>',
    skills: [
      { name: 'JavaScript (ES2023)', level: 5 },
      { name: 'TypeScript', level: 5 },
      { name: 'HTML5 & Semantik', level: 5 },
      { name: 'CSS3 / Modern CSS', level: 5 },
      { name: 'Rust', level: 2 },
    ],
  },
  {
    title: 'Framework & Library',
    icon: '{ }',
    skills: [
      { name: 'React', level: 5 },
      { name: 'Next.js', level: 4 },
      { name: 'Vue 3 / Nuxt', level: 4 },
      { name: 'Astro', level: 4 },
      { name: 'Svelte', level: 3 },
    ],
  },
  {
    title: 'Styling & UI',
    icon: '◧',
    skills: [
      { name: 'Tailwind CSS', level: 5 },
      { name: 'Design System / Tokens', level: 5 },
      { name: 'Framer Motion / GSAP', level: 4 },
      { name: 'SCSS / CSS Modules', level: 4 },
      { name: 'Figma (handoff & prototyping)', level: 4 },
    ],
  },
  {
    title: 'Engineering & Tooling',
    icon: '⚙',
    skills: [
      { name: 'Vite / Webpack / Turbopack', level: 5 },
      { name: 'Testing (Vitest, Playwright)', level: 4 },
      { name: 'CI/CD (GitHub Actions)', level: 4 },
      { name: 'Git & Monorepo (pnpm, Nx)', level: 5 },
      { name: 'Performance & Core Web Vitals', level: 5 },
    ],
  },
  {
    title: 'Data & Backend Ringan',
    icon: '▤',
    skills: [
      { name: 'REST & GraphQL', level: 4 },
      { name: 'Node.js / Express', level: 3 },
      { name: 'PostgreSQL & Prisma', level: 3 },
      { name: 'Supabase / Firebase', level: 4 },
    ],
  },
  {
    title: 'Praktik Kerja',
    icon: '✦',
    skills: [
      { name: 'Accessibility (WCAG 2.2 AA)', level: 5 },
      { name: 'Code Review & Mentoring', level: 4 },
      { name: 'Dokumentasi Teknis', level: 5 },
      { name: 'Agile / Scrum', level: 4 },
    ],
  },
]

/** Daftar tools yang dirender sebagai grid tag padat */
export const toolbox = [
  'VS Code', 'Neovim', 'Figma', 'Storybook', 'Vitest', 'Playwright',
  'GitHub Actions', 'Vercel', 'Netlify', 'Docker', 'Postman', 'Linear',
  'Notion', 'Raycast', 'Arc', 'pnpm', 'Nx', 'Sentry',
]

export const education = [
  {
    period: '2016 — 2020',
    degree: 'S.Kom — Sarjana Ilmu Komputer',
    school: 'Universitas Gadjah Mada',
    location: 'Yogyakarta',
    grade: 'IPK 3,71 / 4,00 — Cum Laude',
    note: 'Skripsi: "Optimasi Rendering Aplikasi Web Single-Page dengan Teknik Virtualisasi DOM".',
    courses: ['Struktur Data', 'Rekayasa Perangkat Lunak', 'Interaksi Manusia & Komputer', 'Jaringan Komputer'],
  },
  {
    period: '2022',
    degree: 'Front-End Web Development Professional Certificate',
    school: 'Meta / Coursera',
    location: 'Online',
    grade: 'Lulus dengan distinction',
    note: 'Pendalaman React, pengujian, dan praktik front-end modern.',
    courses: ['Advanced React', 'Front-End Testing', 'UX Principles'],
  },
]

export const certifications = [
  { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024', href: '#' },
  { name: 'Google Mobile UX Design', issuer: 'Google / Coursera', year: '2023', href: '#' },
  { name: 'IAAP Web Accessibility Specialist', issuer: 'IAAP', year: '2023', href: '#' },
  { name: 'Scrum Foundation Certified', issuer: 'Scrum Study', year: '2021', href: '#' },
]

export const awards = [
  { year: '2024', title: 'Engineering Excellence Award', org: 'Nusantara Fintech' },
  { year: '2023', title: 'Juara 2 — Hackathon Data Terbuka Jakarta', org: 'Pemprov DKI' },
  { year: '2019', title: 'Lulusan Terbaik Fakultas Ilmu Komputer', org: 'Universitas Gadjah Mada' },
]

export const educationMeta = {
  verificationNote: 'Ijazah & transkrip tersedia atas permintaan.',
}

/** Nomor section dipakai konsisten di nav & header tiap section */
export const sections = [
  { id: 'home', index: '01', label: 'Home' },
  { id: 'about', index: '02', label: 'About' },
  { id: 'experience', index: '03', label: 'Experience' },
  { id: 'projects', index: '04', label: 'Projects' },
  { id: 'skills', index: '05', label: 'Skills' },
  { id: 'education', index: '06', label: 'Education' },
  { id: 'contact', index: '07', label: 'Contact' },
]

export const contact = {
  heading: 'Mari bikin sesuatu yang tegas.',
  body:
    'Punya proyek, lowongan, atau sekadar mau ngobrol soal front-end? Kotak masuk saya selalu terbuka — saya balas dalam 1×24 jam.',
  emailCta: 'Kirim Email',
  services: [
    { t: 'Pengembangan Front-End', d: 'Aplikasi React/Next.js dari nol sampai produksi.' },
    { t: 'Design System', d: 'Audit, penyusunan token, dan pustaka komponen.' },
    { t: 'Optimasi Performa', d: 'Perbaikan Core Web Vitals dan bundle size.' },
    { t: 'Konsultasi & Review', d: 'Code review, mentoring, dan sesi pair programming.' },
  ],
  faq: [
    { q: 'Berapa rate freelance Anda?', a: 'Mulai Rp 8–15 juta per proyek kecil, atau tarif harian untuk engagement panjang. Saya kirim proposal rinci setelah diskusi awal.' },
    { q: 'Bisa kerja remote lintas zona waktu?', a: 'Bisa. Saya terbiasa overlap 4 jam dengan tim di zona waktu Eropa dan Amerika Barat.' },
    { q: 'Menerima proyek jangka pendek?', a: 'Ya, minimal 2 minggu. Untuk audit atau code review bisa sesi satu kali.' },
  ],
}

export const siteMeta = {
  title: 'Raka Aditya Nugraha — Front-End Engineer',
  footerNote: 'Dibangun dengan Vite, React, dan Tailwind CSS.',
  edition: 'ED. 2025 / VOL. 01',
  statsAsOf: 'Data per 2025',
  colophon:
    'Disetel dalam Archivo Black, Space Grotesk, dan JetBrains Mono. Layout bento grid neo-brutalist.',
  sectionDescriptions: {
    about: 'Siapa saya, cara saya bekerja, dan apa yang sedang saya kerjakan sekarang.',
    experience: 'Jejak karier dari magang riset sampai memimpin design system di fintech.',
    projects: 'Sebagian pekerjaan yang paling mewakili cara saya berpikir: masalah, solusi, lalu dampaknya dalam angka.',
    skills: 'Tingkat penguasaan dinilai jujur: 5 = memimpin & mengajari, 3 = produktif mandiri, 1 = baru mengenal.',
    education: 'Latar belakang akademik dan pembelajaran berkelanjutan yang menopang cara kerja saya.',
    contact: 'Kanal tercepat adalah email. Sebutkan singkat proyek atau peran yang Anda tawarkan.',
  },
  projectArchive: {
    heading: 'Masih banyak eksperimen yang belum masuk daftar ini.',
    description: '62 repositori publik — dari pustaka komponen sampai skrip otomatisasi kecil.',
    buttonLabel: 'Buka GitHub',
    href: '#',
  },
  projectProcess: ['Pahami masalah', 'Rancang sistem', 'Bangun iteratif', 'Ukur & pangkas'],
}
