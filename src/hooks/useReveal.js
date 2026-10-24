import { useEffect } from 'react'

const REDUCED = '(prefers-reduced-motion: reduce)'

/**
 * Scroll reveal berbasis IntersectionObserver.
 *
 * Elemen dengan class `.reveal` mendapat class `.is-in` begitu masuk viewport,
 * lalu berhenti diobservasi. Atribut pendukung:
 *
 * - `data-delay="120"`  → jeda animasi (ms), jadi CSS variable `--rv-delay`
 * - `data-reveal="left|right|down|scale|blur|none"` → varian arah (di CSS)
 *
 * MutationObserver dipasang supaya konten yang datang belakangan (mis. proyek
 * dari Supabase yang dimuat async) ikut ter-reveal tanpa memuat ulang halaman.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const reduced = window.matchMedia(REDUCED).matches
    const showAll = () =>
      document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-in'))

    // Tanpa observer / pengguna mematikan animasi: tampilkan semuanya langsung
    if (reduced || !('IntersectionObserver' in window)) {
      showAll()
      return undefined
    }

    const observed = new WeakSet()
    let queued = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    const bind = () => {
      document.querySelectorAll('.reveal:not(.is-in)').forEach((node) => {
        if (observed.has(node)) return
        observed.add(node)

        const delay = Number(node.dataset.delay ?? 0)
        if (delay > 0) node.style.setProperty('--rv-delay', `${delay}ms`)

        // Elemen yang sudah lewat di atas viewport (deep link / restore scroll)
        // langsung dianggap tampil supaya tidak "hilang" saat pengguna scroll naik.
        if (node.getBoundingClientRect().bottom < -40) {
          node.classList.add('is-in')
          return
        }

        observer.observe(node)
      })
    }

    bind()

    const mutation = new MutationObserver(() => {
      if (queued) return
      queued = true
      window.requestAnimationFrame(() => {
        queued = false
        bind()
      })
    })
    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutation.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}