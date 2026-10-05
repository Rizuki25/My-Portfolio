import { useContent } from '../contexts/ContentContext'
import BentoCell from '../components/BentoCell'
import BrutalButton from '../components/BrutalButton'
import { BentoGrid, SectionShell } from '../components/Primitives'

/**
 * ==========================================================================
 *  01 / HOME — pembuka bergaya sampul majalah teknis
 * ==========================================================================
 */
export default function Home() {
  const { profile, stats, siteMeta } = useContent()
  return (
    <SectionShell id="home" className="border-t-0 pt-6 sm:pt-8">
      <BentoGrid>
        {/* ---------- identitas utama ---------- */}
        <BentoCell
          as="div"
          span="sm:col-span-2 lg:col-span-2"
          tone="card"
          pad="lg"
          hover
          className="bg-blueprint"
        >
          <div className="flex flex-wrap items-center gap-2 border-b-2 border-ink pb-2">
            <span className="label-mono bg-ink px-1.5 py-0.5 text-paper">
              Portfolio
            </span>
            <span className="label-mono text-ink-soft">{siteMeta.edition}</span>
            <span className="label-mono ml-auto text-flag-text">01 / Home</span>
          </div>

          <h1 className="mt-4 font-display text-[2.6rem] leading-[0.86] break-words sm:text-6xl lg:text-7xl">
            {profile.firstName}
            <br />
            <span className="text-outline">{profile.lastName}</span>
          </h1>

          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.6875rem] font-bold tracking-[0.14em] uppercase sm:text-xs">
            <span className="bg-acid border-2 border-ink px-2 py-0.5">
              {profile.role}
            </span>
            <span className="text-ink-soft">&</span>
            <span className="border-2 border-ink px-2 py-0.5">{profile.roleAlt}</span>
          </p>

          <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-ink-soft sm:text-base">
            {profile.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <BrutalButton href="#projects" variant="ink" size="md" icon="↓">
              Lihat Project
            </BrutalButton>
            <BrutalButton href="#contact" variant="outline" size="md" icon="→">
              Hubungi Saya
            </BrutalButton>
          </div>
        </BentoCell>

        {/* ---------- monogram / potret ---------- */}
        <BentoCell
          tone="ink"
          pad="none"
          hover
          className="flex min-h-[13rem] flex-col justify-between overflow-hidden bg-hatch sm:min-h-full"
        >
          <div className="flex items-start justify-between p-3">
            <span className="label-mono text-acid-text">ID</span>
            <span className="label-mono text-paper/70">F.01</span>
          </div>

          <div className="flex items-center justify-center py-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={`Potret ${profile.name}`}
                className="h-40 w-40 border-[3px] border-paper object-cover sm:h-48 sm:w-48"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span
                aria-hidden="true"
                className="font-display text-[5.5rem] leading-none text-paper sm:text-7xl"
              >
                {profile.monogram}
              </span>
            )}
          </div>

          <div className="border-t-[3px] border-paper/25 bg-ink p-3">
            <p className="font-mono text-[0.625rem] leading-relaxed tracking-[0.14em] text-paper/70 uppercase">
              {profile.role}
            </p>
          </div>
        </BentoCell>

        {/* ---------- ketersediaan ---------- */}
        <BentoCell tone="flag" span="sm:col-span-2" pad="md" hover>
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center border-[3px] border-ink bg-card">
              <span className="blink h-1.5 w-1.5 bg-flag-text" />
            </span>
            <div className="min-w-0">
              <span className="label-mono">Status</span>
              <p className="mt-1 font-display text-lg leading-tight uppercase sm:text-2xl">
                {profile.availability}
              </p>
              <p className="mt-1 font-mono text-[0.6875rem] text-on-flag">
                {profile.statusNote}
              </p>
            </div>
          </div>
        </BentoCell>

        {/* ---------- lokasi & zona waktu ---------- */}
        <BentoCell tone="paper2" pad="md" hover>
          <span className="label-mono text-flag-text">Basis</span>
          <p className="mt-2 font-display text-base leading-tight uppercase">
            {profile.location}
          </p>
          <p className="mt-1 font-mono text-[0.6875rem] text-ink-soft">
            {profile.timezone}
          </p>
          <p className="mt-3 border-t-2 border-ink/20 pt-2 font-mono text-[0.625rem] text-ink-soft">
            {profile.yearsExp}+ tahun pengalaman
          </p>
        </BentoCell>

        {/* ---------- statistik ---------- */}
        <BentoCell
          tone="ink"
          span="sm:col-span-2 lg:col-span-3"
          pad="none"
          reveal
          delay={80}
        >
          <div className="flex items-center justify-between border-b-[3px] border-paper/25 px-4 py-2">
            <span className="label-mono text-acid-text">Rekap Angka</span>
            <span className="label-mono text-paper/70">{siteMeta.statsAsOf}</span>
          </div>

          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={[
                  'group p-4 transition-colors duration-200 hover:bg-acid hover:text-ink',
                  i % 2 === 0 ? 'border-r-[3px] border-paper/25' : '',
                  i < 2 ? 'border-b-[3px] border-paper/25 lg:border-b-0' : '',
                  'lg:border-r-[3px] lg:last:border-r-0',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <dt className="label-mono text-paper/70 group-hover:text-ink/85">{s.label}</dt>
                <dd className="mt-1.5 font-display text-4xl leading-none sm:text-5xl">
                  {s.value}
                </dd>
                <dd className="mt-1.5 font-mono text-[0.625rem] text-paper/70 group-hover:text-ink/85">
                  {s.sub}
                </dd>
              </div>
            ))}
          </dl>
        </BentoCell>

        {/* ---------- petunjuk gulir ---------- */}
        <BentoCell
          tone="card"
          span="sm:col-span-2 lg:col-span-3"
          pad="sm"
          className="flex items-center justify-between gap-3"
        >
          <span className="label-mono text-ink-soft">
            Gulir ke bawah — 07 section tersusun vertikal
          </span>
          <a
            href="#about"
            className="group inline-flex items-center gap-2 border-2 border-ink bg-acid px-3 py-1 font-mono text-[0.625rem] font-bold tracking-[0.14em] uppercase"
          >
            02 / About
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            >
              ↓
            </span>
          </a>
        </BentoCell>
      </BentoGrid>
    </SectionShell>
  )
}
