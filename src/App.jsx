import NavBar from './components/NavBar'
import Footer from './components/Footer'

import Home from './sections/Home'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Education from './sections/Education'
import Contact from './sections/Contact'

import { useTheme } from './hooks/useTheme'
import { useReveal } from './hooks/useReveal'

/**
 * ==========================================================================
 *  PORTFOLIO — Bento Grid / Neo-Brutalist Tech Editorial
 * ==========================================================================
 *  Alur halaman sengaja portrait: satu kolom sempit yang mengalir lurus
 *  dari atas ke bawah (01 Home → 07 Contact). Pada layar besar, tiap
 *  section melebar jadi bento 2–3 kolom tanpa mengubah urutannya.
 */
export default function App() {
  const { theme, toggle } = useTheme()

  // Pasang IntersectionObserver ke semua elemen .reveal setelah render pertama
  useReveal()

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      {/* tautan lompat untuk pengguna keyboard / pembaca layar */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:border-[3px] focus:border-ink focus:bg-acid focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:tracking-widest focus:uppercase"
      >
        Lompat ke konten
      </a>

      <NavBar theme={theme} onToggleTheme={toggle} />

      <main
        id="main"
        className="mx-auto w-full max-w-md px-3 pb-4 sm:max-w-3xl sm:px-5 lg:max-w-6xl"
      >
        <Home />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
