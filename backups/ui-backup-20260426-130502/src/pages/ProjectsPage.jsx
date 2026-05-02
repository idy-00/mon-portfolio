import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'

export default function ProjectsPage() {
  const [query, setQuery] = useState('')

  const filteredProjects = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return projects

    return projects.filter((project) => {
      const haystack = [
        project.title,
        project.category,
        project.summary,
        project.impact,
        project.stack.join(' '),
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(value)
    })
  }, [query])

  return (
    <main>
      <motion.section
        className="panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1>Projets réalisés</h1>
        <p>
          Sélection de 6 projets représentatifs de mon niveau actuel, choisis pour leur impact, leur
          clarté technique et leur diversité fonctionnelle.
        </p>

        <form className="search-form" role="search" aria-label="Recherche de projets">
          <label htmlFor="project-search">Rechercher un projet par mots-clés</label>
          <input
            id="project-search"
            name="project-search"
            type="search"
            placeholder="Ex: Laravel, React, QCM, MySQL"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
      </motion.section>

      <section className="projects-grid" aria-live="polite">
        {filteredProjects.map((project, index) => (
          <motion.article
            key={project.id}
            className="project-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <p className="project-card__type">{project.category}</p>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <p className="project-card__impact">{project.impact}</p>
            <div className="chip-grid">
              {project.stack.map((tech) => (
                <span key={`${project.id}-${tech}`} className="chip">
                  {tech}
                </span>
              ))}
            </div>
            <a href={project.link} target="_blank" rel="noreferrer" className="btn btn--ghost">
              Voir sur GitHub
            </a>
          </motion.article>
        ))}
      </section>

      {!filteredProjects.length && (
        <p className="no-results">
          Aucun projet ne correspond à ta recherche. Essaie un autre mot-clé comme React, PHP ou
          Laravel.
        </p>
      )}
    </main>
  )
}
