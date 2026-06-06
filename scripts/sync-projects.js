#!/usr/bin/env node
/**
 * npm run sync-projects
 *
 * Pipeline complet — rien à faire manuellement :
 *  1. Analyse GitHub → liste des repos
 *  2. Analyse Cloudflare → URLs live existantes
 *  3. Merge données
 *  4. Auto-déploie les projets frontend sans URL (Cloudflare Pages direct upload)
 *  5. Score & filtre les meilleurs projets
 *  6. Génère src/data/projects.js avec les vraies URLs injectées
 *  7. Prend des screenshots Playwright des projets en ligne
 *  8. Build du portfolio (npm run build)
 *  9. Déploie le portfolio lui-même sur Cloudflare Pages
 * → Portfolio à jour et en ligne automatiquement
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { analyzeGitHub }          from './github-analyzer.js'
import { analyzeCloudflare, mergeWithCloudflare } from './cloudflare-analyzer.js'
import { filterAndRankProjects, buildProjectData } from './project-scanner.js'
import { generateScreenshots }    from './screenshot-generator.js'
import { deployProject, diagnoseCFToken } from './cloudflare-deployer.js'
import { generateProjectsFile }   from './generate-projects-file.js'
import { generateSitemap }        from './generate-sitemap.js'
import { deployPortfolio }        from './deploy-portfolio.js'
import { log }                    from './logger.js'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const ROOT       = path.join(__dirname, '..')
const GENERATED  = path.join(ROOT, 'generated')
const PUBLIC_GEN = path.join(ROOT, 'public', 'generated')

const {
  GITHUB_TOKEN,
  GITHUB_USERNAME,
  CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID,
} = process.env

const FLAGS = {
  noScreenshots:    process.argv.includes('--no-screenshots'),
  noDeploy:         process.argv.includes('--no-deploy'),         // skip auto-deploying individual projects
  noPortfolioDeploy:process.argv.includes('--no-portfolio-deploy'),// skip final portfolio deploy
  diagnose:         process.argv.includes('--diagnose-cf'),
  buildOnly:        process.argv.includes('--build-only'),        // generate + build, no CF deploys
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mkdir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

function copyDirSync(src, dst) {
  mkdir(dst)
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name)
    e.isDirectory() ? copyDirSync(s, d) : fs.copyFileSync(s, d)
  }
}

function banner(text) {
  const line = '─'.repeat(50)
  console.log(`\n  ${line}`)
  console.log(`  ${text}`)
  console.log(`  ${line}\n`)
}

// ─── Diagnosis ───────────────────────────────────────────────────────────────

async function runDiagnosis() {
  banner('Cloudflare Token Diagnosis')
  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
    console.error('  CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID not set in .env')
    return
  }
  const r = await diagnoseCFToken(CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN)
  if (r.ok) {
    console.log(`  ✓ Token OK — ${r.projectCount} Pages projects found`)
  } else {
    console.log(`  ✗ ${r.reason}`)
    if (r.fix) console.log(`\n  Fix:\n    ${r.fix}\n`)
  }
}

// ─── Auto-deploy individual undeployed projects ───────────────────────────────

async function autoDeployMissing(repos) {
  if (FLAGS.noDeploy || FLAGS.buildOnly) {
    log.info('Auto-deploy of individual projects: skipped')
    return repos
  }
  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
    log.warn('No CF credentials — skipping auto-deploy of individual projects')
    return repos
  }

  const diag = await diagnoseCFToken(CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN)
  if (!diag.ok) {
    log.warn(`CF token insufficient: ${diag.reason}`)
    log.warn('Skipping auto-deploy of individual projects')
    return repos
  }

  const BLOCKED_REPOS = ['porfolio-perso', 'porfolio-idy', 'mon-portfolio', 'portfolio-idy']
  const deployable = repos.filter(r =>
    !r.live &&
    !BLOCKED_REPOS.includes(r.name.toLowerCase()) &&
    (r.stack?.some(t => ['React', 'Vue', 'Next.js', 'TypeScript', 'JavaScript', 'Flutter', 'Dart'].includes(t)) ||
     ['JavaScript', 'TypeScript', 'Dart'].includes(r.language))
  )

  if (!deployable.length) { log.info('No undeployed frontend projects to deploy'); return repos }

  log.info(`Auto-deploying ${deployable.length} frontend project(s) without live URL`)

  const results = {}
  for (const repo of deployable) {
    const r = await deployProject(repo, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, GITHUB_TOKEN)
    results[repo.name] = r
    if (r.success) {
      const idx = repos.findIndex(x => x.name === repo.name)
      if (idx !== -1) repos[idx] = { ...repos[idx], live: r.url, deployment: { platform: 'Cloudflare Pages', subdomain: r.projectName, status: 'deployed', lastDeployedAt: new Date().toISOString() } }
    }
  }

  fs.writeFileSync(path.join(GENERATED, 'deploy-results.json'), JSON.stringify(results, null, 2))
  return repos
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (FLAGS.diagnose) { await runDiagnosis(); return }

  banner('PORTFOLIO SYNC — Démarrage')

  if (!GITHUB_TOKEN)    { console.error('ERROR: GITHUB_TOKEN manquant dans .env'); process.exit(1) }
  if (!GITHUB_USERNAME) { console.error('ERROR: GITHUB_USERNAME manquant dans .env'); process.exit(1) }

  mkdir(GENERATED)
  mkdir(PUBLIC_GEN)

  // ── 1. GitHub ───────────────────────────────────────────────────────────────
  log.info('PHASE 1 — Analyse GitHub')
  const githubRepos = await analyzeGitHub(GITHUB_USERNAME, GITHUB_TOKEN)

  // ── 2. Cloudflare (URLs déjà déployées) ─────────────────────────────────────
  log.info('PHASE 2 — Analyse Cloudflare')
  const cfProjects = await analyzeCloudflare(CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN)

  // ── 3. Merge ────────────────────────────────────────────────────────────────
  log.info('PHASE 3 — Merge données')
  let merged = mergeWithCloudflare(githubRepos, cfProjects)

  // ── 4. Auto-deploy projets sans URL ─────────────────────────────────────────
  log.info('PHASE 4 — Auto-déploiement projets individuels')
  merged = await autoDeployMissing(merged)

  // ── 5. Score & filtre ───────────────────────────────────────────────────────
  log.info('PHASE 5 — Scoring et sélection')
  const topProjects = filterAndRankProjects(merged, { maxProjects: 6, minScore: 20 })
  const projectsData = topProjects.map((r, i) => buildProjectData(r, i))

  // ── 6. Écriture src/data/projects.js (URLs live injectées) ──────────────────
  log.info('PHASE 6 — Génération src/data/projects.js')
  await generateProjectsFile(projectsData)

  // ── 6b. Sitemap ─────────────────────────────────────────────────────────────
  await generateSitemap()

  // ── 7. Sauvegarde JSON brut ──────────────────────────────────────────────────
  const json = JSON.stringify(projectsData, null, 2)
  fs.writeFileSync(path.join(GENERATED, 'projects-data.json'), json)
  fs.writeFileSync(path.join(PUBLIC_GEN, 'projects-data.json'), json)

  // ── 8. Screenshots Playwright ────────────────────────────────────────────────
  if (!FLAGS.noScreenshots) {
    log.info('PHASE 7 — Screenshots Playwright')
    // Purge stale screenshot folders not in current project list
    const activeKeys = new Set(projectsData.map(p =>
      (p.meta?.repoName || p.id.replace('gh-', '')).toLowerCase()
    ))
    for (const dir of [path.join(GENERATED, 'screenshots'), path.join(PUBLIC_GEN, 'screenshots')]) {
      if (!fs.existsSync(dir)) continue
      for (const name of fs.readdirSync(dir)) {
        if (!activeKeys.has(name.toLowerCase())) {
          fs.rmSync(path.join(dir, name), { recursive: true, force: true })
          log.info(`  Purged stale screenshot folder: ${name}`)
        }
      }
    }
    await generateScreenshots(projectsData)
    const srcShots = path.join(GENERATED, 'screenshots')
    if (fs.existsSync(srcShots)) copyDirSync(srcShots, path.join(PUBLIC_GEN, 'screenshots'))
  } else {
    log.info('PHASE 7 — Screenshots: skipped')
  }

  // ── 9. Build + déploiement portfolio ─────────────────────────────────────────
  let portfolioUrl = null
  const canDeployPortfolio = !FLAGS.buildOnly && !FLAGS.noPortfolioDeploy &&
    CLOUDFLARE_API_TOKEN && CLOUDFLARE_ACCOUNT_ID

  if (canDeployPortfolio) {
    log.info('PHASE 8 — Build & déploiement du portfolio')
    try {
      const diag = await diagnoseCFToken(CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN)
      if (diag.ok) {
        portfolioUrl = await deployPortfolio(CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN)
      } else {
        log.warn(`CF token insuffisant pour le portfolio: ${diag.reason}`)
        log.info('Build local uniquement...')
        await buildLocal()
      }
    } catch (err) {
      log.error(`Déploiement portfolio échoué: ${err.message}`)
      log.info('Tentative de build local uniquement...')
      await buildLocal()
    }
  } else {
    log.info('PHASE 8 — Build local (sans déploiement CF)')
    await buildLocal()
  }

  // ── Résumé ────────────────────────────────────────────────────────────────────
  const allProjects = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'projects.js'), 'utf-8').match(/\[[\s\S]*\]/)[0])
  const liveCount = allProjects.filter(p => p.live).length

  banner('SYNC TERMINÉ')
  console.log(`  Projets : ${allProjects.length}`)
  console.log(`  Avec URL live : ${liveCount}`)
  if (portfolioUrl) {
    console.log(`\n  Portfolio en ligne : ${portfolioUrl}`)
  } else {
    console.log(`\n  Build local : dist/`)
  }
  console.log('')
}

async function buildLocal() {
  const { spawnSync } = await import('child_process')
  // Pass as single string with shell:true to avoid Windows EINVAL with arg arrays
  const r = spawnSync('npm run build', {
    cwd: ROOT, stdio: 'inherit', shell: true,
    timeout: 300000, env: { ...process.env, CI: 'true', NODE_ENV: 'production' },
  })
  if (r.error) throw new Error(`Build spawn error: ${r.error.message}`)
  if (r.status !== null && r.status !== 0) throw new Error(`npm run build exited with code ${r.status}`)
  log.ok('Build local terminé → dist/')
}

main().catch(err => {
  log.error(`Fatal: ${err.message}`)
  console.error(err)
  process.exit(1)
})
