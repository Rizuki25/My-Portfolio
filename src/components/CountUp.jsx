import { useEffect, useRef } from 'react'

const REDUCED = '(prefers-reduced-motion: reduce)'

/**
 * Pisahkan nilai statistik seperti "5+", "99", "1,2k", "38" menjadi
 * prefix / angka / suffix supaya bisa dianimasikan tanpa kehilangan format.
 */
function parseStat(value) {
  const text = String(value ?? '').trim()
  const match = text.match(/^(\D*?)(\d+(?:[.,]\d+)?)(\D*)$/)
  if (!match) return null

  const [, prefix, number, suffix] = match
  const separator = number.includes(',') ? ',' : '.'
  const decimals = number.split(/[.,]/)[1]?.length ?? 0
  const target = Number(number.replace(',', '.'))

  if (!Number.isFinite(target)) return null
  return { prefix, suffix, separator, decimals, target }
}

/**
 * CountUp — angka berjalan dari 0 ke nilai target saat masuk viewport.
 * `prefers-reduced-motion` → langsung menampilkan nilai akhir.
 */
export default function CountUp({ value, duration = 1300, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const parsed = parseStat(value)
    const finalText = String(value ?? '')

    if (!parsed || window.matchMedia(REDUCED).matches || !('IntersectionObserver' in window)) {
      node.textContent = finalText
      return undefined
    }

    const format = (number) =>
      `${parsed.prefix}${number
        .toFixed(parsed.decimals)
        .replace('.', parsed.separator)}${parsed.suffix}`

    let frame = 0
    let startedAt = 0
    let started = false

    const tick = (now) => {
      if (!startedAt) startedAt = now
      const elapsed = Math.min(1, (now - startedAt) / duration)
      // easeOutCubic — cepat di awal, melambat di akhir
      const eased = 1 - Math.pow(1 - elapsed, 3)
      node.textContent = format(parsed.target * eased)
      if (elapsed < 1) frame = window.requestAnimationFrame(tick)
      else node.textContent = format(parsed.target)
    }

    const start = () => {
      if (started) return
      started = true
      frame = window.requestAnimationFrame(tick)
    }

    node.textContent = format(0)

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        start()
      },
      { threshold: 0.35 },
    )

    observer.observe(node)

    // Jaring pengaman: kalau observer tidak pernah menyala (mis. elemen
    // tersembunyi saat mount), tampilkan angka akhir agar tidak tertahan di 0.
    const fallback = window.setTimeout(() => {
      if (started) return
      observer.disconnect()
      node.textContent = format(parsed.target)
    }, 2600)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}