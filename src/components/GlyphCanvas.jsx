import { useEffect, useRef } from 'react'
import { gsap, REDUCE } from '../lib/motion'

/*
 * Moteur de particules de glyphes de code.
 *  mode="compile" : les glyphes dispersés se rassemblent en `text` selon progressRef.current (0 → 1),
 *                   scintillement vert une fois assemblés.
 *  mode="rain"    : les glyphes tombent et se figent pour former `text`, pluie d'ambiance derrière.
 * Le rendu tourne sur gsap.ticker uniquement quand le canvas est à l'écran. Tout est nettoyé au démontage.
 * reduced-motion : état final dessiné une fois, sans boucle.
 */
const G = '{}<>/;=()[]$#01&|*+:'.split('')
const pick = () => G[(Math.random() * G.length) | 0]
const BONE = '#f1f0ec'
const LIVE = '#34c759'

function sizeCanvas(cv, light) {
  const dpr = Math.min(window.devicePixelRatio || 1, light ? 1.5 : 2)
  const W = cv.clientWidth, H = cv.clientHeight
  cv.width = Math.max(1, Math.round(W * dpr))
  cv.height = Math.max(1, Math.round(H * dpr))
  const c = cv.getContext('2d')
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { c, W, H }
}

function textPoints(W, H, text, fsRatio, yRatio, light) {
  const off = document.createElement('canvas')
  off.width = W; off.height = H
  const o = off.getContext('2d', { willReadFrequently: true })
  let fs = Math.min((W * fsRatio) / Math.max(1, text.length * 0.55), H * 0.62)
  o.fillStyle = '#fff'; o.textAlign = 'center'; o.textBaseline = 'middle'
  o.font = `800 ${fs}px Syne, "Arial Black", sans-serif`
  // le texte doit tenir dans 88 % de la largeur (mobile : canvas étroit et haut)
  const w = o.measureText(text).width
  if (w > W * 0.88) { fs *= (W * 0.88) / w; o.font = `800 ${fs}px Syne, "Arial Black", sans-serif` }
  o.fillText(text, W / 2, H * yRatio)
  const d = o.getImageData(0, 0, W, H).data
  const step = Math.max(light ? 9 : 7, Math.round(fs / (light ? 34 : 44)))
  const pts = []
  for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 128) pts.push([x, y])
  return { pts, step }
}

function compileEngine(cv, text, progressRef) {
  let S, pts = []
  const build = () => {
    const light = window.innerWidth < 900
    S = sizeCanvas(cv, light)
    const r = textPoints(S.W, S.H, text, 0.9, 0.47, light)
    pts = r.pts.map((q) => {
      const a = Math.random() * 6.283, R = Math.max(S.W, S.H) * (0.45 + Math.random() * 0.6)
      return { tx: q[0], ty: q[1], sx: S.W / 2 + Math.cos(a) * R, sy: S.H / 2 + Math.sin(a) * R, g: pick(), d: Math.random() * 0.35, ph: Math.random() * 6.28, s: r.step * 1.05 }
    })
  }
  const draw = (still) => {
    const c = S.c, t = performance.now() / 1000, p = still ? 1 : progressRef.current
    c.clearRect(0, 0, S.W, S.H); c.textAlign = 'center'; c.textBaseline = 'middle'
    for (const q of pts) {
      const k = Math.min(1, Math.max(0, (p * 1.25 - q.d) / 0.65)), e = 1 - Math.pow(1 - k, 3)
      const wob = still ? 0 : (1 - e) * 14
      const x = q.sx + (q.tx - q.sx) * e + Math.sin(t * 1.3 + q.ph) * wob
      const y = q.sy + (q.ty - q.sy) * e + Math.cos(t * 1.1 + q.ph) * wob
      const lit = !still && e > 0.98 ? Math.sin(t * 2 + q.ph) * 0.5 + 0.5 : 0
      c.globalAlpha = 0.16 + e * 0.64 + lit * 0.2
      c.fillStyle = lit > 0.97 ? LIVE : BONE
      c.font = `${q.s * (0.8 + e * 0.35)}px "JetBrains Mono", monospace`
      c.fillText(q.g, x, y)
    }
    c.globalAlpha = 1
  }
  return { build, draw }
}

function rainEngine(cv, text) {
  let S, drops = [], amb = []
  const build = () => {
    const light = window.innerWidth < 900
    S = sizeCanvas(cv, light)
    const r = textPoints(S.W, S.H, text, 1.05, 0.44, light)
    drops = r.pts.map((q) => ({ x: q[0], ty: q[1], y: -Math.random() * S.H * 1.6 - 20, v: 2 + Math.random() * 5, g: pick(), lock: false, s: r.step * 1.1, ph: Math.random() * 6.28 }))
    const gap = light ? 34 : 22
    amb = []
    for (let i = 0; i < Math.floor(S.W / gap); i++) amb.push({ x: i * gap + gap / 2, y: Math.random() * S.H, v: 1 + Math.random() * 3, len: 6 + ((Math.random() * 14) | 0) })
  }
  const draw = (still) => {
    const c = S.c, t = performance.now()
    c.clearRect(0, 0, S.W, S.H); c.textAlign = 'center'; c.textBaseline = 'middle'
    if (!still) {
      c.font = '13px "JetBrains Mono", monospace'
      c.fillStyle = '#8f8e94'
      amb.forEach((a, i) => {
        a.y += a.v
        if (a.y - a.len * 16 > S.H) a.y = -20
        for (let j = 0; j < a.len; j++) {
          c.globalAlpha = (1 - j / a.len) * 0.13
          c.fillText(G[(i * 7 + j + ((t / 90) | 0)) % G.length], a.x, a.y - j * 16)
        }
      })
    }
    for (const d of drops) {
      if (still) { d.y = d.ty; d.lock = true }
      if (!d.lock) { d.y += d.v; d.v += 0.12; if (d.y >= d.ty) { d.y = d.ty; d.lock = true } }
      if (!still && d.lock && Math.random() < 0.004) d.g = pick()
      const lit = d.lock && !still ? Math.sin(t / 400 + d.ph) * 0.5 + 0.5 : 0
      c.globalAlpha = d.lock ? 0.72 + lit * 0.28 : 0.45
      c.fillStyle = d.lock && lit > 0.96 ? LIVE : BONE
      c.font = `${d.s}px "JetBrains Mono", monospace`
      c.fillText(d.g, d.x, d.y)
    }
    c.globalAlpha = 1
  }
  return { build, draw }
}

export default function GlyphCanvas({ mode = 'compile', text, progressRef, className = '', label }) {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    const engine = mode === 'rain' ? rainEngine(cv, text) : compileEngine(cv, text, progressRef)
    let visible = false, alive = true, to
    const render = () => engine.draw(false)
    const rebuild = () => { if (!alive) return; engine.build(); if (REDUCE) engine.draw(true) }
    rebuild()
    document.fonts?.ready.then(rebuild)
    const onResize = () => { clearTimeout(to); to = setTimeout(rebuild, 200) }
    window.addEventListener('resize', onResize)

    let io
    if (!REDUCE) {
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !visible) { visible = true; gsap.ticker.add(render) }
        else if (!e.isIntersecting && visible) { visible = false; gsap.ticker.remove(render) }
      })
      io.observe(cv)
    }
    return () => {
      alive = false
      clearTimeout(to)
      window.removeEventListener('resize', onResize)
      io?.disconnect()
      gsap.ticker.remove(render)
    }
  }, [mode, text, progressRef])

  return <canvas ref={ref} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'} />
}
