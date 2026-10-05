import { useEffect, useState } from 'react'
import { uploadProjectImage } from '../lib/projectImages'
import { blankProject, MAX_PROJECT_IMAGES, projectToForm, validateProject } from './projectForm'

const inputClass = 'mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:bg-card'
const smallButtonClass = 'border-2 border-ink bg-card px-3 py-2 font-mono text-[0.625rem] font-bold tracking-wider uppercase transition-colors hover:bg-acid'

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-mono block text-ink-soft">{label}</label>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{hint}</p> : null}
    </div>
  )
}

export default function ProjectEditor({ project, busy, actionError, successMessage, galleryReady, onSave, onDelete }) {
  const [form, setForm] = useState(() => project ? projectToForm(project) : blankProject())
  const [validationError, setValidationError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploadNotice, setUploadNotice] = useState('')
  const [uploadBusy, setUploadBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setForm(project ? projectToForm(project) : blankProject())
    setValidationError('')
    setUploadError('')
    setUploadNotice('')
    setConfirmDelete(false)
  }, [project])

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setValidationError('')
  }

  const setName = (value) => {
    setForm((current) => ({
      ...current,
      name: value,
      id: !project && (!current.id || current.id === slugify(current.name))
        ? slugify(value)
        : current.id,
    }))
    setValidationError('')
  }

  const updateRow = (field, index, name, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((row, rowIndex) =>
        rowIndex === index ? { ...row, [name]: value } : row,
      ),
    }))
    setValidationError('')
  }

  const removeRow = (field, index) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, rowIndex) => rowIndex !== index),
    }))
    setValidationError('')
  }

  const moveRow = (field, index, direction) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= form[field].length) return
    setForm((current) => {
      const rows = [...current[field]]
      ;[rows[index], rows[nextIndex]] = [rows[nextIndex], rows[index]]
      return { ...current, [field]: rows }
    })
    setValidationError('')
  }

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return
    if (form.images.length + files.length > MAX_PROJECT_IMAGES) {
      setUploadError(`Galeri maksimal ${MAX_PROJECT_IMAGES} foto.`)
      return
    }
    setUploadBusy(true)
    setUploadError('')
    setUploadNotice('')
    const uploaded = []
    for (const file of files) {
      try {
        uploaded.push(await uploadProjectImage(project?.id, file))
      } catch (error) {
        setUploadError(error.message)
        break
      }
    }
    if (uploaded.length > 0) {
      setForm((current) => ({ ...current, images: [...current.images, ...uploaded] }))
      setUploadNotice(`${uploaded.length} foto berhasil diunggah. Klik tombol simpan di bawah agar foto tercatat pada proyek.`)
    }
    setUploadBusy(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy || uploadBusy) return
    try {
      const { payload, error } = validateProject(form)
      if (error) {
        setValidationError(error)
        return
      }
      setValidationError('')
      await onSave(payload)
    } catch (error) {
      setValidationError(`Gagal memproses proyek: ${error instanceof Error ? error.message : 'coba muat ulang halaman.'}`)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="border-[3px] border-ink bg-card shadow-[6px_6px_0_0_var(--color-ink)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b-[3px] border-ink bg-acid px-5 py-5 sm:px-7">
        <div>
          <p className="label-mono">Editor / Projects</p>
          <h2 className="mt-2 font-display text-2xl uppercase sm:text-3xl">
            {project ? 'Edit proyek' : 'Proyek baru'}
          </h2>
        </div>
        <span className={`border-2 border-ink px-3 py-1.5 font-mono text-[0.625rem] font-bold tracking-wider uppercase ${form.is_published ? 'bg-paper-2' : 'bg-card'}`}>
          {form.is_published ? 'Terbit' : 'Draft'}
        </span>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-7">
        <section className="space-y-5" aria-labelledby="project-basics">
          <h3 id="project-basics" className="border-b-2 border-ink pb-2 text-lg">01 / Identitas</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama proyek *" htmlFor="project-name">
              <input id="project-name" className={inputClass} required maxLength={120} value={form.name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Website Katalog" />
            </Field>
            <Field label="ID / slug *" htmlFor="project-id" hint={project ? 'ID tidak dapat diubah setelah proyek dibuat.' : 'Dibuat dari nama, dan bisa diubah sebelum disimpan.'}>
              <input id="project-id" className={inputClass} required pattern="[a-z0-9]+(-[a-z0-9]+)*" readOnly={Boolean(project)} value={form.id} onChange={(event) => setField('id', event.target.value)} placeholder="website-katalog" />
            </Field>
            <Field label="Kategori *" htmlFor="project-kind">
              <input id="project-kind" className={inputClass} required maxLength={100} value={form.kind} onChange={(event) => setField('kind', event.target.value)} placeholder="Web Development" />
            </Field>
            <Field label="Tahun *" htmlFor="project-year">
              <input id="project-year" type="number" min="1900" max="2100" className={inputClass} required value={form.year} onChange={(event) => setField('year', event.target.value)} />
            </Field>
          </div>
          <Field label="Deskripsi singkat *" htmlFor="project-description" hint="Teks ini tampil di kartu proyek pada halaman portofolio.">
            <textarea id="project-description" rows="4" className={inputClass} required value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Ceritakan hasil utama proyek ini..." />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Urutan tampil" htmlFor="project-order" hint="Angka lebih kecil tampil lebih awal.">
              <input id="project-order" type="number" min="0" className={inputClass} required value={form.sort_order} onChange={(event) => setField('sort_order', event.target.value)} />
            </Field>
            <Field label="Tech stack" htmlFor="project-stack" hint="Pisahkan setiap teknologi dengan koma.">
              <input id="project-stack" className={inputClass} value={form.stack} onChange={(event) => setField('stack', event.target.value)} placeholder="React, Tailwind CSS, Supabase" />
            </Field>
          </div>
          <label className="flex cursor-pointer items-start gap-3 border-2 border-ink bg-paper-2 p-3">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-flag" checked={form.featured} onChange={(event) => setField('featured', event.target.checked)} />
            <span><strong className="block font-mono text-xs uppercase">Proyek unggulan</strong><span className="mt-1 block text-xs text-ink-soft">Tampil sebagai kartu besar di bagian awal Projects.</span></span>
          </label>
        </section>

        <section className="space-y-5" aria-labelledby="project-story">
          <h3 id="project-story" className="border-b-2 border-ink pb-2 text-lg">02 / Cerita & dampak</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Masalah" htmlFor="project-problem" hint="Tampil pada kartu proyek setelah diterbitkan.">
              <textarea id="project-problem" rows="4" className={inputClass} value={form.problem} onChange={(event) => setField('problem', event.target.value)} placeholder="Masalah yang ingin diselesaikan..." />
            </Field>
            <Field label="Solusi" htmlFor="project-solution" hint="Tampil pada kartu proyek setelah diterbitkan.">
              <textarea id="project-solution" rows="4" className={inputClass} value={form.solution} onChange={(event) => setField('solution', event.target.value)} placeholder="Pendekatan yang Anda bangun..." />
            </Field>
          </div>
          <Field label="Sorotan hasil" htmlFor="project-metrics" hint="Tampil pada kartu proyek biasa, misalnya: 1.000 pengguna aktif.">
            <input id="project-metrics" className={inputClass} value={form.metrics} onChange={(event) => setField('metrics', event.target.value)} placeholder="Contoh: waktu muat turun 40%" />
          </Field>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="label-mono text-ink-soft">Angka dampak</span>
              <button type="button" className={smallButtonClass} onClick={() => setField('impact', [...form.impact, { k: '', v: '' }])}>+ Tambah dampak</button>
            </div>
            {form.impact.length === 0 ? <p className="mt-3 text-xs text-ink-soft">Belum ada angka dampak.</p> : null}
            <div className="mt-3 space-y-3">
              {form.impact.map((row, index) => (
                <div key={index} className="grid gap-2 border-2 border-ink/30 bg-paper p-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input aria-label={`Label dampak ${index + 1}`} className="min-w-0 border-2 border-ink bg-card px-3 py-2 text-sm" placeholder="Label, mis. Pengguna" value={row.k} onChange={(event) => updateRow('impact', index, 'k', event.target.value)} />
                  <input aria-label={`Nilai dampak ${index + 1}`} className="min-w-0 border-2 border-ink bg-card px-3 py-2 text-sm" placeholder="Nilai, mis. 1.000+" value={row.v} onChange={(event) => updateRow('impact', index, 'v', event.target.value)} />
                  <button type="button" className={smallButtonClass} onClick={() => removeRow('impact', index)} aria-label={`Hapus dampak ${index + 1}`}>Hapus</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5" aria-labelledby="project-gallery">
          <h3 id="project-gallery" className="border-b-2 border-ink pb-2 text-lg">03 / Galeri foto</h3>
          <p className="text-sm leading-relaxed text-ink-soft">Urutan foto di sini menjadi urutan slider pada portofolio. Maksimal {MAX_PROJECT_IMAGES} foto, masing-masing 6 MB.</p>

          {galleryReady === false ? <p className="border-l-4 border-flag bg-paper px-4 py-3 text-sm">Jalankan <code>supabase/setup-project-gallery.sql</code> di Supabase SQL Editor, lalu muat ulang dashboard untuk mengaktifkan foto.</p> : null}
          {galleryReady === null ? <p className="text-sm text-ink-soft">Memeriksa pengaturan galeri...</p> : null}

          <div className="flex flex-wrap items-end justify-between gap-4">
            <Field label="Unggah foto dari perangkat" htmlFor="project-images-upload" hint={project ? 'Foto masuk ke Storage. Klik Simpan draft atau Simpan & terbitkan agar foto tercatat pada proyek.' : 'Simpan proyek sebagai draft terlebih dahulu untuk mengaktifkan unggah.'}>
              <input id="project-images-upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={!project || galleryReady !== true || busy || uploadBusy || form.images.length >= MAX_PROJECT_IMAGES} onChange={handleUpload} className={`${inputClass} max-w-full file:mr-3 file:border-0 file:bg-acid file:px-2 file:py-1 file:font-mono file:text-xs file:font-bold disabled:opacity-50`} />
            </Field>
            <button type="button" disabled={galleryReady !== true || busy || uploadBusy || form.images.length >= MAX_PROJECT_IMAGES} className={`${smallButtonClass} disabled:opacity-50`} onClick={() => setField('images', [...form.images, { url: '', alt: '' }])}>+ Tambah URL foto</button>
          </div>
          {uploadBusy ? <p role="status" className="text-sm text-ink-soft">Mengunggah foto...</p> : null}
          {uploadNotice ? <p role="status" className="border-l-4 border-paper-2 bg-paper px-4 py-3 text-sm">{uploadNotice}</p> : null}
          {uploadError ? <p role="alert" className="border-2 border-flag bg-paper px-4 py-3 text-sm">{uploadError}</p> : null}
          {form.images.length === 0 ? <p className="text-xs text-ink-soft">Belum ada foto proyek. Slider akan muncul setelah foto disimpan pada proyek.</p> : null}

          <div className="space-y-3">
            {form.images.map((image, index) => (
              <div key={index} className="grid min-w-0 gap-3 border-2 border-ink/30 bg-paper p-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
                <div className="flex aspect-video items-center justify-center overflow-hidden border-2 border-ink bg-ink/10">
                  {/^https?:\/\//i.test(image.url) ? <img src={image.url} alt="Pratinjau foto proyek" loading="lazy" className="h-full w-full object-contain" /> : <span className="font-mono text-[0.625rem] text-ink-soft">Pratinjau foto</span>}
                </div>
                <div className="min-w-0 space-y-3">
                  <Field label={`URL foto ${index + 1}`} htmlFor={`project-image-url-${index}`}>
                    <input id={`project-image-url-${index}`} type="url" className={inputClass} value={image.url} onChange={(event) => updateRow('images', index, 'url', event.target.value)} placeholder="https://..." />
                  </Field>
                  <Field label={`Deskripsi gambar ${index + 1}`} htmlFor={`project-image-alt-${index}`} hint="Jelaskan isi foto untuk pengunjung yang memakai pembaca layar.">
                    <input id={`project-image-alt-${index}`} className={inputClass} value={image.alt} onChange={(event) => updateRow('images', index, 'alt', event.target.value)} placeholder="Tampilan halaman utama proyek" />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={index === 0} className={`${smallButtonClass} disabled:opacity-40`} onClick={() => moveRow('images', index, -1)} aria-label={`Pindah foto ${index + 1} ke atas`}>↑</button>
                    <button type="button" disabled={index === form.images.length - 1} className={`${smallButtonClass} disabled:opacity-40`} onClick={() => moveRow('images', index, 1)} aria-label={`Pindah foto ${index + 1} ke bawah`}>↓</button>
                    <button type="button" className={smallButtonClass} onClick={() => removeRow('images', index)} aria-label={`Hapus foto ${index + 1} dari galeri`}>Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5" aria-labelledby="project-links">
          <h3 id="project-links" className="border-b-2 border-ink pb-2 text-lg">04 / Tautan</h3>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs leading-relaxed text-ink-soft">Tambahkan demo, studi kasus, atau kode sumber.</p>
            <button type="button" className={smallButtonClass} onClick={() => setField('links', [...form.links, { label: '', href: '' }])}>+ Tambah tautan</button>
          </div>
          {form.links.length === 0 ? <p className="text-xs text-ink-soft">Belum ada tautan.</p> : null}
          <div className="space-y-3">
            {form.links.map((row, index) => (
              <div key={index} className="grid gap-2 border-2 border-ink/30 bg-paper p-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)_auto]">
                <input aria-label={`Label tautan ${index + 1}`} className="min-w-0 border-2 border-ink bg-card px-3 py-2 text-sm" placeholder="Live Demo" value={row.label} onChange={(event) => updateRow('links', index, 'label', event.target.value)} />
                <input aria-label={`URL tautan ${index + 1}`} type="url" className="min-w-0 border-2 border-ink bg-card px-3 py-2 text-sm" placeholder="https://..." value={row.href} onChange={(event) => updateRow('links', index, 'href', event.target.value)} />
                <button type="button" className={smallButtonClass} onClick={() => removeRow('links', index)} aria-label={`Hapus tautan ${index + 1}`}>Hapus</button>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="project-publish">
          <h3 id="project-publish" className="border-b-2 border-ink pb-2 text-lg">05 / Publikasi</h3>
          <label className="mt-4 flex cursor-pointer items-start gap-3 border-[3px] border-ink bg-paper-2 p-4">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-flag" checked={form.is_published} onChange={(event) => setField('is_published', event.target.checked)} />
            <span><strong className="block font-mono text-xs uppercase">Tampilkan di portofolio</strong><span className="mt-1 block text-xs leading-relaxed text-ink-soft">Draft tetap tersimpan di database dan terlihat di dashboard admin. Aktifkan ini lalu simpan untuk menampilkannya pada halaman utama.</span></span>
          </label>
        </section>

        {validationError || actionError ? (
          <p role="alert" className="border-2 border-flag bg-paper px-4 py-3 text-sm font-medium text-ink">{validationError || actionError}</p>
        ) : null}
        {successMessage ? <p role="status" className="border-2 border-ink bg-paper-2 px-4 py-3 text-sm font-medium">{successMessage}</p> : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t-[3px] border-ink pt-6">
          <div>
            {project ? (
              confirmDelete ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" disabled={busy} onClick={onDelete} className="border-2 border-ink bg-flag px-3 py-2 font-mono text-xs font-bold uppercase disabled:opacity-50">Ya, hapus</button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className={smallButtonClass}>Batal</button>
                </div>
              ) : <button type="button" disabled={busy} onClick={() => setConfirmDelete(true)} className="font-mono text-xs font-bold text-flag-text underline underline-offset-4 disabled:opacity-50">Hapus proyek</button>
            ) : null}
          </div>
          <button type="submit" disabled={busy || uploadBusy} className="border-[3px] border-ink bg-acid px-5 py-3 font-mono text-xs font-bold tracking-wider uppercase shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Menyimpan...' : form.is_published ? 'Simpan & terbitkan ↗' : 'Simpan draft →'}
          </button>
        </div>
      </div>
    </form>
  )
}
