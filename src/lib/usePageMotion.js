import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, REDUCE, scrambleTo, cancelScramble, whenRevealed } from './motion'

/**
 * Encapsule les animations d'une page dans gsap.context().
 * - init commune : labels [data-scramble] décodés à l'entrée dans l'écran
 * - setup({ root, q, add, revealed }) : animations propres à la page
 *   add(fn) enregistre un nettoyage (ticker, listeners, canvas)
 *   revealed(fn) lance fn quand le rideau/loader découvre l'écran
 * Tout est annulé au démontage (ctx.revert + nettoyages).
 */
export function usePageMotion(ref, setup, deps = []) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const cleanups = []
    const add = (fn) => cleanups.push(fn)
    const ctx = gsap.context(() => {}, root)
    ctx.add(() => {
      root.querySelectorAll('[data-scramble]').forEach((el) => {
        el.dataset.final = el.textContent
        add(() => cancelScramble(el))
        if (REDUCE) return
        ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => scrambleTo(el, null, 1000) })
      })
      setup?.({
        root,
        q: gsap.utils.selector(root),
        add,
        revealed: (fn) => add(whenRevealed(() => ctx.add(fn))),
      })
    })
    return () => {
      cleanups.forEach((f) => { try { f() } catch { /* déjà nettoyé */ } })
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
