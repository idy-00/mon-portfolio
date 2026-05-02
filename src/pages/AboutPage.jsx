import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
})

/* ── Animated skill bar ── */
function SkillBar({ name, pct, icon, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div className="skill-bar-item" ref={ref}>
      <div className="skill-bar-header">
        <span className="skill-bar-name">
          {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
          {name}
        </span>
        <span className="skill-bar-pct">{pct}%</span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className="skill-bar-fill"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: pct / 100 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 + delay }}
        />
      </div>
    </div>
  )
}

const FRONTEND_SKILLS = [
  { name: 'React.js',        pct: 88, icon: '⚛️' },
  { name: 'JavaScript ES6+', pct: 85, icon: '🟨' },
  { name: 'Framer Motion',   pct: 78, icon: '🎞️' },
  { name: 'CSS / Tailwind',  pct: 90, icon: '🎨' },
]

const BACKEND_SKILLS = [
  { name: 'Laravel / PHP', pct: 90, icon: '🐘' },
  { name: 'MySQL',         pct: 82, icon: '🗄️' },
  { name: 'API REST',      pct: 80, icon: '🔌' },
  { name: 'Python',        pct: 65, icon: '🐍' },
]

const VALUES = [
  {
    title: 'Vision Full Stack',
    desc: "Autonomie totale sur l’ensemble d’un projet, du modèle de données jusqu’à l’interface.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    title: 'Focus Utilisateur',
    desc: "Une app puissante ne vaut rien si l’utilisateur s’y perd. L’UX est au cœur de chaque décision.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
  {
    title: "Esprit d’initiative",
    desc: "Toujours force de proposition pour améliorer le code, le design ou l’expérience globale.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
]

export default function AboutPage() {
  return (
    <main>
      {/* ── Hero section ── */}
      <motion.section
        className="about-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <div className="about-hero__eyebrow">À propos</div>
          <h1>
            L'humain<br />
            <span className="gradient-text">derrière le code</span>
          </h1>
          <p className="about-hero__text">
            Tombé dans la marmite de l'informatique dès mon plus jeune âge, j'ai rapidement compris que je voulais faire plus qu'utiliser des logiciels : <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>je voulais les créer.</strong>
            <br /><br />
            Aujourd'hui je construis des solutions web complètes, de l'idée initiale jusqu'au déploiement. Ce qui m'anime, c'est la résolution de problèmes — transformer un besoin métier complexe en un système logique, élégant et fonctionnel.
          </p>
        </div>
        <div className="about-hero__photo">
          <img src="/images/profil.png" alt="Idrissa Kane" />
          <div className="about-hero__photo-badge">
            Dakar, Sénégal 🌍
          </div>
        </div>
      </motion.section>

      {/* ── Skills ── */}
      <motion.section className="skills-grid" {...fadeUp(0.05)}>
        <div className="skills-block">
          <div className="skills-block__title skills-block__title--frontend">
            Frontend & Interfaces
          </div>
          {FRONTEND_SKILLS.map(({ name, pct, icon }, i) => (
            <SkillBar key={name} name={name} pct={pct} icon={icon} delay={i * 0.08} />
          ))}
          <div className="chip-grid" style={{ marginTop: '1.75rem' }}>
            <span className="chip chip--purple">React.js</span>
            <span className="chip chip--purple">JavaScript</span>
            <span className="chip">Tailwind CSS</span>
            <span className="chip">Framer Motion</span>
            <span className="chip">HTML / CSS</span>
          </div>
        </div>

        <div className="skills-block">
          <div className="skills-block__title skills-block__title--backend">
            Backend & Architecture
          </div>
          {BACKEND_SKILLS.map(({ name, pct, icon }, i) => (
            <SkillBar key={name} name={name} pct={pct} icon={icon} delay={i * 0.08} />
          ))}
          <div className="chip-grid" style={{ marginTop: '1.75rem' }}>
            <span className="chip chip--cyan">Laravel 12</span>
            <span className="chip chip--cyan">PHP</span>
            <span className="chip">MySQL</span>
            <span className="chip">API REST</span>
            <span className="chip">WebSockets</span>
          </div>
        </div>
      </motion.section>

      {/* ── Values ── */}
      <motion.section className="values-grid" {...fadeUp(0.1)}>
        {VALUES.map(({ title, desc, icon }, i) => (
          <motion.div
            key={title}
            className="value-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="value-card__icon">{icon}</div>
            <div className="value-card__title">{title}</div>
            <p className="value-card__desc">{desc}</p>
          </motion.div>
        ))}
      </motion.section>
    </main>
  )
}
