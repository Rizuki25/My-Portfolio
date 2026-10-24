import { useContent } from '../contexts/ContentContext'

/**
 * Footer — penutup bergaya kolofon majalah: nama besar outline,
 * catatan teknis, stempel edisi, dan tombol kembali ke atas.
 */
export default function Footer() {
  const { profile, siteMeta } = useContent()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-12 border-t-[3px] border-ink bg-paper-2 sm:mt-16">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-5 sm:py-14">
        {/* nama besar outline — bergerak halus mengikuti scroll */}
        <p
          aria-hidden="true"
          data-parallax="slow"
          className="name-outline text-outline select-none text-center font-display text-[3.25rem] leading-[0.85] break-words sm:text-7xl lg:text-8xl"
        >
          {profile.firstName.toUpperCase()}
          <br />
          {profile.lastName.toUpperCase()}
        </p>
        <p className="sr-only">{profile.name}</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* kolofon */}
          <div className="border-[3px] border-ink bg-card p-4">
            <span className="label-mono text-flag-text">Kolofon</span>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">{siteMeta.colophon}</p>
          </div>

          {/* tautan cepat */}
          <div className="border-[3px] border-ink bg-card p-4">
            <span className="label-mono text-flag-text">Tautan</span>
            <ul className="mt-2 space-y-1.5">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-wide uppercase"
                  >
                    <span className="text-ink transition-transform duration-150 group-hover:translate-x-1">
                      →
                    </span>
                    <span className="border-b-2 border-transparent transition-colors group-hover:border-acid">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={profile.resumeUrl}
                  className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-wide uppercase"
                >
                  <span className="text-ink transition-transform duration-150 group-hover:translate-x-1">
                    ↓
                  </span>
                  <span className="border-b-2 border-transparent transition-colors group-hover:border-acid">
                    Unduh CV
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* stempel edisi */}
          <div className="flex flex-col justify-between gap-3 border-[3px] border-ink bg-ink p-4 text-paper">
            <div>
              <span className="label-mono text-acid-text">{siteMeta.edition}</span>
              <p className="mt-2 text-xs leading-relaxed opacity-70">
                {siteMeta.footerNote}
              </p>
            </div>
            <a
              href="#home"
              className="inline-flex items-center justify-between gap-2 border-[3px] border-paper bg-transparent px-3 py-2 font-mono text-[0.625rem] font-bold tracking-[0.14em] uppercase transition-colors duration-150 hover:bg-acid hover:text-ink"
            >
              Kembali ke atas
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>

        {/* baris hak cipta */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t-2 border-ink/20 pt-4 sm:flex-row">
          <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-soft uppercase">
            © {year} {profile.name}. Seluruh hak cipta dilindungi.
          </p>
          <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-soft uppercase">
            {profile.location} — {profile.timezone}
          </p>
        </div>
      </div>
    </footer>
  )
}
