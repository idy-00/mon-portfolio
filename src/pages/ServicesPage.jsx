import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

/* ── Mouse parallax card ── */
function ServiceCard({ number, icon, title, description, tags, delay = 0 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 22 })
  const sy = useSpring(y, { stiffness: 180, damping: 22 })
  const rotateX = useTransform(sy, [-0.5, 0.5], ['6deg', '-6deg'])
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-6deg', '6deg'])

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      className="service-card"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: '800px' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <span className="service-card__number">{number}</span>
      <div className="service-card__icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="service-card__tags">
        {tags.map(t => <span key={t} className="chip">{t}</span>)}
      </div>
    </motion.div>
  )
}

const SERVICES = [
  {
    number: '01',
    title: 'Applications Web & SaaS',
    description: "Création d'outils métiers complexes sur mesure. Plateformes de gestion, dashboards interactifs, SaaS multi-tenant capables de gérer des milliers d'entrées en temps réel.",
    tags: ['React', 'Laravel', 'MySQL', 'WebSockets'],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'E-Commerce',
    description: "Boutiques en ligne fluides et sécurisées. Intégration de solutions de paiement locales (PayDunya) et internationales, gestion des stocks, des commandes et des clients.",
    tags: ['Laravel', 'PayDunya', 'PHP', 'MySQL'],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Sites Vitrines Premium',
    description: "Présence en ligne qui marque les esprits. Sites ultra-modernes avec animations fluides, design soigné, et optimisés pour convertir les visiteurs en clients.",
    tags: ['React', 'Framer Motion', 'SEO', 'Responsive'],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Portfolios Sur-Mesure',
    description: "Démarquez-vous avec un portfolio unique qui met en valeur vos compétences et réalisations. Interactif, haut de gamme, parfait pour les freelances et créatifs.",
    tags: ['React', 'Animations', 'Design', 'CV intégré'],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
]

export default function ServicesPage() {
  return (
    <main>
      {/* ── Header ── */}
      <motion.section
        className="services-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="section-eyebrow section-eyebrow--accent" style={{ marginBottom: '1rem' }}>
          Ce que je construis
        </div>
        <h1>Mes <span className="gradient-text">Services</span></h1>
        <p>
          De la conception de la base de données jusqu'à l'animation de l'interface, je vous accompagne sur l'ensemble du cycle de vie de votre projet web.
        </p>
      </motion.section>

      {/* ── Grid ── */}
      <section className="services-grid">
        {SERVICES.map((service, i) => (
          <ServiceCard key={service.title} {...service} delay={i * 0.08} />
        ))}
      </section>

      {/* ── CTA ── */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-eyebrow section-eyebrow--accent" style={{ marginBottom: '1rem' }}>
            Prêt à démarrer ?
          </div>
          <h2>Un projet en tête ?</h2>
          <p>Parlons-en — premier échange gratuit, sans engagement.</p>
          <Link to="/contact" className="btn btn--primary">
            Discutons-en
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </motion.section>
    </main>
  )
}
