import { lazy, StrictMode, Suspense, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ContentProvider } from './contexts/ContentContext.jsx'

const AdminDashboard = lazy(() => import('./admin/AdminDashboard.jsx'))

function Root() {
  const [adminRoute, setAdminRoute] = useState(() => window.location.hash === '#/admin')

  useEffect(() => {
    const syncRoute = () => setAdminRoute(window.location.hash === '#/admin')
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    if (adminRoute || !window.location.hash.startsWith('#')) return undefined
    const sectionId = window.location.hash.slice(1)
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [adminRoute])

  return adminRoute ? (
    <Suspense fallback={<div className="min-h-screen bg-paper p-8 font-mono text-ink">Memuat dashboard...</div>}>
      <AdminDashboard />
    </Suspense>
  ) : <ContentProvider><App /></ContentProvider>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
