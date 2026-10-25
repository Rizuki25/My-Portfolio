import { useEffect } from 'react'

/**
 * Parallax ringan berbasis CSS variables. Hanya berjalan sekali per frame saat
 * scroll, tanpa React re-render dan tanpa mengubah posisi dokumen.
 */
export function useScrollScenes(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined

    const nodes = Array.from(document.querySelectorAll('[data-scroll-scene]'))
    let frame = 0

    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect()
        if (rect.bottom < -100 || rect.top > viewport + 100) return
        const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)))
        const depth = Number(node.dataset.sceneDepth) || 1
        node.style.setProperty('--scene-progress', progress.toFixed(3))
        node.style.setProperty('--scene-y', `${((0.5 - progress) * 40 * depth).toFixed(2)}px`)
      })
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
      nodes.forEach((node) => {
        node.style.removeProperty('--scene-progress')
        node.style.removeProperty('--scene-y')
      })
    }
  }, [enabled])
}
