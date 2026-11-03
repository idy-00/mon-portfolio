import { useEffect, useRef } from 'react'
import { gsap, REDUCE } from '../lib/motion'

/*
 * Portrait rendu d'abord en caractères, puis « développé » en photo par une ligne de scan verte.
 * progressRef.current (0 → 1) pilote la ligne ; pctRef reçoit le texte « rendu 000% ».
 * Boucle sur gsap.ticker seulement quand le canvas est visible. reduced-motion : photo finale.
 */
const RAMP = ' .:-=+<>{}*#%@'
const LIVE = '#34c759'
const BONE = '#f1f0ec'

export default function AsciiPortrait({ src, alt, progressRef, pctRef }) {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    const img = new Image()
    let S = null, cells = [], cw = 8, ch = 12, ready = false, visible = false, dead = false

    const cover = () => {
      const ir = img.width / img.height, cr = S.W / S.H
      let w, h
      if (ir > cr) { h = S.H; w = h * ir } else { w = S.W; h = w / ir }
      return [(S.W - w) / 2, (S.H - h) * 0.3, w, h]
    }

    const build = () => {
      if (dead) return
      const light = window.innerWidth < 900
      const dpr = Math.min(window.devicePixelRatio || 1, light ? 1.5 : 2)
      const W = cv.clientWidth, H = cv.clientHeight
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr))
      const c = cv.getContext('2d')
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      S = { c, W, H }
      if (!ready) return
      cw = Math.max(6, Math.round(W / (light ? 56 : 78))); ch = Math.round(cw * 1.5)
      const cols = Math.ceil(W / cw), rows = Math.ceil(H / ch)
      const off = document.createElement('canvas')
      off.width = cols; off.height = rows
      const o = off.getContext('2d', { willReadFrequently: true })
      const r = cover()
      o.drawImage(img, r[0] / cw, r[1] / ch, r[2] / cw, r[3] / ch)
      const d = o.getImageData(0, 0, cols, rows).data
      cells = []
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const k = (y * cols + x) * 4
        cells.push([x * cw + cw / 2, y * ch + ch / 2, (d[k] + d[k + 1] + d[k + 2]) / 765])
      }
      draw(true)
    }

    const draw = (force) => {
      if (!ready || !S || (!visible && force !== true)) return
      const p = REDUCE ? 1 : progressRef.current
      const c = S.c, scan = p * S.H * 1.08
      c.clearRect(0, 0, S.W, S.H)
      if (scan > 0) {
        c.save(); c.beginPath(); c.rect(0, 0, S.W, scan); c.clip()
        const r = cover()
        c.filter = 'grayscale(1)'; c.drawImage(img, r[0], r[1], r[2], r[3]); c.filter = 'none'
        c.restore()
      }
      c.textAlign = 'center'; c.textBaseline = 'middle'
      c.font = `${Math.round(ch * 0.95)}px "JetBrains Mono", monospace`
      for (const q of cells) {
        if (q[1] < scan) continue
        const l = q[2]
        if (l < 0.06) continue
        let idx = Math.min(RAMP.length - 1, (l * RAMP.length) | 0)
        if (Math.random() < 0.004) idx = (Math.random() * RAMP.length) | 0
        c.globalAlpha = 0.25 + l * 0.75
        c.fillStyle = Math.abs(q[1] - scan) < ch * 2 ? LIVE : BONE
        c.fillText(RAMP[idx], q[0], q[1])
      }
      c.globalAlpha = 1
      if (scan > 0 && scan < S.H) {
        c.fillStyle = LIVE; c.shadowColor = LIVE; c.shadowBlur = 18
        c.fillRect(0, scan - 1, S.W, 2); c.shadowBlur = 0
      }
      if (pctRef?.current) pctRef.current.textContent = `rendu ${String(Math.min(100, Math.round(p * 100))).padStart(3, '0')}%`
    }

    const tick = () => draw()
    img.onload = () => { ready = true; build() }
    img.src = src

    let io = null
    if (!REDUCE) {
      io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
      io.observe(cv)
      gsap.ticker.add(tick)
    }
    // la taille du canvas suit sa boîte (pin, grille, rotation) : on reconstruit à chaque changement
    let t, lastW = 0, lastH = 0
    const ro = new ResizeObserver(() => {
      if (cv.clientWidth === lastW && cv.clientHeight === lastH) return
      lastW = cv.clientWidth; lastH = cv.clientHeight
      clearTimeout(t); t = setTimeout(build, 120)
    })
    ro.observe(cv)
    document.fonts?.ready.then(build)

    return () => {
      dead = true
      img.onload = null
      io?.disconnect()
      gsap.ticker.remove(tick)
      clearTimeout(t)
      ro.disconnect()
    }
  }, [src, progressRef, pctRef])

  return <canvas ref={ref} role="img" aria-label={alt} />
}
