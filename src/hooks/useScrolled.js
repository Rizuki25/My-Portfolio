import { useEffect, useState } from 'react'

/**
 * `true` setelah halaman digulir melewati ambang tertentu.
 * Dipakai header untuk mengubah tampilan saat menempel di atas konten.
 */
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}