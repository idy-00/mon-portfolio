import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Animated counter */
function AnimatedCounter({ target, suffix = '', prefix = '', duration = 1.5 }) {
  const ref = useRef(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        const num = parseFloat(target)
        gsap.fromTo({ val: 0 }, { val: num }, {
          duration,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = prefix + Math.round(this.targets()[0].val).toLocaleString('fr-FR') + suffix
          },
        })
      },
    })
    return () => st.kill()
  }, [target, suffix, prefix, duration])

  return <span ref={ref}>{prefix}0{suffix}</span>
}

/* Mini sparkline chart */
function Sparkline({ data, color = '#4f8cff', height = 40 }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 120
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 8) - 4
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="sparkline">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

/* Progress bar */
function ProgressBar({ value, max, color = '#4f8cff' }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="progress-bar">
      <div className="progress-bar__fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

const STATS_KEY = 'ikdev_insights'

function getStoredStats() {
  try {
    const stored = localStorage.getItem(STATS_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) { /* ignore */ }
  return null
}

function generateMockStats() {
  const now = new Date()
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 80) + 20,
      visitors: Math.floor(Math.random() * 50) + 10,
    })
  }

  const totalViews = days.reduce((s, d) => s + d.views, 0)
  const totalVisitors = days.reduce((s, d) => s + d.visitors, 0)

  return {
    generatedAt: now.toISOString(),
    summary: {
      totalViews,
      totalVisitors,
      avgSessionDuration: '2m 34s',
      bounceRate: 42,
      topCountry: 'Sénégal',
    },
    daily: days,
    pages: [
      { path: '/', views: Math.floor(totalViews * 0.35), label: 'Accueil' },
      { path: '/projets', views: Math.floor(totalViews * 0.25), label: 'Projets' },
      { path: '/a-propos', views: Math.floor(totalViews * 0.15), label: 'À propos' },
      { path: '/services', views: Math.floor(totalViews * 0.12), label: 'Services' },
      { path: '/contact', views: Math.floor(totalViews * 0.08), label: 'Contact' },
      { path: '/projets/*', views: Math.floor(totalViews * 0.05), label: 'Détails projet' },
    ],
    sources: [
      { name: 'Direct', visits: Math.floor(totalVisitors * 0.45), color: '#4f8cff' },
      { name: 'Google', visits: Math.floor(totalVisitors * 0.25), color: '#34a853' },
      { name: 'LinkedIn', visits: Math.floor(totalVisitors * 0.15), color: '#0a66c2' },
      { name: 'GitHub', visits: Math.floor(totalVisitors * 0.10), color: '#6e40c9' },
      { name: 'Autres', visits: Math.floor(totalVisitors * 0.05), color: '#888' },
    ],
    countries: [
      { name: 'Sénégal', code: 'SN', visits: Math.floor(totalVisitors * 0.55) },
      { name: 'France', code: 'FR', visits: Math.floor(totalVisitors * 0.20) },
      { name: 'Côte d\'Ivoire', code: 'CI', visits: Math.floor(totalVisitors * 0.08) },
      { name: 'Maroc', code: 'MA', visits: Math.floor(totalVisitors * 0.06) },
      { name: 'Canada', code: 'CA', visits: Math.floor(totalVisitors * 0.05) },
      { name: 'Autres', code: 'XX', visits: Math.floor(totalVisitors * 0.06) },
    ],
    devices: [
      { type: 'Mobile', pct: 62, color: '#4f8cff' },
      { type: 'Desktop', pct: 34, color: '#10b981' },
      { type: 'Tablet', pct: 4, color: '#f59e0b' },
    ],
  }
}

