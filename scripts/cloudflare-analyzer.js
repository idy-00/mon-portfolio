import axios from 'axios'
import { log } from './logger.js'

const CF = 'https://api.cloudflare.com/client/v4'

async function fetchPages(accountId, token) {
  const projects = []
  let page = 1
  while (true) {
    const { data } = await axios.get(`${CF}/accounts/${accountId}/pages/projects`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page },
    })
    if (!data.success) throw new Error(`Cloudflare API error: ${JSON.stringify(data.errors)}`)
    projects.push(...data.result)
    const info = data.result_info
    if (info.page >= info.total_pages) break
    page++
  }
  log.info(`Fetched ${projects.length} Cloudflare Pages projects`)
  return projects
}

export async function analyzeCloudflare(accountId, token) {
  if (!accountId || !token) {
    log.warn('Cloudflare credentials missing — skipping Cloudflare analysis')
    return []
  }
  try {
    log.info('Starting Cloudflare analysis')
    const projects = await fetchPages(accountId, token)
    const result = projects.map((p) => {
      const latest = p.latest_deployment
      return {
        name: p.name,
        subdomain: p.subdomain,
        live: p.subdomain.includes('.') ? `https://${p.subdomain}` : `https://${p.subdomain}.pages.dev`,
        customDomain: p.domains?.find(d => !d.endsWith('pages.dev')) || null,
        repoOwner: latest?.source?.config?.owner || null,
        repoName: latest?.source?.config?.repo_name || null,
        branch: latest?.source?.config?.production_branch || 'main',
        lastDeployedAt: latest?.created_on || null,
        status: latest?.stage?.status || 'unknown',
      }
    })
    log.ok(`Cloudflare analysis complete: ${result.length} projects`)
    return result
  } catch (err) {
    log.error(`Cloudflare analysis failed: ${err.message}`)
    return []
  }
}

export function mergeWithCloudflare(githubRepos, cloudflareProjects) {
  // Pour chaque repo GitHub, trouver le meilleur match CF :
  // Priorité 1 : nom de projet CF == nom du repo (ex: "BMF" → "bmf")
  // Priorité 2 : repoName du CF == nom du repo (ex: repoName: "BMF")
  // Si plusieurs matchs sur repoName, prendre celui dont le nom de projet contient le nom du repo

  return githubRepos.map((repo) => {
    const repoKey = repo.name.toLowerCase()

    // Tous les CF projects qui référencent ce repo
    const candidates = cloudflareProjects.filter(cf =>
      cf.name.toLowerCase() === repoKey ||
      (cf.repoName && cf.repoName.toLowerCase() === repoKey)
    )

    if (!candidates.length) return repo

    // Parmi les candidats, préférer le plus récent (lastDeployedAt le plus grand)
    // ou à défaut celui dont le subdomain répond (bmf-dakar > bmf-6fa pour le repo BMF)
    candidates.sort((a, b) => {
      const da = a.lastDeployedAt ? new Date(a.lastDeployedAt).getTime() : 0
      const db = b.lastDeployedAt ? new Date(b.lastDeployedAt).getTime() : 0
      return db - da
    })
    const best = candidates[0]

    return {
      ...repo,
      live: best.customDomain ? `https://${best.customDomain}` : (best.live || repo.live),
      deployment: {
        platform: 'Cloudflare Pages',
        subdomain: best.subdomain,
        lastDeployedAt: best.lastDeployedAt,
        status: best.status,
      },
    }
  })
}
