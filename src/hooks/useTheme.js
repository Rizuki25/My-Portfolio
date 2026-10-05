import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio-theme'

/** Baca kelas `.dark` yang sudah dipasang skrip anti-flash di index.html */
function getInitialTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Toggle dark/light. Kelas `dark` dipasang di <html>, lalu disimpan ke
 * localStorage supaya pilihan pengguna bertahan antar kunjungan.
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')

    // Ikuti warna chrome browser / address bar di mobile
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#211f1d' : '#f7ede5')

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* localStorage diblokir (private mode) — abaikan saja */
    }
  }, [theme])

  const toggle = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  )

  return { theme, isDark: theme === 'dark', toggle }
}
