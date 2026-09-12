/**
 * Déploie le dist/ du portfolio sur Cloudflare Pages via wrangler.
 * Nom du projet Pages : "portfolio-idrissa" (créé automatiquement si absent).
 */
import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { log } from './logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PORTFOLIO_PROJECT = 'portfolio-idrissa'

function run(cmdString, cwd, extraEnv = {}) {
  const r = spawnSync(cmdString, {
    cwd: cwd || ROOT,
    stdio: 'pipe',
    shell: true,
    timeout: 300000,
    env: { ...process.env, CI: 'true', NODE_ENV: 'production', ...extraEnv },
  })
  if (r.error) throw new Error(`spawn error: ${r.error.message}`)
  if (r.status !== null && r.status !== 0) {
    const err = r.stderr?.toString().trim() || r.stdout?.toString().trim() || ''
    throw new Error(`"${cmdString}" failed (exit ${r.status}): ${err.slice(0, 600)}`)
  }
  return (r.stdout?.toString() || '') + (r.stderr?.toString() || '')
}

export async function deployPortfolio(accountId, token) {
  log.info('\n── Deploying portfolio to Cloudflare Pages ──')

  // 1. Build
  log.info('  Building portfolio (npm run build)...')
  run('npm run build', ROOT)
  log.ok('  Build complete')

  const distDir = path.join(ROOT, 'dist')
  if (!fs.existsSync(distDir)) throw new Error('dist/ not found after build')

  // 2. Deploy via wrangler pages deploy
  log.info(`  Deploying to ${PORTFOLIO_PROJECT} via wrangler...`)
  const output = run(
    `npx wrangler pages deploy dist --project-name=${PORTFOLIO_PROJECT} --commit-dirty=true`,
    ROOT,
    {
      CLOUDFLARE_API_TOKEN: token,
      CLOUDFLARE_ACCOUNT_ID: accountId,
      WRANGLER_SEND_METRICS: 'false',
    }
  )
  log.ok('  Wrangler deploy complete')

  // Extract URL from wrangler output
  const urlMatch = output.match(/https:\/\/[^\s]+pages\.dev[^\s]*/i)
  const url = urlMatch ? urlMatch[0].replace(/[.)]+$/, '') : `https://${PORTFOLIO_PROJECT}.pages.dev`
  log.ok(`  Portfolio live: ${url}`)
  return url
}
