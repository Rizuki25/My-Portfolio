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
export function usePointerFX(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    let frame = 0
    let pending = null
    const touched = new Set()
    const reset = (el) => {
      el.classList.remove('is-tilting', 'is-magnetizing')
      if (el.hasAttribute('data-tilt')) el.style.removeProperty('transform')
      if (el.hasAttribute('data-magnetic')) el.style.removeProperty('translate')
      el.style.removeProperty('--pointer-x')
      el.style.removeProperty('--pointer-y')
    }

    const apply = () => {
      frame = 0
      if (!pending) return

      const { el, x, y } = pending
      if (!el.isConnected) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const px = Math.max(0, Math.min(1, (x - rect.left) / rect.width))
      const py = Math.max(0, Math.min(1, (y - rect.top) / rect.height))

      if (el.hasAttribute('data-spotlight')) {
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      }

      if (el.hasAttribute('data-pointer-scene')) {
        el.style.setProperty('--pointer-x', `${((px - 0.5) * 14).toFixed(2)}px`)
        el.style.setProperty('--pointer-y', `${((py - 0.5) * 10).toFixed(2)}px`)
      }

      if (el.hasAttribute('data-tilt')) {
        const strength = Math.min(10, Number(el.dataset.tilt) || 6)
        const rotateX = (0.5 - py) * strength * 2
        const rotateY = (px - 0.5) * strength * 2
        el.classList.add('is-tilting')
        el.style.transform =
          `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
      }

      if (el.hasAttribute('data-magnetic')) {
        const strength = Math.min(0.35, Number(el.dataset.magnetic) || 0.18)
        const dx = Math.max(-12, Math.min(12, (x - rect.left - rect.width / 2) * strength))
        const dy = Math.max(-8, Math.min(8, (y - rect.top - rect.height / 2) * strength))
        el.classList.add('is-magnetizing')
        el.style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`
      }
    }

    const onPointerMove = (event) => {
      const target = event.target.closest?.('[data-spotlight], [data-tilt], [data-pointer-scene], [data-magnetic]')
      if (!target) return
      touched.add(target)
      pending = { el: target, x: event.clientX, y: event.clientY }
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    const onPointerOut = (event) => {
      const target = event.target.closest?.('[data-tilt], [data-magnetic], [data-pointer-scene]')
      if (!target || target.contains(event.relatedTarget)) return
      reset(target)
      if (pending?.el === target) pending = null
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      if (frame) window.cancelAnimationFrame(frame)
      touched.forEach(reset)
    }
  }, [enabled])
}