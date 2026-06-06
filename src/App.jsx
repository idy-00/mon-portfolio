import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { NavLink, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { gsap } from 'gsap'
import HomePage           from './pages/HomePage'
import AboutPage          from './pages/AboutPage'
import ServicesPage       from './pages/ServicesPage'
import ProjectsPage       from './pages/ProjectsPage'
import ProjectDetailPage  from './pages/ProjectDetailPage'
import ContactPage        from './pages/ContactPage'

const NAV_ITEMS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/a-propos', label: 'À propos' },
  { to: '/services', label: 'Services' },
  { to: '/projets', label: 'Projets' },
  { to: '/contact', label: 'Contact' },
]

/* ── Page transition variants ── */
const curtainVariants = {
  initial: { scaleY: 0, transformOrigin: 'top' },
  animate: { scaleY: 0, transformOrigin: 'top' },
  exit:    { scaleY: 1, transformOrigin: 'top', transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] } },
}
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, delay: 0.1 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}

/* ── Custom Cursor ── */
function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)

  useEffect(() => {
    const dot   = dotRef.current
    const ringEl = ringRef.current
    const labelEl = labelRef.current
    if (!dot || !ringEl) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const lerp = (a, b, t) => a + (b - a) * t
    const tick = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12)
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const onEnter = (e) => {
      const el = e.target.closest('[data-cursor]')
      if (!el) return
      const label = el.getAttribute('data-cursor')
      ringEl.classList.add('cursor-ring--hover')
      dot.classList.add('cursor-dot--hover')
      if (label && labelEl) {
        labelEl.textContent = label
        labelEl.style.opacity = '1'
      }
    }
    const onLeave = () => {
      ringEl.classList.remove('cursor-ring--hover')
      dot.classList.remove('cursor-dot--hover')
      if (labelEl) labelEl.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseenter', onEnter, true)
    document.addEventListener('mouseleave', onLeave, true)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter, true)
      document.removeEventListener('mouseleave', onLeave, true)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  )
}

/* ── Scroll Progress ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

/* ── Back to top ── */
function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          aria-label="Retour en haut"
          data-cursor="TOP"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ── Scroll to top on navigate ── */
function ScrollToTop() {
  const { pathname } = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    if (navType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, navType])
  return null
}

/* ── Dakar clock ── */
function DakarClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString('fr-FR', {
        timeZone: 'Africa/Dakar',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      })
      setTime(t)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="dakar-clock" aria-label="Heure à Dakar">
      <span className="dakar-clock__label">DAKAR</span>
      <span className="dakar-clock__time">{time}</span>
    </div>
  )
}

/* ── Topbar ── */
function Topbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeRect, setActiveRect] = useState(null)
  const navRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  useEffect(() => {
    if (!navRef.current) return
    const activeLink = navRef.current.querySelector('a.active')
    if (!activeLink) return
    const navRect = navRef.current.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    setActiveRect({
      left: linkRect.left - navRect.left,
      top: linkRect.top - navRect.top,
      width: linkRect.width,
      height: linkRect.height,
    })
  }, [location.pathname])

  return (
    <>
      <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
        {/* Hamburger à gauche sur mobile */}
        <button
          className="nav-hamburger nav-hamburger--left"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <motion.span animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }} />
          <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} />
          <motion.span animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }} />
        </button>

        <div className="brand">
          <div className="brand__mark" data-cursor="HOME">IK</div>
          <div>
            <strong className="brand__name">Idrissa Kane</strong>
            <span className="brand__role">Full Stack Dev</span>
          </div>
        </div>

        <nav ref={navRef} className="nav-links" aria-label="Navigation principale">
          {activeRect && (
            <motion.div
              className="nav-pill"
              layoutId="nav-pill"
              initial={false}
              animate={activeRect}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} data-cursor="ALLER">
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar__actions">
          <DakarClock />
          <a
            href="/CV_IDRISSA_M_KANE.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="theme-toggle"
            aria-label="Télécharger le CV"
            data-cursor="CV"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <span>CV</span>
          </a>
          {/* Hamburger original (desktop fallback — caché sur mobile) */}
          <button
            className="nav-hamburger nav-hamburger--right"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }} />
            <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            {NAV_ITEMS.map(({ to, label, end }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <NavLink to={to} end={end}>{label}</NavLink>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

/* ── Magnetic button wrapper ── */
export function MagneticWrap({ children, strength = 0.35 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return <span ref={ref} style={{ display: 'inline-block' }}>{children}</span>
}

/* ── Site-wide grain ── */
function SiteGrain() {
  return <div className="site-grain" aria-hidden="true" />
}

function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <SiteGrain />
      <CustomCursor />
      <ScrollProgress />

      <div className="site-shell">
        <Topbar />

        <AnimatePresence mode="wait">
          {/* Page transition curtain */}
          <motion.div
            key={location.pathname + '-curtain'}
            className="page-curtain"
            variants={curtainVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            aria-hidden="true"
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="page-wrap"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/"                   element={<HomePage />} />
              <Route path="/a-propos"           element={<AboutPage />} />
              <Route path="/services"           element={<ServicesPage />} />
              <Route path="/projets"            element={<ProjectsPage />} />
              <Route path="/projets/:slug"      element={<ProjectDetailPage />} />
              <Route path="/contact"            element={<ContactPage />} />
            </Routes>

            <footer className="footer-wrap">
              <div className="footer">
                <div className="footer__col">
                  <strong className="footer__name">Idrissa Kane</strong>
                  <span className="footer__sub">Développeur Full Stack · Dakar, Sénégal</span>
                  <div className="footer__status">
                    <span className="pulse-dot" />
                    Disponible pour de nouveaux projets
                  </div>
                </div>
                <div className="footer__col">
                  <span className="footer__col-label">Navigation</span>
                  <nav className="footer__nav">
                    <NavLink to="/" end>Accueil</NavLink>
                    <NavLink to="/a-propos">À propos</NavLink>
                    <NavLink to="/services">Services</NavLink>
                    <NavLink to="/projets">Projets</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                  </nav>
                </div>
                <div className="footer__col">
                  <span className="footer__col-label">Contact & liens</span>
                  <div className="footer__socials">
                    <a href="https://github.com/idy-00" target="_blank" rel="noreferrer" className="footer__social" data-cursor="GITHUB">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                      GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/idrissa-kane-7a7ba7370/" target="_blank" rel="noreferrer" className="footer__social" data-cursor="LINKEDIN">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                      LinkedIn
                    </a>
                    <a href="mailto:idykane03@gmail.com" className="footer__social" data-cursor="MAIL">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      idykane03@gmail.com
                    </a>
                    <a href="/CV_IDRISSA_M_KANE.pdf" target="_blank" rel="noopener noreferrer" className="footer__social" data-cursor="CV">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                      Télécharger le CV
                    </a>
                  </div>
                </div>
              </div>
              <div className="footer__bottom">
                <span>© {new Date().getFullYear()} Idrissa Mamadou Kane — Tous droits réservés</span>
                <span>Dakar, Sénégal · GMT+0</span>
              </div>
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>

      <BackToTop />
    </>
  )
}

export default App
