import { useState } from 'react'
import { useContent } from '../contexts/ContentContext'
import BentoCell from '../components/BentoCell'
import BrutalButton from '../components/BrutalButton'
import SectionHeader from '../components/SectionHeader'
import Tag from '../components/Tag'
import { BentoGrid, SectionShell } from '../components/Primitives'

/**
 * ==========================================================================
 *  07 / CONTACT — ajakan kolaborasi, kanal langsung, layanan, FAQ
 * ==========================================================================
 */
export default function Contact() {
  const { contact, profile, siteMeta } = useContent()
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API ditolak (mis. konteks tidak aman) — abaikan diam-diam
      setCopied(false)
    }
  }

  return (
    <SectionShell id="contact">
      <SectionHeader
        index="07"
        title="Contact"
        meta={profile.timezone}
        description={siteMeta.sectionDescriptions.contact}
      />

      <BentoGrid>
        {/* ================= AJAKAN UTAMA ================= */}
        <BentoCell
          tone="acid"
          span="sm:col-span-2 lg:col-span-2"
          pad="lg"
          hover
          data-spotlight
          className="bg-halftone"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="flag">
              <span className="blink mr-1.5 inline-block h-1.5 w-1.5 bg-on-flag align-middle" />
              {profile.availability}
            </Tag>
            <Tag tone="ink">{profile.location}</Tag>
          </div>

          <h3 className="mt-4 font-display text-[2rem] leading-[0.9] uppercase sm:text-4xl lg:text-5xl">
            {contact.heading}
          </h3>

          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed sm:text-[0.9375rem]">
            {contact.body}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <BrutalButton
              href={`mailto:${profile.email}?subject=${encodeURIComponent(
                `Halo ${profile.firstName} — saya punya proyek`,
              )}`}
              variant="ink"
              size="lg"
              icon="→"
            >
              {contact.emailCta}
            </BrutalButton>
            <BrutalButton href={profile.resumeUrl} variant="outline" size="lg" icon="↓">
              Unduh CV
            </BrutalButton>
          </div>
        </BentoCell>

        {/* ================= KANAL LANGSUNG ================= */}
        <BentoCell tone="ink" pad="none" hover variant="right" delay={80} className="self-start">
          <div className="border-b-[3px] border-paper/25 px-4 py-2">
            <span className="label-mono text-acid-text">Kanal langsung</span>
          </div>

          {/* email + tombol salin */}
          <div className="border-b-2 border-paper/12 px-4 py-3">
            <span className="label-mono text-paper/70">Email</span>
            <div className="mt-1.5 flex items-center gap-2">
              <a
                href={`mailto:${profile.email}`}
                className="min-w-0 flex-1 truncate font-mono text-[0.6875rem] font-bold text-paper underline decoration-acid-text decoration-2 underline-offset-4 hover:text-acid-text sm:text-xs"
              >
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Salin alamat email"
                className="shrink-0 border-2 border-paper/35 px-2 py-1 font-mono text-[0.5625rem] font-bold tracking-wider text-paper uppercase transition-colors duration-150 hover:border-acid hover:bg-acid hover:text-ink"
              >
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          </div>

          <div className="border-b-2 border-paper/12 px-4 py-3">
            <span className="label-mono text-paper/70">Telepon / WhatsApp</span>
            <a
              href={`tel:${profile.phone.replace(/\s/g, '')}`}
              className="mt-1.5 block font-mono text-[0.6875rem] font-bold text-paper hover:text-acid-text sm:text-xs"
            >
              {profile.phone}
            </a>
          </div>

          <div className="px-4 py-3">
            <span className="label-mono text-paper/70">Respons</span>
            <p className="mt-1.5 font-mono text-[0.6875rem] leading-snug text-paper/80">
              {profile.statusNote}
            </p>
          </div>
        </BentoCell>

        {/* ================= LAYANAN ================= */}
        <BentoCell tone="card" span="sm:col-span-2 lg:col-span-2" pad="lg" hover>
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
            <span className="label-mono text-flag-text">Yang bisa saya kerjakan</span>
            <span className="label-mono text-ink-soft">
              {String(contact.services.length).padStart(2, '0')} layanan
            </span>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contact.services.map((s, i) => (
              <li
                key={s.t}
                className="group border-[3px] border-ink bg-paper p-3 transition-all duration-150 hover:-translate-y-[2px] hover:bg-acid hover:shadow-[4px_4px_0_0_var(--color-ink)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.625rem] font-bold text-flag-text group-hover:text-ink">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 border-2 border-ink bg-transparent transition-colors group-hover:bg-ink"
                  />
                </div>
                <h4 className="mt-2 font-display text-[0.9375rem] leading-tight uppercase">
                  {s.t}
                </h4>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft group-hover:text-ink/75">
                  {s.d}
                </p>
              </li>
            ))}
          </ul>
        </BentoCell>

        {/* ================= MEDIA SOSIAL ================= */}
        <BentoCell tone="paper2" pad="none" hover>
          <div className="border-b-[3px] border-ink px-4 py-2">
            <span className="label-mono text-flag-text">Temui saya di</span>
          </div>

          <ul>
            {profile.socials.map((s, i) => (
              <li
                key={s.label}
                className={i < profile.socials.length - 1 ? 'border-b-2 border-ink/10' : ''}
              >
                <a
                  href={s.href}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-acid"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[0.875rem] leading-none uppercase">
                      {s.label}
                    </span>
                    <span className="mt-1 block truncate font-mono text-[0.625rem] text-ink-soft">
                      {s.handle}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-ink-soft transition-transform duration-150 group-hover:translate-x-1 group-hover:text-ink"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </BentoCell>

        {/* ================= FAQ ================= */}
        <BentoCell
          tone="card"
          span="sm:col-span-2 lg:col-span-3"
          pad="none"
          hover={false}
          delay={60}
        >
          <div className="flex items-center justify-between border-b-[3px] border-ink px-4 py-2 sm:px-5">
            <span className="label-mono text-flag-text">Pertanyaan yang sering masuk</span>
            <span className="label-mono text-ink-soft">FAQ</span>
          </div>

          <ul className="divide-y-2 divide-ink/12">
            {contact.faq.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <li key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-acid/40 sm:px-5"
                  >
                    <span className="shrink-0 font-mono text-[0.625rem] font-bold text-flag-text">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1 font-display text-[0.875rem] leading-tight uppercase sm:text-base">
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={[
                        'flex h-6 w-6 shrink-0 items-center justify-center border-[3px] border-ink font-mono text-xs font-bold transition-all duration-200',
                        isOpen ? 'rotate-45 bg-acid' : 'bg-card',
                      ].join(' ')}
                    >
                      +
                    </span>
                  </button>

                  {/* panel jawaban: grid-template-rows untuk transisi tinggi mulus */}
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="border-l-[3px] border-acid-deep px-4 pb-4 pl-5 text-[0.8125rem] leading-relaxed text-ink-soft sm:px-5 sm:pl-11">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </BentoCell>
      </BentoGrid>
    </SectionShell>
  )
}
