import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger, REDUCE, scrambleTo } from '../lib/motion'
import { usePageMotion } from '../lib/usePageMotion'
import { BY_SLUG, FILTERS, STATS, pad3 } from '../lib/site'
import SplitChars from '../components/SplitChars'
import GlyphCanvas from '../components/GlyphCanvas'
import Odometer from '../components/Odometer'
import Phone from '../components/Phone'
import NextPage from '../components/NextPage'

const RUN = ['finora360', 'paytrack', 'jeli', 'immoclair', 'emirati-vape', 'esa'].map((s) => BY_SLUG[s]).filter(Boolean)
const POCKET = ['sunufoot', 'yankee'].map((s) => BY_SLUG[s]).filter(Boolean)
const FILTER_LABEL = Object.fromEntries(FILTERS.map((f) => [f.key, f.label]))

const SWEEP = "Depuis mes débuts, j'ai toujours voulu passer de l'usage à la création."
const CHUNKS = SWEEP.split(' ').reduce((acc, w, i) => {
  if (i % 3 === 0) acc.push([])
  acc[acc.length - 1].push(w)
  return acc
}, []).map((g) => g.join(' '))

const ROW_A = ['React /', 'Laravel /', 'Flutter /', 'TypeScript /', 'PostgreSQL /']
const ROW_B = ['Wave', 'Orange Money', 'PayDunya', 'Stripe', 'Wave', 'Orange Money', 'PayDunya', 'Stripe']

