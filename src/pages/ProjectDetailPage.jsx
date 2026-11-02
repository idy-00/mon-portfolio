import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { gsap, REDUCE } from '../lib/motion'
import { usePageMotion } from '../lib/usePageMotion'
import { PROJECTS, BY_SLUG, statusOf } from '../lib/site'
import SplitChars from '../components/SplitChars'
import Phone from '../components/Phone'
import NextPage from '../components/NextPage'

/* Scène épinglée selon le projet : navigateur (capture), téléphone (mobile), N° en contour (sans capture) */
function Stage({ p }) {
  if (p.isPhone) return <Phone className="c-vis c-vis--phone" src={p.image} alt={`Écran de ${p.name}`} loading="eager" />
  if (p.image) {
    return (
      <div className="c-vis frame">
        <div className="frame__bar" aria-hidden="true"><i /><i /><i /><span>{p.liveHost || p.host}</span></div>
        <div className="frame__img"><img src={p.image} alt={`Capture de ${p.name}`} decoding="async" /></div>
      </div>
    )
  }
  return (
    <div className="c-vis ghost" aria-hidden="true">
      <span className="ghost__o">{p.n}</span>
      <span className="ghost__f">{p.n}</span>
    </div>
  )
}

function CaseStudy({ p }) {
  const ref = useRef(null)
  const i = PROJECTS.indexOf(p)
  const next = PROJECTS[(i + 1) % PROJECTS.length]

  usePageMotion(ref, ({ q }) => {
    if (REDUCE) return
    const stage = q('.c-stage')[0]
    const vis = q('.c-vis')[0]
    if (vis.classList.contains('frame')) {
      gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top top', end: '+=120%', pin: true, scrub: true } })
        .fromTo(vis, { scale: 0.58, y: 80, borderRadius: 28 }, { scale: 1, y: 0, borderRadius: 10, ease: 'none' })
        .fromTo(vis.querySelector('.frame__img img'), { scale: 1.3 }, { scale: 1, ease: 'none' }, 0)
    } else if (vis.classList.contains('phone')) {
      gsap.set(stage, { perspective: 1200 })
      gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top top', end: '+=110%', pin: true, scrub: true } })
        .fromTo(vis, { rotateX: 38, rotateZ: -8, y: 160, scale: 0.8 }, { rotateX: 0, rotateZ: 0, y: 0, scale: 1, ease: 'none' })
    } else {
      gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top top', end: '+=100%', pin: true, scrub: true } })
        .fromTo(vis.querySelector('.ghost__f'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
        .fromTo(vis, { scale: 0.86 }, { scale: 1, ease: 'none' }, 0)
    }
    gsap.from(q('.c-lead'), { y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: q('.c-body')[0], start: 'top 85%' } })
    const pills = q('.c-stack li')
    if (pills.length) gsap.from(pills, { scale: 0.6, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: 'back.out(2)', scrollTrigger: { trigger: q('.c-stack')[0], start: 'top 90%' } })
    q('.c-feats li').forEach((li, k) => gsap.from(li, { y: 30, autoAlpha: 0, duration: 1, delay: (k % 3) * 0.08, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 92%' } }))
    q('.c-block').forEach((b) => gsap.from(b.children, { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 85%' } }))
  }, [p.slug])

  const meta = [`N°${p.n}`, p.category, p.year].filter(Boolean).join(' · ')

  return (
    <div ref={ref} className="case">
      <section className="c-head wrap">
        <div className="c-head__meta">
          <Link className="mono c-back" to="/projets">← Projets</Link>
          <span className="mono" data-scramble>{meta}</span>
          <span className="chip c-status">{p.isLive ? <><span className="dot" aria-hidden="true" />En production</> : statusOf(p)}</span>
        </div>
        <SplitChars className="h-xl c-title fit" text={p.name} style={{ '--len': p.name.length }} />
        {p.hasSub && <p className="h-m c-sub">{p.sub}</p>}
      </section>

      <section className="c-stage" aria-label={`Aperçu de ${p.name}`}>
        <Stage p={p} />
      </section>

      <section className="wrap">
        <div className="c-body">
          <div>{p.summary && <p className="c-lead">{p.summary}</p>}</div>
          <div className="c-side">
            <dl>
              <div><dt className="mono">Type</dt><dd>{p.category}</dd></div>
              <div><dt className="mono">Statut</dt><dd>{statusOf(p)}</dd></div>
              {p.role && <div><dt className="mono">Rôle</dt><dd>{p.role}</dd></div>}
              {p.duration && <div><dt className="mono">Durée</dt><dd>{p.duration}</dd></div>}
            </dl>
            {p.stack?.length > 0 && (
              <div>
                <span className="mono">Stack</span>
                <ul className="pills c-stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            )}
            <div className="c-links">
              {p.live && <a className="btn btn--solid" href={p.live} target="_blank" rel="noreferrer">Voir {p.liveHost} ↗</a>}
              {p.link && <a className="btn btn--ghost" href={p.link} target="_blank" rel="noreferrer">Code source ↗</a>}
            </div>
          </div>
        </div>

        {p.impact && (
          <div className="c-block">
            <h2 className="mono">Impact</h2>
            <p>{p.impact}</p>
          </div>
        )}

        {p.features?.length > 0 && (
          <div className="c-block c-block--feats">
            <h2 className="mono">Fonctionnalités</h2>
            <ol className="c-feats">
              {p.features.map((f, k) => (
                <li key={k}><b aria-hidden="true">{String(k + 1).padStart(2, '0')}</b><span>{f}</span></li>
              ))}
            </ol>
          </div>
        )}

        {p.challenge && (
          <div className="c-block">
            <h2 className="mono">Le défi</h2>
            <p>{p.challenge}</p>
          </div>
        )}
      </section>

      <NextPage to={`/projets/${next.slug}`} kicker={`Projet suivant · N°${next.n}`} title={next.name} />
    </div>
  )
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const p = BY_SLUG[slug]
  if (!p) {
    return (
      <section className="c-head wrap c-missing">
        <span className="mono">N°??? · introuvable</span>
        <h1 className="h-l">Ce numéro n'existe pas dans la série.</h1>
        <Link className="btn btn--solid" to="/projets">Voir les {PROJECTS.length} projets</Link>
      </section>
    )
  }
  return <CaseStudy key={p.slug} p={p} />
}
