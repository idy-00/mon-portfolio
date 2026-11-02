// Registre unique du mouvement : plugins GSAP, Lenis, préférence reduced-motion, scramble.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, Flip)
// exposé pour la QA (compteur de ScrollTrigger actifs)
if (typeof window !== 'undefined') window.__ST = ScrollTrigger

export { gsap, ScrollTrigger, Flip }

const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
export const REDUCE = !!mq?.matches

/* ── Lenis (désactivé si reduced-motion) ── */
let lenis = null
let tickerFn = null

export function startLenis() {
  if (REDUCE || lenis) return lenis
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  tickerFn = (t) => lenis.raf(t * 1000)
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function stopLenis() {
  if (!lenis) return
  gsap.ticker.remove(tickerFn)
  lenis.destroy()
  lenis = null
}

export const getLenis = () => lenis
export const pauseScroll = () => lenis?.stop()
export const resumeScroll = () => lenis?.start()

export function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  window.scrollTo(0, y)
}

/* ── Porte de révélation ──
   Fermée pendant le loader et pendant qu'un rideau couvre l'écran.
   Les pages y accrochent leurs animations d'entrée (titre, hero…). */
let revealed = REDUCE
let firstLoad = true
const waiters = new Set()
export function closeReveal() { if (!REDUCE) revealed = false }
export function openReveal() {
  revealed = true
  firstLoad = false
  waiters.forEach((f) => f())
  waiters.clear()
}
/** true tant que le premier chargement (loader) n'est pas terminé. */
export const isFirstLoad = () => firstLoad
/** Appelle fn quand l'écran est découvert. Renvoie une fonction d'annulation. */
export function whenRevealed(fn) {
  if (revealed) { fn(); return () => {} }
  waiters.add(fn)
  return () => waiters.delete(fn)
}

/* ── Scramble : le texte se décode de gauche à droite ── */
const GLY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}<>/;#$=+*'
const raf = new WeakMap()

export function scrambleTo(el, text, dur = 900) {
  if (!el) return
  const final = text ?? el.dataset.final ?? el.textContent
  el.dataset.final = final
  if (raf.has(el)) cancelAnimationFrame(raf.get(el))
  if (REDUCE) { el.textContent = final; return }
  const start = performance.now()
  const frame = (now) => {
    const t = Math.min(1, (now - start) / dur)
    let out = ''
    for (let i = 0; i < final.length; i++) {
      const c = final[i]
      out += c === ' ' || i / final.length < t * 1.15 - 0.15 ? c : GLY[(Math.random() * GLY.length) | 0]
    }
    el.textContent = out
    if (t < 1) raf.set(el, requestAnimationFrame(frame))
    else { el.textContent = final; raf.delete(el) }
  }
  raf.set(el, requestAnimationFrame(frame))
}

export function cancelScramble(el) {
  if (raf.has(el)) { cancelAnimationFrame(raf.get(el)); raf.delete(el) }
  if (el?.dataset.final) el.textContent = el.dataset.final
}
