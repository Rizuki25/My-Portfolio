import { hasSupabaseConfig, supabasePublishableKey, supabaseUrl } from './supabaseConfig'

export async function getSiteContent({ signal } = {}) {
  if (!hasSupabaseConfig) return []

  const url = new URL(`${supabaseUrl}/rest/v1/site_content`)
  url.searchParams.set('select', 'section_key,content')

  const response = await fetch(url, {
    headers: { apikey: supabasePublishableKey, Accept: 'application/json' },
    signal,
  })
  if (!response.ok) {
    throw new Error(`Supabase site_content request failed (${response.status})`)
  }

  const rows = await response.json()
  if (!Array.isArray(rows)) {
    throw new Error('Supabase site_content response is not an array')
  }
  return rows
}
