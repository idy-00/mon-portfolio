import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, REDUCE } from '../lib/motion'
import { CONTACT } from '../lib/site'

/** Fin de page : « Page suivante » géant, barre de progression au scroll, footer. */
export default function NextPage({ to, kicker, title }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (REDUCE) return
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo('.next__bar i', { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom bottom', scrub: true },
      })
      gsap.from('.next__t', {
        yPercent: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      })
    }, el)
    return () => ctx.revert()
  }, [to])

  return (
    <section ref={ref} className="next wrap" aria-label={kicker}>
      <span className="mono">{kicker}</span>
      <Link to={to}><span className="next__t fit" style={{ '--len': Math.max(title.length, 6) }}>{title}</span></Link>
      <div className="next__bar" aria-hidden="true"><i /></div>
      <footer className="foot mono">
        <span>© {new Date().getFullYear()} Idrissa Mamadou Kane · Dakar · GMT+0</span>
        <nav aria-label="Réseaux">
          <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={CONTACT.tiktok} target="_blank" rel="noreferrer">TikTok</a>
          <a href={CONTACT.cv} target="_blank" rel="noreferrer">CV</a>
        </nav>
      </footer>
    </section>
  )
}
