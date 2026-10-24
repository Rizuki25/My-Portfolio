import { useContent } from '../contexts/ContentContext'
import BentoCell from '../components/BentoCell'
import SectionHeader from '../components/SectionHeader'
import Tag from '../components/Tag'
import { BentoGrid, IndexBadge, SectionShell } from '../components/Primitives'

/**
 * ==========================================================================
 *  06 / EDUCATION — pendidikan formal, sertifikasi, dan penghargaan
 * ==========================================================================
 */
export default function Education() {
  const { education, educationMeta, certifications, awards, siteMeta } = useContent()
  return (
    <SectionShell id="education">
      <SectionHeader
        index="06"
        title="Education"
        meta={`${education.length} institusi / ${certifications.length} sertifikasi`}
        description={siteMeta.sectionDescriptions.education}
      />

      <BentoGrid>
        {/* ================= PENDIDIKAN FORMAL ================= */}
        {education.map((edu, i) => (
          <BentoCell
            key={edu.school}
            span="sm:col-span-2 lg:col-span-3"
            tone={i === 0 ? 'card' : 'paper2'}
            pad="none"
            hover
            variant="scale"
            delay={i * 60}
          >
            {/* kepala */}
            <div className="flex flex-col gap-3 border-b-[3px] border-ink px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-3">
                <IndexBadge tone={i === 0 ? 'acid' : 'ink'}>
                  {String(i + 1).padStart(2, '0')}
                </IndexBadge>
                <span className="font-mono text-[0.6875rem] font-bold tracking-[0.14em] uppercase sm:text-xs">
                  {edu.period}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="soft">{edu.location}</Tag>
                {i === 0 ? <Tag tone="flag">Pendidikan utama</Tag> : null}
              </div>
            </div>

            {/* isi */}
            <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div>
                <h3 className="font-display text-lg leading-tight uppercase sm:text-2xl">
                  {edu.degree}
                </h3>
                <p className="mt-1.5 font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-flag-text uppercase sm:text-xs">
                  {edu.school}
                </p>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
                  {edu.note}
                </p>

                {edu.courses?.length ? (
                  <div className="mt-4">
                    <span className="label-mono text-ink-soft">
                      Mata kuliah relevan
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {edu.courses.map((c) => (
                        <Tag key={c} tone="outline">
                          {c}
                        </Tag>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <aside className="border-t-[3px] border-ink pt-4 lg:border-t-0 lg:border-l-[3px] lg:pt-0 lg:pl-5">
                <span className="label-mono text-ink-soft">Hasil</span>
                <p className="mt-2 border-2 border-ink bg-acid px-3 py-2.5 font-mono text-[0.6875rem] leading-snug font-bold uppercase">
                  {edu.grade}
                </p>

                <div className="mt-4 bg-halftone border-2 border-ink p-3">
                  <span className="label-mono text-flag-text">Terverifikasi</span>
                  <p className="mt-1.5 font-mono text-[0.625rem] leading-relaxed text-ink-soft">
                    {educationMeta.verificationNote}
                  </p>
                </div>
              </aside>
            </div>
          </BentoCell>
        ))}

        {/* ================= SERTIFIKASI ================= */}
        <BentoCell
          tone="ink"
          span="sm:col-span-2 lg:col-span-2"
          pad="none"
          hover
          delay={60}
        >
          <div className="flex items-center justify-between border-b-[3px] border-paper/25 px-4 py-2">
            <span className="label-mono text-acid-text">Sertifikasi</span>
            <span className="label-mono text-paper/70">
              {String(certifications.length).padStart(2, '0')} item
            </span>
          </div>

          <ul>
            {certifications.map((c, i) => (
              <li key={c.name}>
                <a
                  href={c.href}
                  className={[
                    'group flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-acid hover:text-ink',
                    i < certifications.length - 1 ? 'border-b-2 border-paper/12' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.625rem] font-bold text-acid-text group-hover:text-ink"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-[0.6875rem] font-bold tracking-wide text-paper uppercase group-hover:text-ink sm:text-xs">
                      {c.name}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[0.625rem] text-paper/70 group-hover:text-ink/80">
                      {c.issuer}
                    </span>
                  </span>
                  <span className="shrink-0 border-2 border-paper/30 px-1.5 py-0.5 font-mono text-[0.5625rem] font-bold text-paper/70 group-hover:border-ink group-hover:text-ink">
                    {c.year}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-paper/40 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-ink"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </BentoCell>

        {/* ================= PENGHARGAAN ================= */}
        <BentoCell tone="acid" pad="md" hover delay={120}>
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <span className="label-mono">Penghargaan</span>
            <span aria-hidden="true" className="font-mono text-sm font-bold">
              ✦
            </span>
          </div>

          <ul className="mt-3 space-y-3">
            {awards.map((a) => (
              <li key={a.title} className="border-l-[3px] border-ink pl-3">
                <span className="font-mono text-[0.625rem] font-bold tracking-[0.14em]">
                  {a.year}
                </span>
                <p className="mt-1 text-[0.8125rem] leading-snug font-semibold">
                  {a.title}
                </p>
                <p className="mt-0.5 font-mono text-[0.625rem] text-ink/80">
                  {a.org}
                </p>
              </li>
            ))}
          </ul>
        </BentoCell>
      </BentoGrid>
    </SectionShell>
  )
}
