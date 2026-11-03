// QA serial|dev v2 : navigation, historique, fuites ScrollTrigger, débordement mobile, captures.
// Usage : node scripts/qa-serial.mjs [baseUrl] [--shots]
import { chromium } from '@playwright/test'
import fs from 'fs'

const BASE = (process.argv.find((a) => a.startsWith('http')) || 'http://localhost:4318').replace(/\/$/, '')
const SHOTS = process.argv.includes('--shots')
const OUT = 'logs/screens'
const ROUTES = ['/', '/projets', '/projets/finora360', '/projets/sunufoot', '/projets/certifio', '/services', '/a-propos', '/contact', '/insights']

const browser = await chromium.launch({ channel: 'chrome' })
const errors = []
const watch = (page, tag) => {
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`) })
}
const settle = (page, ms = 2600) => page.waitForTimeout(ms)
const h1 = (page) => page.evaluate(() => document.querySelector('main h1')?.getAttribute('aria-label') || document.querySelector('main h1')?.textContent?.trim())
const stCount = (page) => page.evaluate(() => window.__ST?.getAll().length ?? -1)

/* 1. Parcours + bouton retour */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  watch(page, 'nav')
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await settle(page, 3600)
  const log = (step) => console.log(`${step.padEnd(28)} url=${new URL(page.url()).pathname.padEnd(22)} h1=${JSON.stringify(h1cache)}`)
  let h1cache = await h1(page); log('accueil')
  await page.click('.nav__menu'); await page.waitForTimeout(1200)
  await page.click('#menu a[href="/projets"]'); await settle(page)
  h1cache = await h1(page); log('menu → projets')
  // scroll réel (molette → Lenis), puis clic sur une ligne déjà visible : rien ne re-scrolle avant le clic
  await page.mouse.move(400, 450)
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(120) }
  await page.waitForTimeout(1200)
  const yBefore = await page.evaluate(() => Math.round(window.scrollY))
  const target = await page.evaluate(() => {
    const a = [...document.querySelectorAll('.idx__row:not([hidden]) a')].find((el) => { const r = el.getBoundingClientRect(); return r.top > 120 && r.bottom < innerHeight - 40 })
    return a?.getAttribute('href')
  })
  await page.click(`.idx__row a[href="${target}"]`); await settle(page)
  h1cache = await h1(page); log(`projets → ${target.split('/').pop()}`)
  await page.goBack(); await settle(page)
  h1cache = await h1(page); log('retour ×1')
  const yAfter = await page.evaluate(() => Math.round(window.scrollY))
  console.log(`  scroll restauré : avant ${yBefore}px, après ${yAfter}px`)
  await page.goBack(); await settle(page)
  h1cache = await h1(page); log('retour ×2')
  await page.goForward(); await settle(page)
  h1cache = await h1(page); log('avant ×1')

  /* 2. 20 navigations : fuites ScrollTrigger */
  const seq = ['/', '/projets', '/services', '/a-propos', '/contact']
  const counts = []
  for (let i = 0; i < 20; i++) {
    const to = seq[i % seq.length]
    await page.evaluate((p) => { window.history.pushState({}, '', p); window.dispatchEvent(new PopStateEvent('popstate')) }, to)
    await settle(page, 2200)
    if (to === '/') counts.push(await stCount(page))
  }
  console.log(`ScrollTrigger actifs sur / après chaque tour de 5 pages : ${counts.join(', ')}`)
  await page.close()
}

/* 3. Débordement horizontal à 390 px + captures */
if (SHOTS) fs.mkdirSync(OUT, { recursive: true })
for (const vp of [{ width: 390, height: 844, tag: 'mob' }, { width: 1440, height: 900, tag: 'desk' }]) {
  for (const r of ROUTES) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    watch(page, `${vp.tag}${r}`)
    await page.goto(BASE + r, { waitUntil: 'networkidle' })
    await settle(page, 3600)
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    if (vp.tag === 'mob' || over > 0) console.log(`${vp.tag} ${r.padEnd(22)} scrollWidth - innerWidth = ${over}px`)
    if (SHOTS) {
      // descente progressive pour déclencher les animations, puis capture pleine page
      const total = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < total; y += 400) { await page.mouse.wheel(0, 400); await page.waitForTimeout(60) }
      await page.waitForTimeout(1200)
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800)
      const name = r === '/' ? 'accueil' : r.slice(1).replace(/\//g, '_')
      await page.screenshot({ path: `${OUT}/${vp.tag}-${name}.png`, fullPage: true })
    }
    await page.close()
  }
}

console.log(`\nerreurs console/JS : ${errors.length ? '\n' + errors.join('\n') : '0'}`)
await browser.close()
