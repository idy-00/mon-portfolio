import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const html = `<!DOCTYPE html>
<html><head><style>
* { margin:0; padding:0; }
body { width:32px; height:32px; overflow:hidden; background:#000; }
</style></head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="6" fill="#000"/>
  <text x="16" y="21.5" font-family="Georgia,serif" font-size="14" font-weight="700" fill="#fff" text-anchor="middle" letter-spacing="0.5">IK</text>
</svg>
</body></html>`

const tmpFile = path.join(ROOT, 'temp-fav.html')
fs.writeFileSync(tmpFile, html)

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 32, height: 32 })
const fileUrl = 'file:///' + tmpFile.replace(/\\/g, '/')
await page.goto(fileUrl)

const buf32 = await page.screenshot({ type: 'png', clip: { x:0, y:0, width:32, height:32 } })
fs.writeFileSync(path.join(ROOT, 'public/favicon.png'), buf32)
console.log('favicon.png (32x32):', buf32.length, 'bytes')

await browser.close()
fs.unlinkSync(tmpFile)
console.log('Done')
