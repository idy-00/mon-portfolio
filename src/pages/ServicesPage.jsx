import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger, REDUCE } from '../lib/motion'
import { usePageMotion } from '../lib/usePageMotion'
import { BY_SLUG } from '../lib/site'
import SplitChars from '../components/SplitChars'
import Phone from '../components/Phone'
import NextPage from '../components/NextPage'

const SERVICES = [
  {
    title: 'Applications mobiles',
    text: 'Apps iOS et Android avec Flutter. Une seule codebase, deux plateformes. Notifications push FCM, GPS, paiement mobile money, du MVP au produit fini.',
    tags: ['Flutter', 'Dart', 'iOS', 'Android', 'Firebase FCM'],
    visual: 'sunufoot',
  },
  {
    title: 'Applications web & SaaS',
    text: 'Apps web et SaaS claires, scalables, orientées usage. Architecture propre, données bien posées.',
    tags: ['React', 'Laravel 12', 'MySQL', 'WebSockets', 'API REST'],
    visual: 'finora360',
  },
  {
    title: 'E‑commerce & paiement',
    text: 'Boutiques rapides et sécurisées. Paiement intégré, stock et commandes bien gérés.',
    tags: ['Laravel', 'PayDunya', 'PHP', 'MySQL', 'Stripe'],
    visual: 'emirati-vape',
  },
  {
    title: 'Sites vitrines & portfolios',
    text: 'Sites clairs et rapides, pensés pour convertir. Design propre, SEO soigné, animations utiles.',
    tags: ['React', 'GSAP', 'SEO', 'Responsive', 'Animations'],
    visual: 'caane-jewelry',
  },
]

const TERMINAL = [
  ['p', '$ cadrage --besoin'],
  ['o', "Le besoin, le périmètre, le budget. Rien n'est codé avant."],
  ['p', '$ maquettes --charte client'],
  ['o', 'Écrans validés avec vous, sur votre identité.'],
  ['p', '$ build --web --mobile --api'],
  ['o', 'Laravel, React, Flutter. Paiement local branché.'],
  ['p', '$ deploy --prod'],
  ['o', 'Mise en ligne, domaine, emails.'],
  ['p', '$ suivi --maintenance'],
  ['o', 'Un seul interlocuteur après la livraison.'],
]

function Visual({ slug }) {
  const p = BY_SLUG[slug]
  if (!p?.image) return <div className="scard__vis" />
  if (p.isPhone) return <div className="scard__vis scard__vis--phone"><Phone src={p.image} alt={`${p.name} sur mobile`} /></div>
  return <div className="scard__vis"><img src={p.image} alt={`Capture de ${p.name}`} loading="lazy" decoding="async" /></div>
}

function line(kind, text) {
  const d = document.createElement('div')
  d.className = kind
  d.textContent = text
  return d
}

export default function ServicesPage() {
  const ref = useRef(null)

  usePageMotion(ref, ({ q, add }) => {
    const body = q('.term__body')[0]
    const cards = q('.scard')

    if (REDUCE) { body.replaceChildren(...TERMINAL.map(([k, s]) => line(k, s))); return }

    // cartes empilées : la précédente rétrécit et s'assombrit quand la suivante arrive (desktop)
    const mm = gsap.matchMedia()
    add(() => mm.revert())
    mm.add('(min-width: 861px)', () => {
      cards.forEach((c, i) => {
        if (i === cards.length - 1) return
        gsap.to(c, { scale: 0.9, filter: 'brightness(.45)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 12%', scrub: true } })
      })
    })
    cards.forEach((c) => {
      gsap.from(c.querySelector('h2'), { yPercent: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 70%' } })
      const vis = c.querySelector('.scard__vis img, .scard__vis .phone')
      if (vis) gsap.fromTo(vis, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'top 15%', scrub: true } })
    })

    /* Terminal : se tape tout seul à l'entrée dans l'écran */
    let timer
    add(() => clearTimeout(timer))
    body.replaceChildren()
    ScrollTrigger.create({
      trigger: q('.term')[0], start: 'top 75%', once: true,
      onEnter: () => {
        let i = 0
        const next = () => {
          if (i >= TERMINAL.length) {
            const prompt = document.createElement('span')
            prompt.className = 'p'
            prompt.textContent = '$ '
            const caret = document.createElement('span')
            caret.className = 'caret'
            body.append(prompt, caret)
            return
          }
          const [kind, s] = TERMINAL[i]
          const d = line(kind, '')
          body.appendChild(d)
          let k = 0
          const type = () => {
            d.textContent = s.slice(0, ++k)
            if (k < s.length) timer = setTimeout(type, kind === 'p' ? 28 : 10)
            else { i++; timer = setTimeout(next, kind === 'p' ? 160 : 340) }
          }
          type()
        }
        next()
      },
    })
  })

  return (
    <div ref={ref} className="services">
      <section className="s-head wrap">
        <span className="mono" data-scramble>SN·02 · Ce que je construis</span>
        <SplitChars className="h-xl" text="Services" />
        <p className="lede">Du cadrage à la mise en ligne, je prends en charge chaque étape du projet. Un seul interlocuteur, du début à la fin.</p>
      </section>

      <section className="stackcards wrap" aria-label="Services">
        {SERVICES.map((s, i) => (
          <article className="scard" key={s.title}>
            <div className="scard__txt">
              <span className="scard__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <ul className="pills" aria-label="Outils">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>
            <Visual slug={s.visual} />
          </article>
        ))}
      </section>

      <section className="process wrap" aria-label="Méthode">
        <div className="process__txt">
          <span className="mono" data-scramble>Méthode</span>
          <h2 className="h-l">Du cadrage à la mise en ligne.</h2>
          <p className="lede">Premier échange gratuit, sans engagement.</p>
          <Link className="btn btn--solid" to="/contact">Démarrer un projet</Link>
        </div>
        <div className="term" role="img" aria-label={`Étapes d'un projet : ${TERMINAL.filter(([k]) => k === 'o').map(([, s]) => s).join(' ')}`}>
          <div className="term__bar" aria-hidden="true"><i /><i /><i /><span>idy@dakar: ~/nouveau-projet</span></div>
          <div className="term__body" aria-hidden="true" />
        </div>
      </section>

      <NextPage to="/a-propos" kicker="Page suivante · SN·03" title="À propos" />
    </div>
  )
}
