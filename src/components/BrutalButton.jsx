/**
 * BrutalButton — tombol/link bergaya neo-brutalist.
 * Border tebal, hard shadow offset, terangkat saat hover, menekan saat klik.
 *
 * variant : 'ink' | 'acid' | 'outline' | 'flag'
 * size    : 'sm' | 'md' | 'lg'
 */
const VARIANTS = {
  ink: 'bg-ink text-paper hover:bg-acid hover:text-ink',
  acid: 'bg-acid text-ink hover:bg-ink hover:text-paper',
  outline: 'bg-card text-ink hover:bg-acid',
  flag: 'bg-flag text-on-flag hover:bg-ink hover:text-paper',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-[0.625rem] gap-1.5',
  md: 'px-4 py-2.5 text-[0.6875rem] gap-2',
  lg: 'px-5 py-3 text-xs gap-2.5',
}

export default function BrutalButton({
  as = 'a',
  href,
  variant = 'ink',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}) {
  const Tag = as
  const classes = [
    'group inline-flex items-center justify-center border-[3px] border-ink',
    'font-mono font-bold tracking-[0.14em] uppercase whitespace-nowrap',
    'shadow-[4px_4px_0_0_var(--color-ink)]',
    'transition-all duration-150',
    'hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[7px_7px_0_0_var(--color-ink)]',
    'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--color-ink)]',
    VARIANTS[variant] ?? VARIANTS.ink,
    SIZES[size] ?? SIZES.md,
    className,
  ].join(' ')

  return (
    <Tag
      href={Tag === 'a' ? href : undefined}
      className={classes}
      {...rest}
    >
      {children}
      {icon ? (
        <span
          aria-hidden="true"
          className="text-[1.1em] leading-none transition-transform duration-200 group-hover:translate-x-[2px]"
        >
          {icon}
        </span>
      ) : null}
    </Tag>
  )
}
