import { useEffect, useMemo, useRef, useState } from 'react'
import { projects } from '../data/content'
import { useContent } from '../contexts/ContentContext'
import { useReveal } from '../hooks/useReveal'
import { getPublishedProjects, hasProjectsApi } from '../lib/projectsApi'
import { prepareProjects } from '../lib/prepareProjects'
import BentoCell from '../components/BentoCell'
import BrutalButton from '../components/BrutalButton'
import ProjectGallery from '../components/ProjectGallery'
import SectionHeader from '../components/SectionHeader'
import Tag from '../components/Tag'
import { BentoGrid, SectionShell } from '../components/Primitives'

function ProjectStory({ problem, solution, compact = false }) {
  if (!problem && !solution) return null

  return (
    <div className={compact ? 'mt-3 grid gap-2' : 'mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'}>
      {problem ? <div className="min-w-0 border-2 border-ink bg-paper p-3">
        <span className="label-mono text-flag-text">Masalah</span>
        <p className="mt-1.5 whitespace-pre-line break-words text-[0.8125rem] leading-relaxed text-ink-soft">{problem}</p>
      </div> : null}
      {solution ? <div className="min-w-0 border-2 border-ink bg-paper p-3">
        <span className="label-mono text-flag-text">Solusi</span>
        <p className="mt-1.5 whitespace-pre-line break-words text-[0.8125rem] leading-relaxed text-ink-soft">{solution}</p>
      </div> : null}
    </div>
  )
}

/**
 * ==========================================================================
 *  04 / PROJECTS — bentuk kartu unggulan dan biasa tetap berbeda;
 *  proyek tambahan diganti melalui slider.
 * ==========================================================================
 */
