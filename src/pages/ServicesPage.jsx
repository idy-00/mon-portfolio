import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

function ServiceCard({ num, icon, title, description, tags, delay = 0 }) {
  const ref = useRef(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 22 })
  const sy = useSpring(y, { stiffness: 160, damping: 22 })
  const rotateX = useTransform(sy, [-0.5, 0.5], ['5deg', '-5deg'])
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-5deg', '5deg'])

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} className="service-card"
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: '900px' }}
    >
      <span className="service-card__num">{num}</span>
      <div className="service-card__icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="chip-grid">
        {tags.map(t => <span key={t} className="chip">{t}</span>)}
      </div>
    </motion.div>
  )
}

const SERVICES = [
  {
    num: '01',
    title: 'Applications Mobiles',
    description: "Apps iOS et Android avec Flutter — une seule codebase, deux plateformes. Notifications push FCM, GPS, paiement mobile money, du MVP au produit fini.",
    tags: ['Flutter', 'Dart', 'iOS', 'Android', 'Firebase FCM'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Applications Web & SaaS',
    description: "Apps web et SaaS claires, scalables, orientées usage. Architecture propre, données bien posées.",
    tags: ['React', 'Laravel 12', 'MySQL', 'WebSockets', 'API REST'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'E-Commerce & Paiement',
    description: "Boutiques rapides et sécurisées. Paiement intégré, stock et commandes bien gérés.",
    tags: ['Laravel', 'PayDunya', 'PHP', 'MySQL', 'Stripe'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Sites Vitrines & Portfolios',
    description: "Sites clairs et rapides, pensés pour convertir. Design propre, SEO soigné, animations utiles.",
    tags: ['React', 'GSAP', 'SEO', 'Responsive', 'Animations'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
]

export default function ServicesPage() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.services-page-header > *',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.05 }
      )
      gsap.fromTo('.service-card',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.services-grid', start: 'top 78%', once: true } }
      )
      gsap.fromTo('.services-cta',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: '.services-cta', start: 'top 82%', once: true } }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={pageRef}>
      {/* ── Header ── */}
      <div className="services-page-header">
        <div>
          <div className="eyebrow eyebrow--accent">Ce que je construis</div>
          <h1>Mes <em>Services</em></h1>
        </div>
        <p>
          Du cadrage à la mise en ligne, je prends en charge chaque étape du projet.
          Une seule interlocution, du début à la fin.
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} {...s} delay={i * 0.08} />
        ))}
      </div>

      {/* ── CTA ── */}
      <section className="services-cta">
        <div className="eyebrow eyebrow--accent" style={{ justifyContent: 'center' }}>Prêt à démarrer ?</div>
        <h2>Un projet en tête ?</h2>
        <p>Parlons-en — premier échange gratuit, sans engagement.</p>
        <Link to="/contact" className="btn btn--primary">
          Discutons-en
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </section>
    </main>
  )
}
