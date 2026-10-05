/**
 * Tag — chip metadata mono dengan border tebal.
 * tone: 'outline' | 'acid' | 'ink' | 'flag'
 */
const TONES = {
  outline: 'border-ink bg-transparent text-ink',
  acid: 'border-ink bg-acid text-ink',
  ink: 'border-ink bg-ink text-paper',
  flag: 'border-ink bg-flag text-on-flag',
  soft: 'border-ink/25 bg-paper-2 text-ink-soft',
}

export default function Tag({ children, tone = 'outline', className = '', ...rest }) {
  return (
    <span
      className={[
        'inline-flex items-center border-2 px-2 py-[3px]',
        'font-mono text-[0.625rem] font-bold tracking-[0.12em] uppercase',
        'transition-colors duration-200',
        TONES[tone] ?? TONES.outline,
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </span>
  )
}
