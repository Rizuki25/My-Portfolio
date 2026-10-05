import { sections } from '../data/content'

/**
 * Label — teks mono kecil untuk metadata ("PERIOD", "STACK", dst).
 */
export function Label({ children, className = '' }) {
  return (
    <span className={`label-mono block text-ink-soft ${className}`}>{children}</span>
  )
}

/**
 * Rule — garis pemisah editorial.
 */
export function Rule({ className = '' }) {
  return <hr className={`border-0 border-t-[3px] border-ink ${className}`} />
}

/**
 * CornerMark — penanda sudut ala cetak (crop mark) di pojok kartu.
 */
export function CornerMark({ position = 'tr', className = '' }) {
  const pos = {
    tr: 'top-[-3px] right-[-3px]',
    tl: 'top-[-3px] left-[-3px]',
    br: 'right-[-3px] bottom-[-3px]',
    bl: 'bottom-[-3px] left-[-3px]',
  }[position]

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-2.5 w-2.5 border-[3px] border-ink bg-acid ${pos} ${className}`}
    />
  )
}

/**
 * SectionShell — pembungkus section: id untuk anchor nav + batas atas.
 */
export function SectionShell({ id, children, className = '' }) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t-[3px] border-ink pt-8 sm:scroll-mt-28 sm:pt-12 ${className}`}
    >
      {children}
    </section>
  )
}

/**
 * Grid — induk bento: 1 kolom di portrait/mobile, 2 di tablet, 3 di desktop.
 */
export function BentoGrid({ children, className = '' }) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * IndexBadge — nomor urut item (project, prinsip, dst).
 */
export function IndexBadge({ children, tone = 'ink' }) {
  const bg = tone === 'acid' ? 'bg-acid text-ink' : 'bg-ink text-paper'
  return (
    <span
      className={`inline-flex h-7 min-w-7 items-center justify-center border-[3px] border-ink px-1 font-mono text-[0.6875rem] font-bold ${bg}`}
    >
      {children}
    </span>
  )
}

export { sections }
