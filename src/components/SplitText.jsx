/**
 * Judul per karakter tanpa memecah kata maupun menggandakan teks untuk screen
 * reader. Mask pada induk menjaga gerakan tetap rapi dan editorial.
 */
export default function SplitText({ text, delay = 0, step = 32, className = '' }) {
  return (
    <span className={`split-text ${className}`} aria-hidden="true">
      <span>
        {Array.from(text).map((character, index) => (
          <span
            key={`${character}-${index}`}
            className="kinetic-char"
            style={{
              '--char-index': index,
              transitionDelay: `${delay + index * step}ms`,
            }}
          >
            {character === ' ' ? ' ' : character}
          </span>
        ))}
      </span>
    </span>
  )
}
