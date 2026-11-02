import { useLayoutEffect, useRef } from 'react'
import { gsap, REDUCE } from '../lib/motion'

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/** Chiffres en colonnes qui roulent jusqu'à `value` quand ils entrent dans l'écran. */
export default function Odometer({ value, suffix = '', className = '' }) {
  const ref = useRef(null)
  const s = String(value)

  useLayoutEffect(() => {
    const el = ref.current
    const ctx = gsap.context(() => {
      el.querySelectorAll('.odo__col > span').forEach((inner, i) => {
        const to = -Number(s[i]) * 10
        if (REDUCE) { gsap.set(inner, { yPercent: to }); return }
        gsap.fromTo(inner, { yPercent: 0 }, {
          yPercent: to, duration: 1.8 + i * 0.35, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [s])

  return (
    <span ref={ref} className={`odo ${className}`} role="img" aria-label={`${s}${suffix}`}>
      {[...s].map((_, i) => (
        <span className="odo__col" key={i} aria-hidden="true">
          <span>{DIGITS.map((d) => <i key={d}>{d}</i>)}</span>
        </span>
      ))}
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  )
}
