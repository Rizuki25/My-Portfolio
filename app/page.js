"use client";

import { useEffect, useState } from "react";
import { getPortfolioAssetUrl, getSupabaseBrowserClient } from "../lib/supabase/browser";

const skills = [
  { title: "Core engineering", items: ["Systems thinking", "Design review", "Root-cause analysis", "FMEA"] },
  { title: "Tools & methods", items: ["SolidWorks", "MATLAB", "Python", "Lean / Six Sigma"] },
  { title: "Working style", items: ["Field-first", "Clear documentation", "Calm under pressure", "Mentoring"] },
];

const experiences = [
  { period: "2023 — now", role: "Process Improvement Engineer", company: "Nusantara Manufacturing", copy: "Own continuous improvement across two production lines, partnering with operators to make better work easier to do." },
  { period: "2021 — 2023", role: "Product Development Engineer", company: "Arcform Labs", copy: "Took early-stage hardware concepts through design reviews, prototyping, testing, and supplier handoff." },
  { period: "2020 — 2021", role: "Engineering Intern", company: "PT Karya Teknik", copy: "Built a foundation in drawing standards, shop-floor problem solving, and the discipline of good documentation." },
];

const projects = [
  { tone: "amber", type: "Manufacturing systems", title: "Line 04 / less friction", copy: "Reworked a high-mix assembly cell into a visual, measurable system—cutting changeover time by 31%.", tags: ["Process design", "Time study", "-31% changeover"] },
  { tone: "mint", type: "Energy & monitoring", title: "Gridwatch / live signals", copy: "A lightweight energy dashboard that turns machine-level data into decisions the floor team can act on.", tags: ["Python", "IoT", "Realtime dashboard"] },
  { tone: "violet", type: "Product development", title: "Aero housing / made lighter", copy: "Led the redesign of a protective enclosure from first sketch to pilot run without losing serviceability.", tags: ["CAD", "DFMA", "-18% mass"] },
];

const certificates = [
  { tone: "gold", code: "LSS-G", title: "Lean Six Sigma Green Belt", issuer: "IASSC · 2024" },
  { tone: "blue", code: "CAD-P", title: "Professional CAD Specialist", issuer: "Dassault Systèmes · 2023" },
  { tone: "red", code: "PMP-F", title: "Project Fundamentals", issuer: "PMI · 2022" },
];

const profile = {
  full_name: "Fahzri Rizqie",
  role_label: "engineer",
  hero_kicker: "Engineering with intent.",
  hero_title: "Making complex",
  hero_emphasis: "systems feel simple.",
  bio: "I'm Fahzri, an engineer who turns messy constraints into clear systems, better products, and work that holds up in the real world.",
  about_text: "Whether I'm on the factory floor or inside a design review, I look for the signal beneath the noise—and build from there.",
  email: "hello@fahzri.engineer",
  location: "Bandung, Indonesia",
  photo_path: "",
};

