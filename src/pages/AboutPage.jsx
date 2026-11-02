import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function SkillIcon({ type, size = 14 }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const icons = {
    react:      <svg {...c}><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="3.8"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(-60 12 12)"/></svg>,
    flutter:    <svg {...c}><path d="M13.5 2 4 12l3.5 3.5L20 4.5Z"/><path d="M7.5 15.5 11 19l2.5-2.5-3.5-3.5Z"/><path d="M13.5 16.5 17 20l3-3-3.5-3.5Z"/></svg>,
    javascript: <svg {...c}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M10 8v7a2 2 0 0 1-2 2"/><path d="M15 14c.2 1.3 1.1 2 2.3 2 1.1 0 1.9-.5 1.9-1.4 0-2.2-4.4-1.2-4.4-4 0-1.5 1.2-2.6 3.1-2.6 1.7 0 2.8.8 3.1 2.3"/></svg>,
    css:        <svg {...c}><path d="M4 3h16l-1.5 16L12 21l-6.5-2L4 3Z"/><path d="M8 8h8M8.5 12h7M9 16h5.5"/></svg>,
    laravel:    <svg {...c}><path d="M5 8.5 12 4l7 4.5v7L12 20l-7-4.5v-7Z"/><path d="M12 4v16M5 8.5 12 13l7-4.5"/></svg>,
    mysql:      <svg {...c}><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>,
    api:        <svg {...c}><path d="M8 8h8M8 12h8M8 16h5"/><rect x="4" y="4" width="16" height="16" rx="3"/></svg>,
    python:     <svg {...c}><path d="M8 10V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V9H9.5A1.5 1.5 0 0 0 8 10.5Z"/><path d="M16 14v3.5a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 8 17.5V15h6.5a1.5 1.5 0 0 0 1.5-1.5Z"/><circle cx="11" cy="6.8" r="0.8" fill="currentColor" stroke="none"/><circle cx="13" cy="17.2" r="0.8" fill="currentColor" stroke="none"/></svg>,
  }
  return icons[type] ?? null
}

function SkillRow({ name, level, icon }) {
  return (
    <div className="skill-row">
      <div className="skill-row__meta">
        <span className="skill-icon"><SkillIcon type={icon} /></span>
        <span className="skill-row__name">{name}</span>
        <span className="skill-row__pct">{level}%</span>
      </div>
      <div className="skill-row__bar">
        <span style={{ width: `${level}%` }} />
      </div>
    </div>
  )
}

const SKILLS = [
  { name: 'Flutter / Dart',       level: 88, icon: 'flutter',    category: 'mobile' },
  { name: 'State Management',     level: 82, icon: 'react',      category: 'mobile' },
  { name: 'Architecture Mobile',  level: 78, icon: 'api',        category: 'mobile' },
  { name: 'React.js',        level: 85, icon: 'react',      category: 'frontend' },
  { name: 'JavaScript ES6+', level: 83, icon: 'javascript', category: 'frontend' },
  { name: 'CSS / Tailwind',  level: 88, icon: 'css',        category: 'frontend' },
  { name: 'Laravel / PHP',   level: 92, icon: 'laravel',    category: 'backend' },
  { name: 'MySQL',           level: 84, icon: 'mysql',      category: 'backend' },
  { name: 'API REST',        level: 85, icon: 'api',        category: 'backend' },
  { name: 'Python',          level: 65, icon: 'python',     category: 'backend' },
]

const VALUES = [
  {
    num: '01',
    title: 'Vision Full Stack',
    desc: "Autonomie totale sur l'ensemble d'un projet : du modèle de données jusqu'à l'animation de l'interface.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Focus Utilisateur',
    desc: "Une app puissante ne vaut rien si l'utilisateur s'y perd. L'UX est au cœur de chaque décision.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: "Esprit d'initiative",
    desc: "Toujours force de proposition — améliorer le code, le design ou l'expérience globale fait partie du travail.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
]

const grouped = SKILLS.reduce((acc, s) => {
  if (!acc[s.category]) acc[s.category] = []
  acc[s.category].push(s)
  return acc
}, {})

export default function AboutPage() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero */
      gsap.fromTo('.about-hero__eyebrow', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 })
      gsap.fromTo('.about-hero h1',       { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 })
      gsap.fromTo('.about-hero__text',    { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.3, stagger: 0.1 })
      gsap.fromTo('.about-hero__meta',    { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.55 })
      gsap.fromTo('.about-hero__photo-frame', { opacity: 0, x: 30, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 })

      /* Skills groups */
      gsap.fromTo('.skills-group',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.skills-section', start: 'top 75%', once: true } }
      )

      /* Values */
      gsap.fromTo('.value-card',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.values-section', start: 'top 75%', once: true } }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={pageRef}>
      {/* ── Hero ── */}
      <section className="about-hero">
        <div>
          <div className="about-hero__eyebrow">À propos</div>
          <h1>L'humain<br /><em>derrière le code</em></h1>
          <p className="about-hero__text">
            Depuis mes débuts, j'ai toujours voulu passer de l'usage à la création.
            <strong> Construire des outils utiles, simples et fiables.</strong>
          </p>
          <p className="about-hero__text">
            Aujourd'hui, je réalise des apps web et mobiles de bout en bout.
            Mon moteur : résoudre des besoins réels avec une expérience claire.
          </p>
          <div className="about-hero__meta">
            <span className="about-hero__meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Dakar, Sénégal
            </span>
            <span className="about-hero__meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              2 ans d'expérience
            </span>
            <span className="about-hero__meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              20+ projets livrés
            </span>
          </div>
        </div>
        <div>
          <div className="about-hero__photo-frame">
            <img src="/images/profil.png" alt="Idrissa Kane" />
            <div className="about-hero__photo-corner about-hero__photo-corner--tl" />
            <div className="about-hero__photo-corner about-hero__photo-corner--br" />
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="skills-section">
        <div className="skills-header">
          <div className="eyebrow eyebrow--accent">Stack technique</div>
          <h2>Compétences clés</h2>
          <p>Un aperçu clair de ce que je maîtrise réellement au quotidien.</p>
        </div>
        <div className="skills-groups">
          {[
            { key: 'mobile',   label: 'Mobile (Flutter)' },
            { key: 'frontend', label: 'Frontend' },
            { key: 'backend',  label: 'Backend' },
          ].map(({ key, label }) => (
            <div key={key} className="skills-group">
              <div className="skills-group__header">
                <span className="skills-group__title">{label}</span>
                <span className="skills-group__count">{grouped[key]?.length ?? 0} comp.</span>
              </div>
              <div className="skills-list">
                {(grouped[key] ?? []).map(skill => (
                  <SkillRow key={skill.name} {...skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="values-section">
        <div className="eyebrow eyebrow--accent">Mes valeurs</div>
        <h2>Comment je travaille</h2>
        <div className="values-grid">
          {VALUES.map(({ num, title, desc, icon }) => (
            <div key={title} className="value-card" data-num={num}>
              <div className="value-card__icon">{icon}</div>
              <div className="value-card__title">{title}</div>
              <p className="value-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
