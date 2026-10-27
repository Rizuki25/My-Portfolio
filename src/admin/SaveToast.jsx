import { useEffect, useState } from 'react'

const AUTO_DISMISS_MS = 5000
const EXIT_ANIMATION_MS = 200

export default function SaveToast({ message, type = 'success', onClose }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const dismissTimer = window.setTimeout(() => setLeaving(true), AUTO_DISMISS_MS)
    return () => window.clearTimeout(dismissTimer)
  }, [])

  useEffect(() => {
    if (!leaving) return undefined
    const removeTimer = window.setTimeout(onClose, EXIT_ANIMATION_MS)
    return () => window.clearTimeout(removeTimer)
  }, [leaving, onClose])

  const success = type === 'success'

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-5 z-[100] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6 sm:justify-end" aria-live="polite" aria-atomic="true">
      <div
        role={success ? 'status' : 'alert'}
        className={`admin-toast pointer-events-auto relative flex w-full max-w-md items-start gap-3 overflow-hidden border-[3px] border-ink bg-card p-4 pr-11 shadow-[6px_6px_0_0_var(--color-ink)] ${leaving ? 'admin-toast-leave' : ''}`}
      >
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink ${success ? 'bg-paper-2' : 'bg-flag text-on-flag'}`} aria-hidden="true">
          {success ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <path className="admin-toast-check" d="m5 12 4 4L19 6" />
            </svg>
          ) : <span className="font-display text-xl">!</span>}
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="font-mono text-[0.6875rem] font-bold tracking-widest uppercase">{success ? 'Berhasil disimpan' : 'Gagal disimpan'}</p>
          <p className="mt-1.5 text-sm leading-relaxed">{message}</p>
        </div>
        <button type="button" onClick={() => setLeaving(true)} aria-label="Tutup notifikasi" className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center border-2 border-transparent font-mono text-lg leading-none hover:border-ink hover:bg-paper-2">×</button>
        <span className={`admin-toast-progress absolute right-0 bottom-0 left-0 h-1 origin-left ${success ? 'bg-acid-deep' : 'bg-flag'}`} aria-hidden="true" />
      </div>
    </div>
  )
}
