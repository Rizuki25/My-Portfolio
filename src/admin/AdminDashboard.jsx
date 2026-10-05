import { useCallback, useEffect, useMemo, useState } from 'react'
import { contentGroups, hydrateLike } from '../data/contentGroups'
import { useTheme } from '../hooks/useTheme'
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient'
import ProjectEditor from './ProjectEditor'
import SectionEditor from './SectionEditor'
import { PROJECT_COLUMNS } from './projectForm'

const panelClass = 'border-[3px] border-ink bg-card shadow-[5px_5px_0_0_var(--color-ink)]'
const actionClass = 'border-2 border-ink bg-acid px-4 py-2.5 font-mono text-[0.6875rem] font-bold tracking-wider uppercase transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5'
const dashboardTabs = [
  ...contentGroups.slice(0, 4),
  { key: 'projects', label: 'Projects', description: 'Proyek, draft, dan publikasi.' },
  ...contentGroups.slice(4),
]

function DashboardFrame({ theme, onToggleTheme, children }) {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <header className="border-b-[3px] border-ink bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <span className="flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-acid font-display text-sm">P/</span>
          <div>
            <p className="font-display text-sm leading-none uppercase sm:text-base">Portfolio Studio</p>
            <p className="mt-1 font-mono text-[0.5625rem] tracking-widest text-ink-soft uppercase">Admin / Content</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a href="#projects" className="border-2 border-ink bg-paper px-3 py-2 font-mono text-[0.625rem] font-bold tracking-wider uppercase hover:bg-acid">Lihat situs ↗</a>
            <button type="button" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'} className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-paper hover:bg-acid">{theme === 'dark' ? '☀' : '☾'}</button>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}

function LoginForm({ onLogin, busy, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await onLogin(email.trim(), password)
    if (success) setPassword('')
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-70px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <div>
        <span className="label-mono border-l-4 border-flag pl-3 text-flag-text">Akses pengelola</span>
        <h1 className="mt-5 max-w-xl font-display text-4xl leading-[0.95] uppercase sm:text-6xl">Karya baru dimulai di sini.</h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">Kelola identitas, cerita, pengalaman, proyek, keahlian, pendidikan, dan kontak dari satu tempat.</p>
        <div className="mt-8 grid max-w-md grid-cols-3 gap-2">
          {['Tulis', 'Tinjau', 'Terbitkan'].map((step, index) => (
            <div key={step} className={`border-2 border-ink px-3 py-3 ${index === 1 ? 'bg-paper-2' : index === 2 ? 'bg-flag text-on-flag' : 'bg-acid'}`}>
              <span className="block font-mono text-[0.625rem] font-bold">0{index + 1}</span>
              <span className="mt-2 block font-display text-xs uppercase sm:text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`${panelClass} p-6 sm:p-8`}>
        <p className="label-mono text-flag-text">Login admin</p>
        <h2 className="mt-3 font-display text-2xl uppercase sm:text-3xl">Masuk ke studio</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">Gunakan akun Supabase Auth yang telah diberi akses admin.</p>
        <label htmlFor="admin-email" className="label-mono mt-8 block text-ink-soft">Email</label>
        <input id="admin-email" type="email" autoComplete="username" required className="mt-2 w-full border-2 border-ink bg-paper px-3 py-3 text-sm" placeholder="anda@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="admin-password" className="label-mono mt-5 block text-ink-soft">Password</label>
        <input id="admin-password" type="password" autoComplete="current-password" required className="mt-2 w-full border-2 border-ink bg-paper px-3 py-3 text-sm" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error ? <p role="alert" className="mt-5 border-2 border-flag bg-paper p-3 text-sm">{error}</p> : null}
        <button type="submit" disabled={busy} className={`${actionClass} mt-7 w-full py-3 disabled:cursor-wait disabled:opacity-60`}>{busy ? 'Memeriksa...' : 'Masuk →'}</button>
        <p className="mt-5 font-mono text-[0.625rem] leading-relaxed text-ink-soft">Akses menulis diperiksa oleh aturan database Supabase.</p>
      </form>
    </div>
  )
}

function StatusCard({ title, message, children }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <div className={`${panelClass} p-6 sm:p-8`}>
        <p className="label-mono text-flag-text">Portfolio Studio</p>
        <h1 className="mt-4 font-display text-2xl uppercase sm:text-3xl">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">{message}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { theme, toggle } = useTheme()
  const [session, setSession] = useState(undefined)
  const [access, setAccess] = useState('checking')
  const [loginBusy, setLoginBusy] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [projects, setProjects] = useState([])
  const [galleryReady, setGalleryReady] = useState(null)
  const [listStatus, setListStatus] = useState('loading')
  const [listError, setListError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')
  const [activeTab, setActiveTab] = useState('identity')
  const [siteRows, setSiteRows] = useState({})
  const [siteDrafts, setSiteDrafts] = useState({})
  const [siteStatus, setSiteStatus] = useState('loading')
  const [siteError, setSiteError] = useState('')
  const [siteActionError, setSiteActionError] = useState('')
  const [siteBusy, setSiteBusy] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession)
    })
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) setLoginError(error.message)
      setSession((current) => current === undefined ? data.session : current)
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!supabase || session === undefined) return undefined
    if (!session) {
      setAccess('signed-out')
      setProjects([])
      setSiteRows({})
      setSiteDrafts({})
      return undefined
    }

    let active = true
    setAccess('checking')
    supabase.from('portfolio_admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setListError(error.message)
          setAccess('error')
        } else {
          setAccess(data ? 'admin' : 'denied')
        }
      })
    return () => { active = false }
  }, [session === undefined, session?.user?.id])

  const loadProjects = useCallback(async () => {
    setListStatus('loading')
    const { data, error } = await supabase.from('projects')
      .select(PROJECT_COLUMNS)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      setListError(error.message)
      setListStatus('error')
      return false
    }
    setProjects(data)
    setSelectedId((current) => current && data.some((project) => project.id === current)
      ? current
      : data[0]?.id ?? null)
    setListError('')
    setListStatus('ready')
    return true
  }, [])

  const checkGalleryReady = useCallback(async () => {
    const { error } = await supabase.from('projects').select('images').limit(0)
    setGalleryReady(!error)
  }, [])

  const loadSiteContent = useCallback(async () => {
    setSiteStatus('loading')
    const { data, error } = await supabase.from('site_content').select('section_key,content')
    if (error) {
      setSiteError(error.message)
      setSiteStatus('error')
      return
    }
    const rows = Object.fromEntries(data.flatMap((row) => {
      const group = contentGroups.find((item) => item.key === row.section_key)
      return group ? [[group.key, hydrateLike(group.defaults, row.content)]] : []
    }))
    setSiteRows(rows)
    setSiteError('')
    setSiteStatus('ready')
  }, [])

  useEffect(() => {
    if (access === 'admin') {
      loadProjects()
      checkGalleryReady()
      loadSiteContent()
    }
  }, [access, loadProjects, checkGalleryReady, loadSiteContent])

  const handleLogin = async (email, password) => {
    setLoginBusy(true)
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoginBusy(false)
    if (error) {
      setLoginError(error.message)
      return false
    }
    return true
  }

  const handleSignOut = async () => {
    setActionError('')
    const { error } = await supabase.auth.signOut()
    if (error) setActionError(error.message)
  }

  const handleSave = async (payload) => {
    setBusy(true)
    setActionError('')
    setNotice('')
    try {
      if (galleryReady !== true && payload.images.length > 0) {
        setActionError('Jalankan setup-project-gallery.sql di Supabase SQL Editor sebelum menyimpan foto proyek.')
        return
      }

      const projectPayload = { ...payload }
      if (galleryReady !== true) delete projectPayload.images

      const { id, ...changes } = projectPayload
      const query = selectedId
        ? supabase.from('projects').update(changes).eq('id', selectedId)
        : supabase.from('projects').insert(projectPayload)
      const { error } = await query.select('id').single()

      if (error) {
        setActionError(error.message)
        return
      }

      const loaded = await loadProjects()
      setSelectedId(id)
      if (loaded) setNotice(payload.is_published ? 'Proyek berhasil diterbitkan dan dapat dilihat pengunjung.' : 'Draft berhasil disimpan di database. Centang “Tampilkan di portofolio” lalu simpan lagi untuk menerbitkannya.')
    } catch (error) {
      setActionError(`Gagal menyimpan proyek: ${error instanceof Error ? error.message : 'coba lagi.'}`)
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    setBusy(true)
    setActionError('')
    setNotice('')
    const { error } = await supabase.from('projects').delete().eq('id', selectedId).select('id').single()
    if (error) {
      setActionError(error.message)
    } else {
      setSelectedId(null)
      if (await loadProjects()) setNotice('Proyek berhasil dihapus.')
    }
    setBusy(false)
  }

  const handleSaveSection = async (content) => {
    const group = contentGroups.find((item) => item.key === activeTab)
    if (!group) return
    setSiteBusy(true)
    setSiteActionError('')
    setNotice('')
    const { data, error } = await supabase.from('site_content')
      .upsert({ section_key: group.key, content }, { onConflict: 'section_key' })
      .select('section_key,content')
      .single()

    if (error) {
      setSiteActionError(error.message)
    } else {
      setSiteRows((current) => ({
        ...current,
        [group.key]: hydrateLike(group.defaults, data.content),
      }))
      setSiteDrafts((current) => {
        const next = { ...current }
        delete next[group.key]
        return next
      })
      setNotice(`${group.label} berhasil disimpan dan tampil di portofolio.`)
    }
    setSiteBusy(false)
  }

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    return query
      ? projects.filter((project) => `${project.name} ${project.kind} ${project.id}`.toLowerCase().includes(query))
      : projects
  }, [projects, search])

  const publishedCount = projects.filter((project) => project.is_published).length
  const selectedProject = projects.find((project) => project.id === selectedId)
  const activeGroup = contentGroups.find((group) => group.key === activeTab)
  const dirtyTabs = Object.fromEntries(contentGroups.map((group) => [
    group.key,
    Boolean(siteDrafts[group.key]) && JSON.stringify(siteDrafts[group.key]) !== JSON.stringify(siteRows[group.key] ?? group.defaults),
  ]))

  let content
  if (!hasSupabaseConfig) {
    content = <StatusCard title="Konfigurasi belum tersedia" message="Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di .env.local, lalu mulai ulang server website." />
  } else if (session === undefined || access === 'checking') {
    content = <StatusCard title="Memeriksa akses" message="Menyiapkan sesi admin Anda..." />
  } else if (access === 'signed-out') {
    content = <LoginForm onLogin={handleLogin} busy={loginBusy} error={loginError} />
  } else if (access === 'denied') {
    content = <StatusCard title="Akun belum menjadi admin" message="Login berhasil, tetapi akun ini belum tercatat di portfolio_admins. Tambahkan akun melalui SQL Editor sesuai README, lalu masuk kembali."><button type="button" onClick={handleSignOut} className={actionClass}>Keluar</button></StatusCard>
  } else if (access === 'error') {
    content = <StatusCard title="Akses belum dapat diperiksa" message={`Periksa apakah setup-projects-admin.sql sudah dijalankan. Detail: ${listError}`}><button type="button" onClick={handleSignOut} className={actionClass}>Keluar</button></StatusCard>
  } else {
    content = (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-mono text-flag-text">Dashboard / {activeTab === 'projects' ? 'Projects' : activeGroup.label}</p>
            <h1 className="mt-3 font-display text-3xl uppercase sm:text-5xl">{activeTab === 'projects' ? 'Kelola karya' : `Kelola ${activeGroup.label}`}</h1>
            <p className="mt-3 text-sm text-ink-soft">{activeTab === 'projects' ? 'Draft tersimpan di database, tetapi hanya proyek terbit yang terlihat pada halaman utama.' : activeGroup.description}</p>
          </div>
          <button type="button" onClick={handleSignOut} className="border-2 border-ink bg-card px-4 py-2.5 font-mono text-[0.6875rem] font-bold uppercase hover:bg-acid">Keluar</button>
        </div>

        <nav aria-label="Menu dashboard" className="no-scrollbar mt-8 flex gap-2 overflow-x-auto border-b-[3px] border-ink pb-3">
          {dashboardTabs.map((tab, index) => (
            <button key={tab.key} type="button" onClick={() => { setActiveTab(tab.key); setNotice(''); setActionError(''); setSiteActionError('') }} aria-current={activeTab === tab.key ? 'page' : undefined} className={`shrink-0 border-2 border-ink px-3 py-2 font-mono text-[0.625rem] font-bold tracking-wider uppercase ${activeTab === tab.key ? 'bg-acid shadow-[3px_3px_0_0_var(--color-ink)]' : 'bg-card hover:bg-paper-2'}`}>
              <span className="mr-2 text-flag-text">{String(index + 1).padStart(2, '0')}</span>{tab.label}{dirtyTabs[tab.key] ? <span className="ml-1" aria-label="Perubahan belum disimpan">●</span> : null}
            </button>
          ))}
        </nav>

        {notice ? <p role="status" className="mt-6 border-2 border-ink bg-paper-2 px-4 py-3 text-sm font-medium">{notice}</p> : null}

        {activeTab === 'projects' ? <>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Total proyek', value: projects.length, tone: 'bg-acid' },
            { label: 'Terbit', value: publishedCount, tone: 'bg-paper-2' },
            { label: 'Draft', value: projects.length - publishedCount, tone: 'bg-flag text-on-flag' },
          ].map((item) => (
            <div key={item.label} className={`border-[3px] border-ink p-4 ${item.tone}`}>
              <span className="label-mono block">{item.label}</span>
              <strong className="mt-3 block font-display text-3xl">{item.value.toString().padStart(2, '0')}</strong>
            </div>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-7 lg:grid-cols-[19rem_minmax(0,1fr)]">
          <aside className={`${panelClass} lg:sticky lg:top-5`}>
            <div className="border-b-[3px] border-ink bg-paper-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-lg uppercase">Daftar proyek</h2>
                <span className="font-mono text-xs font-bold">{projects.length.toString().padStart(2, '0')}</span>
              </div>
              <button type="button" onClick={() => { setSelectedId(null); setNotice(''); setActionError('') }} className={`${actionClass} mt-4 w-full`}>+ Proyek baru</button>
              <label htmlFor="project-search" className="sr-only">Cari proyek</label>
              <input id="project-search" type="search" className="mt-4 w-full border-2 border-ink bg-card px-3 py-2 text-sm" placeholder="Cari proyek..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            {listStatus === 'loading' ? <p className="p-4 text-sm text-ink-soft">Memuat daftar proyek...</p> : null}
            {listStatus === 'error' ? <div className="p-4"><p role="alert" className="text-sm text-flag-text">{listError}</p><button type="button" onClick={loadProjects} className={`${actionClass} mt-3`}>Coba lagi</button></div> : null}
            {listStatus === 'ready' && projects.length === 0 ? <p className="p-4 text-sm text-ink-soft">Belum ada proyek. Mulai dengan tombol di atas.</p> : null}
            {listStatus === 'ready' && projects.length > 0 && visibleProjects.length === 0 ? <p className="p-4 text-sm text-ink-soft">Tidak ada proyek yang cocok.</p> : null}
            {listStatus === 'ready' ? (
              <div className="max-h-[32rem] overflow-y-auto p-2">
                {visibleProjects.map((project) => (
                  <button key={project.id} type="button" onClick={() => { setSelectedId(project.id); setNotice(''); setActionError('') }} className={`mb-2 w-full border-2 p-3 text-left transition-colors ${selectedId === project.id ? 'border-ink bg-acid' : 'border-transparent bg-paper hover:border-ink'}`}>
                    <span className="flex items-start justify-between gap-2">
                      <strong className="font-display text-sm leading-tight uppercase">{project.name}</strong>
                      <span className={`shrink-0 border border-ink px-1.5 py-0.5 font-mono text-[0.5rem] font-bold uppercase ${project.is_published ? 'bg-paper-2' : 'bg-card'}`}>{project.is_published ? 'Terbit' : 'Draft'}</span>
                    </span>
                    <span className="mt-2 block font-mono text-[0.625rem] text-ink-soft">{project.kind} · {project.year}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </aside>

          <div>
            {listStatus === 'error' ? <StatusCard title="Daftar belum tersedia" message="Periksa aturan akses Projects di Supabase, lalu coba muat ulang." /> : (
              <ProjectEditor key={selectedId ?? 'new'} project={selectedProject} busy={busy || listStatus === 'loading'} actionError={actionError} successMessage={notice} galleryReady={galleryReady} onSave={handleSave} onDelete={handleDelete} />
            )}
          </div>
        </div>
        </> : siteStatus === 'loading' ? (
          <StatusCard title="Memuat konten" message="Mengambil isi bagian portofolio dari Supabase..." />
        ) : siteStatus === 'error' ? (
          <StatusCard title="Konten belum tersedia" message={`Jalankan setup-site-content.sql di Supabase SQL Editor. Detail: ${siteError}`}>
            <button type="button" onClick={loadSiteContent} className={actionClass}>Coba lagi</button>
          </StatusCard>
        ) : (
          <div className="mt-8">
            <SectionEditor
              key={activeTab}
              group={activeGroup}
              data={siteDrafts[activeTab] ?? siteRows[activeTab] ?? activeGroup.defaults}
              saved={Boolean(siteRows[activeTab])}
              dirty={dirtyTabs[activeTab]}
              busy={siteBusy}
              actionError={siteActionError}
              onChange={(updated) => setSiteDrafts((current) => ({ ...current, [activeTab]: updated }))}
              onReset={() => setSiteDrafts((current) => { const next = { ...current }; delete next[activeTab]; return next })}
              onSave={handleSaveSection}
            />
          </div>
        )}
      </main>
    )
  }

  return <DashboardFrame theme={theme} onToggleTheme={toggle}>{content}</DashboardFrame>
}
