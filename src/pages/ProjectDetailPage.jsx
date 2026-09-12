import { useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { projects } from '../data/projects'
import IPhoneFrame from '../components/IPhoneFrame'

gsap.registerPlugin(ScrollTrigger, SplitText)

/* ── Icons ── */
function IconGitHub() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
  )
}
function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}
function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  )
}
function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)

  const project = projects.find(p => p.slug === slug)
  const currentIdx = projects.findIndex(p => p.slug === slug)
  const prev = currentIdx > 0 ? projects[currentIdx - 1] : null
  const next = currentIdx < projects.length - 1 ? projects[currentIdx + 1] : null

  useEffect(() => {
    if (!project) { navigate('/projets', { replace: true }); return }

    const ctx = gsap.context(() => {
      // Eyebrow + title
      gsap.fromTo('.pd-eyebrow',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.05 }
      )
      gsap.fromTo('.pd-title',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      )
      gsap.fromTo('.pd-meta',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.25 }
      )
      gsap.fromTo('.pd-actions',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.35 }
      )

      // Content sections
      gsap.fromTo('.pd-section',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: '.pd-body', start: 'top 80%', once: true },
        }
      )

      // Features list items
      gsap.fromTo('.pd-feature',
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: '.pd-features-list', start: 'top 82%', once: true },
        }
      )

      // Screenshot / phone reveal
      const shotTarget = document.querySelector('.pd-screenshot') || document.querySelector('.pd-phone-frame')
      if (shotTarget) {
        gsap.fromTo(shotTarget,
          { opacity: 0, scale: 0.97, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: shotTarget, start: 'top 85%', once: true } }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [project, navigate])

  if (!project) return null

  const haslive = Boolean(project.live)

  return (
    <main ref={pageRef} className="pd-page">
      {/* ── Back ── */}
      <div className="pd-back-wrap">
        <Link to="/projets" className="pd-back" data-cursor="PROJETS">
          <IconArrowLeft />
          <span>Tous les projets</span>
        </Link>
      </div>

      {/* ── Hero ── */}
      <header className="pd-hero">
        <div className="pd-hero__left">
          <div className="pd-eyebrow">
            <span className="eyebrow-tag">{project.category}</span>
            {haslive && <span className="live-badge"><span className="live-dot" />En ligne</span>}
          </div>

          <h1 className="pd-title">{project.title}</h1>

          <div className="pd-meta">
            {project.year && <span className="pd-meta-item">{project.year}</span>}
            {project.role && <span className="pd-meta-item">{project.role}</span>}
            {project.duration && <span className="pd-meta-item">{project.duration}</span>}
          </div>

          <div className="pd-actions">
            {haslive && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn--primary pd-btn-live"
                data-cursor="VOIR"
              >
                <IconLink />
                Voir le site
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn--ghost"
                data-cursor="GITHUB"
              >
                <IconGitHub />
                Code source
              </a>
            )}
          </div>
        </div>

        {/* Stack chips */}
        <div className="pd-hero__stack">
          <span className="pd-stack-label">Stack</span>
          <div className="chip-grid chip-grid--vertical">
            {project.stack.map(t => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
      </header>

      {/* ── URL display if live ── */}
      {haslive && (
        <div className="pd-live-bar">
          <span className="pd-live-bar__label">URL</span>
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer noopener"
            className="pd-live-bar__url"
            data-cursor="OUVRIR"
          >
            {project.live}
            <IconLink />
          </a>
        </div>
      )}

      {/* ── Body + Screenshot ── */}
      {project.category?.includes('Mobile') && project.screenshot ? (
        /* Layout 2 colonnes pour les apps mobiles */
        <div className="pd-mobile-layout">
          <div className="pd-body">
            <section className="pd-section">
              <div className="pd-section__label">Aperçu</div>
              <p className="pd-section__text">{project.summary}</p>
            </section>
            {project.impact && (
              <section className="pd-section">
                <div className="pd-section__label">Fonctionnalités clés</div>
                <p className="pd-section__text">{project.impact}</p>
              </section>
            )}
            {project.features?.length > 0 && (
              <section className="pd-section">
                <div className="pd-section__label">Ce que j'ai construit</div>
                <ul className="pd-features-list">
                  {project.features.map((f, i) => (
                    <li key={i} className="pd-feature">
                      <span className="pd-feature__icon"><IconCheck /></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {project.challenge && (
              <section className="pd-section">
                <div className="pd-section__label">Défi technique</div>
                <p className="pd-section__text">{project.challenge}</p>
              </section>
            )}
          </div>

          {/* iPhone sticky à droite */}
          <div className="pd-phone-sticky">
            <IPhoneFrame
              src={project.screenshot}
              alt={`Capture d'écran de ${project.title}`}
            />
          </div>
        </div>
      ) : (
        /* Layout standard */
        <>
          {project.screenshot && (
            <div className="pd-screenshot-wrap">
              <div className="pd-screenshot-frame">
                <div className="pd-screenshot-chrome">
                  <span /><span /><span />
                  <div className="pd-screenshot-urlbar">
                    {haslive ? project.live : '— preview —'}
                  </div>
                </div>
                <img
                  src={project.screenshot}
                  alt={`Capture d'écran de ${project.title}`}
                  className="pd-screenshot"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          <div className="pd-body">
            <section className="pd-section">
              <div className="pd-section__label">Aperçu</div>
              <p className="pd-section__text">{project.summary}</p>
            </section>
            {project.impact && (
              <section className="pd-section">
                <div className="pd-section__label">Fonctionnalités clés</div>
                <p className="pd-section__text">{project.impact}</p>
              </section>
            )}
            {project.features?.length > 0 && (
              <section className="pd-section">
                <div className="pd-section__label">Ce que j'ai construit</div>
                <ul className="pd-features-list">
                  {project.features.map((f, i) => (
                    <li key={i} className="pd-feature">
                      <span className="pd-feature__icon"><IconCheck /></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {project.challenge && (
              <section className="pd-section">
                <div className="pd-section__label">Défi technique</div>
                <p className="pd-section__text">{project.challenge}</p>
              </section>
            )}
          </div>
        </>
      )}

      {/* ── CTA live ── */}
      {haslive && (
        <div className="pd-cta-live">
          <div className="pd-cta-live__inner">
            <div>
              <div className="pd-cta-live__title">Voir le projet en ligne</div>
              <div className="pd-cta-live__url">{project.live}</div>
            </div>
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn--primary"
              data-cursor="OUVRIR"
            >
              Ouvrir
              <IconArrowRight />
            </a>
          </div>
        </div>
      )}

      {/* ── Prev / Next ── */}
      <nav className="pd-nav-projects" aria-label="Projet précédent / suivant">
        <div className="pd-nav-projects__inner">
          {prev ? (
            <Link to={`/projets/${prev.slug}`} className="pd-nav-card pd-nav-card--prev" data-cursor="PRÉCÉDENT">
              <span className="pd-nav-card__dir">← Précédent</span>
              <span className="pd-nav-card__title">{prev.title}</span>
              <span className="pd-nav-card__cat">{prev.category}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link to={`/projets/${next.slug}`} className="pd-nav-card pd-nav-card--next" data-cursor="SUIVANT">
              <span className="pd-nav-card__dir">Suivant →</span>
              <span className="pd-nav-card__title">{next.title}</span>
              <span className="pd-nav-card__cat">{next.category}</span>
            </Link>
          ) : <div />}
        </div>
      </nav>
    </main>
  )
}
