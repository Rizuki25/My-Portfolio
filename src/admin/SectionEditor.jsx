import { useEffect, useState } from 'react'
import { blankLike } from '../data/contentGroups'

const labels = {
  profile: 'Profil', name: 'Nama lengkap', firstName: 'Nama depan', lastName: 'Nama belakang',
  monogram: 'Monogram', role: 'Profesi utama', roleAlt: 'Peran tambahan', tagline: 'Kalimat perkenalan',
  location: 'Lokasi', timezone: 'Zona waktu', email: 'Email', phone: 'Telepon / WhatsApp',
  availability: 'Ketersediaan', statusNote: 'Catatan respons', yearsExp: 'Tahun pengalaman',
  resumeUrl: 'URL CV', avatarUrl: 'URL foto profil', socials: 'Media sosial', handle: 'Akun / handle',
  href: 'URL tautan', note: 'Catatan', stats: 'Statistik', value: 'Angka', label: 'Label',
  sub: 'Keterangan', siteMeta: 'Metadata situs', title: 'Judul', footerNote: 'Catatan footer',
  edition: 'Edisi', colophon: 'Kolofon', statsAsOf: 'Keterangan tanggal statistik',
  sectionDescriptions: 'Deskripsi setiap section', projectArchive: 'Kartu arsip Projects',
  buttonLabel: 'Teks tombol', projectProcess: 'Langkah proses kerja',
  about: 'Tentang saya', projects: 'Projects', heading: 'Judul',
  paragraphs: 'Paragraf', facts: 'Fakta', k: 'Label', v: 'Nilai', principles: 'Prinsip',
  n: 'Nomor', t: 'Judul', d: 'Deskripsi', currently: 'Kegiatan saat ini',
  experience: 'Riwayat kerja', experienceMeta: 'Ringkasan pengalaman', range: 'Rentang',
  industries: 'Industri', workModes: 'Mode kerja', period: 'Periode', company: 'Perusahaan', type: 'Jenis kerja',
  current: 'Posisi saat ini', summary: 'Ringkasan', highlights: 'Pencapaian', stack: 'Teknologi',
  skillGroups: 'Kelompok keahlian', icon: 'Ikon', skills: 'Daftar keahlian', level: 'Level (1–5)',
  toolbox: 'Alat yang digunakan', education: 'Pendidikan', educationMeta: 'Keterangan pendidikan',
  verificationNote: 'Catatan verifikasi', degree: 'Gelar / program',
  school: 'Institusi', grade: 'Nilai / predikat', courses: 'Topik / mata kuliah',
  certifications: 'Sertifikasi', issuer: 'Penerbit', year: 'Tahun', awards: 'Penghargaan',
  org: 'Penyelenggara', contact: 'Kontak', body: 'Isi', emailCta: 'Teks tombol email',
  services: 'Layanan', faq: 'Pertanyaan umum', q: 'Pertanyaan', a: 'Jawaban',
}

const longTextKeys = new Set([
  'tagline', 'description', 'summary', 'body', 'footerNote', 'colophon',
  'note', 'd', 'a', 'paragraphs', 'highlights', 'currently',
])

function fieldLabel(key) {
  return labels[key] ?? key.replace(/([A-Z])/g, ' $1')
}

function updateAtPath(source, path, value) {
  if (path.length === 0) return value
  const [head, ...rest] = path
  const copy = Array.isArray(source) ? [...source] : { ...source }
  copy[head] = updateAtPath(source[head], rest, value)
  return copy
}

function itemTitle(item, index) {
  if (typeof item === 'string') return item || `Item ${index + 1}`
  const summary = item.name || item.title || item.role || item.degree || item.label
    || item.company || item.school || item.t || item.k || item.q || item.value
  return summary || `Item ${index + 1}`
}

function isSafeLink(value) {
  if (!value || value === '#') return true
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
  } catch {
    return false
  }
}

function invalidLinkPath(value, path = []) {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const invalid = invalidLinkPath(value[index], [...path, index])
      if (invalid) return invalid
    }
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const next = [...path, key]
      if (['href', 'resumeUrl', 'avatarUrl'].includes(key) && !isSafeLink(child)) {
        return next.map((part) => typeof part === 'number' ? part + 1 : fieldLabel(part)).join(' / ')
      }
      const invalid = invalidLinkPath(child, next)
      if (invalid) return invalid
    }
  }
  return null
}

