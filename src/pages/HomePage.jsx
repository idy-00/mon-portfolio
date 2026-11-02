import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { projects } from '../data/projects'

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin)

/*
 * serial|dev — la page d'accueil raconte une chaîne de production.
 * Le curseur « | » du hero devient un fil qui se dessine au scroll,
 * traverse chaque chapitre (SN·01 → SN·04) et finit sa course dans
 * le prochain numéro de série : le projet du visiteur.
 */

const pad = (n, size = 2) => String(n).padStart(size, '0')

const TOTAL = projects.length
const LIVE = projects.filter(p => p.live).length
const NEXT_SERIAL = `N°${pad(TOTAL + 1, 3)}`

const RELEASES = ['finora360', 'paytrack', 'jeli']
  .map(slug => projects.find(p => p.slug === slug))
  .filter(Boolean)

const METHOD = [
  { cmd: 'init',  title: 'Cadrer',
    text: "Besoin, utilisateurs, budget. Un cahier des charges clair avant la première ligne de code." },
  { cmd: 'build', title: 'Construire',
    text: "Web, mobile et API — React, Flutter, Laravel. Une seule personne, du modèle de données à l'animation." },
  { cmd: 'test',  title: 'Vérifier',
    text: "Des tests automatisés là où une erreur coûte cher : paiements, rôles, données. Finora360 en compte plus de 270." },
  { cmd: 'ship',  title: 'Livrer',
    text: "Mise en ligne, nom de domaine, Wave et Orange Money branchés. Puis le suivi, après la livraison." },
]

function Counter({ value }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const o = { v: 0 }
        gsap.to(o, { v: value, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v) } })
      },
    })
    return () => st.kill()
  }, [value])
  return <span ref={ref}>{value}</span>
}

