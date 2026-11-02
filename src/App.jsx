import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import {
  gsap, ScrollTrigger, REDUCE, scrambleTo, startLenis, stopLenis, pauseScroll, resumeScroll,
  scrollToY, closeReveal, openReveal,
} from './lib/motion'
import { pageFor, STATS } from './lib/site'
import Nav from './components/Nav'
import Menu from './components/Menu'
import Curtain from './components/Curtain'
import Loader from './components/Loader'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ServicesPage from './pages/ServicesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import InsightsPage from './pages/InsightsPage'

const HOME_TITLE = document.title

function applyMeta(pathname) {
  const pg = pageFor(pathname)
  document.title = pathname === '/' ? HOME_TITLE : `${pg.name} · Idrissa Kane serial|dev`
  const url = pathname === '/' ? 'https://ikdev.tech/' : `https://ikdev.tech${pathname}`
  document.getElementById('canonical-link')?.setAttribute('href', url)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url)
}

/**
 * Transitions pilotées par le changement de location (PUSH comme POP) :
 * l'URL change tout de suite (historique réel), le rideau monte, on monte la nouvelle
 * page quand l'écran est couvert, on règle le scroll (haut en PUSH, position mémorisée en POP),
 * puis le rideau sort par le haut.
 */
export default function App() {
  const location = useLocation()
  const navType = useNavigationType()
  const [shown, setShown] = useState(location)
  const [menuOpen, setMenuOpen] = useState(false)

  const curtainRef = useRef(null)
  const loaderRef = useRef(null)
  const mainRef = useRef(null)
  const menuBtnRef = useRef(null)

  const latest = useRef({ location, navType })
  const shownRef = useRef(shown)
  const handledKey = useRef(shown.key)
  const busy = useRef(false)
  const pendingType = useRef('PUSH')
  const scrollMemo = useRef(new Map())
  const loaderStarted = useRef(false)

  /* Lenis + scroll restoration manuelle */
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    startLenis()
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => stopLenis()
  }, [])

  /* Loader : premier chargement seulement */
  useEffect(() => {
    if (loaderStarted.current) return
    loaderStarted.current = true
    applyMeta(location.pathname)
    const el = loaderRef.current
    if (REDUCE) { el.style.display = 'none'; openReveal(); return }
    pauseScroll()
    const n = el.querySelector('[data-loader-n]')
    const c = { v: 0 }
    gsap.timeline({ onComplete: () => { el.style.display = 'none'; resumeScroll(); ScrollTrigger.refresh() } })
      .to(c, { v: STATS.total, duration: 1.25, ease: 'power2.inOut', onUpdate: () => { n.textContent = String(Math.round(c.v)).padStart(3, '0') } })
      .add(() => openReveal(), '+=.1')
      .to(el, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '<')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const run = useCallback(() => {
    const { location: target, navType: type } = latest.current
    busy.current = true
    pendingType.current = type
    scrollMemo.current.set(shownRef.current.key, window.scrollY)
    const swap = () => { pauseScroll(); setMenuOpen(false); setShown(target) }
    if (REDUCE) { gsap.delayedCall(0, swap); return }
    closeReveal()
    const pg = pageFor(target.pathname)
    const c = curtainRef.current
    const t = c.querySelector('[data-curtain-t]')
    c.querySelector('[data-curtain-n]').textContent = pg.sn
    t.textContent = pg.name
    gsap.timeline()
      .set(c, { yPercent: 101, visibility: 'visible' })
      .to(c, { yPercent: 0, duration: 0.75, ease: 'expo.inOut' })
      .add(() => scrambleTo(t, pg.name, 520), '-=.35')
      .add(swap, '+=.2')
  }, [])

  /* Nouvelle location → rideau (ou mise en file si une transition tourne déjà) */
  useLayoutEffect(() => {
    latest.current = { location, navType }
    if (busy.current || location.key === shownRef.current.key) return
    run()
  }, [location, navType, run])

  /* Nouvelle page montée sous le rideau → scroll, refresh, focus, sortie du rideau */
  useLayoutEffect(() => {
    shownRef.current = shown
    if (handledKey.current === shown.key) return
    handledKey.current = shown.key
    const y = pendingType.current === 'POP' ? scrollMemo.current.get(shown.key) || 0 : 0
    scrollToY(0)
    ScrollTrigger.refresh()
    scrollToY(y)
    ScrollTrigger.update()
    applyMeta(shown.pathname)
    mainRef.current?.focus({ preventScroll: true })
    const finish = () => {
      busy.current = false
      if (latest.current.location.key !== shown.key) run()
    }
    if (REDUCE) { resumeScroll(); finish(); return }
    gsap.timeline()
      .add(() => { openReveal(); resumeScroll() }, '+=.1')
      .to(curtainRef.current, { yPercent: -101, duration: 0.85, ease: 'expo.inOut' }, '<')
      .set(curtainRef.current, { visibility: 'hidden' })
      .add(finish)
  }, [shown, run])

  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <a className="skip" href="#main">Aller au contenu</a>
      <Loader ref={loaderRef} />
      <Curtain ref={curtainRef} />
      <Nav here={pageFor(shown.pathname)} menuOpen={menuOpen} onToggle={toggleMenu} buttonRef={menuBtnRef} />
      <Menu open={menuOpen} current={shown.pathname} onClose={closeMenu} returnFocusRef={menuBtnRef} />
      <main ref={mainRef} id="main" tabIndex={-1} key={shown.pathname}>
        <Routes location={shown}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projets" element={<ProjectsPage />} />
          <Route path="/projets/:slug" element={<ProjectDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </>
  )
}
