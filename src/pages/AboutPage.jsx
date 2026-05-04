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
          {icon && <SkillIcon type={icon} />}
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

function SkillIcon({ type }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  const icons = {
    react: (
      <svg {...common}>
        <circle cx="12" cy="12" r="2" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(-60 12 12)" />
      </svg>
    ),
    javascript: (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M10 8v7a2 2 0 0 1-2 2" />
        <path d="M15 14c.2 1.3 1.1 2 2.3 2 1.1 0 1.9-.5 1.9-1.4 0-2.2-4.4-1.2-4.4-4 0-1.5 1.2-2.6 3.1-2.6 1.7 0 2.8.8 3.1 2.3" />
      </svg>
    ),
    motion: (
      <svg {...common}>
        <path d="M4 16V8l4 6 4-8 4 10 4-4" />
      </svg>
    ),
    css: (
      <svg {...common}>
        <path d="M4 3h16l-1.5 16L12 21l-6.5-2L4 3Z" />
        <path d="M8 8h8M8.5 12h7M9 16h5.5" />
      </svg>
    ),
    laravel: (
      <svg {...common}>
        <path d="M5 8.5 12 4l7 4.5v7L12 20l-7-4.5v-7Z" />
        <path d="M12 4v16M5 8.5 12 13l7-4.5" />
      </svg>
    ),
    mysql: (
      <svg {...common}>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    ),
    api: (
      <svg {...common}>
        <path d="M8 8h8M8 12h8M8 16h5" />
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    ),
    python: (
      <svg {...common}>
        <path d="M8 10V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V9H9.5A1.5 1.5 0 0 0 8 10.5Z" />
        <path d="M16 14v3.5a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 8 17.5V15h6.5a1.5 1.5 0 0 0 1.5-1.5Z" />
        <circle cx="11" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="13" cy="17.2" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  }

  return <span className="skill-icon">{icons[type] ?? null}</span>
}

const FRONTEND_SKILLS = [
  { name: 'React.js',        pct: 88, icon: 'react' },
  { name: 'JavaScript ES6+', pct: 85, icon: 'javascript' },
  { name: 'Framer Motion',   pct: 78, icon: 'motion' },
  { name: 'CSS / Tailwind',  pct: 90, icon: 'css' },
]

const BACKEND_SKILLS = [
  { name: 'Laravel / PHP', pct: 90, icon: 'laravel' },
  { name: 'MySQL',         pct: 82, icon: 'mysql' },
  { name: 'API REST',      pct: 80, icon: 'api' },
  { name: 'Python',        pct: 65, icon: 'python' },
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
    <main className="about-page">
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
        <div className="skills-block skills-block--frontend">
          <div className="skills-block__title skills-block__title--frontend">
            Frontend & Interfaces
          </div>
          {FRONTEND_SKILLS.map(({ name, pct, icon }, i) => (
            <SkillBar key={name} name={name} pct={pct} icon={icon} delay={i * 0.08} />
          ))}
          <div className="chip-grid" style={{ marginTop: '2.2rem' }}>
            <span className="chip chip--purple">React.js</span>
            <span className="chip chip--purple">JavaScript</span>
            <span className="chip">Tailwind CSS</span>
            <span className="chip">Framer Motion</span>
            <span className="chip">HTML / CSS</span>
          </div>
        </div>

        <div className="skills-block skills-block--backend">
          <div className="skills-block__title skills-block__title--backend">
            Backend & Architecture
          </div>
          {BACKEND_SKILLS.map(({ name, pct, icon }, i) => (
            <SkillBar key={name} name={name} pct={pct} icon={icon} delay={i * 0.08} />
          ))}
          <div className="chip-grid" style={{ marginTop: '2.2rem' }}>
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
