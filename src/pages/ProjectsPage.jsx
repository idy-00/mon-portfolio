import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

const ALL_CATEGORIES = ['Tous', ...Array.from(new Set(projects.map(p => p.category)))]

function IconGitHub() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
  )
}

function IconLive() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

function ProjectCard({ project, index }) {
  const haslive = Boolean(project.live)
  const isMobile = project.category?.includes('Mobile')

  return (
    <motion.article
      className={`project-card${isMobile ? ' project-card--mobile' : ''}`}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      whileHover={{ y: -4 }}
    >
      {isMobile && project.screenshot ? (
        /* ── Layout mobile : image à gauche, contenu à droite ── */
        <>
          <div className="project-card__mobile-img">
            <img
              src={project.screenshot}
              alt={`Aperçu ${project.title}`}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="project-card__mobile-content">
            <div className="project-card__header">
              <span className="project-card__category">{project.category}</span>
              <div className="project-card__header-actions">
                {haslive && (
                  <a href={project.live} target="_blank" rel="noreferrer"
                    className="project-card__live-badge"
                    onClick={e => e.stopPropagation()} data-cursor="VOIR">
                    <IconLive /><span>Live</span>
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer"
                    className="project-card__github"
                    onClick={e => e.stopPropagation()} data-cursor="GITHUB">
                    <IconGitHub />
                  </a>
                )}
              </div>
            </div>
            <h3>{project.title}</h3>
            <p className="project-card__summary">{project.summary}</p>
            <div className="chip-grid">
              {project.stack.slice(0, 4).map(tech => (
                <span key={`${project.id}-${tech}`} className="chip">{tech}</span>
              ))}
              {project.stack.length > 4 && (
                <span className="chip chip--more">+{project.stack.length - 4}</span>
              )}
            </div>
            <Link to={`/projets/${project.slug}`} className="project-card__cta"
              data-cursor="DÉTAIL" aria-label={`Voir le détail de ${project.title}`}>
              <span>Voir le projet</span>
              <IconArrow />
            </Link>
          </div>
        </>
      ) : (
        /* ── Layout standard ── */
        <>
          {project.screenshot && (
            <div className="project-card__shot">
              <img src={project.screenshot} alt={`Aperçu ${project.title}`} loading="lazy" decoding="async" />
            </div>
          )}
          <div className="project-card__header">
            <span className="project-card__category">{project.category}</span>
            <div className="project-card__header-actions">
              {haslive && (
                <a href={project.live} target="_blank" rel="noreferrer"
                  className="project-card__live-badge"
                  onClick={e => e.stopPropagation()} data-cursor="VOIR">
                  <IconLive /><span>Live</span>
                </a>
              )}
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer"
                  className="project-card__github"
                  onClick={e => e.stopPropagation()} data-cursor="GITHUB">
                  <IconGitHub />
                </a>
              )}
            </div>
          </div>
          <h3>{project.title}</h3>
          <p className="project-card__summary">{project.summary}</p>
          <div className="chip-grid">
            {project.stack.slice(0, 5).map(tech => (
              <span key={`${project.id}-${tech}`} className="chip">{tech}</span>
            ))}
            {project.stack.length > 5 && (
              <span className="chip chip--more">+{project.stack.length - 5}</span>
            )}
          </div>
          <Link to={`/projets/${project.slug}`} className="project-card__cta"
            data-cursor="DÉTAIL" aria-label={`Voir le détail de ${project.title}`}>
            <span>Voir le projet</span>
            <IconArrow />
          </Link>
        </>
      )}
    </motion.article>
  )
}

export default function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tous')
  const pageRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter(p => {
      const matchCat = activeCategory === 'Tous' || p.category === activeCategory
      if (!matchCat) return false
      if (!q) return true
      return [p.title, p.category, p.summary, p.impact || '', ...p.stack].join(' ').toLowerCase().includes(q)
    })
  }, [query, activeCategory])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects-page-header > *',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', delay: 0.05 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={pageRef}>
      {/* ── Header ── */}
      <div className="projects-page-header">
        <div className="eyebrow eyebrow--accent">Réalisations</div>
        <h1>Mes <em>Projets</em></h1>
        <p>Une sélection de projets pour montrer l'impact, la clarté et la diversité.</p>

        <div className="projects-controls">
          <div className="filter-tabs" role="group" aria-label="Filtrer par catégorie">
            {ALL_CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                className={`filter-tab${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.95 }}
                layout
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="search-input-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              className="search-input"
              placeholder="React, Laravel, Flutter…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Rechercher un projet"
            />
          </div>
        </div>

        <motion.p
          key={filtered.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          {filtered.length} projet{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
        </motion.p>
      </div>

      {/* ── Grid ── */}
      <section className="projects-grid" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}

          {filtered.length === 0 && (
            <motion.div
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="no-results"
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>—</div>
              <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontFamily: 'var(--font-display)' }}>Aucun projet trouvé</div>
              <div>Essaie un autre mot-clé ou réinitialise les filtres.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}
