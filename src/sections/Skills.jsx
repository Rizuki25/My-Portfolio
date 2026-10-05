import { useEffect, useRef, useState } from 'react'
import { useContent } from '../contexts/ContentContext'
import BentoCell from '../components/BentoCell'
import SectionHeader from '../components/SectionHeader'
import Tag from '../components/Tag'
import { BentoGrid, SectionShell } from '../components/Primitives'

/**
 * Bar level keahlian: 5 blok segmen. Blok terisi = level.
 * Sangat brutalist — tanpa gradasi, tanpa animasi halus.
 */
function LevelBar({ level = 3, invert = false }) {
  return (
    <span className="flex gap-[3px]" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={[
            'h-3 w-[10px] border-2 transition-colors duration-200',
            invert ? 'border-paper/40 group-hover:border-ink' : 'border-ink',
            n <= level
              ? invert
                ? 'bg-acid group-hover:bg-ink'
                : 'bg-ink'
              : invert
                ? 'bg-transparent'
                : 'bg-ink/12',
          ].join(' ')}
        />
      ))}
    </span>
  )
}

function groupsPerPage() {
  if (typeof window === 'undefined') return 3
  if (window.matchMedia('(min-width: 1024px)').matches) return 3
  if (window.matchMedia('(min-width: 640px)').matches) return 2
  return 1
}

function SkillGroupCard({ group, index }) {
  const dark = index === 1 || index === 4

  return (
    <BentoCell
      tone={dark ? 'ink' : index % 3 === 2 ? 'paper2' : 'card'}
      pad="none"
      hover
      reveal={false}
    >
      <div className={[
        'flex items-center justify-between gap-2 border-b-[3px] px-3 py-2',
        dark ? 'border-paper/25' : 'border-ink',
      ].join(' ')}>
        <span className={`label-mono ${dark ? 'text-acid-text' : 'text-flag-text'}`}>{group.title}</span>
        <span aria-hidden="true" className={`font-mono text-xs font-bold ${dark ? 'text-paper/70' : 'text-ink/40'}`}>{group.icon}</span>
      </div>

      <ul>
        {(group.skills ?? []).map((skill, skillIndex) => (
          <li
            key={`${skillIndex}-${skill.name}`}
            className={[
              'group flex items-center justify-between gap-3 px-3 py-2.5 transition-colors duration-150',
              dark ? 'hover:bg-acid hover:text-ink' : 'hover:bg-acid/45',
              'border-b-2 last:border-b-0',
              dark ? 'border-paper/12' : 'border-ink/10',
            ].join(' ')}
          >
            <span className={`min-w-0 font-mono text-[0.6875rem] leading-snug font-medium sm:text-xs ${dark ? 'text-paper/85 group-hover:text-ink' : 'text-ink'}`}>
              {skill.name}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <LevelBar level={skill.level} invert={dark} />
              <span className={`font-mono text-[0.5625rem] font-bold ${dark ? 'text-paper/70 group-hover:text-ink' : 'text-ink-soft'}`}>{skill.level}/5</span>
            </span>
          </li>
        ))}
      </ul>

      {(group.skills ?? []).length === 0 ? <p className={`px-3 py-3 text-xs ${dark ? 'text-paper/70' : 'text-ink-soft'}`}>Belum ada keahlian.</p> : null}
    </BentoCell>
  )
}

/**
 * ==========================================================================
 *  05 / SKILLS — kelompok keahlian + kotak perkakas
 * ==========================================================================
 */
