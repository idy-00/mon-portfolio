// Capture ponctuelle de sites en ligne → public/images/<slug>-screenshot.webp
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const targets = process.argv.slice(2).map(a => a.split('='))

const browser = await chromium.launch({ channel: 'chrome' })
const mobile = process.env.SHOT_MOBILE === '1'
const page = await browser.newPage(mobile
  ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { viewport: { width: 1440, height: 900 } })
// SHOT_COOKIE="nom=valeur" : cookie posé avant la capture (ex. porte d'âge déjà validée)
if (process.env.SHOT_COOKIE) {
  const [name, value] = process.env.SHOT_COOKIE.split('=')
  await page.context().addCookies(targets.map(([, url]) => ({ name, value, url })))
}
for (const [slug, url] of targets) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
  } catch { /* certains sites gardent une connexion ouverte (vidéo) */ }
  await page.waitForTimeout(3500)
  const raw = await page.screenshot({ type: 'png' })
  const buf = await sharp(raw).webp({ quality: 82 }).toBuffer()
  const out = path.join(ROOT, 'public', 'images', `${slug}-screenshot.webp`)
  await sharp(buf).toFile(out).catch(async () => {
    const fs = await import('fs'); fs.writeFileSync(out, buf)
  })
  console.log('ok', slug, out)
}
await browser.close()