function ValueField({ value, template, path, label, onChange }) {
  const id = `content-${path.join('-')}`

  if (Array.isArray(template)) {
    const items = Array.isArray(value) ? value : []
    const sample = template[0] ?? ''
    const isObjectItem = sample !== null && typeof sample === 'object' && !Array.isArray(sample)
    const move = (index, direction) => {
      const target = index + direction
      if (target < 0 || target >= items.length) return
      const next = [...items]
      ;[next[index], next[target]] = [next[target], next[index]]
      onChange(path, next)
    }

    return (
      <section className="min-w-0 border-2 border-ink/40 bg-paper p-3 sm:p-4" aria-label={label}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-display text-base uppercase">{label}</h4>
            <p className="mt-1 font-mono text-[0.625rem] text-ink-soft">{items.length} item · urutan sesuai tampilan situs</p>
          </div>
          <button type="button" onClick={() => onChange(path, [...items, blankLike(sample)])} className="border-2 border-ink bg-acid px-3 py-2 font-mono text-[0.625rem] font-bold uppercase hover:bg-card">+ Tambah item</button>
        </div>

        {items.length === 0 ? <p className="mt-4 text-xs text-ink-soft">Belum ada item. Gunakan tombol tambah untuk mengisinya.</p> : null}
        <div className="mt-4 space-y-3">
          {items.map((item, index) => (
            <div key={index} className="min-w-0 border-2 border-ink bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink/20 bg-paper-2 px-3 py-2">
                <span className="min-w-0 truncate font-mono text-[0.6875rem] font-bold uppercase">{String(index + 1).padStart(2, '0')} / {itemTitle(item, index)}</span>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Pindah ${label} ${index + 1} ke atas`} className="border border-ink px-2 py-1 font-mono text-xs disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label={`Pindah ${label} ${index + 1} ke bawah`} className="border border-ink px-2 py-1 font-mono text-xs disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => onChange(path, items.filter((_, row) => row !== index))} aria-label={`Hapus ${label} ${index + 1}`} className="border border-ink bg-flag px-2 py-1 font-mono text-[0.625rem] font-bold text-on-flag uppercase">Hapus</button>
                </div>
              </div>
              {isObjectItem ? (
                <details open={index === 0} className="group">
                  <summary className="cursor-pointer px-3 py-2 font-mono text-[0.625rem] font-bold uppercase marker:text-flag-text">Edit rincian</summary>
                  <div className="grid gap-4 border-t-2 border-ink/20 p-3 sm:grid-cols-2">
                    {Object.entries(sample).map(([key, childTemplate]) => (
                      <div key={key} className={`min-w-0 ${Array.isArray(childTemplate) || (childTemplate && typeof childTemplate === 'object') || longTextKeys.has(key) ? 'sm:col-span-2' : ''}`}>
                        <ValueField value={item[key]} template={childTemplate} path={[...path, index, key]} label={fieldLabel(key)} onChange={onChange} />
                      </div>
                    ))}
                  </div>
                </details>
              ) : (
                <div className="p-3">
                  <ValueField value={item} template={sample} path={[...path, index]} label={`${label} ${index + 1}`} onChange={onChange} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (template && typeof template === 'object') {
    return (
      <section className="space-y-4 border-t-[3px] border-ink pt-5">
        <h3 className="font-display text-lg uppercase">{label}</h3>
        {path.join('.') === 'siteMeta.projectArchive' ? <p className="text-sm leading-relaxed text-ink-soft">Kartu ini mengarahkan pengunjung ke kumpulan karya lain, misalnya profil GitHub Anda. Isi judul, deskripsi, teks tombol, dan URL tujuan. Kartu ini tidak mengambil proyek secara otomatis dari database.</p> : null}
        <div className="grid gap-5 sm:grid-cols-2">
          {Object.entries(template).map(([key, childTemplate]) => (
            <div key={key} className={`min-w-0 ${Array.isArray(childTemplate) || (childTemplate && typeof childTemplate === 'object') || longTextKeys.has(key) ? 'sm:col-span-2' : ''}`}>
              <ValueField value={value?.[key]} template={childTemplate} path={[...path, key]} label={fieldLabel(key)} onChange={onChange} />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (typeof template === 'boolean') {
    return (
      <label className="flex cursor-pointer items-center gap-3 border-2 border-ink bg-paper-2 px-3 py-3 font-mono text-xs font-bold uppercase">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(path, event.target.checked)} className="h-4 w-4 accent-flag" />
        {label}
      </label>
    )
  }

  const key = path[path.length - 1]
  const parentKey = path[path.length - 2]
  const multiline = longTextKeys.has(key) || longTextKeys.has(parentKey) || String(value ?? '').length > 110
  const inputType = typeof template === 'number' ? 'number' : key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'
  const inputClass = 'mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:bg-card'
  const change = (event) => onChange(path, inputType === 'number' ? Number(event.target.value) : event.target.value)

  return (
    <div>
      <label htmlFor={id} className="label-mono block text-ink-soft">{label}</label>
      {multiline ? (
        <textarea id={id} rows="3" value={value ?? ''} onChange={change} className={inputClass} />
      ) : (
        <input id={id} type={inputType} min={inputType === 'number' ? (key === 'level' ? 1 : 0) : undefined} max={key === 'level' ? 5 : undefined} value={value ?? ''} onChange={change} className={inputClass} />
      )}
      {['href', 'resumeUrl', 'avatarUrl'].includes(key) ? <p className="mt-1 text-[0.6875rem] text-ink-soft">Gunakan URL lengkap. Tanda # berarti belum ada tautan.</p> : null}
    </div>
  )
}

export default function SectionEditor({ group, data, saved, dirty, busy, actionError, onChange, onReset, onSave }) {
  const draft = data
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    setValidationError('')
  }, [group.key])

  const change = (path, value) => {
    onChange(updateAtPath(draft, path, value))
    setValidationError('')
  }

  const submit = (event) => {
    event.preventDefault()
    if (group.key === 'identity' && (!draft.profile.name.trim() || !draft.profile.firstName.trim() || !draft.profile.lastName.trim() || !draft.profile.email.trim())) {
      setValidationError('Nama lengkap, nama depan, nama belakang, dan email wajib diisi.')
      return
    }
    const unsafe = invalidLinkPath(draft)
    if (unsafe) {
      setValidationError(`Periksa tautan pada ${unsafe}. Gunakan URL web, email, telepon, atau #.`)
      return
    }
    setValidationError('')
    onSave(draft)
  }

  return (
    <form onSubmit={submit} className="border-[3px] border-ink bg-card shadow-[6px_6px_0_0_var(--color-ink)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b-[3px] border-ink bg-acid px-5 py-5 sm:px-7">
        <div>
          <p className="label-mono">Editor / {group.label}</p>
          <h2 className="mt-2 font-display text-2xl uppercase sm:text-3xl">Isi {group.label}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed">{group.description}</p>
        </div>
        <span className={`border-2 border-ink px-3 py-1.5 font-mono text-[0.625rem] font-bold uppercase ${saved ? 'bg-paper-2' : 'bg-card'}`}>
          {dirty ? 'Belum disimpan' : saved ? 'Dari database' : 'Contoh lokal'}
        </span>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-7">
        {!saved ? <p className="border-l-4 border-flag bg-paper px-4 py-3 text-sm leading-relaxed">Data ini masih contoh dari website. Ubah isinya dan klik simpan untuk memasukkannya ke Supabase.</p> : null}
        {Object.entries(group.defaults).map(([key, template]) => (
          <ValueField key={key} value={draft[key]} template={template} path={[key]} label={fieldLabel(key)} onChange={change} />
        ))}
        {validationError || actionError ? <p role="alert" className="border-2 border-flag bg-paper p-3 text-sm">{validationError || actionError}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-ink pt-6">
          <p className="text-xs leading-relaxed text-ink-soft">Perubahan akan tampil di situs setelah disimpan dan halaman dimuat ulang.</p>
          <div className="flex flex-wrap gap-3">
            {dirty ? <button type="button" onClick={onReset} disabled={busy} className="border-2 border-ink bg-paper px-4 py-3 font-mono text-xs font-bold uppercase hover:bg-paper-2">Batalkan perubahan</button> : null}
            <button type="submit" disabled={busy} className="border-[3px] border-ink bg-acid px-5 py-3 font-mono text-xs font-bold tracking-wider uppercase shadow-[4px_4px_0_0_var(--color-ink)] hover:bg-paper-2 disabled:cursor-wait disabled:opacity-60">
              {busy ? 'Menyimpan...' : 'Simpan bagian →'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
