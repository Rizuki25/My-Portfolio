/**
 * SectionHeader — kepala section bergaya editorial majalah teknis:
 * nomor section besar, garis rule, judul display, dan metadata mono.
 *
 * Motion: nomor "dicap" (stamp), judul tersingkap lewat mask line, dan garis
 * rule tumbuh mengikuti scroll (progressive enhancement via view timeline).
 */
export default function SectionHeader({ index, title, meta, description }) {
  return (
    <header className="reveal mb-5 sm:mb-7">
      {/* baris atas: nomor + meta kanan */}
      <div className="flex items-end justify-between gap-3 pb-2">
        <div className="flex items-baseline gap-3">
          <span className="stamp label-mono text-flag-text">{index}</span>
          <h2 className="font-display text-[1.75rem] leading-none sm:text-4xl lg:text-5xl">
            <span className="mask-line">
              <span style={{ '--line-delay': '90ms' }}>{title}</span>
            </span>
          </h2>
        </div>
        {meta ? (
          <span className="label-mono shrink-0 pb-0.5 text-ink-soft">{meta}</span>
        ) : null}
      </div>

      <div data-scroll-rule className="h-[3px] w-full bg-ink" aria-hidden="true" />

      {description ? (
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink-soft sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  )
}