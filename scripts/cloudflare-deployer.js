/**
 * Cloudflare Pages Auto-Deployer — Direct Upload method
 * No GitHub OAuth integration needed. Downloads repo zip via GitHub API,
 * builds locally, uploads dist/ to Cloudflare Pages.
 */
import axios from 'axios'
import { spawnSync } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { fileURLToPath } from 'url'
import { log } from './logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CF = 'https://api.cloudflare.com/client/v4'
const GH = 'https://api.github.com'

// ─── Shell exec (Windows-safe: shell:true + single string) ─────────────────

function run(cmdString, options = {}) {
  const result = spawnSync(cmdString, {
    cwd: options.cwd,
    timeout: options.timeout || 180000,
    env: options.env || process.env,
    stdio: 'pipe',
    shell: true,
  })
  if (result.error) throw new Error(`spawn error: ${result.error.message}`)
  if (result.status !== null && result.status !== 0) {
    const stderr = result.stderr?.toString().trim() || ''
    const stdout = result.stdout?.toString().trim() || ''
    throw new Error(`"${cmdString}" failed (exit ${result.status}): ${stderr || stdout}`.slice(0, 500))
  }
  return result.stdout?.toString().trim() || ''
}

// ─── Framework detection ───────────────────────────────────────────────────

const FRAMEWORK_CONFIGS = {
  flutter: {
    name: 'Flutter Web',
    buildScript: null, // handled separately
    out: 'build/web',
    isFlutter: true,
  },
  next: {
    name: 'Next.js',
    buildScript: 'build',
    out: 'out',
    patchNextConfig: true,
  },
  vite: {
    name: 'Vite',
    buildScript: 'build',
    out: 'dist',
  },
  cra: {
    name: 'Create React App',
    buildScript: 'build',
    out: 'build',
  },
  vue: {
    name: 'Vue',
    buildScript: 'build',
    out: 'dist',
  },
  nuxt: {
    name: 'Nuxt.js',
    buildScript: 'generate',
    out: '.output/public',
  },
  gatsby: {
    name: 'Gatsby',
    buildScript: 'build',
    out: 'public',
  },
  astro: {
    name: 'Astro',
    buildScript: 'build',
    out: 'dist',
  },
  static: {
    name: 'Static',
    buildScript: null,
    out: '.',
  },
}

function detectFramework(pkgJson, files) {
  // Flutter détecté via pubspec.yaml
  if (files.includes('pubspec.yaml')) return FRAMEWORK_CONFIGS.flutter

  if (!pkgJson) {
    if (files.includes('index.html')) return FRAMEWORK_CONFIGS.static
    return null
  }

  const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies }
  const scripts = pkgJson.scripts || {}

  if (deps.next || scripts.build?.includes('next'))                            return FRAMEWORK_CONFIGS.next
  if (deps.nuxt || scripts.build?.includes('nuxt'))                            return FRAMEWORK_CONFIGS.nuxt
  if (deps.gatsby || scripts.build?.includes('gatsby'))                        return FRAMEWORK_CONFIGS.gatsby
  if (deps.astro || scripts.build?.includes('astro'))                          return FRAMEWORK_CONFIGS.astro
  if (deps.vite || deps['@vitejs/plugin-react'] || deps['@vitejs/plugin-vue']) return FRAMEWORK_CONFIGS.vite
  if (deps['react-scripts'])                                                   return FRAMEWORK_CONFIGS.cra
  if (deps.vue)                                                                return FRAMEWORK_CONFIGS.vue
  if (scripts.build)    return { name: 'Custom', buildScript: 'build', out: 'dist' }
  if (files.includes('index.html')) return FRAMEWORK_CONFIGS.static
  return null
}

// ─── Repo download & extract ────────────────────────────────────────────────

async function downloadRepo(owner, repo, branch, ghToken) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `cf-deploy-${repo}-`))
  const zipPath = path.join(tmpDir, 'repo.zip')

  log.info(`  Downloading ${owner}/${repo}@${branch}`)

  const res = await axios.get(`${GH}/repos/${owner}/${repo}/zipball/${branch}`, {
    headers: {
      Authorization: `Bearer ${ghToken}`,
      Accept: 'application/vnd.github+json',
    },
    responseType: 'stream',
    maxRedirects: 5,
  })
  await pipeline(res.data, createWriteStream(zipPath))

  const extractDir = path.join(tmpDir, 'extracted')
  fs.mkdirSync(extractDir)

  // Use tar (available on Windows 10+) with argument array — no shell interpolation
  const tarResult = spawnSync('tar', ['-xf', zipPath, '-C', extractDir], { stdio: 'pipe' })
  if (tarResult.status !== 0) {
    // Windows PowerShell fallback — arguments kept separate, no shell expansion
    const psResult = spawnSync('powershell', [
      '-NoProfile', '-NonInteractive', '-Command',
      `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${extractDir}'`,
    ], { stdio: 'pipe', shell: false })
    if (psResult.status !== 0) {
      throw new Error('Failed to extract repo zip (tar and PowerShell both failed)')
    }
  }

  // GitHub zips contain one top-level folder like owner-repo-sha/
  const items = fs.readdirSync(extractDir)
  const repoRoot = items.length === 1 && fs.statSync(path.join(extractDir, items[0])).isDirectory()
    ? path.join(extractDir, items[0])
    : extractDir

  log.ok(`  Extracted → ${repoRoot}`)
  return { tmpDir, repoRoot }
}

