import { useEffect } from 'react'

/**
 * Efek pointer global dengan event delegation — satu listener untuk seluruh
 * halaman, di-throttle lewat requestAnimationFrame.
 *
 * - `data-spotlight` → mengisi `--mx` / `--my` (posisi sorot di kartu)
 * - `data-tilt="6"`  → memiringkan kartu mengikuti kursor (derajat)
 *
 * Otomatis nonaktif di layar sentuh dan saat prefers-reduced-motion.
 */
export function usePointerFX() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    let frame = 0
    let pending = null

    const apply = () => {
      frame = 0
      if (!pending) return

      const { el, x, y } = pending
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const px = (x - rect.left) / rect.width
      const py = (y - rect.top) / rect.height

      if (el.hasAttribute('data-spotlight')) {
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      }

      if (el.hasAttribute('data-tilt')) {
        const strength = Math.min(14, Number(el.dataset.tilt) || 6)
        const rotateX = (0.5 - py) * strength * 2
        const rotateY = (px - 0.5) * strength * 2
        el.classList.add('is-tilting')
        el.style.transform =
          `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
      }
    }

    const onPointerMove = (event) => {
      const target = event.target.closest?.('[data-spotlight], [data-tilt]')
      if (!target) return
      pending = { el: target, x: event.clientX, y: event.clientY }
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    // Kembalikan kartu ke posisi datar saat kursor keluar
    const onPointerOut = (event) => {
      const target = event.target.closest?.('[data-tilt]')
      if (!target) return
      if (target.contains(event.relatedTarget)) return
      target.classList.remove('is-tilting')
      target.style.transform = ''
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
}