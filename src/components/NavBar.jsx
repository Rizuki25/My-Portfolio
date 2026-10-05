import { useMemo } from 'react'
import { sections } from '../data/content'
import { useContent } from '../contexts/ContentContext'
import { useActiveSection } from '../hooks/useActiveSection'
import { useScrollProgress } from '../hooks/useScrollProgress'

/**
 * ==========================================================================
 *  NavBar — header lengket bergaya editorial
 * ==========================================================================
 *  Baris 1 : monogram + nama + toggle tema
 *  Baris 2 : strip tautan section (bisa digeser horizontal di layar sempit)
 *  Baris 3 : garis progres scroll
 *
 *  Semua tetap terbaca di orientasi portrait.
 */
export default function NavBar({ theme, onToggleTheme }) {
  const { profile } = useContent()
  const progress = useScrollProgress()
  const ids = useMemo(() => sections.map((s) => s.id), [])
  const active = useActiveSection(ids)

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper/95 backdrop-blur-sm">
      {/* ---------- baris identitas ---------- */}
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-3 py-2.5 sm:px-5">
        <a
          href="#home"
          className="group flex items-center gap-2.5"
          aria-label="Kembali ke atas"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-ink bg-acid font-mono text-xs font-bold shadow-[3px_3px_0_0_var(--color-ink)] transition-transform duration-150 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-[5px_5px_0_0_var(--color-ink)]">
            {profile.monogram}
          </span>
          <span className="hidden min-w-0 flex-col leading-tight xs:flex sm:flex">
            <span className="truncate font-display text-[0.8rem] tracking-tight uppercase">
              {profile.name}
            </span>
            <span className="label-mono truncate text-[0.5625rem] text-ink-soft">
              {profile.role}
            </span>
          </span>
        </a>

        <span className="ml-auto flex items-center gap-2">
          {/* status ketersediaan — hanya di layar lega */}
          <span className="hidden items-center gap-1.5 border-2 border-ink px-2 py-1 font-mono text-[0.5625rem] font-bold tracking-[0.14em] uppercase lg:inline-flex">
            <span className="blink h-2 w-2 bg-flag-text" aria-hidden="true" />
            {profile.availability}
          </span>

          {/* toggle tema */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            aria-pressed={theme === 'dark'}
            className="flex h-9 w-9 items-center justify-center border-[3px] border-ink bg-card text-base shadow-[3px_3px_0_0_var(--color-ink)] transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-acid hover:shadow-[5px_5px_0_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--color-ink)]"
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
        </span>
      </div>

      {/* ---------- strip navigasi section ---------- */}
      <nav
        aria-label="Navigasi section"
        className="no-scrollbar mx-auto flex w-full max-w-6xl gap-1.5 overflow-x-auto px-3 pb-2.5 sm:px-5"
      >
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={isActive ? 'true' : undefined}
              className={[
                'shrink-0 border-2 px-2.5 py-1 font-mono text-[0.625rem] font-bold tracking-[0.12em] uppercase',
                'transition-all duration-150',
                isActive
                  ? 'border-ink bg-acid text-ink shadow-[2px_2px_0_0_var(--color-ink)]'
                  : 'border-ink/30 bg-transparent text-ink-soft hover:border-ink hover:bg-card hover:text-ink',
              ].join(' ')}
            >
              <span className="text-flag-text">{s.index}</span>
              <span className="mx-1 opacity-40" aria-hidden="true">
                /
              </span>
              {s.label}
            </a>
          )
        })}
      </nav>

      {/* ---------- garis progres scroll ---------- */}
      <div
        className="h-[3px] w-full bg-ink/10"
        role="progressbar"
        aria-label="Progres scroll halaman"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-acid transition-[width] duration-100 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </header>
  )
}