export default function HomePage() {
  const ref = useRef(null)
  const sigProgress = useRef(0)

  usePageMotion(ref, ({ q, add, revealed }) => {
    const media = q('.hero__media')[0]
    const typed = q('.hero__typed')[0]

    /* ── 1. Hero : la vidéo s'ouvre depuis un cadre, le nom monte, serial|dev se tape ── */
    if (!REDUCE) {
      gsap.set(media, { clipPath: 'inset(18% 30% 18% 30% round 28px)', scale: 1.08 })
      gsap.set(q('.hero__meta, .hero__foot'), { autoAlpha: 0, y: 20 })
      typed.textContent = ''
      revealed(() => {
        gsap.timeline({ defaults: { ease: 'expo.out' } })
          .to(media, { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, duration: 1.6 })
          .to(q('.hero__meta, .hero__foot'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, '-=1.1')
          .add(() => {
            const s = 'serial|dev'
            let i = 0
            let id
            const step = () => {
              i++
              const [a, b] = s.slice(0, i).split('|')
              const bar = document.createElement('span')
              bar.className = 'bar'
              bar.textContent = '|'
              typed.replaceChildren(a, ...(b !== undefined ? [bar, b] : []))
              if (i < s.length) id = setTimeout(step, 70 + Math.random() * 60)
            }
            id = setTimeout(step, 0)
            add(() => clearTimeout(id))
          }, '-=.7')
      })

      // au scroll : la vidéo se replie dans un cadre arrondi, le nom remonte
      gsap.timeline({ scrollTrigger: { trigger: q('.hero')[0], start: 'top top', end: 'bottom top', scrub: true } })
        .fromTo(media, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(6% 5% 22% 5% round 26px)', ease: 'none', immediateRender: false }, 0)
        .fromTo(q('.hero__media video'), { scale: 1 }, { scale: 1.18, ease: 'none' }, 0)
        .fromTo(q('.hero__name'), { yPercent: 0 }, { yPercent: -38, ease: 'none' }, 0)
        .fromTo(q('.hero__foot, .hero__meta'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.5, immediateRender: false }, 0)
    }

    /* ── 2. Intro : sélection de texte groupe par groupe ── */
    const sweep = q('.sweep')[0]
    if (!REDUCE) {
      sweep.classList.add('is-armed')
      const tl = gsap.timeline({ scrollTrigger: { trigger: sweep, start: 'top 78%' } })
      q('.sweep .chunk').forEach((c, i) => {
        const st = { s: 0 }
        const set = () => c.style.setProperty('--sx', st.s)
        tl.to(st, { s: 1, duration: 0.42, ease: 'expo.inOut', onUpdate: set }, i * 0.16)
          .add(() => { c.classList.add('on'); c.style.setProperty('--orig', 'right') }, i * 0.16 + 0.42)
          .to(st, { s: 0, duration: 0.42, ease: 'expo.inOut', onUpdate: set }, i * 0.16 + 0.42)
      })
      gsap.from(q('.intro__cols p'), { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: q('.intro__cols')[0], start: 'top 85%' } })
    }

    /* ── 3. Signature : les glyphes se compilent en IK (section épinglée) ── */
    if (!REDUCE) {
      ScrollTrigger.create({
        trigger: q('.sig')[0], start: 'top top', end: '+=140%', pin: true, scrub: true,
        onUpdate: (s) => { sigProgress.current = s.progress },
      })
    } else sigProgress.current = 1

    /* ── 4. Dernières sorties : scroll horizontal épinglé (≥ 900 px) ── */
    const mm = gsap.matchMedia()
    add(() => mm.revert())
    mm.add({ wide: '(min-width: 900px)', reduce: '(prefers-reduced-motion: reduce)' }, (mctx) => {
      const { wide, reduce } = mctx.conditions
      if (reduce) return
      const track = q('.track')[0]
      if (wide) {
        const dist = () => track.scrollWidth - window.innerWidth
        const tw = gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: q('.run')[0], start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        })
        const now = q('.run__now')[0]
        q('.card:not(.card--end)').forEach((card) => {
          gsap.fromTo(card.querySelector('img'), { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } })
          gsap.from(card.querySelector('.shot__n'), { yPercent: 100, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, containerAnimation: tw, start: 'left 75%', toggleActions: 'play none none reverse' } })
          ScrollTrigger.create({ trigger: card, containerAnimation: tw, start: 'left center', end: 'right center', onToggle: (s) => { if (s.isActive) scrambleTo(now, card.dataset.n, 420) } })
        })
      } else {
        q('.card .shot').forEach((s) => gsap.from(s, { clipPath: 'inset(12% 8% 12% 8% round 18px)', ease: 'none', scrollTrigger: { trigger: s, start: 'top 95%', end: 'top 45%', scrub: true } }))
      }
    })

    if (REDUCE) return

    /* ── 5. Applis mobiles : deux vitesses ── */
    const pocket = q('.pocket')[0]
    const phones = q('.phones .phone')
    gsap.fromTo(phones[0], { y: 120 }, { y: -60, ease: 'none', scrollTrigger: { trigger: pocket, start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.fromTo(phones[1], { y: 240 }, { y: -140, rotate: -3, ease: 'none', scrollTrigger: { trigger: pocket, start: 'top bottom', end: 'bottom top', scrub: true } })

    /* ── 7. Marquee : accélère avec la vitesse de scroll ── */
    const boosts = q('.mrow').map((row, i) => {
      const dir = i === 0 ? -1 : 1
      let x = dir < 0 ? 0 : -row.scrollWidth / 2
      let b = 0
      const tick = () => {
        const w = row.scrollWidth / 2
        x += (0.6 + b) * dir
        b *= 0.92
        if (dir < 0 && x <= -w) x += w
        if (dir > 0 && x >= 0) x -= w
        row.style.transform = `translate3d(${x}px,0,0)`
      }
      gsap.ticker.add(tick)
      add(() => gsap.ticker.remove(tick))
      return (v) => { b = Math.min(Math.abs(v) / 120, 18) }
    })
    ScrollTrigger.create({ trigger: q('.marquee')[0], start: 'top bottom', end: 'bottom top', onUpdate: (s) => { const v = s.getVelocity(); boosts.forEach((f) => f(v)) } })
  })

  return (
    <div ref={ref} className="home">
      {/* 1 ── Hero */}
      <section className="hero" aria-label="Idrissa Kane">
        <div className="hero__media grain">
          <video src="/videos/keyword.mp4" autoPlay={!REDUCE} muted loop playsInline preload="auto" aria-hidden="true" />
        </div>
        <div className="hero__body wrap">
          <div className="hero__meta mono">
            <span><span className="dot" aria-hidden="true" />Disponible pour de nouveaux projets</span>
            <span>SN·00 · Dakar, Sénégal</span>
          </div>
          <SplitChars className="h-xl hero__name" lines={['Idrissa', 'Kane']} delay={0.35} />
          <div className="hero__foot">
            <p className="hero__tag" aria-label="serial|dev">
              <span className="hero__typed" aria-hidden="true">serial<span className="bar">|</span>dev</span>
              <span className="caret" aria-hidden="true" />
            </p>
            <p className="lede hero__lede">Développeur full stack. Web, mobile, paiement mobile money. Je conçois, je code et je mets en ligne, projet après projet.</p>
          </div>
        </div>
      </section>

      {/* 2 ── Intro */}
      <section className="intro wrap" aria-label="Présentation">
        <span className="mono" data-scramble>SN·00 · Depuis mes débuts</span>
        <p className="sweep" aria-label={SWEEP}>
          {CHUNKS.map((c, i) => <span className="chunk" key={i} aria-hidden="true"><span>{c}</span></span>)}
        </p>
        <div className="intro__cols">
          <p>Aujourd'hui, je réalise des apps web et mobiles de bout en bout. Mon moteur : résoudre des besoins réels avec une expérience claire.</p>
          <p>Laravel et React côté web, Flutter côté mobile. Wave, Orange Money, PayDunya et Stripe pour encaisser.</p>
        </div>
      </section>

      {/* 3 ── Signature IK */}
      <section className="sig" aria-label="Signature IK">
        <GlyphCanvas mode="compile" text="IK" progressRef={sigProgress} />
        <div className="sig__top wrap mono" data-scramble>{`Signature · ${STATS.total} projets compilés`}</div>
        <div className="sig__cap wrap">
          <p className="h-m">Chaque caractère vient d'un projet livré.</p>
          <span className="mono" aria-hidden="true">{'{ } </> ; $ → IK'}</span>
        </div>
      </section>

      {/* 4 ── Dernières sorties */}
      <section className="run" aria-label="Dernières sorties">
        <div className="run__head wrap">
          <h2 className="h-l">Dernières sorties</h2>
          <p className="run__count" aria-hidden="true">N°<b className="run__now">{RUN[0]?.n}</b> / {pad3(STATS.total)}</p>
        </div>
        <div className="track wrap">
          {RUN.map((p) => (
            <Link className="card" to={`/projets/${p.slug}`} key={p.slug} data-n={p.n}>
              <div className="shot">
                <img src={p.image} alt={`Capture de ${p.name}`} loading="lazy" decoding="async" />
                <span className="shot__n" aria-hidden="true">{p.n}</span>
                <span className="chip">{p.isLive ? <><span className="dot" aria-hidden="true" />En production</> : 'Archive'}</span>
              </div>
              <div className="card__row">
                <h3 className="card__name">{p.name}</h3>
                <span className="mono">{FILTER_LABEL[p.filter]} · {p.stack.slice(0, 2).join(' · ')}</span>
              </div>
            </Link>
          ))}
          <Link className="card card--end" to="/projets">
            <strong>Les {STATS.total}<br /><span>numéros →</span></strong>
          </Link>
        </div>
      </section>

      {/* 5 ── Applis mobiles */}
      <section className="pocket wrap" aria-label="Applications mobiles">
        <div>
          <p className="mono pocket__kicker" data-scramble>Applis mobiles · Flutter</p>
          <h2 className="h-l">Une codebase.<br /><span>Deux stores.</span></h2>
          <p className="lede pocket__lede">iOS et Android avec Flutter. Notifications push FCM, GPS, paiement mobile money, du MVP au produit fini.</p>
          <div className="pocket__list">
            {POCKET.map((p) => (
              <Link to={`/projets/${p.slug}`} key={p.slug}>
                <strong>{p.name}</strong>
                <span className="mono">N°{p.n} · {p.sub}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="phones">
          {POCKET.map((p) => <Phone key={p.slug} src={p.image} alt={`Écran de ${p.name}`} />)}
        </div>
      </section>

      {/* 6 ── Chiffres */}
      <section className="odo-row wrap" aria-label="Chiffres">
        <div><Odometer value={STATS.total} /><span className="mono">Projets dans la série</span></div>
        <div><Odometer value={STATS.live} /><span className="mono">En production</span></div>
        <div><Odometer value={STATS.years} /><span className="mono">Ans d'expérience</span></div>
      </section>

      {/* 7 ── Stack */}
      <section className="marquee" aria-label="Stack : React, Laravel, Flutter, TypeScript, PostgreSQL. Paiement : Wave, Orange Money, PayDunya, Stripe.">
        <div className="mrow" aria-hidden="true">{[...ROW_A, ...ROW_A].map((t, i) => <span key={i}>{t}</span>)}</div>
        <div className="mrow mrow--b" aria-hidden="true">{[...ROW_B, ...ROW_B].map((t, i) => <span key={i}>{t}</span>)}</div>
      </section>

      <NextPage to="/projets" kicker="Page suivante · SN·01" title="Projets" />
    </div>
  )
}
