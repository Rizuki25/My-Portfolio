import { createContext, useContext, useEffect, useState } from 'react'
import { contentFromRows, defaultContent } from '../data/contentGroups'
import { getSiteContent } from '../lib/siteContentApi'
import { hasSupabaseConfig } from '../lib/supabaseConfig'

const ContentContext = createContext(defaultContent)

export function useContent() {
  return useContext(ContentContext)
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)
  const [status, setStatus] = useState(hasSupabaseConfig ? 'loading' : 'local')

  useEffect(() => {
    if (!hasSupabaseConfig) return undefined

    const controller = new AbortController()
    getSiteContent({ signal: controller.signal })
      .then((rows) => {
        setContent(contentFromRows(rows))
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Gagal memuat konten portofolio dari Supabase:', error)
          setStatus('fallback')
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    document.title = content.siteMeta.title || content.profile.name
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', content.profile.tagline)
    const openGraphTitle = document.querySelector('meta[property="og:title"]')
    if (openGraphTitle) openGraphTitle.setAttribute('content', content.siteMeta.title || content.profile.name)
    const openGraphDescription = document.querySelector('meta[property="og:description"]')
    if (openGraphDescription) openGraphDescription.setAttribute('content', content.profile.tagline)
  }, [content])

  useEffect(() => {
    if (status === 'loading' || !window.location.hash.startsWith('#')) return undefined
    const sectionId = window.location.hash.slice(1)
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [status])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4 font-mono text-xs font-bold tracking-wider text-ink uppercase">
        Memuat portofolio...
      </div>
    )
  }

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}
