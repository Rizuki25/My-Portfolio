import { supabase } from './supabaseClient'

export const PROJECT_IMAGE_BUCKET = 'portfolio-project-images'
export const MAX_PROJECT_IMAGE_BYTES = 6 * 1024 * 1024

const extensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

export async function uploadProjectImage(projectId, file) {
  const extension = extensions[file.type]
  if (!extension) throw new Error('Gunakan foto JPG, PNG, WebP, atau AVIF.')
  if (file.size > MAX_PROJECT_IMAGE_BYTES) {
    throw new Error('Ukuran setiap foto maksimal 6 MB.')
  }
  if (!projectId || !supabase) throw new Error('Simpan proyek sebagai draft sebelum mengunggah foto.')

  const path = `${projectId}/${crypto.randomUUID()}.${extension}`
  const bucket = supabase.storage.from(PROJECT_IMAGE_BUCKET)
  const { error } = await bucket.upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })
  if (error) throw new Error(`Gagal mengunggah ${file.name}: ${error.message}`)

  const { data } = bucket.getPublicUrl(path)
  return {
    url: data.publicUrl,
    alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Foto proyek',
  }
}
