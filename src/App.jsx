import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { NavLink, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'

const NAV_ITEMS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/a-propos', label: 'À propos' },
  { to: '/services', label: 'Services' },
  { to: '/projets', label: 'Projets' },
  { to: '/contact', label: 'Contact' },
]

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
}

function ScrollToTop() {
  const { pathname } = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, navType])

  return null
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  )
}

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
          transition={{ duration: 0.25 }}
          aria-label="Retour en haut"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

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

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

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
        <div className="brand">
          <div className="brand__avatar">IK</div>
          <div className="brand__text">
            <strong>Idrissa Kane</strong>
            <span>Full Stack Developer</span>
          </div>
        </div>

        <nav ref={navRef} aria-label="Navigation principale" className="nav-links">
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
            <NavLink key={to} to={to} end={end}>{label}</NavLink>
          ))}
        </nav>

        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <motion.span animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }} />
          <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} />
          <motion.span animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }} />
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex' }}
          >
            {NAV_ITEMS.map(({ to, label, end }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.06 }}
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

function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <div className="site-shell">
        <Topbar />

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
              <Route path="/"         element={<HomePage />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/projets"  element={<ProjectsPage />} />
              <Route path="/contact"  element={<ContactPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        <footer className="footer">
          <div className="footer__brand">
            <strong>Idrissa Mamadou Kane</strong>
            <span>Développeur Full Stack React & Laravel · Dakar, Sénégal</span>
          </div>
          <div className="footer__links">
            <a href="https://github.com/idy-00" target="_blank" rel="noreferrer" className="footer__link">GitHub</a>
            <a href="https://www.linkedin.com/in/idrissa-kane-7a7ba7370/" target="_blank" rel="noreferrer" className="footer__link">LinkedIn</a>
            <a href="/CV_IDRISSA_M_KANE.pdf" target="_blank" rel="noopener noreferrer" className="footer__link" aria-label="Télécharger le CV">CV</a>
          </div>
        </footer>
      </div>

      <BackToTop />
    </>
  )
}

export default App
