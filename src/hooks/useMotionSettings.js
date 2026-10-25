import { useCallback, useEffect, useState } from 'react'

const REDUCED = '(prefers-reduced-motion: reduce)'
const STORAGE_KEY = 'portfolio-motion'

function readPaused() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'paused'
  } catch {
    return false
  }
}

/**
 * Satu sakelar untuk seluruh choreography halaman. Preferensi reduced-motion
 * sistem selalu menang; pilihan jeda pengguna disimpan untuk kunjungan berikutnya.
 */
export function useMotionSettings() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED).matches,
  )
  const [paused, setPaused] = useState(readPaused)
  const enabled = !reduced && !paused

  useEffect(() => {
    const query = window.matchMedia(REDUCED)
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'play' : 'paused'
    return () => {
      delete document.documentElement.dataset.motion
    }
  }, [enabled])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, paused ? 'paused' : 'play')
    } catch {
      /* Preferensi tetap berlaku selama sesi bila storage tidak tersedia. */
    }
  }, [paused])

  const toggle = useCallback(() => {
    if (!reduced) setPaused((value) => !value)
  }, [reduced])

  return { enabled, reduced, toggle }
}
