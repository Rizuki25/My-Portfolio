import { useMemo } from 'react'
import { sections } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'
import { useScrollProgress } from '../hooks/useScrollProgress'

/**
 * PageChrome — ornamen navigasi yang menempel di viewport:
 *
 * 1. Rail section di kanan (hanya layar lebar): penanda posisi + link cepat.
 * 2. Tombol kembali ke atas yang muncul setelah halaman digulir.
 *
 * Keduanya murni tambahan — navbar utama tetap menjadi navigasi utama.
 */
export default function PageChrome() {
  const ids = useMemo(() => sections.map((section) => section.id), [])
  const active = useActiveSection(ids)
  const progress = useScrollProgress()
  const canGoTop = progress > 0.1

  const backToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <>
      {/* ---------- rail section ---------- */}
      <nav
        aria-label="Navigasi cepat section"
        className="pointer-events-none fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 xl:flex"
      >
        {sections.map((section) => {
          const isActive = active === section.id
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? 'true' : undefined}
              className="group pointer-events-auto flex items-center gap-2"
            >
              <span
                className={[
                  'border-2 border-ink bg-card px-1.5 py-0.5 font-mono text-[0.5625rem] font-bold tracking-[0.14em] uppercase',
                  'opacity-0 transition-all duration-200 group-hover:opacity-100',
                  isActive ? 'opacity-100 bg-acid' : '',
                ].join(' ')}
              >
                {section.index} / {section.label}
              </span>
              <span
                aria-hidden="true"
                className={[
                  'h-2.5 border-2 border-ink transition-all duration-300',
                  isActive
                    ? 'w-6 bg-flag shadow-[2px_2px_0_0_var(--color-ink)]'
                    : 'w-2.5 bg-card group-hover:w-4 group-hover:bg-acid',
                ].join(' ')}
              />
            </a>
          )
        })}
      </nav>

      {/* ---------- kembali ke atas ---------- */}
      <button
        type="button"
        onClick={backToTop}
        aria-label="Kembali ke atas halaman"
        tabIndex={canGoTop ? 0 : -1}
        className={[
          'fixed right-3 bottom-3 z-40 flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-acid text-base font-bold text-ink',
          'shadow-[4px_4px_0_0_var(--color-ink)] transition-all duration-300 sm:right-5 sm:bottom-5',
          'hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_var(--color-ink)]',
          'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--color-ink)]',
          canGoTop
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0',
        ].join(' ')}
      >
        <span aria-hidden="true">↑</span>
      </button>
    </>
  )
}