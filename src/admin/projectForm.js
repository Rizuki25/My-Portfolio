export const PROJECT_COLUMNS =
  '*'
export const MAX_PROJECT_IMAGES = 12

export function blankProject() {
  return {
    id: '',
    name: '',
    kind: '',
    year: String(new Date().getFullYear()),
    featured: false,
    description: '',
    problem: '',
    solution: '',
    impact: [],
    stack: '',
    links: [],
    images: [],
    metrics: '',
    sort_order: '0',
    is_published: false,
  }
}

export function projectToForm(project) {
  return {
    ...blankProject(),
    ...project,
    year: String(project.year),
    sort_order: String(project.sort_order),
    problem: project.problem ?? '',
    solution: project.solution ?? '',
    metrics: project.metrics ?? '',
    impact: Array.isArray(project.impact) ? project.impact : [],
    stack: Array.isArray(project.stack) ? project.stack.join(', ') : '',
    links: Array.isArray(project.links) ? project.links : [],
    images: Array.isArray(project.images)
      ? project.images.map((item) => ({ url: String(item?.url ?? ''), alt: String(item?.alt ?? '') }))
      : [],
  }
}

function isWebUrl(value) {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname)
  } catch {
    return false
  }
}

export function validateProject(form) {
  const id = form.id.trim().toLowerCase()
  const name = form.name.trim()
  const kind = form.kind.trim()
  const description = form.description.trim()
  const year = Number(form.year)
  const sortOrder = Number(form.sort_order)

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    return { error: 'ID harus huruf kecil, angka, dan tanda hubung. Contoh: desain-aplikasi.' }
  }
  if (!name || !kind || !description) {
    return { error: 'Nama, kategori, dan deskripsi wajib diisi.' }
  }
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return { error: 'Tahun harus berupa angka antara 1900 dan 2100.' }
  }
  if (!form.sort_order.trim() || !Number.isInteger(sortOrder) || sortOrder < 0) {
    return { error: 'Urutan harus berupa bilangan bulat mulai dari 0.' }
  }

  const impact = form.impact.map(({ k = '', v = '' }) => ({ k: k.trim(), v: v.trim() }))
  if (impact.some(({ k, v }) => !k || !v)) {
    return { error: 'Setiap baris dampak harus mempunyai label dan nilai.' }
  }

  const links = form.links.map(({ label = '', href = '' }) => ({
    label: label.trim(),
    href: href.trim(),
  }))
  if (links.some(({ label, href }) => !label || !isWebUrl(href))) {
    return { error: 'Setiap tautan harus mempunyai label dan URL http:// atau https://.' }
  }

  const sourceImages = Array.isArray(form.images) ? form.images : []
  if (sourceImages.length > MAX_PROJECT_IMAGES) {
    return { error: `Galeri proyek maksimal berisi ${MAX_PROJECT_IMAGES} foto.` }
  }
  const images = sourceImages.map((item) => ({
    url: String(item?.url ?? '').trim(),
    alt: String(item?.alt ?? '').trim(),
  }))
  if (images.some(({ url, alt }) => !isWebUrl(url) || !alt)) {
    return { error: 'Setiap foto harus mempunyai URL http(s) dan deskripsi gambar.' }
  }

  return {
    payload: {
      id,
      name,
      kind,
      year,
      featured: Boolean(form.featured),
      description,
      problem: String(form.problem ?? '').trim() || null,
      solution: String(form.solution ?? '').trim() || null,
      impact,
      stack: [...new Set(form.stack.split(',').map((item) => item.trim()).filter(Boolean))],
      links,
      images,
      metrics: String(form.metrics ?? '').trim() || null,
      sort_order: sortOrder,
      is_published: Boolean(form.is_published),
    },
  }
}
