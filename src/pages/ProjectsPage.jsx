import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../data/projects'

const ALL_CATEGORIES = ['Tous', ...Array.from(new Set(projects.map(p => p.category)))]

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

export default function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tous')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter(p => {
      const matchCat = activeCategory === 'Tous' || p.category === activeCategory
      if (!matchCat) return false
      if (!q) return true
      return [p.title, p.category, p.summary, p.impact, ...p.stack]
        .join(' ').toLowerCase().includes(q)
    })
  }, [query, activeCategory])

  return (
    <main>
      {/* ── Header ── */}
      <motion.section
        className="projects-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="section-eyebrow section-eyebrow--accent" style={{ marginBottom: '0.75rem' }}>
          Réalisations
        </div>
        <h1>Mes <span className="gradient-text">Projets</span></h1>
        <p>
          6 projets représentatifs de mon niveau actuel, choisis pour leur impact, leur clarté technique et leur diversité fonctionnelle.
        </p>

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
            <SearchIcon />
            <input
              id="project-search"
              name="project-search"
              type="search"
              className="search-input"
              placeholder="Rechercher — React, Laravel, QCM…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Rechercher un projet"
            />
          </div>
        </div>

        <motion.div
          style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
          key={filtered.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {filtered.length} projet{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
        </motion.div>
      </motion.section>

      {/* ── Grid ── */}
      <section className="projects-grid" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <motion.article
              key={project.id}
              className="project-card"
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div className="project-card__header">
                <span className="project-card__category">{project.category}</span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card__github"
                  aria-label={`Voir ${project.title} sur GitHub`}
                >
                  <GitHubIcon />
                </a>
              </div>

              <h3>{project.title}</h3>
              <p className="project-card__summary">{project.summary}</p>
              <p className="project-card__impact">{project.impact}</p>

              <div className="chip-grid">
                {project.stack.map(tech => (
                  <span key={`${project.id}-${tech}`} className="chip">{tech}</span>
                ))}
              </div>
            </motion.article>
          ))}

          {filtered.length === 0 && (
            <motion.div
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="no-results"
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-sub)' }}>Aucun projet trouvé</div>
              <div>Essaie un autre mot-clé ou réinitialise les filtres.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}