function ChapterLabel({ n, children }) {
  return (
    <div className="sx-label">
      <span className="sx-label__sn">SN·{pad(n)}</span>
      <span className="sx-label__rule" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

export default function HomePage() {
  const pageRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
      ({ conditions }) => {
        if (conditions.reduce) {
          gsap.set('.sx-thread__fill', { scaleY: 1 })
          gsap.set('.sx-node', { className: 'sx-node is-on' })
          return
        }

        /* ── 1. Boot : la vidéo s'allume, le nom se décode, le curseur apparaît ── */
        gsap.set(['.sx-hero__meta', '.sx-hero__sig', '.sx-hero__sub', '.sx-hero__actions', '.sx-hero__cue'], { autoAlpha: 0, y: 16 })
        gsap.set('.sx-hero__video', { autoAlpha: 0, scale: 1.08 })
        titleRef.current.textContent = '██████ ████'

        const boot = gsap.timeline({ delay: 0.15 })
        boot
          .to('.sx-hero__video', { autoAlpha: 1, scale: 1, duration: 1.8, ease: 'power2.out' }, 0)
          .to('.sx-hero__meta', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.4)
          .to(titleRef.current, {
            duration: 1.3,
            scrambleText: { text: 'IDRISSA KANE', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', revealDelay: 0.3, speed: 0.45 },
            ease: 'none',
          }, 0.55)
          .to('.sx-hero__sig', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 1.5)
          .to('.sx-hero__sub', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.75)
          .to('.sx-hero__actions', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.9)
          .to('.sx-hero__cue', { autoAlpha: 1, y: 0, duration: 0.5 }, 2.2)

        /* ── 2. On quitte le hero : le contenu s'efface, la vidéo plonge ── */
        gsap.to('.sx-hero__content', {
          yPercent: -18, autoAlpha: 0, ease: 'none',
          scrollTrigger: { trigger: '.sx-hero', start: 'top top', end: 'bottom 35%', scrub: true },
        })
        gsap.to('.sx-hero__video', {
          scale: 1.15, ease: 'none',
          scrollTrigger: { trigger: '.sx-hero', start: 'top top', end: 'bottom top', scrub: true },
        })

        /* ── 3. Le fil : le curseur s'étire et descend avec la lecture,
                 puis termine sa course au centre du prochain numéro ── */
        const story = pageRef.current.querySelector('.sx-story')
        const threadEl = story.querySelector('.sx-thread')
        const target = story.querySelector('.sx-next__serial')
        const fitThread = () => {
          const s = story.getBoundingClientRect()
          const t = target.getBoundingClientRect()
          threadEl.style.bottom = 'auto'
          threadEl.style.height = `${t.top - s.top}px` // le fil s'arrête au bord du numéro
        }
        fitThread()
        ScrollTrigger.addEventListener('refreshInit', fitThread)

        const thread = {
          trigger: '.sx-story', start: 'top 55%',
          endTrigger: '.sx-next__serial', end: 'top 55%',
          scrub: 0.6,
        }
        // quand la tête du fil touche le numéro, il s'allume
        ScrollTrigger.create({ trigger: '.sx-next__serial', start: 'top 55%', toggleClass: 'is-lit' })
        gsap.fromTo('.sx-thread__fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: thread })
        gsap.fromTo('.sx-thread__head', { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: thread })

        gsap.utils.toArray('.sx-node').forEach(node => {
          ScrollTrigger.create({ trigger: node, start: 'top 55%', toggleClass: 'is-on' })
        })

        /* ── 4. Les chapitres entrent ── */
        gsap.utils.toArray('.sx-reveal').forEach(el => {
          gsap.from(el, {
            autoAlpha: 0, y: 28, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })

        const narrow = window.matchMedia('(max-width: 860px)').matches
        gsap.utils.toArray('.sx-release').forEach(el => {
          const fromLeft = el.classList.contains('sx-release--left')
          gsap.from(el.querySelector('.sx-release__shot'), {
            clipPath: fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
            duration: 1.1, ease: 'power4.inOut',
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          })
          gsap.from(el.querySelector('.sx-release__body'), {
            autoAlpha: 0, duration: 0.8, ease: 'power3.out', delay: 0.25,
            ...(narrow ? { y: 24 } : { x: fromLeft ? 30 : -30 }),
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          })
        })

        gsap.from('.sx-step', {
          autoAlpha: 0, y: 24, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.sx-steps', start: 'top 80%', once: true },
        })

        /* ── 5. Arrivée : le prochain numéro se décode ── */
        const serial = pageRef.current.querySelector('.sx-next__serial')
        serial.textContent = 'N°---'
        gsap.to(serial, {
          duration: 1.4,
          scrambleText: { text: NEXT_SERIAL, chars: '0123456789', speed: 0.5 },
          scrollTrigger: { trigger: '.sx-next', start: 'top 70%', once: true },
        })

        return () => ScrollTrigger.removeEventListener('refreshInit', fitThread)
      },
      pageRef.current,
    )

    return () => mm.revert()
  }, [])

  return (
    <div ref={pageRef} className="sx">

      {/* ════════ SN·00 — BOOT ════════ */}
      <section className="sx-hero" aria-label="Introduction">
        <video
          className="sx-hero__video"
          src="/videos/keyword.mp4"
          autoPlay loop muted playsInline preload="auto"
          aria-hidden="true"
        />
        <div className="sx-hero__shade" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />

        <div className="sx-hero__content">
          <p className="sx-hero__meta">
            <span className="sx-rec" aria-hidden="true" /> SN·00 — Dakar, Sénégal
          </p>
          <h1 ref={titleRef} className="sx-hero__title" aria-label="Idrissa Kane">IDRISSA KANE</h1>
          <p className="sx-hero__sig" aria-label="serial dev">
            <span>serial</span><span className="sx-caret" aria-hidden="true">|</span><span>dev</span>
          </p>
          <p className="sx-hero__sub">
            Développeur full stack. Web, mobile, paiement mobile money&nbsp;— je conçois,
            je code et je mets en ligne, projet après projet.
          </p>
          <div className="sx-hero__actions">
            <Link to="/projets" className="btn btn--primary">Voir la série <Arrow /></Link>
            <Link to="/contact" className="btn btn--ghost">Démarrer un projet</Link>
          </div>
        </div>

        <div className="sx-hero__cue" aria-hidden="true">
          <span>scroll</span>
          <span className="sx-hero__cue-line" />
        </div>
      </section>

      {/* ════════ La pile ════════ */}
      <div className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          {['React', 'Flutter', 'Laravel', 'PostgreSQL', 'MySQL', 'PHP', 'Dart', 'TypeScript', 'Wave', 'Orange Money',
            'React', 'Flutter', 'Laravel', 'PostgreSQL', 'MySQL', 'PHP', 'Dart', 'TypeScript', 'Wave', 'Orange Money',
          ].map((item, i) => (
            <span key={i} className="marquee-item">{item}<span className="marquee-sep"> | </span></span>
          ))}
        </div>
      </div>

      {/* ════════ Le fil ════════ */}
      <div className="sx-story">
        <div className="sx-thread" aria-hidden="true">
          <span className="sx-thread__fill" />
          <span className="sx-thread__head" />
        </div>

        {/* SN·01 — LA SÉRIE */}
        <section className="sx-chapter" aria-labelledby="sx-serie">
          <span className="sx-node" aria-hidden="true" />
          <ChapterLabel n={1}>La série</ChapterLabel>
          <h2 id="sx-serie" className="sx-statement sx-reveal">
            <Counter value={TOTAL} /> projets sortis de l'atelier.{' '}
            <em><Counter value={LIVE} /> sont en ligne</em> en ce moment.
            Un seul développeur, du cahier des charges à la mise en production.
          </h2>
          <dl className="sx-figures sx-reveal">
            <div><dt>Projets</dt><dd>{pad(TOTAL)}</dd></div>
            <div><dt>En ligne</dt><dd>{pad(LIVE)}</dd></div>
            <div><dt>Années</dt><dd>02</dd></div>
            <div><dt>Base</dt><dd>DKR</dd></div>
          </dl>
        </section>

        {/* SN·02 — DERNIÈRES SORTIES */}
        <section className="sx-chapter" aria-labelledby="sx-sorties">
          <span className="sx-node" aria-hidden="true" />
          <ChapterLabel n={2}>Dernières sorties</ChapterLabel>
          <h2 id="sx-sorties" className="sx-title sx-reveal">Les plus gros numéros</h2>

          <div className="sx-releases">
            {RELEASES.map((p, i) => (
              <Link
                key={p.slug}
                to={`/projets/${p.slug}`}
                className={`sx-release ${i % 2 === 0 ? 'sx-release--left' : 'sx-release--right'}`}
               
              >
                <div className="sx-release__shot">
                  {p.screenshot && <img src={p.screenshot} alt={`Aperçu de ${p.title}`} loading="lazy" decoding="async" />}
                  <span className="sx-corner sx-corner--tl" aria-hidden="true" />
                  <span className="sx-corner sx-corner--br" aria-hidden="true" />
                </div>
                <div className="sx-release__body">
                  <span className="sx-release__sn">N°{pad(projects.indexOf(p) + 1, 3)} · {p.year}</span>
                  <h3 className="sx-release__title">{p.title}</h3>
                  <p className="sx-release__text">{p.summary}</p>
                  <div className="sx-release__tags">
                    {p.stack.slice(0, 4).map(t => <span key={t} className="chip">{t}</span>)}
                  </div>
                  <span className="sx-release__cta">
                    {p.live ? <><span className="sx-live" aria-hidden="true" /> En ligne</> : 'Voir la fiche'} <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="sx-center sx-reveal">
            <Link to="/projets" className="btn btn--ghost">Voir les {TOTAL} de la série <Arrow /></Link>
          </div>
        </section>

        {/* SN·03 — LA MÉTHODE */}
        <section className="sx-chapter" aria-labelledby="sx-methode">
          <span className="sx-node" aria-hidden="true" />
          <ChapterLabel n={3}>La méthode</ChapterLabel>
          <h2 id="sx-methode" className="sx-title sx-reveal">Du clavier à la production</h2>
          <ol className="sx-steps">
            {METHOD.map((s, i) => (
              <li key={s.cmd} className="sx-step">
                <span className="sx-step__cmd"><span aria-hidden="true">$ </span>{s.cmd}</span>
                <span className="sx-step__n" aria-hidden="true">{pad(i + 1)}</span>
                <h3 className="sx-step__title">{s.title}</h3>
                <p className="sx-step__text">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="sx-center sx-reveal">
            <Link to="/a-propos" className="btn btn--ghost">Qui est derrière <Arrow /></Link>
          </div>
        </section>

        {/* SN·04 — PROCHAIN NUMÉRO : le fil finit sa course ici */}
        <section className="sx-chapter sx-next" aria-labelledby="sx-next">
          <span className="sx-node sx-node--end" aria-hidden="true" />
          <ChapterLabel n={4}>Prochain numéro</ChapterLabel>
          <p className="sx-next__serial" aria-hidden="true">{NEXT_SERIAL}</p>
          <h2 id="sx-next" className="sx-next__title sx-reveal">
            Le prochain de la série, c'est votre projet<span className="sx-caret" aria-hidden="true">|</span>
          </h2>
          <p className="sx-next__text sx-reveal">Premier échange gratuit. Décrivez votre idée — je vous réponds sous 24&nbsp;h.</p>
          <div className="btn-row sx-reveal">
            <Link to="/contact" className="btn btn--primary">Démarrer un projet <Arrow /></Link>
            <a href="/CV_IDRISSA_M_KANE.pdf" target="_blank" rel="noopener noreferrer" className="btn btn--ghost">Télécharger le CV</a>
          </div>
        </section>
      </div>
    </div>
  )
}
