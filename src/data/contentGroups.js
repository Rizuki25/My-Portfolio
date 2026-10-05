import {
  about,
  awards,
  certifications,
  contact,
  education,
  educationMeta,
  experience,
  experienceMeta,
  profile,
  siteMeta,
  skillGroups,
  stats,
  toolbox,
} from './content.js'

/** Satu baris site_content per tab; Projects tetap memakai tabel tersendiri. */
export const contentGroups = [
  {
    key: 'identity',
    label: 'Identitas',
    description: 'Nama, peran, kontak, foto, dan media sosial yang muncul di seluruh situs.',
    defaults: { profile },
  },
  {
    key: 'home',
    label: 'Home',
    description: 'Statistik, deskripsi bagian, kartu Arsip Projects, dan metadata footer.',
    defaults: { stats, siteMeta },
  },
  {
    key: 'about',
    label: 'About',
    description: 'Cerita singkat, fakta, prinsip, dan kegiatan saat ini.',
    defaults: { about },
  },
  {
    key: 'experience',
    label: 'Experience',
    description: 'Riwayat pekerjaan, pencapaian, dan teknologi pada setiap peran.',
    defaults: { experience, experienceMeta },
  },
  {
    key: 'skills',
    label: 'Skills',
    description: 'Kelompok keahlian, tingkat kemampuan, dan daftar alat.',
    defaults: { skillGroups, toolbox },
  },
  {
    key: 'education',
    label: 'Education',
    description: 'Pendidikan, sertifikasi, dan penghargaan.',
    defaults: { education, certifications, awards, educationMeta },
  },
  {
    key: 'contact',
    label: 'Contact',
    description: 'Ajakan menghubungi, layanan, dan pertanyaan umum.',
    defaults: { contact },
  },
]

export const defaultContent = Object.assign({}, ...contentGroups.map((group) => group.defaults))

export function blankLike(example) {
  if (Array.isArray(example)) return []
  if (example && typeof example === 'object') {
    return Object.fromEntries(Object.entries(example).map(([key, value]) => [key, blankLike(value)]))
  }
  if (typeof example === 'boolean') return false
  if (typeof example === 'number') return 0
  return ''
}

function hydrateFromExample(example, value, fallback) {
  if (Array.isArray(example)) {
    if (!Array.isArray(value)) return structuredClone(fallback)
    if (example.length === 0) return value
    return value.map((item) =>
      hydrateFromExample(example[0], item, blankLike(example[0])),
    )
  }
  if (example && typeof example === 'object') {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
    return Object.fromEntries(
      Object.entries(example).map(([key, child]) => [
        key,
        hydrateFromExample(child, source[key], fallback[key]),
      ]),
    )
  }
  if (example === null) return typeof value === 'string' ? value : fallback
  return typeof value === typeof example ? value : fallback
}

export function hydrateLike(example, value) {
  return hydrateFromExample(example, value, example)
}

export function contentFromRows(rows) {
  const byKey = new Map(rows.map((row) => [row.section_key, row.content]))
  return Object.assign({}, ...contentGroups.map((group) =>
    hydrateLike(group.defaults, byKey.get(group.key)),
  ))
}
