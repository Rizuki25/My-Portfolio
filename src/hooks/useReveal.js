import { useEffect } from 'react'

/**
 * Scroll reveal berbasis IntersectionObserver.
 *
 * Elemen apa pun dengan class `.reveal` akan diberi class `.is-in` begitu
 * masuk viewport, lalu berhenti diobservasi (animasi sekali jalan).
 *
 * Urutan muncul bisa diatur lewat atribut `data-delay="120"` (ms) pada elemen.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.reveal:not(.is-in)'))
    if (nodes.length === 0) return

    // Hormati pengguna yang mematikan animasi
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-in'))
      return
    }

    nodes.forEach((node) => {
      const delay = node.dataset.delay
      if (delay) node.style.transitionDelay = `${delay}ms`
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
