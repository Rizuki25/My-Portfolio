import { useEffect, useRef, useState } from 'react'

export default function ProjectGallery({ images = [], title, wide = false }) {
  const [active, setActive] = useState(0)
  const touchStartX = useRef(null)
  const count = images.length

  useEffect(() => setActive(0), [images])

  if (count === 0) return null

  const current = Math.min(active, count - 1)
  const image = images[current]
  const move = (direction) => setActive((index) => (index + direction + count) % count)

  const onKeyDown = (event) => {
    if (count < 2) return
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
  }

  const onTouchEnd = (event) => {
    if (count < 2 || touchStartX.current === null) return
    const distance = event.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(distance) >= 45) move(distance < 0 ? 1 : -1)
    touchStartX.current = null
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={`Foto proyek ${title}`} tabIndex={0} onKeyDown={onKeyDown} onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX }} onTouchEnd={onTouchEnd} className="min-w-0 outline-none focus-visible:ring-4 focus-visible:ring-azure">
      <div className={`relative flex items-center justify-center overflow-hidden bg-ink/90 ${wide ? 'aspect-[16/9] max-h-[32rem]' : 'aspect-[4/3]'}`}>
        <img key={image.url} src={image.url} alt={image.alt} loading="lazy" decoding="async" className="gallery-img h-full w-full object-contain" />
        {count > 1 ? <span aria-live="polite" className="absolute top-3 right-3 border-2 border-paper bg-ink px-2 py-1 font-mono text-[0.625rem] font-bold text-paper">{current + 1} / {count}</span> : null}
      </div>
      {count > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-ink bg-paper px-3 py-2">
          <button type="button" onClick={() => move(-1)} aria-label={`Foto sebelumnya dari ${title}`} className="border-2 border-ink bg-card px-3 py-1 font-mono text-sm font-bold hover:bg-acid">←</button>
          <div className="flex flex-wrap justify-center gap-1.5" aria-label="Pilih foto">
            {images.map((item, index) => (
              <button key={`${item.url}-${index}`} type="button" onClick={() => setActive(index)} aria-label={`Lihat foto ${index + 1} dari ${title}`} aria-current={current === index ? 'true' : undefined} className={`h-3 w-3 border-2 border-ink ${current === index ? 'bg-flag' : 'bg-card hover:bg-acid'}`} />
            ))}
          </div>
          <button type="button" onClick={() => move(1)} aria-label={`Foto berikutnya dari ${title}`} className="border-2 border-ink bg-card px-3 py-1 font-mono text-sm font-bold hover:bg-acid">→</button>
        </div>
      ) : null}
    </div>
  )
}
