import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { projects } from '../data/projects'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin)

/* Animated counter */
function AnimatedCounter({ target, suffix = '', duration = 1.8 }) {
  const ref = useRef(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        const num = parseFloat(target)
        gsap.fromTo({ val: 0 }, { val: num }, {
          duration,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].val) + suffix
          },
        })
      },
    })
    return () => st.kill()
  }, [target, suffix, duration])

  return <span ref={ref}>0{suffix}</span>
}

const FEATURED = [
  projects.find(p => p.slug === 'yankee'),
  projects.find(p => p.slug === 'jeli'),
  projects.find(p => p.slug === 'certifio'),
].filter(Boolean)

export default function HomePage() {
  const videoRef     = useRef(null)
  const titleRef     = useRef(null)
  const subtitleRef  = useRef(null)
  const taglineRef   = useRef(null)
  const actionsRef   = useRef(null)
  const scrollRef    = useRef(null)
  const pageRef      = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Initial states ── */
      gsap.set(videoRef.current,    { opacity: 0 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 })
      gsap.set(taglineRef.current,  { opacity: 0, y: 14 })
      gsap.set(actionsRef.current,  { opacity: 0, y: 20 })
      gsap.set(scrollRef.current,   { opacity: 0 })
      gsap.set('.hero-bar-top',     { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.hero-bar-bottom',  { scaleX: 0, transformOrigin: 'right center' })
      gsap.set('.hero-letterbox-top',    { y: '-100%' })
      gsap.set('.hero-letterbox-bottom', { y: '100%' })

      /* ── Title ScrambleText ── */
      gsap.set(titleRef.current, { opacity: 1 })
      titleRef.current.textContent = '████████ ████'

      const tl = gsap.timeline({ delay: 0.2 })

      /* Letterbox cinéma */
      tl.to('.hero-letterbox-top',    { y: '0%', duration: 0.7, ease: 'power3.out' }, 0)
      tl.to('.hero-letterbox-bottom', { y: '0%', duration: 0.7, ease: 'power3.out' }, 0)

      /* Vidéo fade in */
      tl.to(videoRef.current, { opacity: 1, duration: 1.4, ease: 'power2.inOut' }, 0.3)

      /* Barres horizontales */
      tl.to('.hero-bar-top',    { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, 0.5)
      tl.to('.hero-bar-bottom', { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, 0.65)

      /* ScrambleText sur le titre */
      tl.to(titleRef.current, {
        duration: 1.4,
        scrambleText: {
          text: 'IDRISSA KANE',
          chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          revealDelay: 0.4,
          speed: 0.4,
        },
        ease: 'none',
      }, 0.9)

      /* Subtitle + tagline + actions */
      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.8)
      tl.to(taglineRef.current,  { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 1.95)
      tl.to(actionsRef.current,  { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 2.1)
      tl.to(scrollRef.current,   { opacity: 1, duration: 0.4 }, 2.4)

      /* ── Glitch périodique sur le titre ── */
      const glitchLoop = gsap.timeline({ repeat: -1, repeatDelay: 6, delay: 4 })
      glitchLoop
        .to(titleRef.current, { skewX: 4, x: -4, duration: 0.06, ease: 'none' })
        .to(titleRef.current, { skewX: -2, x: 3, duration: 0.06, ease: 'none' })
        .to(titleRef.current, { skewX: 0, x: 0, duration: 0.06, ease: 'none' })
        .to(titleRef.current, { opacity: 0.8, duration: 0.04 }, '+=0.1')
        .to(titleRef.current, { opacity: 1, duration: 0.04 })

      /* ── Scroll reveals ── */
      ScrollTrigger.batch('.gsap-reveal', {
        onEnter: els => gsap.to(els, {
          opacity: 1, y: 0,
          duration: 0.6, stagger: 0.1, ease: 'power3.out',
        }),
        start: 'top 83%', once: true,
      })

      gsap.fromTo('.featured-item',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out',
          scrollTrigger: { trigger: '.featured-list', start: 'top 80%', once: true } }
      )
      gsap.fromTo('.about-teaser__card',
        { opacity: 0, y: 18, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: '.about-teaser__grid', start: 'top 83%', once: true } }
      )
      gsap.fromTo('.stat-item',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: '.stats-grid', start: 'top 83%', once: true } }
      )

    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef}>

      {/* ════════════ HERO ════════════ */}
      <section className="hero" aria-label="Introduction">

        {/* Film grain */}
        <div className="hero-grain" aria-hidden="true" />

        {/* Letterbox cinéma */}
        <div className="hero-letterbox-top"  aria-hidden="true" />
        <div className="hero-letterbox-bottom" aria-hidden="true" />

        {/* Vidéo background — verticale CSS-rotated */}
        <div className="hero-video-wrap" aria-hidden="true">
          <video
            ref={videoRef}
            className="hero-video"
            src="/videos/keyword.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>

        {/* Overlay sombre */}
        <div className="hero-overlay" aria-hidden="true" />

        {/* Content */}
        <div className="hero__content">

          {/* Barres horizontales décoratives */}
          <div className="hero-bar hero-bar-top"    aria-hidden="true" />
          <div className="hero-bar hero-bar-bottom" aria-hidden="true" />

          {/* Titre principal */}
          <h1
            ref={titleRef}
            className="hero__title"
            aria-label="Idrissa Kane"
          >
            IDRISSA KANE
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} className="hero__subtitle">
            Développeur Full Stack
          </p>

          {/* Tagline mono */}
          <p ref={taglineRef} className="hero__tagline">
            React · Flutter · Laravel · MySQL · Dakar
          </p>

          {/* Actions */}
          <div ref={actionsRef} className="hero__actions">
            <Link to="/projets" className="btn btn--primary" data-cursor="VOIR">
              Voir mes projets
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/contact" className="btn btn--ghost" data-cursor="CONTACT">Me contacter</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollRef} className="hero__scroll" aria-hidden="true">
          <span className="hero__scroll-label">Scroll</span>
          <span className="hero__scroll-line" />
        </div>
      </section>

      {/* ════════════ MARQUEE ════════════ */}
      <div className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          {['React','Flutter','Laravel','MySQL','PHP','Dart','JavaScript','API REST','Mobile','Web',
            'React','Flutter','Laravel','MySQL','PHP','Dart','JavaScript','API REST','Mobile','Web',
          ].map((item, i) => (
            <span key={i} className="marquee-item">
              {item}<span className="marquee-sep"> · </span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════ STATS ════════════ */}
      <section className="stats-section" aria-label="En chiffres">
        <div className="stats-grid">
          {[
            { target: '20', suffix: '+',  label: 'Projets livrés' },
            { target: '2',  suffix: '',   label: "Ans d'expérience" },
            { target: '100',suffix: '%',  label: 'Satisfaction client' },
          ].map(({ target, suffix, label }) => (
            <div key={label} className="stat-item">
              <div className="stat-item__value">
                <AnimatedCounter target={target} suffix={suffix} />
              </div>
              <div className="stat-item__label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ FEATURED PROJECTS ════════════ */}
      <section className="featured-section" aria-label="Projets récents">
        <div className="featured-header gsap-reveal">
          <div>
            <div className="eyebrow">Sélection</div>
            <h2>Projets récents</h2>
          </div>
          <Link to="/projets" className="btn btn--ghost">
            Tous les projets
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="featured-list">
          {FEATURED.map((p, i) => (
            <a key={p.id} href={p.link} target="_blank" rel="noreferrer" className="featured-item" data-cursor="OUVRIR">
              <span className="featured-item__num">0{i + 1}</span>
              <div>
                <div className="featured-item__title">{p.title}</div>
                <div className="featured-item__tags">
                  {p.stack.slice(0, 4).map(t => <span key={t} className="chip">{t}</span>)}
                </div>
              </div>
              <div className="featured-item__arrow" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ════════════ ABOUT TEASER ════════════ */}
      <section className="about-teaser" aria-label="À propos">
        <div className="about-teaser__left">
          <div className="eyebrow gsap-reveal">À propos</div>
          <h2 className="gsap-reveal">Développeur Full&nbsp;Stack basé à Dakar</h2>
          <p className="gsap-reveal">
            Je conçois et développe des applications web et mobiles de bout en bout.
            Du back-end Laravel à l'animation React — une seule interlocution.
          </p>
          <Link to="/a-propos" className="btn btn--ghost gsap-reveal">
            En savoir plus
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="about-teaser__grid">
          {[
            { title: 'Full Stack',  text: "Du modèle de données à l'animation UI.",
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
            { title: 'Mobile',     text: 'Apps iOS et Android avec Flutter & React Native.',
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
            { title: 'Backend',    text: 'APIs REST robustes avec Laravel et PHP.',
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M5 6h14M5 18h7"/></svg> },
            { title: 'Paiement',   text: 'Wave, Orange Money, PayDunya intégrés.',
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
          ].map(({ title, text, icon }) => (
            <div key={title} className="about-teaser__card">
              <div className="about-teaser__card-icon">{icon}</div>
              <div className="about-teaser__card-title">{title}</div>
              <div className="about-teaser__card-text">{text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ CTA ════════════ */}
      <section className="cta-section" aria-label="Contact">
        <div className="eyebrow gsap-reveal" style={{ justifyContent: 'center' }}>Parlons-en</div>
        <h2 className="gsap-reveal">Un projet en tête ?</h2>
        <p className="gsap-reveal">Premier échange gratuit. Décrivez votre idée — je vous réponds sous 24h.</p>
        <div className="btn-row gsap-reveal">
          <Link to="/contact" className="btn btn--primary">
            Démarrer un projet
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <a href="/CV_IDRISSA_M_KANE.pdf" target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            Télécharger le CV
          </a>
        </div>
      </section>

    </div>
  )
}
