import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'

function App() {
  const location = useLocation()

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand">
          <span>IK</span>
          <div>
            <strong>Idrissa Kane</strong>
            <p>Portfolio Développeur</p>
          </div>
        </div>

        <nav aria-label="Navigation principale" className="nav-links">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/a-propos">À propos</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/projets">Projets</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
          className="page-wrap"
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projets" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <footer className="footer">
        <p>Idrissa Mamadou Kane - Développeur Full Stack</p>
        <div>
          <a href="https://github.com/idy-00" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/idrissa-kane-7a7ba7370/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="/CV_IDRISSA_M_KANE.pdf" target="_blank" rel="noopener noreferrer" aria-label="Télécharger le CV">
            CV
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
