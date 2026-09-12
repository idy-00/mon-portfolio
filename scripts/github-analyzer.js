import axios from 'axios'
import { log } from './logger.js'

const GH = 'https://api.github.com'

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function fetchRepos(username, token) {
  const repos = []
  let page = 1
  while (true) {
    const { data } = await axios.get(`${GH}/users/${username}/repos`, {
      headers: headers(token),
      params: { per_page: 100, page, sort: 'updated', direction: 'desc' },
    })
    repos.push(...data)
    if (data.length < 100) break
    page++
  }
  log.info(`Fetched ${repos.length} repos for ${username}`)
  return repos
}

async function fetchFileContent(username, repo, path, token) {
  try {
    const { data } = await axios.get(`${GH}/repos/${username}/${repo}/contents/${path}`, {
      headers: headers(token),
    })
    return Buffer.from(data.content, 'base64').toString('utf-8')
  } catch {
    return null
  }
}

// Mots-clés signalant du boilerplate à ignorer
const BOILERPLATE_PATTERNS = [
  /bootstrapped with/i, /create-next-app/i, /create-react-app/i,
  /getting started/i, /npm run (dev|build|start|test)/i, /yarn (dev|build|start)/i,
  /this (is a|project|template|app) (uses|was|built|bootstrapped)/i,
  /minimal setup/i, /open \[?http/i, /deploy on vercel/i, /learn more/i,
  /first,? run/i, /you can start/i, /edit (this page|`?src\/)/i,
  /vite \+ react/i, /hmr and some eslint/i, /two official plugins/i,
  /^```/, /^\[!\[/, /^#{1,6}\s*(getting started|installation|usage|prerequis|setup|deploy)/i,
]

function extractReadmeSummary(readme) {
  const lines = readme.split('\n')
  for (const line of lines) {
    const clean = line.trim()
    if (!clean) continue
    if (clean.startsWith('#')) continue        // titres
    if (clean.startsWith('!')) continue        // images
    if (clean.startsWith('<')) continue        // HTML
    if (clean.startsWith('|')) continue        // tableaux
    if (clean.startsWith('-') && clean.length < 15) continue // listes courtes
    if (BOILERPLATE_PATTERNS.some(p => p.test(clean))) continue
    if (clean.length < 20) continue            // trop court
    // Nettoyer le markdown inline
    const text = clean
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // liens → texte
      .replace(/[`*_~]/g, '')                  // formatage
      .slice(0, 200)
    if (text.length >= 20) return text
  }
  return ''
}

async function detectStack(username, repoName, token) {
  const stack = new Set()

  const checks = [
    ['package.json', (c) => {
      try {
        const pkg = JSON.parse(c)
        const deps = { ...pkg.dependencies, ...pkg.devDependencies }
        if (deps.react)         stack.add('React')
        if (deps.next)          stack.add('Next.js')
        if (deps.vue)           stack.add('Vue.js')
        if (deps.nuxt)          stack.add('Nuxt.js')
        if (deps.svelte)        stack.add('Svelte')
        if (deps.typescript)    stack.add('TypeScript')
        if (deps.express)       stack.add('Express')
        if (deps.fastify)       stack.add('Fastify')
        if (deps['tailwindcss'])stack.add('Tailwind CSS')
        if (deps.gsap)          stack.add('GSAP')
        if (deps.prisma || deps['@prisma/client']) stack.add('Prisma')
        if (deps.mongoose)      stack.add('MongoDB')
        if (deps.stripe)        stack.add('Stripe')
        if (deps.socket || deps['socket.io']) stack.add('WebSockets')
      } catch {}
    }],
    ['pubspec.yaml', (c) => {
      if (c.includes('flutter:')) stack.add('Flutter')
      if (c.includes('dart:'))    stack.add('Dart')
      if (c.includes('firebase')) stack.add('Firebase')
      if (c.includes('google_maps')) stack.add('Google Maps API')
      if (c.includes('dio'))      stack.add('Dio')
      if (c.includes('provider') || c.includes('riverpod') || c.includes('bloc')) stack.add('State Management')
    }],
    ['composer.json', (c) => {
      try {
        const pkg = JSON.parse(c)
        const deps = { ...pkg.require, ...pkg['require-dev'] }
        stack.add('PHP')
        if (Object.keys(deps).some(k => k.includes('laravel'))) stack.add('Laravel')
        if (Object.keys(deps).some(k => k.includes('symfony'))) stack.add('Symfony')
      } catch { stack.add('PHP') }
    }],
    ['requirements.txt', () => { stack.add('Python') }],
    ['go.mod', () => { stack.add('Go') }],
    ['Cargo.toml', () => { stack.add('Rust') }],
    ['pom.xml', () => { stack.add('Java') }],
    ['build.gradle', () => { stack.add('Kotlin') }],
  ]

  await Promise.all(checks.map(async ([file, fn]) => {
    const content = await fetchFileContent(username, repoName, file, token)
    if (content) fn(content)
  }))

  return [...stack]
}

async function analyzeRepo(repo, username, token) {
  const { name, description, html_url, homepage, stargazers_count, forks_count,
          language, topics, created_at, updated_at, fork, archived, size,
          default_branch } = repo

  if (fork || archived || size < 2) return null

  const stack = await detectStack(username, name, token)

  // Priorité 1 : description GitHub (champ court du repo)
  // Priorité 2 : première vraie phrase du README (filtre boilerplate)
  let readmeSummary = description || ''
  if (!readmeSummary) {
    const readme = await fetchFileContent(username, name, 'README.md', token)
    if (readme) readmeSummary = extractReadmeSummary(readme)
  }

  log.ok(`Analyzed: ${name} — ${stack.join(', ') || language || 'unknown stack'}`)

  return {
    name,
    description: readmeSummary || description || '',
    url: html_url,
    live: homepage || null,
    stars: stargazers_count,
    forks: forks_count,
    language: language || null,
    topics: topics || [],
    stack: stack.length ? stack : (language ? [language] : []),
    created_at,
    updated_at,
    default_branch,
  }
}

export async function analyzeGitHub(username, token) {
  log.info(`Starting GitHub analysis for ${username}`)
  const repos = await fetchRepos(username, token)

  const results = []
  for (const repo of repos) {
    try {
      const data = await analyzeRepo(repo, username, token)
      if (data) results.push(data)
    } catch (err) {
      log.error(`Failed to analyze ${repo.name}: ${err.message}`)
    }
  }

  log.ok(`GitHub analysis complete: ${results.length} repos analyzed`)
  return results
}
