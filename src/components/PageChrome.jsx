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
export default function PageChrome({ motionEnabled, reducedMotion, onToggleMotion }) {
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

      {/* ---------- kendali motion: pengguna selalu punya tombol jeda ---------- */}
      <button
        type="button"
        onClick={onToggleMotion}
        disabled={reducedMotion}
        aria-label={reducedMotion ? 'Animasi mengikuti preferensi reduced-motion sistem' : motionEnabled ? 'Jeda animasi dekoratif' : 'Putar animasi dekoratif'}
        aria-pressed={motionEnabled}
        title={reducedMotion ? 'Animasi dimatikan oleh preferensi sistem' : motionEnabled ? 'Jeda animasi' : 'Putar animasi'}
        data-magnetic="0.12"
        className="motion-control fixed bottom-3 left-3 z-40 flex items-center gap-2 border-[3px] border-ink bg-card px-2.5 py-2 font-mono text-[0.5625rem] font-bold tracking-[0.12em] uppercase shadow-[4px_4px_0_0_var(--color-ink)] sm:bottom-5 sm:left-5"
      >
        <span className="motion-control__icon" aria-hidden="true">{motionEnabled ? '❚❚' : '▶'}</span>
        <span>{motionEnabled ? 'Motion on' : 'Motion off'}</span>
      </button>

      {/* ---------- kembali ke atas + progres melingkar ---------- */}
      <button
        type="button"
        onClick={backToTop}
        aria-label={`Kembali ke atas halaman. Progres baca ${Math.round(progress * 100)} persen`}
        title="Kembali ke atas"
        tabIndex={canGoTop ? 0 : -1}
        data-magnetic="0.12"
        className={[
          'back-to-top fixed right-3 bottom-3 z-40 flex h-11 w-11 items-center justify-center border-[3px] border-ink bg-acid text-base font-bold text-ink',
          'shadow-[4px_4px_0_0_var(--color-ink)] transition-all duration-300 sm:right-5 sm:bottom-5',
          'hover:shadow-[6px_6px_0_0_var(--color-ink)]',
          canGoTop
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0',
        ].join(' ')}
      >
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="22" cy="22" r="18" fill="none" stroke="var(--color-ink)" strokeOpacity="0.18" strokeWidth="2" />
          <circle cx="22" cy="22" r="18" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeDasharray="113.1" strokeDashoffset={(1 - progress) * 113.1} />
        </svg>
        <span className="relative" aria-hidden="true">↑</span>
      </button>
    </>
  )
}