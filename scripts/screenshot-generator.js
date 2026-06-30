import { chromium } from '@playwright/test'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { log } from './logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'generated', 'screenshots')
const THUMBNAILS_DIR  = path.join(__dirname, '..', 'generated', 'thumbnails')

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 390,  height: 844  },
]

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function screenshotUrl(page, url, outputPath, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height })
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
    await page.waitForTimeout(1500)
    const raw = await page.screenshot({ fullPage: false, type: 'png' })
    await sharp(raw)
      .webp({ quality: 82 })
      .toFile(outputPath)
    log.shotOk(`  ${viewport.name}: ${outputPath}`)
    return true
  } catch (err) {
    log.shotErr(`  ${viewport.name} failed for ${url}: ${err.message}`)
    return false
  }
}

async function generatePlaceholder(projectName, outputPath) {
  const svg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <rect width="1920" height="1080" fill="#0a0a0a"/>
    <text x="960" y="520" font-family="monospace" font-size="48" fill="#333" text-anchor="middle">${projectName}</text>
    <text x="960" y="580" font-family="monospace" font-size="24" fill="#222" text-anchor="middle">No live URL</text>
  </svg>`
  await sharp(Buffer.from(svg))
    .webp({ quality: 70 })
    .toFile(outputPath)
}

async function generateThumbnail(inputPath, thumbnailPath) {
  try {
    await sharp(inputPath)
      .resize(640, 360, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(thumbnailPath)
  } catch {}
}

export async function generateScreenshots(projects) {
  await ensureDir(SCREENSHOTS_DIR)
  await ensureDir(THUMBNAILS_DIR)

  const projectsWithLive = projects.filter(p => p.links?.live)
  const projectsNoLive   = projects.filter(p => !p.links?.live)

  log.shot(`Generating screenshots for ${projectsWithLive.length} projects with live URLs`)

  if (projectsWithLive.length === 0) {
    log.shot('No live URLs found — generating placeholders for all')
    for (const p of projects) {
      const dir = path.join(SCREENSHOTS_DIR, (p.meta?.repoName || p.title).toLowerCase())
      await ensureDir(dir)
      for (const vp of VIEWPORTS) {
        await generatePlaceholder(p.title, path.join(dir, `${vp.name}.webp`))
      }
    }
    return projects
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124',
    locale: 'fr-FR',
  })
  const page = await context.newPage()

  for (const project of projects) {
    const repoName = (project.meta?.repoName || project.id.replace('gh-', '')).toLowerCase()
    const dir = path.join(SCREENSHOTS_DIR, repoName)
    const thumbDir = path.join(THUMBNAILS_DIR, repoName)
    await ensureDir(dir)
    await ensureDir(thumbDir)

    if (!project.links?.live) {
      log.shot(`${repoName}: no live URL — generating placeholder`)
      for (const vp of VIEWPORTS) {
        await generatePlaceholder(project.title, path.join(dir, `${vp.name}.webp`))
      }
      continue
    }

    log.shot(`Screenshotting ${project.title} (${project.links.live})`)
    for (const vp of VIEWPORTS) {
      const out = path.join(dir, `${vp.name}.webp`)
      const ok = await screenshotUrl(page, project.links.live, out, vp)
      if (ok && vp.name === 'desktop') {
        await generateThumbnail(out, path.join(thumbDir, 'thumb.webp'))
      }
      if (!ok) {
        await generatePlaceholder(project.title, out)
      }
    }
  }

  await browser.close()
  log.shotOk('Screenshot generation complete')
  return projects
}
