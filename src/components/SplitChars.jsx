import { useLayoutEffect, useRef } from 'react'
import { gsap, REDUCE, whenRevealed } from '../lib/motion'

/**
 * Titre découpé lettre par lettre, chaque ligne dans un masque.
 * `lines` : tableau de lignes (sinon `text` sur une ligne). Monte quand l'écran est découvert.
 */
export default function SplitChars({ text, lines, as: Tag = 'h1', className = '', delay = 0.15, play = true, ...rest }) {
  const ref = useRef(null)
  const rows = lines || [text]
  const label = rows.join(' ')

  useLayoutEffect(() => {
    if (!play || REDUCE) return
    const el = ref.current
    const ctx = gsap.context(() => {
      const chars = el.querySelectorAll('.ch')
      gsap.set(chars, { yPercent: 110 })
      const cancel = whenRevealed(() => ctx.add(() => {
        gsap.to(chars, { yPercent: 0, duration: 1.2, stagger: 0.03, ease: 'expo.out', delay })
      }))
      ctx.add(() => () => cancel())
    }, el)
    return () => ctx.revert()
  }, [label, delay, play])

  return (
    <Tag ref={ref} className={className} aria-label={label} {...rest}>
      {rows.map((row, r) => (
        <span className="ln" key={r} aria-hidden="true">
          {row.split(' ').map((word, w, words) => (
            <span className="w" key={w}>
              {[...word].map((c, i) => <span className="ch" key={i}>{c}</span>)}
              {w < words.length - 1 && <span className="ch">{' '}</span>}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
