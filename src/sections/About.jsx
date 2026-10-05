import { useContent } from '../contexts/ContentContext'
import BentoCell from '../components/BentoCell'
import SectionHeader from '../components/SectionHeader'
import { BentoGrid, IndexBadge, SectionShell } from '../components/Primitives'

/**
 * ==========================================================================
 *  02 / ABOUT — profil, fakta singkat, prinsip kerja, kesibukan saat ini
 * ==========================================================================
 */
export default function About() {
  const { about, profile, siteMeta } = useContent()
  return (
    <SectionShell id="about">
      <SectionHeader
        index="02"
        title="About"
        meta={`Profil / ${profile.yearsExp}+ thn`}
        description={siteMeta.sectionDescriptions.about}
      />

      <BentoGrid>
        {/* ---------- narasi utama ---------- */}
        <BentoCell span="sm:col-span-2 lg:col-span-2" tone="card" pad="lg" hover>
          <h3 className="font-display text-2xl leading-[0.95] uppercase sm:text-3xl">
            {about.heading}
          </h3>

          <div className="mt-4 space-y-3.5">
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className={[
                  'text-sm leading-relaxed text-ink-soft sm:text-[0.9375rem]',
                  // paragraf pembuka diberi huruf kapital drop-cap ala editorial
                  i === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:leading-[0.78] first-letter:text-ink' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {p}
              </p>
            ))}
          </div>
        </BentoCell>

        {/* ---------- fakta singkat ---------- */}
        <BentoCell tone="ink" pad="none" hover className="self-start">
          <div className="border-b-[3px] border-paper/25 px-4 py-2">
            <span className="label-mono text-acid-text">Fakta Singkat</span>
          </div>
          <dl className="divide-y-2 divide-paper/15">
            {about.facts.map((f) => (
              <div key={f.k} className="px-4 py-2.5">
                <dt className="label-mono text-paper/70">{f.k}</dt>
                <dd className="mt-1 font-mono text-[0.6875rem] leading-snug font-medium text-paper sm:text-xs">
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
        </BentoCell>

        {/* ---------- prinsip kerja ---------- */}
        {about.principles.map((p, i) => (
          <BentoCell
            key={p.n}
            tone={i % 3 === 1 ? 'paper2' : 'card'}
            pad="md"
            hover
            delay={i * 70}
          >
            <div className="flex items-center justify-between">
              <IndexBadge tone={i % 3 === 1 ? 'ink' : 'acid'}>{p.n}</IndexBadge>
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 border-2 border-ink bg-acid"
              />
            </div>
            <h3 className="mt-3 font-display text-base leading-tight uppercase">
              {p.t}
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">
              {p.d}
            </p>
          </BentoCell>
        ))}

        {/* ---------- sedang dikerjakan ---------- */}
        <BentoCell
          tone="acid"
          span="sm:col-span-2 lg:col-span-3"
          pad="lg"
          hover
          delay={60}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
            <div className="sm:w-52 sm:shrink-0">
              <span className="label-mono">Sedang dikerjakan</span>
              <p className="mt-2 font-display text-2xl leading-none uppercase sm:text-3xl">
                Sekarang
                <span className="text-flag-text">.</span>
              </p>
            </div>

            <ul className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
              {about.currently.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 border-2 border-ink bg-paper/60 px-3 py-2.5 transition-colors duration-150 hover:bg-paper"
                >
                  <span aria-hidden="true" className="mt-0.5 font-mono text-xs font-bold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[0.8125rem] leading-snug font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </BentoCell>
      </BentoGrid>
    </SectionShell>
  )
}
