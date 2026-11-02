// Données dérivées du site. Source de vérité : src/data/projects.js (généré, non modifié ici).
import { projects } from '../data/projects'

export const PAGES = [
  { path: '/', sn: 'SN·00', name: 'Accueil' },
  { path: '/projets', sn: 'SN·01', name: 'Projets' },
  { path: '/services', sn: 'SN·02', name: 'Services' },
  { path: '/a-propos', sn: 'SN·03', name: 'À propos' },
  { path: '/contact', sn: 'SN·04', name: 'Contact' },
]

export const CONTACT = {
  email: 'idykane03@gmail.com',
  phone: '+221 78 119 48 05',
  wa: '221781194805',
  github: 'https://github.com/idy-00',
  linkedin: 'https://www.linkedin.com/in/idrissa-kane-7a7ba7370/',
  tiktok: 'https://www.tiktok.com/@idycodes',
  cv: '/CV_IDRISSA_M_KANE.pdf',
}

/** Début de l'activité pro (« 2 ans d'expérience » en 2026). */
export const EXPERIENCE_START = 2024

export const pad3 = (n) => String(n).padStart(3, '0')

export const FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'saas', label: 'SaaS' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'web', label: 'Web' },
  { key: 'edu', label: 'EdTech' },
]

function filterOf(category = '') {
  if (/saas/i.test(category)) return 'saas'
  if (/mobile/i.test(category)) return 'mobile'
  if (/edtech|bureau/i.test(category)) return 'edu'
  return 'web'
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return null }
}

export const PROJECTS = projects.map((p, i) => {
  const [name, sub] = p.title.split(/\s+—\s+/)
  return {
    ...p,
    n: pad3(i + 1),
    name: name.trim(),
    sub: (sub || p.category || '').trim(),
    hasSub: !!sub,
    filter: filterOf(p.category),
    host: hostOf(p.live) || hostOf(p.link) || p.slug,
    liveHost: hostOf(p.live),
    isLive: !!p.live,
    isPhone: !!p.screenshot && /-mobile-/.test(p.screenshot),
    image: p.screenshot || null,
  }
})

export const BY_SLUG = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]))

export const STATS = {
  total: PROJECTS.length,
  live: PROJECTS.filter((p) => p.isLive).length,
  years: Math.max(1, new Date().getFullYear() - EXPERIENCE_START),
}

export const NEXT_SERIAL = `N°${pad3(PROJECTS.length + 1)}`

export const statusOf = (p) => (p.isLive ? 'En production' : 'Archive')

/** Page courante (numéro + nom) pour un chemin. */
export function pageFor(pathname) {
  if (pathname.startsWith('/projets/')) {
    const p = BY_SLUG[decodeURIComponent(pathname.split('/')[2] || '')]
    if (p) return { sn: `N°${p.n}`, name: p.name }
    return { sn: 'SN·01', name: 'Projets' }
  }
  if (pathname.startsWith('/insights')) return { sn: 'SN···', name: 'Insights' }
  return PAGES.find((pg) => pg.path === pathname) || { sn: 'SN·00', name: 'Accueil' }
}

/** Page suivante dans la boucle Accueil → Projets → Services → À propos → Contact → Accueil. */
export function nextPageOf(path) {
  const i = PAGES.findIndex((pg) => pg.path === path)
  return PAGES[(i + 1) % PAGES.length]
}
