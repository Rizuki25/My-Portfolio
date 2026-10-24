/**
 * MarqueeBand — pita teks berjalan bergaya ticker editorial.
 *
 * Dua salinan daftar yang identik dipasang berdampingan, lalu track digeser
 * -50% sehingga loop terlihat mulus. Pita berhenti saat di-hover supaya
 * nyaman dibaca, dan seluruhnya dekoratif (aria-hidden).
 */
export default function MarqueeBand({
  items = [],
  duration = 34,
  reverse = false,
  className = '',
}) {
  const content = items.filter(Boolean)
  if (content.length === 0) return null

  return (
    <div
      aria-hidden="true"
      className={`marquee-band relative overflow-hidden border-y-[3px] border-ink bg-ink text-paper ${className}`}
    >
      {/* tepi dilembutkan agar teks tidak "terpotong" kasar */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-ink to-transparent" />

      <div
        className="marquee-track py-2"
        data-direction={reverse ? 'reverse' : undefined}
        style={{ '--marquee-duration': `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {content.map((item, index) => (
              <span
                key={`${copy}-${index}`}
                className="flex items-center gap-3 px-3 font-mono text-[0.625rem] font-bold tracking-[0.18em] whitespace-nowrap uppercase"
              >
                <span className="text-acid-text">{item}</span>
                <span className="h-1.5 w-1.5 border border-paper/50" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}