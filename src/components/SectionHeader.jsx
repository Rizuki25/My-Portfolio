/**
 * SectionHeader — kepala section bergaya editorial majalah teknis:
 * nomor section besar, garis rule, judul display, dan metadata mono.
 */
export default function SectionHeader({ index, title, meta, description }) {
  return (
    <header className="reveal mb-5 sm:mb-7">
      {/* baris atas: nomor + meta kanan */}
      <div className="flex items-end justify-between gap-3 border-b-[3px] border-ink pb-2">
        <div className="flex items-baseline gap-3">
          <span className="label-mono text-flag-text">{index}</span>
          <h2 className="font-display text-[1.75rem] leading-none sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        </div>
        {meta ? (
          <span className="label-mono shrink-0 pb-0.5 text-ink-soft">{meta}</span>
        ) : null}
      </div>

      {description ? (
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink-soft sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  )
}
