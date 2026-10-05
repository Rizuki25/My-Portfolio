import { hasSupabaseConfig, supabasePublishableKey, supabaseUrl } from './supabaseConfig'

export const hasProjectsApi = hasSupabaseConfig

const publicColumns = 'id,name,kind,year,featured,description,problem,solution,impact,stack,links,metrics,sort_order,is_published'

/** Baca proyek terbit lewat Data REST API Supabase dengan peran publik. */
export async function getPublishedProjects({ signal } = {}) {
  if (!hasProjectsApi) return []

  const url = new URL(`${supabaseUrl}/rest/v1/projects`)
  url.searchParams.set('select', `${publicColumns},images`)
  url.searchParams.set('is_published', 'eq.true')
  url.searchParams.set('order', 'sort_order.asc,created_at.asc')

  const request = {
    headers: { apikey: supabasePublishableKey, Accept: 'application/json' },
    signal,
  }
  let response = await fetch(url, request)
  if (response.status === 400 && (await response.clone().json().catch(() => null))?.code === '42703') {
    // Galeri belum dimigrasi; proyek yang sudah terbit tetap dapat dibaca.
    url.searchParams.set('select', publicColumns)
    response = await fetch(url, request)
  }

  if (!response.ok) {
    throw new Error(`Supabase projects request failed (${response.status})`)
  }

  const rows = await response.json()
  if (!Array.isArray(rows)) {
    throw new Error('Supabase projects response is not an array')
  }

  return rows
}
