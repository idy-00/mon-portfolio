import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, REDUCE, scrambleTo, pauseScroll, resumeScroll } from '../lib/motion'
import { PAGES, CONTACT } from '../lib/site'

/** Overlay plein écran : volet clip-path, liens géants en cascade, labels en scramble, Échap pour fermer. */
export default function Menu({ open, current, onClose, returnFocusRef }) {
  const ref = useRef(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    const el = ref.current
    if (first.current) { first.current = false; gsap.set(el, { clipPath: 'inset(0 0 100% 0)', visibility: 'hidden' }); return }
    const tl = gsap.timeline()
    if (open) {
      pauseScroll()
      tl.set(el, { visibility: 'visible' })
      if (REDUCE) tl.set(el, { clipPath: 'inset(0 0 0% 0)' })
      else {
        tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
          .fromTo(el.querySelectorAll('.menu__list strong'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out' }, '-=.35')
          .add(() => el.querySelectorAll('.menu__list .mono').forEach((m) => scrambleTo(m, null, 500)), '-=.9')
      }
      tl.add(() => el.querySelector('a')?.focus({ preventScroll: true }))
    } else {
      resumeScroll()
      if (REDUCE) tl.set(el, { clipPath: 'inset(0 0 100% 0)', visibility: 'hidden' })
      else tl.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'expo.inOut' }).set(el, { visibility: 'hidden' })
    }
    return () => tl.kill()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); returnFocusRef?.current?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, returnFocusRef])

  return (
    <nav ref={ref} id="menu" className="menu" aria-label="Pages" aria-hidden={!open} inert={!open}>
      <ul className="menu__list">
        {PAGES.map((pg) => (
          <li key={pg.path}>
            <Link
              to={pg.path}
              aria-current={current === pg.path ? 'page' : undefined}
              onClick={(e) => { if (current === pg.path) { e.preventDefault(); onClose() } }}
            >
              <span className="mono">{pg.sn}</span><strong>{pg.name}</strong>
            </Link>
          </li>
        ))}
      </ul>
      <div className="menu__foot mono">
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <a href={`https://wa.me/${CONTACT.wa}`} target="_blank" rel="noreferrer">{CONTACT.phone}</a>
        <span>Dakar · GMT+0</span>
      </div>
    </nav>
  )
}
