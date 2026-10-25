import { useEffect, useRef } from 'react'

/**
 * Ring tipis mengikuti pointer dengan easing. Kursor asli tetap terlihat agar
 * pengguna tidak kehilangan affordance sistem; ring membesar di elemen interaktif.
 */
export default function CursorFollower({ enabled }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!enabled || !node) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    let frame = 0
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0
    let initialized = false

    const render = () => {
      currentX += (targetX - currentX) * 0.2
      currentY += (targetY - currentY) * 0.2
      node.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        frame = window.requestAnimationFrame(render)
      } else {
        frame = 0
      }
    }

    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      targetX = event.clientX
      targetY = event.clientY
      if (!initialized) {
        currentX = targetX
        currentY = targetY
        initialized = true
      }
      node.dataset.visible = 'true'
      node.dataset.active = event.target.closest?.('a, button, [data-cursor]') ? 'true' : 'false'
      if (!frame) frame = window.requestAnimationFrame(render)
    }
    const onLeave = () => { node.dataset.visible = 'false' }
    const onDown = () => { node.dataset.pressed = 'true' }
    const onUp = () => { node.dataset.pressed = 'false' }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerup', onUp, { passive: true })

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} className="cursor-follower" data-visible="false" aria-hidden="true">
      <span className="cursor-follower__ring" />
    </div>
  )
}
