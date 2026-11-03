import { useRef } from 'react'
import { gsap, ScrollTrigger, REDUCE } from '../lib/motion'
import { usePageMotion } from '../lib/usePageMotion'
import { STATS } from '../lib/site'
import SplitChars from '../components/SplitChars'
import AsciiPortrait from '../components/AsciiPortrait'
import Odometer from '../components/Odometer'
import NextPage from '../components/NextPage'

const COMMITS = [
  { ref: <>branch <b>main</b> · formation</>, title: 'ESTM Dakar', text: 'Licence Informatique, parcours GLAR. En troisième année.' },
  { ref: <>branch <b>freelance</b> · ikdev.tech</>, title: 'IkDev', text: 'Sites et applis pour des clients à Dakar : salons, restaurants, marques, écoles.' },
  { ref: <>merge <b>dakarapps</b> · 2 mois</>, title: 'DakarApps', text: 'Stage en développement mobile.' },
  { ref: <>merge <b>ataaba</b> · juin → oct. 2026</>, title: 'ATAABA Entreprise', text: "Stagiaire puis lead de l'équipe IT. Finora360, PayTrack, ProjetInvest, ImmoClair." },
  { ref: <>HEAD → <b>main</b></>, title: 'Disponible', text: "Ouvert aux nouveaux projets et au stage de fin d'études." },
]

const VALUES = [
  { title: 'Vision full stack', text: "Autonomie totale sur l'ensemble d'un projet : du modèle de données jusqu'à l'animation de l'interface." },
  { title: 'Focus utilisateur', text: "Une app puissante ne vaut rien si l'utilisateur s'y perd. L'UX est au cœur de chaque décision." },
  { title: "Esprit d'initiative", text: "Toujours force de proposition. Améliorer le code, le design ou l'expérience globale fait partie du travail." },
]

/* Graphe git : main à gauche, branche freelance à droite qui se rejoint sur HEAD */
function layoutGraph(svg, wrap, items) {
  const H = wrap.offsetHeight, W = svg.clientWidth
  const mx = W * 0.3, bx = W * 0.72
  const ys = items.map((it) => it.offsetTop + 18)
  const main = `M${mx} 0 L${mx} ${ys[ys.length - 1]}`
  const br = `M${mx} ${ys[0]} C${mx} ${ys[0] + 40} ${bx} ${ys[0] + 30} ${bx} ${ys[1]} L${bx} ${ys[3] + 20} C${bx} ${ys[3] + 60} ${mx} ${ys[4] - 60} ${mx} ${ys[4]}`
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
  svg.style.height = `${H}px`
  svg.querySelectorAll('[data-g="main"]').forEach((p) => p.setAttribute('d', main))
  svg.querySelectorAll('[data-g="br"]').forEach((p) => p.setAttribute('d', br))
  svg.querySelectorAll('.node').forEach((n, k) => { n.setAttribute('cx', k === 1 ? bx : mx); n.setAttribute('cy', ys[k]) })
}