export default function Projects() {
  const { siteMeta } = useContent()
  const [publishedProjects, setPublishedProjects] = useState([])
  const [status, setStatus] = useState(hasProjectsApi ? 'loading' : 'local')
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState(1)
  const touchStart = useRef(null)

  useEffect(() => {
    if (!hasProjectsApi) return undefined

    const controller = new AbortController()
    getPublishedProjects({ signal: controller.signal })
      .then((rows) => {
        setPublishedProjects(rows)
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Gagal memuat Projects dari Supabase:', error)
          setStatus('error')
        }
      })

    return () => controller.abort()
  }, [])

  const visibleProjects = useMemo(
    () => status === 'local'
      ? projects.map((project) => ({
        ...project,
        impact: project.impact ?? [],
        stack: project.stack ?? [],
        links: project.links ?? [],
        images: project.images ?? [],
      }))
      : prepareProjects(publishedProjects),
    [publishedProjects, status],
  )
  useEffect(() => {
    setActiveProjectIndex(0)
    setSlideDirection(1)
  }, [visibleProjects])
  useReveal([publishedProjects, status])

  const projectCount = visibleProjects.length
  const currentIndex = Math.min(activeProjectIndex, projectCount - 1)
  const activeProject = visibleProjects[currentIndex]
  const p = activeProject
  const moveProject = (direction) => {
    if (projectCount < 2) return
    setSlideDirection(direction)
    setActiveProjectIndex((index) => (index + direction + projectCount) % projectCount)
  }
  const goToProject = (index) => {
    setSlideDirection(index >= currentIndex ? 1 : -1)
    setActiveProjectIndex(index)
  }
  const onProjectKeyDown = (event) => {
    if (event.target !== event.currentTarget || projectCount < 2) return
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveProject(-1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveProject(1) }
  }
  const onProjectTouchStart = (event) => {
    // Sentuhan di galeri foto hanya mengganti foto, bukan proyek.
    if (event.target.closest('[aria-roledescription="carousel"]') !== event.currentTarget) return
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }
  const onProjectTouchEnd = (event) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start || projectCount < 2) return
    const distanceX = event.changedTouches[0].clientX - start.x
    const distanceY = event.changedTouches[0].clientY - start.y
    if (Math.abs(distanceX) >= 50 && Math.abs(distanceX) > Math.abs(distanceY)) {
      moveProject(distanceX < 0 ? 1 : -1)
    }
  }

  return (
    <SectionShell id="projects">
      <SectionHeader
        index="04"
        title="Projects"
        meta={status === 'loading' ? 'Memuat karya' : `${visibleProjects.length} karya terpilih`}
        description={siteMeta.sectionDescriptions.projects}
      />

      <BentoGrid>
        {status === 'loading' ? (
          <BentoCell span="sm:col-span-2 lg:col-span-3" tone="card" pad="lg">
            <p className="label-mono text-ink-soft">Memuat proyek...</p>
          </BentoCell>
        ) : null}

        {status === 'ready' && visibleProjects.length === 0 ? (
          <BentoCell span="sm:col-span-2 lg:col-span-3" tone="card" pad="lg">
            <h3 className="text-xl">Belum ada proyek terbit</h3>
            <p className="mt-2 text-sm text-ink-soft">Karya baru akan muncul di sini setelah dipublikasikan.</p>
          </BentoCell>
        ) : null}

        {status === 'error' ? (
          <BentoCell span="sm:col-span-2 lg:col-span-3" tone="card" pad="lg">
            <h3 className="text-xl">Proyek belum dapat dimuat</h3>
            <p className="mt-2 text-sm text-ink-soft">Coba muat ulang halaman beberapa saat lagi.</p>
          </BentoCell>
        ) : null}

        {activeProject && projectCount > 1 ? <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-[3px] border-ink bg-paper-2 p-3 sm:col-span-2 lg:col-span-3" aria-label="Kontrol slider proyek">
          <p className="font-mono text-xs font-bold uppercase" aria-live="polite" aria-atomic="true">Proyek {currentIndex + 1} / {projectCount}: {activeProject.name}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => moveProject(-1)} aria-label="Proyek sebelumnya" className="border-2 border-ink bg-card px-3 py-1.5 font-mono text-sm font-bold hover:bg-acid">←</button>
            <div className="flex flex-wrap justify-center gap-1.5" aria-label="Pilih proyek">
              {visibleProjects.map((project, index) => <button key={project.id} type="button" onClick={() => goToProject(index)} aria-label={`Lihat proyek ${index + 1}: ${project.name}`} aria-current={currentIndex === index ? 'true' : undefined} className={`h-3 w-3 border-2 border-ink ${currentIndex === index ? 'bg-flag' : 'bg-card hover:bg-acid'}`} />)}
            </div>
            <button type="button" onClick={() => moveProject(1)} aria-label="Proyek berikutnya" className="border-2 border-ink bg-card px-3 py-1.5 font-mono text-sm font-bold hover:bg-acid">→</button>
          </div>
        </div> : null}

        {/* ================= SATU PROYEK PER SLIDE ================= */}
        {activeProject ? <div role="region" aria-roledescription="carousel" aria-label="Proyek portofolio" tabIndex={projectCount > 1 ? 0 : undefined} onKeyDown={onProjectKeyDown} onTouchStart={onProjectTouchStart} onTouchEnd={onProjectTouchEnd} className={`min-w-0 outline-none focus-visible:ring-4 focus-visible:ring-azure ${p.featured ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
          <div key={p.id} className={slideDirection > 0 ? 'swap-next' : 'swap-prev'}>
          {p.featured ? (
          <BentoCell
            key={p.id}
            tone={currentIndex % 2 === 0 ? 'card' : 'paper2'}
            pad="none"
            hover
            reveal={false}
          >
            {/* kepala kartu */}
            <div className="flex flex-col gap-3 border-b-[3px] border-ink px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 min-w-8 items-center justify-center border-[3px] border-ink bg-acid px-1 font-mono text-[0.6875rem] font-bold">
                  {p.index}
                </span>
                <div>
                  <h3 className="font-display text-xl leading-none uppercase sm:text-2xl">
                    {p.name}
                  </h3>
                  <p className="mt-1 font-mono text-[0.625rem] tracking-[0.12em] text-ink-soft uppercase">
                    {p.kind}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {p.featured ? <Tag tone="flag">Unggulan</Tag> : null}
                <Tag tone="soft">{p.year}</Tag>
              </div>
            </div>

            <ProjectGallery images={p.images} title={p.name} wide />

            <div className={`grid grid-cols-1 gap-5 p-4 sm:p-5 ${p.impact.length || p.links.length ? 'lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]' : ''}`}>
              {/* kolom narasi */}
              <div>
                <p className="text-sm leading-relaxed sm:text-[0.9375rem]">
                  {p.description}
                </p>

                <ProjectStory problem={p.problem} solution={p.solution} />

                {p.metrics ? <p className="mt-4 border-l-[3px] border-acid-deep pl-3 font-mono text-xs font-bold leading-relaxed uppercase">{p.metrics}</p> : null}

                {p.stack.length > 0 ? <div className="mt-4">
                  <span className="label-mono text-ink-soft">Tech Stack</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                </div> : null}
              </div>

              {/* kolom dampak + tautan */}
              {p.impact.length || p.links.length ? <aside className="flex flex-col gap-4 border-t-[3px] border-ink pt-4 lg:border-t-0 lg:border-l-[3px] lg:pt-0 lg:pl-5">
                {p.impact.length > 0 ? <div>
                  <span className="label-mono text-ink-soft">Dampak</span>
                  <dl className="mt-2 divide-y-2 divide-ink/15 border-2 border-ink">
                    {p.impact.map((m) => (
                      <div key={m.k} className="flex items-baseline justify-between gap-3 bg-paper px-3 py-2">
                        <dt className="font-mono text-[0.625rem] tracking-wide text-ink-soft uppercase">
                          {m.k}
                        </dt>
                        <dd className="font-display text-base leading-none sm:text-lg">
                          {m.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div> : null}

                {p.links.length > 0 ? <div className="mt-auto flex flex-wrap gap-2">
                  {p.links.map((l) => (
                    <BrutalButton
                      key={l.label}
                      href={l.href}
                      variant={l.label === 'Live Demo' ? 'acid' : 'outline'}
                      size="sm"
                      icon="↗"
                    >
                      {l.label}
                    </BrutalButton>
                  ))}
                </div> : null}
              </aside> : null}
            </div>
          </BentoCell>
          ) : (
          <BentoCell
            key={p.id}
            tone={currentIndex % 2 === 0 ? 'card' : 'paper2'}
            pad="md"
            hover
            reveal={false}
            className="flex flex-col"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-[0.6875rem] font-bold text-flag-text">{p.index}</span>
              <Tag tone="soft">{p.year}</Tag>
            </div>
            <h3 className="mt-2 font-display text-lg leading-tight uppercase">{p.name}</h3>
            <p className="label-mono mt-1 text-ink-soft">{p.kind}</p>

            {p.images.length > 0 ? <div className="mt-3 border-2 border-ink"><ProjectGallery images={p.images} title={p.name} /></div> : null}

            <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-soft">{p.description}</p>
            <ProjectStory problem={p.problem} solution={p.solution} compact />

            {p.metrics ? <p className="mt-3 border-l-[3px] border-acid-deep pl-2.5 font-mono text-[0.625rem] leading-snug font-bold tracking-wide uppercase">{p.metrics}</p> : null}

            {p.impact.length > 0 ? <div className="mt-3 border-t-2 border-ink/20 pt-3">
              <span className="label-mono text-ink-soft">Dampak</span>
              <dl className="mt-2 space-y-1">
                {p.impact.map((item) => <div key={item.k} className="flex flex-wrap items-baseline justify-between gap-x-3 border border-ink/30 bg-paper px-2.5 py-1.5 text-xs">
                  <dt className="text-ink-soft">{item.k}</dt>
                  <dd className="font-mono font-bold">{item.v}</dd>
                </div>)}
              </dl>
            </div> : null}

            {p.stack.length > 0 ? <div className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.slice(0, 3).map((item) => <Tag key={item} tone="outline">{item}</Tag>)}
              {p.stack.length > 3 ? <Tag tone="soft">+{p.stack.length - 3}</Tag> : null}
            </div> : null}

            {p.links.length > 0 ? <div className="mt-auto flex flex-wrap gap-2 pt-4">
              {p.links.map((link) => <a key={link.label} href={link.href} className="group inline-flex items-center gap-1.5 border-2 border-ink px-2.5 py-1 font-mono text-[0.625rem] font-bold tracking-[0.12em] uppercase transition-colors duration-150 hover:bg-acid">
                {link.label}<span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>)}
            </div> : null}
          </BentoCell>
          )}
          </div>
        </div> : null}

        {/* ================= KARTU ARSIP ================= */}
        {visibleProjects.length > 0 ? <BentoCell tone="flag" span="lg:col-span-2" pad="md" hover className="flex flex-col justify-between gap-4">
          <div>
            <span className="label-mono">Arsip</span>
            <h3 className="mt-2 font-display text-xl leading-tight uppercase sm:text-2xl">
              {siteMeta.projectArchive.heading}
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-on-flag">
              {siteMeta.projectArchive.description}
            </p>
          </div>
          <div>
            <BrutalButton href={siteMeta.projectArchive.href} variant="ink" size="md" icon="↗">
              {siteMeta.projectArchive.buttonLabel}
            </BrutalButton>
          </div>
        </BentoCell> : null}

        {/* ================= KARTU PROSES ================= */}
        {visibleProjects.length > 0 ? <BentoCell tone="ink" pad="md" hover className="flex flex-col">
          <span className="label-mono text-acid-text">Proses kerja</span>
          <ol className="mt-3 space-y-2.5">
            {siteMeta.projectProcess.map(
              (step, i) => (
                <li key={step} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border-2 border-paper/40 font-mono text-[0.5625rem] font-bold text-acid-text">
                    {i + 1}
                  </span>
                  <span className="font-mono text-[0.6875rem] tracking-wide text-paper/85 uppercase">
                    {step}
                  </span>
                </li>
              ),
            )}
          </ol>
        </BentoCell> : null}
      </BentoGrid>
    </SectionShell>
  )
}