export default function InsightsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const pageRef = useRef(null)

  useEffect(() => {
    const stored = getStoredStats()
    if (stored) {
      setStats(stored)
    } else {
      const mock = generateMockStats()
      localStorage.setItem(STATS_KEY, JSON.stringify(mock))
      setStats(mock)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!stats || !pageRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.insight-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [stats])

  const refreshStats = () => {
    setLoading(true)
    setTimeout(() => {
      const mock = generateMockStats()
      localStorage.setItem(STATS_KEY, JSON.stringify(mock))
      setStats(mock)
      setLoading(false)
    }, 600)
  }

  if (loading || !stats) {
    return (
      <div className="insights-page">
        <div className="insights-loading">
          <div className="insights-loading__spinner" />
          <span>Chargement des statistiques...</span>
        </div>
      </div>
    )
  }

  const { summary, daily, pages, sources, countries, devices } = stats
  const viewsData = daily.map(d => d.views)
  const visitorsData = daily.map(d => d.visitors)
  const maxPageViews = Math.max(...pages.map(p => p.views))
  const maxSourceVisits = Math.max(...sources.map(s => s.visits))
  const maxCountryVisits = Math.max(...countries.map(c => c.visits))

  return (
    <div ref={pageRef} className="insights-page">
      <section className="insights-hero">
        <div className="insights-hero__content">
          <div className="eyebrow">Dashboard</div>
          <h1>Insights</h1>
          <p>Statistiques de performance du portfolio ikdev.tech</p>
        </div>
        <button className="btn btn--ghost" onClick={refreshStats} disabled={loading}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          Actualiser
        </button>
      </section>

      {/* KPI Cards */}
      <section className="insights-kpis">
        <div className="insight-card insight-card--kpi">
          <div className="insight-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="insight-card__label">Vues totales</div>
          <div className="insight-card__value">
            <AnimatedCounter target={summary.totalViews} />
          </div>
          <Sparkline data={viewsData} color="#4f8cff" />
        </div>

        <div className="insight-card insight-card--kpi">
          <div className="insight-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="insight-card__label">Visiteurs uniques</div>
          <div className="insight-card__value">
            <AnimatedCounter target={summary.totalVisitors} />
          </div>
          <Sparkline data={visitorsData} color="#10b981" />
        </div>

        <div className="insight-card insight-card--kpi">
          <div className="insight-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="insight-card__label">Durée moyenne</div>
          <div className="insight-card__value insight-card__value--text">{summary.avgSessionDuration}</div>
        </div>

        <div className="insight-card insight-card--kpi">
          <div className="insight-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="insight-card__label">Taux de rebond</div>
          <div className="insight-card__value">
            <AnimatedCounter target={summary.bounceRate} suffix="%" />
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="insights-grid">
        {/* Pages populaires */}
        <div className="insight-card insight-card--list">
          <div className="insight-card__header">
            <h3>Pages populaires</h3>
            <span className="insight-card__period">30 derniers jours</span>
          </div>
          <div className="insight-list">
            {pages.map((page, i) => (
              <div key={page.path} className="insight-list__item">
                <span className="insight-list__rank">{i + 1}</span>
                <div className="insight-list__info">
                  <span className="insight-list__name">{page.label}</span>
                  <span className="insight-list__path">{page.path}</span>
                </div>
                <div className="insight-list__bar-wrap">
                  <ProgressBar value={page.views} max={maxPageViews} />
                </div>
                <span className="insight-list__value">{page.views.toLocaleString('fr-FR')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sources de trafic */}
        <div className="insight-card insight-card--list">
          <div className="insight-card__header">
            <h3>Sources de trafic</h3>
          </div>
          <div className="insight-list">
            {sources.map((src) => (
              <div key={src.name} className="insight-list__item">
                <span className="insight-list__dot" style={{ background: src.color }} />
                <div className="insight-list__info">
                  <span className="insight-list__name">{src.name}</span>
                </div>
                <div className="insight-list__bar-wrap">
                  <ProgressBar value={src.visits} max={maxSourceVisits} color={src.color} />
                </div>
                <span className="insight-list__value">{src.visits.toLocaleString('fr-FR')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pays */}
        <div className="insight-card insight-card--list">
          <div className="insight-card__header">
            <h3>Pays</h3>
          </div>
          <div className="insight-list">
            {countries.map((c, i) => (
              <div key={c.code} className="insight-list__item">
                <span className="insight-list__rank">{i + 1}</span>
                <div className="insight-list__info">
                  <span className="insight-list__name">{c.name}</span>
                </div>
                <div className="insight-list__bar-wrap">
                  <ProgressBar value={c.visits} max={maxCountryVisits} color="#6366f1" />
                </div>
                <span className="insight-list__value">{c.visits.toLocaleString('fr-FR')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appareils */}
        <div className="insight-card insight-card--devices">
          <div className="insight-card__header">
            <h3>Appareils</h3>
          </div>
          <div className="devices-chart">
            {devices.map((d) => (
              <div key={d.type} className="device-item">
                <div className="device-item__bar" style={{ height: `${d.pct}%`, background: d.color }} />
                <span className="device-item__label">{d.type}</span>
                <span className="device-item__pct">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info notice */}
      <section className="insights-notice">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <p>
          Ces statistiques sont générées localement à des fins de démonstration.
          Pour des données réelles, connectez Cloudflare Web Analytics ou Google Analytics.
        </p>
      </section>
    </div>
  )
}
