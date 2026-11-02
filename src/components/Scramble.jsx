import { useLayoutEffect, useRef } from 'react'
import { scrambleTo, cancelScramble } from '../lib/motion'

/** Texte qui se décode à chaque changement de `text`. Le DOM est piloté ici, pas par React. */
export default function Scramble({ text, as: Tag = 'span', dur = 700, className, ...rest }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (!el.textContent) el.textContent = text
    scrambleTo(el, text, dur)
    return () => cancelScramble(el)
  }, [text, dur])
  return <Tag ref={ref} className={className} {...rest} />
}
