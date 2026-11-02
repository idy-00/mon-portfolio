import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger, Flip, REDUCE } from '../lib/motion'
import { usePageMotion } from '../lib/usePageMotion'
import { PROJECTS, FILTERS } from '../lib/site'
import SplitChars from '../components/SplitChars'
import Phone from '../components/Phone'
import NextPage from '../components/NextPage'

const FILTER_LABEL = Object.fromEntries(FILTERS.map((f) => [f.key, f.label]))
const COUNT = Object.fromEntries(FILTERS.map((f) => [f.key, f.key === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.filter === f.key).length]))
const ROUND = 'round 22px'

function Status({ p }) {
  return p.isLive
    ? <span className="idx__st is-live"><span className="dot" aria-hidden="true" />En production</span>
    : <span className="idx__st">Archive</span>
}

export default function ProjectsPage() {
  const ref = useRef(null)
  const api = useRef(null)
  const flipState = useRef(null)
  const [filter, setFilter] = useState('all')

  usePageMotion(ref, ({ q, add, revealed }) => {
    const rows = q('.idx__row')
    const views = Object.fromEntries(q('.view').map((v) => [v.dataset.v, v]))
    let cur = null
    let triggers = []

    const show = (slug) => {
      if (slug === cur) return
      const prev = cur ? views[cur] : null
      const next = views[slug]
      cur = slug
      rows.forEach((r) => r.classList.toggle('is-on', r.dataset.slug === slug))
      if (next) {
        gsap.killTweensOf(next)
        gsap.set(next, { zIndex: 2 })
        if (REDUCE) gsap.set(next, { clipPath: `inset(0% 0% 0% 0% ${ROUND})` })
        else {
          gsap.fromTo(next, { clipPath: `inset(100% 0% 0% 0% ${ROUND})` }, { clipPath: `inset(0% 0% 0% 0% ${ROUND})`, duration: 0.9, ease: 'expo.out' })
          const im = next.querySelector('img')
          if (im) gsap.fromTo(im, { scale: 1.25 }, { scale: 1, duration: 1.2, ease: 'expo.out' })
        }
      }
      if (prev) {
        gsap.killTweensOf(prev)
        gsap.set(prev, { zIndex: 1 })
        if (REDUCE) gsap.set(prev, { clipPath: `inset(0% 0% 100% 0% ${ROUND})` })
        else gsap.to(prev, { clipPath: `inset(0% 0% 100% 0% ${ROUND})`, duration: 0.9, ease: 'expo.out', delay: 0.05 })
      }
    }

    // la ligne au centre de l'écran devient active (desktop seulement : l'aperçu est masqué sous 900 px)
    const bind = () => {
      triggers.forEach((t) => t.kill())
      triggers = rows.filter((r) => !r.hidden).map((r) => ScrollTrigger.create({
        trigger: r, start: 'top 55%', end: 'bottom 55%',
        onToggle: (s) => { if (s.isActive) show(r.dataset.slug) },
      }))
    }
    add(() => triggers.forEach((t) => t.kill()))

    api.current = {
      reset: () => {
        cur = null
        Object.values(views).forEach((v) => gsap.set(v, { clipPath: `inset(100% 0% 0% 0% ${ROUND})`, zIndex: 0 }))
        const first = rows.find((r) => !r.hidden)
        if (first) show(first.dataset.slug)
        bind()
      },
    }
    add(() => { api.current = null })
    api.current.reset()

    if (!REDUCE) {
      gsap.set(rows.slice(0, 8), { y: 40, autoAlpha: 0 })
      revealed(() => gsap.to(rows.slice(0, 8), { y: 0, autoAlpha: 1, duration: 1, stagger: 0.05, ease: 'expo.out', delay: 0.4, clearProps: 'transform,opacity,visibility' }))
    }
  })

  /* Filtre : on capture l'état avant le rendu, puis Flip anime vers le nouvel état */
  useLayoutEffect(() => {
    const state = flipState.current
    flipState.current = null
    if (!state) return
    if (!REDUCE) {
      Flip.from(state, {
        duration: 0.7, ease: 'expo.out', absolute: false,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.03 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.25 }),
        onComplete: () => ScrollTrigger.refresh(),
      })
    }
    api.current?.reset()
    ScrollTrigger.refresh()
  }, [filter])

  const pick = (key) => {
    if (key === filter) return
    flipState.current = REDUCE ? true : Flip.getState(ref.current.querySelectorAll('.idx__row'))
    setFilter(key)
  }

  return (
    <div ref={ref} className="projects">
      <section className="p-head wrap">
        <span className="mono" data-scramble>SN·01 · Réalisations</span>
        <SplitChars className="h-xl" text="Projets" />
        <div className="p-head__row">
          <p className="lede">Une sélection de projets pour montrer l'impact, la clarté et la diversité.</p>
          <div className="filters" role="group" aria-label="Filtrer par type">
            {FILTERS.map((f) => (
              <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => pick(f.key)}>
                {f.label}<span aria-label={`${COUNT[f.key]} projets`}>{COUNT[f.key]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="idx wrap" aria-label="Index des projets">
        <ol className="idx__list">
          {PROJECTS.map((p) => (
            <li className="idx__row" key={p.slug} data-slug={p.slug} hidden={!(filter === 'all' || p.filter === filter)}>
              <Link to={`/projets/${p.slug}`}>
                <span className="idx__n">N°{p.n}</span>
                <span className="idx__name">{p.name}<small>{p.hasSub ? `${p.sub} · ${FILTER_LABEL[p.filter]}` : p.category}</small></span>
                <Status p={p} />
                {p.image && <span className="idx__thumb"><img src={p.image} alt="" loading="lazy" decoding="async" /></span>}
              </Link>
            </li>
          ))}
        </ol>
        <div className="idx__view" aria-hidden="true">
          {PROJECTS.map((p) => (
            <div key={p.slug} data-v={p.slug} className={`view${p.isPhone ? ' view--phone' : !p.image ? ' view--type' : ''}`}>
              {p.isPhone && <Phone src={p.image} />}
              {!p.isPhone && p.image && <img src={p.image} alt="" loading="lazy" decoding="async" />}
              {!p.image && <><b>{p.n}</b><span>{p.name}</span></>}
              {p.image && !p.isPhone && <span className="chip view__cap">N°{p.n} · {p.name}</span>}
            </div>
          ))}
        </div>
      </section>

      <NextPage to="/services" kicker="Page suivante · SN·02" title="Services" />
    </div>
  )
}
