import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DOMAIN = 'https://ikdev.tech'
const TODAY = new Date().toISOString().slice(0, 10)

export async function generateSitemap() {
  const projectsContent = fs.readFileSync(path.join(ROOT, 'src/data/projects.js'), 'utf-8')
  const match = projectsContent.match(/export const projects = (\[[\s\S]*?\])\n\nexport/)
  const projects = JSON.parse(match[1])

  const staticPages = [
    { url: '/',        priority: '1.0', changefreq: 'monthly' },
    { url: '/projets', priority: '0.9', changefreq: 'monthly' },
    { url: '/a-propos',priority: '0.7', changefreq: 'yearly'  },
    { url: '/contact', priority: '0.8', changefreq: 'yearly'  },
  ]

  const projectPages = projects.map(p => ({
    url: `/projets/${p.slug}`,
    priority: '0.8',
    changefreq: 'yearly',
  }))

  const allPages = [...staticPages, ...projectPages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${DOMAIN}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

  fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml, 'utf-8')
  console.log(`✓ sitemap.xml généré — ${allPages.length} URLs`)
}