export default function Skills() {
  const { skillGroups, toolbox, siteMeta } = useContent()
  const [visibleCount, setVisibleCount] = useState(groupsPerPage)
  const [page, setPage] = useState(0)
  const touchStart = useRef(null)

  useEffect(() => {
    const update = () => setVisibleCount(groupsPerPage())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  useEffect(() => setPage(0), [skillGroups, visibleCount])

  const pageCount = Math.max(1, Math.ceil(skillGroups.length / visibleCount))
  const currentPage = Math.min(page, pageCount - 1)
  const start = currentPage * visibleCount
  const visibleGroups = skillGroups.slice(start, start + visibleCount)
  const move = (direction) => {
    if (pageCount < 2) return
    setPage((current) => (current + direction + pageCount) % pageCount)
  }
  const onKeyDown = (event) => {
    if (event.target !== event.currentTarget || pageCount < 2) return
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
  }
  const onTouchEnd = (event) => {
    const initial = touchStart.current
    touchStart.current = null
    if (!initial || pageCount < 2) return
    const distanceX = event.changedTouches[0].clientX - initial.x
    const distanceY = event.changedTouches[0].clientY - initial.y
    if (Math.abs(distanceX) >= 50 && Math.abs(distanceX) > Math.abs(distanceY)) {
      move(distanceX < 0 ? 1 : -1)
    }
  }

  return (
    <SectionShell id="skills">
      <SectionHeader
        index="05"
        title="Skills"
        meta={`${skillGroups.length} kelompok / ${toolbox.length} alat`}
        description={siteMeta.sectionDescriptions.skills}
      />

      <div role="region" aria-roledescription={pageCount > 1 ? 'carousel' : undefined} aria-label="Kelompok keahlian" tabIndex={pageCount > 1 ? 0 : undefined} onKeyDown={onKeyDown} onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }} onTouchEnd={onTouchEnd} className="outline-none focus-visible:ring-4 focus-visible:ring-azure">
        <BentoGrid>
          {visibleGroups.map((group, offset) => <SkillGroupCard key={`${start + offset}-${group.title}`} group={group} index={start + offset} />)}
          {skillGroups.length === 0 ? <BentoCell span="sm:col-span-2 lg:col-span-3" tone="card" pad="md" reveal={false}><p className="text-sm text-ink-soft">Belum ada kelompok keahlian.</p></BentoCell> : null}
        </BentoGrid>

        {pageCount > 1 ? <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-[3px] border-ink bg-paper-2 p-3">
          <button type="button" onClick={() => move(-1)} aria-label="Kelompok skill sebelumnya" className="border-2 border-ink bg-card px-3 py-1.5 font-mono text-sm font-bold hover:bg-acid">←</button>
          <span className="font-mono text-xs font-bold uppercase" aria-live="polite" aria-atomic="true">Kelompok {start + 1}–{Math.min(start + visibleCount, skillGroups.length)} / {skillGroups.length}</span>
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap justify-center gap-1.5" aria-label="Pilih halaman kelompok skill">
              {Array.from({ length: pageCount }, (_, index) => <button key={index} type="button" onClick={() => setPage(index)} aria-label={`Lihat kelompok skill halaman ${index + 1}`} aria-current={currentPage === index ? 'true' : undefined} className={`h-3 w-3 border-2 border-ink ${currentPage === index ? 'bg-flag' : 'bg-card hover:bg-acid'}`} />)}
            </div>
            <button type="button" onClick={() => move(1)} aria-label="Kelompok skill berikutnya" className="border-2 border-ink bg-card px-3 py-1.5 font-mono text-sm font-bold hover:bg-acid">→</button>
          </div>
        </div> : null}
      </div>

      <BentoGrid className="mt-5">

        {/* ================= KOTAK PERKAKAS ================= */}
        <BentoCell
          tone="acid"
          span="sm:col-span-2 lg:col-span-2"
          pad="lg"
          hover
          delay={60}
        >
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
            <span className="label-mono">Kotak Perkakas</span>
            <span className="label-mono text-ink/80">Sehari-hari</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {toolbox.map((tool) => (
              <span
                key={tool}
                className="border-2 border-ink bg-paper px-2 py-1 font-mono text-[0.625rem] font-bold tracking-wide uppercase transition-all duration-150 hover:-translate-y-[2px] hover:bg-ink hover:text-paper"
              >
                {tool}
              </span>
            ))}
          </div>
        </BentoCell>

        {/* ================= LEGENDA LEVEL ================= */}
        <BentoCell tone="card" pad="md" hover delay={120}>
          <span className="label-mono text-flag-text">Legenda Level</span>
          <ul className="mt-3 space-y-2.5">
            {[
              { n: 5, t: 'Ahli', d: 'Memimpin, mengajari, menentukan arah teknis.' },
              { n: 4, t: 'Mahir', d: 'Mandiri pada proyek produksi kompleks.' },
              { n: 3, t: 'Produktif', d: 'Nyaman dipakai kerja sehari-hari.' },
              { n: 2, t: 'Berkembang', d: 'Paham dasar, masih perlu bimbingan.' },
              { n: 1, t: 'Mengenal', d: 'Sudah mencoba di proyek kecil.' },
            ].map((row) => (
              <li key={row.n} className="flex items-start gap-3">
                <LevelBar level={row.n} />
                <span className="min-w-0">
                  <span className="font-mono text-[0.6875rem] font-bold tracking-wide uppercase">
                    {row.t}
                  </span>
                  <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-soft">
                    {row.d}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t-2 border-ink/15 pt-3">
            <Tag tone="ink">Selalu belajar hal baru</Tag>
          </div>
        </BentoCell>
      </BentoGrid>
    </SectionShell>
  )
}