export default function AboutPage() {
  const ref = useRef(null)
  const progress = useRef(REDUCE ? 1 : 0)
  const pct = useRef(null)

  usePageMotion(ref, ({ q, add }) => {
    const svg = q('.log svg')[0], wrap = q('.log__wrap')[0], items = q('.commit')
    const relayout = () => layoutGraph(svg, wrap, items)
    relayout()
    ScrollTrigger.addEventListener('refreshInit', relayout)
    add(() => ScrollTrigger.removeEventListener('refreshInit', relayout))

    if (REDUCE) { if (pct.current) pct.current.textContent = 'rendu 100%'; return }

    // portrait : épinglé sur desktop, simple scrub au passage sur mobile
    const mm = gsap.matchMedia()
    add(() => mm.revert())
    const setP = (s) => { progress.current = s.progress }
    mm.add('(min-width: 900px)', () => {
      ScrollTrigger.create({ trigger: q('.ascii')[0], start: 'top top', end: '+=130%', pin: true, scrub: true, onUpdate: setP })
    })
    mm.add('(max-width: 899px)', () => {
      ScrollTrigger.create({ trigger: q('.ascii__cv')[0], start: 'top 75%', end: 'bottom 35%', scrub: true, onUpdate: setP })
    })
    gsap.from(q('.ascii__txt p'), { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: q('.ascii__txt')[0], start: 'top 80%' } })

    // tracé du graphe au scroll (pathLength=1 : indépendant de la géométrie)
    gsap.fromTo(q('[data-mask="main"]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top 70%', end: 'bottom 70%', scrub: true } })
    gsap.fromTo(q('[data-mask="br"]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top 60%', end: 'bottom 75%', scrub: true } })
    q('.node').forEach((n, k) => gsap.from(n, { attr: { r: 0 }, duration: 0.8, ease: 'back.out(3)', scrollTrigger: { trigger: items[k], start: 'top 70%' } }))
    items.forEach((c) => gsap.from(c.children, { x: 40, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 72%' } }))
    q('.vals h3 span').forEach((s, k) => gsap.from(s, { yPercent: 105, duration: 1.2, delay: k * 0.1, ease: 'expo.out', scrollTrigger: { trigger: q('.vals')[0], start: 'top 80%' } }))
  })

  return (
    <div ref={ref} className="about">
      <section className="a-head wrap">
        <span className="mono" data-scramble>SN·03 · À propos</span>
        <SplitChars className="h-xl a-title" lines={["L'humain", 'derrière', 'le code']} />
      </section>

      <section className="ascii wrap" aria-label="Portrait">
        <div className="ascii__cv grain">
          <AsciiPortrait src="/images/profil-crop.webp" alt="Portrait d'Idrissa Kane, rendu d'abord en caractères puis en photo" progressRef={progress} pctRef={pct} />
        </div>
        <div className="ascii__txt">
          <span className="mono" ref={pct} aria-hidden="true">rendu 000%</span>
          <p>Depuis mes débuts, j'ai toujours voulu passer de l'usage à la création. Construire des outils utiles, simples et fiables.</p>
          <p>Aujourd'hui, je réalise des apps web et mobiles de bout en bout. Mon moteur : résoudre des besoins réels avec une expérience claire.</p>
          <p className="mono ascii__who">Idrissa Mamadou Kane · Dakar, Sénégal</p>
        </div>
      </section>

      <section className="log wrap" aria-label="Parcours">
        <span className="mono" data-scramble>git log --graph · parcours</span>
        <div className="log__wrap">
          <svg aria-hidden="true">
            <defs>
              <mask id="mk-main" maskUnits="userSpaceOnUse"><path data-g="main" data-mask="main" pathLength="1" stroke="#fff" strokeWidth="10" fill="none" strokeDasharray="1" strokeDashoffset={REDUCE ? 0 : 1} /></mask>
              <mask id="mk-br" maskUnits="userSpaceOnUse"><path data-g="br" data-mask="br" pathLength="1" stroke="#fff" strokeWidth="10" fill="none" strokeDasharray="1" strokeDashoffset={REDUCE ? 0 : 1} /></mask>
            </defs>
            <path data-g="main" mask="url(#mk-main)" fill="none" stroke="#f1f0ec" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 9" />
            <path data-g="br" mask="url(#mk-br)" fill="none" stroke="#8f8e94" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 9" />
            {COMMITS.map((c, k) => <circle key={c.title} className="node" r="7" fill={k === COMMITS.length - 1 ? '#34c759' : '#f1f0ec'} />)}
          </svg>
          <ol className="log__items">
            {COMMITS.map((c) => (
              <li className="commit" key={c.title}>
                <span className="mono">{c.ref}</span>
                <h2>{c.title}</h2>
                <p>{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap" aria-label="Valeurs">
        <span className="mono" data-scramble>Comment je travaille</span>
        <div className="vals">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3><span>{v.title}</span></h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="odo-row wrap" aria-label="Chiffres">
        <div><Odometer value={20} suffix="+" /><span className="mono">Projets livrés</span></div>
        <div><Odometer value={STATS.live} /><span className="mono">En production</span></div>
        <div><Odometer value={STATS.years} /><span className="mono">Ans d'expérience</span></div>
      </section>

      <NextPage to="/contact" kicker="Page suivante · SN·04" title="Contact" />
    </div>
  )
}
