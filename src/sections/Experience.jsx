import { useContent } from '../contexts/ContentContext'
import BentoCell from '../components/BentoCell'
import SectionHeader from '../components/SectionHeader'
import Tag from '../components/Tag'
import { BentoGrid, SectionShell } from '../components/Primitives'

/**
 * ==========================================================================
 *  03 / EXPERIENCE — riwayat kerja sebagai kartu bento bertumpuk vertikal
 * ==========================================================================
 *  Tiap entri = satu kartu lebar penuh, dengan kolom periode di kiri
 *  (jadi baris waktu) dan detail pekerjaan di kanan.
 */
export default function Experience() {
  const { experience, experienceMeta, profile, siteMeta } = useContent()
  const total = experience.length

  return (
    <SectionShell id="experience">
      <SectionHeader
        index="03"
        title="Experience"
        meta={`${total} posisi / ${profile.yearsExp}+ thn`}
        description={siteMeta.sectionDescriptions.experience}
      />

      <BentoGrid>
        {experience.map((job, i) => (
          <BentoCell
            key={`${job.company}-${job.period}`}
            span="sm:col-span-2 lg:col-span-3"
            tone={job.current ? 'acid' : i % 2 === 0 ? 'card' : 'paper2'}
            pad="none"
            hover
            variant="scale"
            delay={i * 60}
          >
            {/* ---------- baris judul entri ---------- */}
            <div
              className={[
                'flex flex-col gap-3 border-b-[3px] border-ink px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border-[3px] border-ink bg-ink font-mono text-[0.625rem] font-bold text-paper">
                  {String(total - i).padStart(2, '0')}
                </span>
                <span className="font-mono text-[0.6875rem] font-bold tracking-[0.14em] uppercase sm:text-xs">
                  {job.period}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {job.current ? (
                  <Tag tone="flag">
                    <span className="blink mr-1.5 inline-block h-1.5 w-1.5 bg-on-flag align-middle" />
                    Sedang berjalan
                  </Tag>
                ) : null}
                <Tag tone={job.current ? 'ink' : 'soft'}>{job.type}</Tag>
                <Tag tone={job.current ? 'ink' : 'soft'}>{job.location}</Tag>
              </div>
            </div>

            {/* ---------- isi entri ---------- */}
            <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
              <div>
                <h3 className="font-display text-xl leading-tight uppercase sm:text-2xl">
                  {job.role}
                </h3>
                <p className="mt-1 font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-flag-text uppercase sm:text-xs">
                  {job.company}
                </p>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
                  {job.summary}
                </p>

                <ul className="mt-4 space-y-2.5">
                  {job.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.4rem] h-2.5 w-2.5 shrink-0 border-2 border-ink bg-acid"
                      />
                      <span className="text-[0.8125rem] leading-relaxed sm:text-sm">
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ---------- kolom stack ---------- */}
              <aside className="border-t-[3px] border-ink pt-3 lg:border-t-0 lg:border-l-[3px] lg:pt-0 lg:pl-5">
                <span className="label-mono text-ink-soft">Tech Stack</span>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {job.stack.map((s) => (
                    <Tag key={s} tone={job.current ? 'ink' : 'outline'}>
                      {s}
                    </Tag>
                  ))}
                </div>
              </aside>
            </div>
          </BentoCell>
        ))}

        {/* ---------- ringkasan industri ---------- */}
        <BentoCell tone="ink" span="sm:col-span-2 lg:col-span-3" pad="md" delay={80}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: 'Total posisi', v: `${total}` },
              { k: 'Rentang', v: experienceMeta.range },
              { k: 'Industri', v: experienceMeta.industries },
              { k: 'Mode kerja', v: experienceMeta.workModes },
            ].map((item) => (
              <div key={item.k}>
                <span className="label-mono text-acid-text">{item.k}</span>
                <p className="mt-1.5 font-mono text-[0.75rem] leading-snug font-medium text-paper sm:text-sm">
                  {item.v}
                </p>
              </div>
            ))}
          </div>
        </BentoCell>
      </BentoGrid>
    </SectionShell>
  )
}