// ─── Build ──────────────────────────────────────────────────────────────────

async function buildProject(repoRoot, frameworkHint) {
  const files = fs.readdirSync(repoRoot)
  let pkg = null
  if (files.includes('package.json')) {
    try { pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf-8')) } catch {}
  }

  const fw = frameworkHint || detectFramework(pkg, files)
  if (!fw) throw new Error('Cannot detect framework (no index.html and no package.json)')

  log.info(`  Framework: ${fw.name} | out: ${fw.out}`)

  // Patch Next.js config to enable static export for Cloudflare Pages
  if (fw.patchNextConfig) {
    const candidates = ['next.config.js', 'next.config.mjs', 'next.config.ts']
    const cfgFile = candidates.find(f => fs.existsSync(path.join(repoRoot, f)))
    const cfgPath = cfgFile ? path.join(repoRoot, cfgFile) : path.join(repoRoot, 'next.config.js')

    if (cfgFile) {
      let content = fs.readFileSync(cfgPath, 'utf-8')
      if (!content.includes('output')) {
        content = content.replace(
          /const nextConfig[^=]*=\s*\{/,
          "const nextConfig = {\n  output: 'export',"
        )
        fs.writeFileSync(cfgPath, content)
        log.info('  Patched next.config: added output: export')
      }
    } else {
      fs.writeFileSync(cfgPath, "/** @type {import('next').NextConfig} */\nconst nextConfig = { output: 'export' }\nmodule.exports = nextConfig\n")
      log.info('  Created next.config.js with output: export')
    }
  }

  if (fw.isFlutter) {
    log.info('  flutter pub get...')
    run('flutter pub get', { cwd: repoRoot, timeout: 120000 })
    log.info('  flutter build web --release...')
    run('flutter build web --release --base-href /', { cwd: repoRoot, timeout: 300000 })
  } else if (fw.buildScript) {
    // NODE_ENV doit rester 'development' pour npm install afin d'inclure les devDependencies (vite, etc.)
    const installEnv = { ...process.env, CI: 'true' }
    const buildEnv   = { ...process.env, CI: 'true', NODE_ENV: 'production' }

    log.info('  npm install...')
    run('npm install --legacy-peer-deps', { cwd: repoRoot, timeout: 180000, env: installEnv })

    log.info(`  npm run ${fw.buildScript}...`)
    run(`npm run ${fw.buildScript}`, { cwd: repoRoot, timeout: 300000, env: buildEnv })
  }

  const outDir = fw.out === '.' ? repoRoot : path.join(repoRoot, fw.out)
  if (!fs.existsSync(outDir)) throw new Error(`Build output not found: ${fw.out}`)

  log.ok(`  Build complete → ${outDir}`)
  return outDir
}

// ─── Cloudflare Pages API helpers ───────────────────────────────────────────

function cfHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

async function ensurePageProject(accountId, token, projectName) {
  try {
    const { data } = await axios.get(`${CF}/accounts/${accountId}/pages/projects/${projectName}`, {
      headers: cfHeaders(token),
    })
    if (data.success) {
      log.info(`  CF Pages project "${projectName}" exists`)
      return data.result
    }
  } catch {}

  log.info(`  Creating CF Pages project: ${projectName}`)
  const { data } = await axios.post(`${CF}/accounts/${accountId}/pages/projects`, {
    name: projectName,
    production_branch: 'main',
  }, { headers: cfHeaders(token) })

  if (!data.success) throw new Error(`Create project failed: ${JSON.stringify(data.errors)}`)
  log.ok(`  Created: ${projectName}.pages.dev`)
  return data.result
}

// Cloudflare Pages deploy via Wrangler CLI
async function uploadDistDirectory(accountId, token, projectName, distDir) {
  log.info(`  Deploying via Wrangler CLI...`)

  const deployEnv = {
    ...process.env,
    CLOUDFLARE_API_TOKEN: token,
    CLOUDFLARE_ACCOUNT_ID: accountId,
  }

  // wrangler pages deploy <dir> --project-name <name> --branch main
  const result = run(
    `npx wrangler pages deploy "${distDir}" --project-name ${projectName} --branch main --commit-dirty=true`,
    { timeout: 300000, env: deployEnv }
  )

  // Extraire l'URL du résultat wrangler
  const urlMatch = result.match(/https:\/\/[^\s]+\.pages\.dev/)
  const url = urlMatch ? urlMatch[0] : `https://${projectName}.pages.dev`
  log.ok(`  Deployed: ${url}`)
  return { id: 'wrangler', url }
}

async function pollDeployment(accountId, token, projectName, deploymentId, maxWaitMs = 300000) {
  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    await new Promise(r => setTimeout(r, 8000))

    const { data } = await axios.get(
      `${CF}/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`,
      { headers: cfHeaders(token) }
    ).catch(e => ({ data: { success: false, errors: [{ message: e.message }] } }))

    if (!data.success) { log.warn(`  Poll error: ${data.errors?.[0]?.message}`); continue }

    const stage = data.result?.latest_stage
    const status = stage?.status || 'unknown'
    log.info(`  [${stageName(stage)}] ${status}`)

    if (status === 'success') {
      const url = data.result?.url || `https://${projectName}.pages.dev`
      log.ok(`  Live: ${url}`)
      return { url, status: 'success' }
    }
    if (status === 'failure') {
      throw new Error(`Deployment failed at stage "${stage?.name}"`)
    }
  }
  throw new Error(`Deployment timed out after ${maxWaitMs / 1000}s`)
}

function stageName(stage) {
  return stage?.name || 'unknown'
}

// ─── Token diagnostic ────────────────────────────────────────────────────────

export async function diagnoseCFToken(accountId, token) {
  const verify = await axios.get(`${CF}/user/tokens/verify`, {
    headers: cfHeaders(token),
  }).catch(e => ({ data: { success: false, errors: [{ message: e.message }] } }))

  if (!verify.data?.success) return { ok: false, reason: 'Token invalid or expired' }

  const pages = await axios.get(`${CF}/accounts/${accountId}/pages/projects`, {
    headers: cfHeaders(token),
  }).catch(e => ({ data: { success: false, errors: [{ message: e.message }] } }))

  if (!pages.data?.success) {
    return {
      ok: false,
      reason: 'Token lacks Cloudflare Pages:Edit permission for this account',
      fix: [
        'Go to https://dash.cloudflare.com/profile/api-tokens',
        'Create Token → "Edit Cloudflare Pages" template',
        'Set Account Resources → Include → your account',
        'Copy the new token into your .env as CLOUDFLARE_API_TOKEN',
      ].join('\n        '),
    }
  }

  return { ok: true, projectCount: pages.data.result_info?.total_count || 0 }
}

// ─── Main deploy entry ───────────────────────────────────────────────────────

export async function deployProject(repo, accountId, cfToken, ghToken) {
  const { name: repoName, default_branch = 'main', stack = [] } = repo
  const projectName = repoName.toLowerCase().replace(/[^a-z0-9-]/g, '-')

  // Flutter = déployable via flutter build web
  const isFlutter = stack.some(t => ['Flutter', 'Dart'].includes(t))
  // PHP/Laravel pur sans frontend = non déployable statique
  const backendOnly = !isFlutter &&
    stack.some(t => ['Laravel', 'PHP'].includes(t)) &&
    !stack.some(t => ['React', 'Vue', 'Next.js', 'Vite', 'JavaScript', 'TypeScript'].includes(t))

  if (backendOnly) {
    log.warn(`  ${repoName}: backend PHP/Laravel — non déployable en statique`)
    return { skipped: true, reason: 'backend PHP/Laravel — non déployable sur CF Pages' }
  }

  log.info(`\n── Deploying: ${repoName} ──`)
  let tmpDir = null

  try {
    const { tmpDir: td, repoRoot } = await downloadRepo('idy-00', repoName, default_branch, ghToken)
    tmpDir = td

    let frameworkHint = null
    if (stack.includes('Next.js')) frameworkHint = FRAMEWORK_CONFIGS.next

    const distDir = await buildProject(repoRoot, frameworkHint)
    const deployment = await uploadDistDirectory(accountId, cfToken, projectName, distDir)

    return { success: true, url: deployment.url, projectName }

  } catch (err) {
    log.error(`  Deploy failed for ${repoName}: ${err.message}`)
    return { success: false, error: err.message, projectName }
  } finally {
    if (tmpDir) {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch {}
    }
  }
}
