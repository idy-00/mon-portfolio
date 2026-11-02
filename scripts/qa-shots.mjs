// Captures écran par écran d'une route (taille réelle), en descendant à la molette (Lenis).
// Usage : node scripts/qa-shots.mjs /route [desk|mob] [base]
import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const route = process.argv[2] || '/'
const tag = process.argv[3] || 'desk'
const base = process.argv[4] || 'http://localhost:4318'
const vp = tag === 'mob' ? { width: 390, height: 844 } : { width: 1440, height: 900 }
const OUT = path.join(process.env.TEMP || '/tmp', 'sx2', `${tag}${route.replace(/\//g, '_') || '_'}`)
fs.mkdirSync(OUT, { recursive: true })
for (const f of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, f))

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 })
const errs = []
page.on('pageerror', (e) => errs.push(e.message))
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
await page.goto(base + route, { waitUntil: 'networkidle' })
await page.waitForTimeout(3800)
let i = 0
const shot = async () => page.screenshot({ path: path.join(OUT, `${String(i++).padStart(2, '0')}.png`) })
await shot()
const step = Math.round(vp.height * 0.75)
for (let guard = 0; guard < 60; guard++) {
  const before = await page.evaluate(() => window.scrollY)
  for (let s = 0; s < step; s += 150) { await page.mouse.wheel(0, 150); await page.waitForTimeout(35) }
  await page.waitForTimeout(1300)
  const after = await page.evaluate(() => window.scrollY)
  await shot()
  if (after - before < 5) break
}
const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
console.log(`${OUT} : ${i} écrans, débordement ${over}px, erreurs ${errs.length ? JSON.stringify(errs) : 0}`)
await browser.close()
