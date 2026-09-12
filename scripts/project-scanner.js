import { log } from './logger.js'

const STACK_WEIGHTS = {
  Flutter: 15, Dart: 5, React: 12, 'Next.js': 14, 'Vue.js': 10, 'Nuxt.js': 12,
  Laravel: 12, PHP: 6, TypeScript: 8, GSAP: 6, 'Tailwind CSS': 4, Python: 8,
  Go: 10, Rust: 12, Firebase: 4, Prisma: 4, WebSockets: 5, Stripe: 6,
}

const BOOSTED_TOPICS = ['portfolio', 'project', 'app', 'web', 'mobile', 'saas', 'ecommerce']
const SKIP_NAMES = ['portfolio', 'porfolio', 'dotfiles', 'config', 'notes', 'learning', 'test', 'demo', 'sandbox', 'playground', 'template', 'boilerplate', 'tutorial', 'perso']
// Repos exclus définitivement — jamais affichés dans le portfolio
const BLOCKED_REPOS = ['porfolio-perso', 'porfolio-idy', 'mon-portfolio', 'portfolio-idy', 'yashba-luxe', 'dama-wetone']

function scoreRepo(repo) {
  let score = 0
  const reasons = []

  if (BLOCKED_REPOS.includes(repo.name.toLowerCase())) {
    return { score: -1, reasons: ['blocked: explicitly excluded'] }
  }

  if (SKIP_NAMES.some(n => repo.name.toLowerCase().includes(n))) {
    return { score: -1, reasons: ['skipped: generic/personal name'] }
  }

  // Stars
  if (repo.stars >= 10)  { score += 20; reasons.push(`stars:${repo.stars}`) }
  else if (repo.stars >= 3) { score += 10 }

  // Live URL
  if (repo.live) { score += 25; reasons.push('has live URL') }

  // Description
  if (repo.description && repo.description.length > 30) { score += 10; reasons.push('has description') }

  // Stack sophistication
  for (const tech of repo.stack || []) {
    const w = STACK_WEIGHTS[tech] || 3
    score += w
  }
  if (repo.stack?.length >= 3) { score += 8; reasons.push('rich stack') }

  // Topics
  if (repo.topics?.length > 0) score += 5
  if (repo.topics?.some(t => BOOSTED_TOPICS.includes(t))) score += 8

  // Recency (updated within 12 months = bonus)
  const monthsAgo = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
  if (monthsAgo < 6)  { score += 15; reasons.push('recently updated') }
  else if (monthsAgo < 12) { score += 8 }

  // Cloudflare deployment
  if (repo.deployment?.platform === 'Cloudflare Pages') { score += 20; reasons.push('CF Pages deployed') }

  return { score, reasons }
}

export function filterAndRankProjects(repos, { maxProjects = 6, minScore = 30 } = {}) {
  log.info(`Scoring ${repos.length} repos...`)

  const scored = repos
    .map((repo) => {
      const { score, reasons } = scoreRepo(repo)
      return { ...repo, _score: score, _reasons: reasons }
    })
    .filter((r) => r._score >= minScore)
    .sort((a, b) => b._score - a._score)

  const selected = scored.slice(0, maxProjects)
  log.ok(`Selected ${selected.length} projects (min score: ${minScore})`)
  selected.forEach(r => log.info(`  [${r._score}] ${r.name} — ${r._reasons.join(', ')}`))

  return selected.map(({ _score, _reasons, ...repo }) => repo)
}

export function buildProjectData(repo, index) {
  const techMap = {
    Flutter: { category: 'mobile' },
    React:   { category: 'frontend' },
    'Next.js': { category: 'frontend' },
    Laravel: { category: 'backend' },
    PHP:     { category: 'backend' },
    Python:  { category: 'backend' },
    Go:      { category: 'backend' },
  }

  const primary = repo.stack?.find(t => techMap[t]) || null
  const category = primary ? techMap[primary].category : 'fullstack'

  return {
    id: `gh-${repo.name}`,
    title: repo.name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()),
    summary: repo.description || '',
    stack: repo.stack || [],
    category,
    links: {
      github: repo.url,
      live: repo.live || null,
    },
    meta: {
      stars: repo.stars,
      updatedAt: repo.updated_at,
      deployment: repo.deployment || null,
    },
    screenshots: {
      desktop: `./screenshots/${repo.name}/desktop.webp`,
      tablet:  `./screenshots/${repo.name}/tablet.webp`,
      mobile:  `./screenshots/${repo.name}/mobile.webp`,
    },
    order: index,
    source: 'auto',
  }
}