const education = [{ period: "2016 — 2020", degree: "Bachelor of Mechanical Engineering", institution: "Institut Teknologi Bandung", detail: "GPA 3.72 / 4.00 · Focus: product design, manufacturing systems, materials" }];
const achievements = [{ metric: "31%", description: "faster changeovers", context: "Line 04, 2024" }, { metric: "18%", description: "lighter enclosure", context: "Aero housing, 2023" }, { metric: "1st", description: "campus design challenge", context: "National finalist, 2019" }];
const navigationItems = [
  { id: "about", label: "About", number: "01" },
  { id: "experience", label: "Experience", number: "03" },
  { id: "projects", label: "Projects", number: "04" },
  { id: "contact", label: "Contact", number: "08" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [themeReady, setThemeReady] = useState(false);
  const [activeMenu, setActiveMenu] = useState("about");
  const [isMenuTransitioning, setIsMenuTransitioning] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [portfolioSkills, setPortfolioSkills] = useState(skills);
  const [portfolioExperiences, setPortfolioExperiences] = useState(experiences);
  const [portfolioProjects, setPortfolioProjects] = useState(projects);
  const [portfolioCertificates, setPortfolioCertificates] = useState(certificates);
  const [portfolioProfile, setPortfolioProfile] = useState(profile);
  const [portfolioEducation, setPortfolioEducation] = useState(education);
  const [portfolioAchievements, setPortfolioAchievements] = useState(achievements);
  const email = portfolioProfile.email || profile.email;

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(savedTheme || systemTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme, themeReady]);

  useEffect(() => {
    const sections = navigationItems.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting);
      if (visibleSection) setActiveMenu(visibleSection.target.id);
    }, { rootMargin: "-42% 0px -48% 0px", threshold: 0 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    async function loadPortfolio() {
      const [profileResult, skillsResult, experiencesResult, projectsResult, certificatesResult, educationResult, achievementsResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("profile_key", "main").eq("is_published", true).maybeSingle(),
        supabase.from("skill_groups").select("title, items, sort_order").eq("is_published", true).order("sort_order"),
        supabase.from("experiences").select("start_label, role, company, description, sort_order").eq("is_published", true).order("sort_order"),
        supabase.from("projects").select("accent, category, title, summary, tags, image_path, case_study_url, sort_order").eq("is_published", true).order("sort_order"),
        supabase.from("certificates").select("accent, code, title, issuer, issued_year, image_path, credential_url, sort_order").eq("is_published", true).order("sort_order"),
        supabase.from("education").select("institution, degree, period_label, detail, sort_order").eq("is_published", true).order("sort_order"),
        supabase.from("achievements").select("metric, description, context, sort_order").eq("is_published", true).order("sort_order"),
      ]);

      if (!profileResult.error && profileResult.data) {
        setPortfolioProfile({ ...profile, ...profileResult.data, photo_url: getPortfolioAssetUrl(profileResult.data.photo_path) });
      }
      if (!skillsResult.error && skillsResult.data?.length) {
        setPortfolioSkills(skillsResult.data.map(({ title, items }) => ({ title, items })));
      }
      if (!experiencesResult.error && experiencesResult.data?.length) {
        setPortfolioExperiences(experiencesResult.data.map(({ start_label, role, company, description }) => ({ period: start_label, role, company, copy: description })));
      }
      if (!projectsResult.error && projectsResult.data?.length) {
        setPortfolioProjects(projectsResult.data.map(({ accent, category, title, summary, tags, image_path, case_study_url }) => ({ tone: accent, type: category, title, copy: summary, tags, imageUrl: getPortfolioAssetUrl(image_path), url: case_study_url })));
      }
      if (!certificatesResult.error && certificatesResult.data?.length) {
        setPortfolioCertificates(certificatesResult.data.map(({ accent, code, title, issuer, issued_year, image_path, credential_url }) => ({ tone: accent, code, title, issuer: `${issuer} · ${issued_year}`, imageUrl: getPortfolioAssetUrl(image_path), url: credential_url })));
      }
      if (!educationResult.error && educationResult.data?.length) {
        setPortfolioEducation(educationResult.data.map(({ institution, degree, period_label, detail }) => ({ institution, degree, period: period_label, detail })));
      }
      if (!achievementsResult.error && achievementsResult.data?.length) {
        setPortfolioAchievements(achievementsResult.data);
      }
    }

    loadPortfolio();
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
  }

  function navigateToMenu(event, id) {
    event?.preventDefault();
    closeMenu();
    setActiveMenu(id);
    setIsMenuTransitioning(true);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    window.setTimeout(() => setIsMenuTransitioning(false), 780);
  }

  function moveCarousel(direction) {
    const currentIndex = navigationItems.findIndex((item) => item.id === activeMenu);
    const nextIndex = (currentIndex + direction + navigationItems.length) % navigationItems.length;
    navigateToMenu(null, navigationItems[nextIndex].id);
  }

  const activeMenuIndex = Math.max(0, navigationItems.findIndex((item) => item.id === activeMenu));
  const activeMenuItem = navigationItems[activeMenuIndex];

  return (
    <div className="site-shell" id="top">
      <header className="topbar">
        <a className="brand" href="#top"><span className="brand-mark">F</span><span>Fahzri / Eng.</span></a>
        <button className={`menu-toggle${menuOpen ? " is-open" : ""}`} type="button" aria-expanded={menuOpen} aria-controls="main-nav" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span><span></span></button>
        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} id="main-nav" aria-label="Main navigation">
          {navigationItems.map((item) => <a className={activeMenu === item.id ? "is-current" : ""} href={`#${item.id}`} onClick={(event) => navigateToMenu(event, item.id)} key={item.id}>{item.label}</a>)}<a className="nav-cta" href="#contact" onClick={(event) => navigateToMenu(event, "contact")}>Let&apos;s talk <span>↗</span></a><button className={`theme-switch${theme === "dark" ? " is-dark" : ""}`} type="button" onClick={toggleTheme} aria-pressed={theme === "dark"} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}><span className="theme-icon theme-sun" aria-hidden="true">☼</span><span className="theme-thumb" aria-hidden="true"></span><span className="theme-icon theme-moon" aria-hidden="true">☾</span></button>
        </nav>
      </header>

      <div className={`menu-wipe${isMenuTransitioning ? " is-active" : ""}`} aria-hidden="true"><div className="menu-wipe-panel menu-wipe-panel-left"></div><div className="menu-wipe-panel menu-wipe-panel-right"></div><p><span>{activeMenuItem.number}</span> {activeMenuItem.label}</p></div>
      <aside className="section-carousel" aria-label="Section carousel navigation"><button type="button" onClick={() => moveCarousel(-1)} aria-label="Previous section">←</button><div className="carousel-window"><div className="carousel-track" style={{ transform: `translateX(-${activeMenuIndex * 100}%)` }}>{navigationItems.map((item) => <button type="button" className="carousel-slide" onClick={(event) => navigateToMenu(event, item.id)} key={item.id}><span>{item.number} / 08</span><strong>{item.label}</strong></button>)}</div></div><button type="button" onClick={() => moveCarousel(1)} aria-label="Next section">→</button></aside>

      <main>
        <section className="hero">
          <div className="hero-copy reveal-up">
            <div className="eyebrow"><span className="status-dot"></span> available for select projects <span className="eyebrow-line"></span></div>
            <p className="hero-kicker">{portfolioProfile.hero_kicker}</p>
            <h1>{portfolioProfile.hero_title}<br /><em>{portfolioProfile.hero_emphasis}</em></h1>
            <p className="hero-intro">{portfolioProfile.bio}</p>
            <div className="hero-actions"><a className="button button-primary" href="#projects">View selected work <span>↘</span></a><a className="text-link" href="#about">More about me <span>↓</span></a></div>
          </div>
          <div className={`hero-visual reveal-up reveal-delay${portfolioProfile.photo_url ? " has-profile-image" : ""}`} aria-label="Profile photo">
            <div className="portrait-grid"></div><div className={`portrait-photo${portfolioProfile.photo_url ? " has-profile-image" : ""}`}>{portfolioProfile.photo_url && <img src={portfolioProfile.photo_url} alt={`Portrait of ${portfolioProfile.full_name}`} />}<div className="portrait-scanline"></div><div className="portrait-initials">{portfolioProfile.full_name.split(" ").map((name) => name[0]).slice(0, 2).join("")}</div>{!portfolioProfile.photo_url && <div className="portrait-label">your portrait<br /><span>replace / 4:5</span></div>}</div>
            <div className="visual-note note-top">01 — profile / 2026</div><div className="visual-note note-bottom">precision / curiosity / care</div><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          </div>
          <div className="hero-meta"><span>Scroll to explore</span><span className="scroll-line"></span><span>03 / 08</span></div>
        </section>

        <section className="statement-section" id="about"><div className="section-marker">01 / about</div><div className="statement-content"><p className="section-kicker">The short version</p><h2>Good engineering is a conversation between <span>people, materials, and time.</span></h2><div className="statement-bottom"><p>{portfolioProfile.about_text}</p><div className="signature">{portfolioProfile.full_name} <span>— {portfolioProfile.role_label}</span></div></div></div></section>

        <section className="section-block" id="skills"><div className="section-heading-row"><div><div className="section-marker">02 / capabilities</div><h2>What I bring<br /><span>to the table.</span></h2></div><p className="heading-aside">A balanced toolkit for the moments when the answer isn&apos;t in the manual yet.</p></div><div className="skills-grid">
          {portfolioSkills.map((skill, index) => <article className="skill-card" key={skill.title}><div className="card-index">{String(index + 1).padStart(2, "0")}</div><h3>{skill.title}</h3><ul>{skill.items.map((item) => <li key={item}><span>+</span>{item}</li>)}</ul></article>)}
        </div></section>

        <section className="experience-section section-block" id="experience"><div className="section-heading-row"><div><div className="section-marker">03 / experience</div><h2>Where I&apos;ve<br /><span>done the work.</span></h2></div><span className="side-label">A timeline of useful problems.</span></div><div className="timeline">
          {portfolioExperiences.map((experience, index) => <article className="timeline-item" key={experience.role}><div className="timeline-index">{String.fromCharCode(65 + index)}</div><div className="timeline-period">{experience.period}</div><div className="timeline-role"><h3>{experience.role}</h3><p>{experience.company}</p></div><p className="timeline-copy">{experience.copy}</p><span className="timeline-arrow">↗</span></article>)}
        </div></section>

        <section className="section-block" id="projects"><div className="section-heading-row"><div><div className="section-marker">04 / selected work</div><h2>Built to be<br /><span>used.</span></h2></div><p className="heading-aside">A few systems, products, and experiments I&apos;m proud to have moved forward.</p></div><div className="projects-grid">
          {portfolioProjects.map((project, index) => <article className={`project-card project-${project.tone}`} key={project.title}><div className="project-art">{project.imageUrl && <img className="project-image" src={project.imageUrl} alt={project.title} />}<span className="project-number">{String(index + 1).padStart(2, "0")}</span><span className="art-cross">+</span><div className="art-bars"><i></i><i></i><i></i><i></i></div><div className="art-ring"></div></div><div className="project-copy"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p>{project.copy}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><a className="project-link" href={project.url || "#contact"} target={project.url ? "_blank" : undefined} rel={project.url ? "noreferrer" : undefined}>View case study <span>↗</span></a></article>)}
        </div></section>

        <section className="section-block cert-section" id="certificates"><div className="section-heading-row"><div><div className="section-marker">05 / proof of practice</div><h2>Always learning.<br /><span>Quietly consistent.</span></h2></div><p className="heading-aside">Selected certificates that support the work—not replace the work.</p></div><div className="cert-grid">
          {portfolioCertificates.map((certificate) => <article className="certificate-card" key={certificate.code}><div className={`certificate-image certificate-${certificate.tone}`}>{certificate.imageUrl && <img className="certificate-asset" src={certificate.imageUrl} alt={certificate.title} />}<span className="cert-stamp">verified</span><span className="cert-code">{certificate.code}</span><span className="cert-seal">✦</span><span className="cert-caption">CERTIFICATE<br />OF COMPLETION</span></div><div className="certificate-meta"><h3>{certificate.title}</h3><p>{certificate.issuer}</p></div></article>)}
        </div></section>

        <section className="section-block edu-section" id="education"><div className="section-marker">06 / education</div><div className="edu-layout"><div><h2>Built on a<br /><span>solid base.</span></h2><p className="edu-note">The discipline of engineering started in the classroom—and got better everywhere else.</p></div><div>{portfolioEducation.map((record) => <div className="education-record" key={`${record.institution}-${record.degree}`}><span className="record-year">{record.period}</span><h3>{record.degree}</h3><p>{record.institution}</p><div className="record-line"></div><span className="record-detail">{record.detail}</span></div>)}</div></div></section>

        <section className="section-block achievement-section" id="achievements"><div className="section-marker">07 / achievements</div><div className="achievement-layout"><div><h2>Small wins<br /><span>compound.</span></h2></div><div className="achievement-list">{portfolioAchievements.map((achievement) => <div key={`${achievement.metric}-${achievement.description}`}><strong>{achievement.metric}</strong><p>{achievement.description}<br /><span>{achievement.context}</span></p></div>)}</div></div></section>
      </main>

      <section className="contact-section" id="contact"><div className="contact-orb orb-left"></div><div className="contact-orb orb-right"></div><div className="section-marker light-marker">08 / contact</div><div className="contact-content"><p className="section-kicker">Have a problem worth solving?</p><h2>Let&apos;s make<br /><em>something useful.</em></h2><p className="contact-copy">Tell me what you&apos;re working on, where it&apos;s stuck, or where you want it to go. I&apos;ll bring a notebook.</p><div className="contact-actions"><a className="button button-light" href={`mailto:${email}`}>Start a conversation <span>↗</span></a><button className="copy-email" type="button" onClick={copyEmail}>{emailCopied ? "Email copied ✓" : email}</button></div></div><footer className="site-footer"><span>© 2026 {portfolioProfile.full_name}</span><span>{portfolioProfile.location}</span><a href="#top">Back to top ↑</a></footer></section>
    </div>
  );
}
