import { createElement } from 'react'

/**
 * ==========================================================================
 *  BentoCell — unit dasar seluruh layout
 * ==========================================================================
 *  Kotak bento dengan border tebal + hard shadow khas neo-brutalist.
 *  Ukuran cell dikendalikan lewat prop `span` (kelas col-span Tailwind),
 *  jadi grid induk tetap 1 kolom di mobile (portrait) dan melebar di desktop.
 */

const TONES = {
  card: 'brutal-card',
  paper: 'brutal-card brutal-paper',
  paper2: 'brutal-card brutal-paper2',
  acid: 'brutal-card brutal-acid',
  ink: 'brutal-card brutal-ink',
  flag: 'brutal-card brutal-flag',
}

const PADS = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-7',
}

export default function BentoCell({
  as = 'div',
  tone = 'card',
  span = '',
  pad = 'md',
  hover = false,
  reveal = true,
  variant,
  delay,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    TONES[tone] ?? TONES.card,
    PADS[pad] ?? PADS.md,
    hover ? 'hover:brutal-lift active:brutal-press cursor-default' : '',
    reveal ? 'reveal' : '',
    span,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return createElement(
    as,
    {
      className: classes,
      ...(delay != null ? { 'data-delay': delay } : {}),
      ...(variant ? { 'data-reveal': variant } : {}),
      ...rest,
    },
    children,
  )
}
