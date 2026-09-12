import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? '93c30406-b560-4ef6-a0ae-56ea104c99f2'
const STEPS = ['Type', 'Détails', 'Envoi']

const PROJECT_TYPES = [
  { value: '', label: 'Choisir un type' },
  { value: 'site-vitrine', label: 'Site vitrine' },
  { value: 'app-web', label: 'Application web' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'autre', label: 'Autre besoin' },
]

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 36 : -36 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -36 : 36 }),
}

export default function ContactPage() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState({
    requestType: 'message', name: '', email: '', message: '',
    company: '', projectType: '', budget: '', details: '',
  })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const pageRef = useRef(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const goNext = () => { setDir(1);  setStep(s => s + 1) }
  const goPrev = () => { setDir(-1); setStep(s => s - 1) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    const data = new FormData()
    data.append('access_key', ACCESS_KEY)
    if (form.requestType === 'message') {
      data.append('subject', 'Nouveau message — Portfolio Idrissa Kane')
      data.append('name', form.name)
      data.append('email', form.email)
      data.append('message', form.message)
    } else {
      data.append('subject', 'Demande de projet — Portfolio Idrissa Kane')
      data.append('name', form.name)
      data.append('email', form.email)
      data.append('company', form.company)
      data.append('project_type', form.projectType)
      data.append('budget', form.budget)
      data.append('details', form.details)
    }
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      const json = await res.json()
      if (json.success) { setStatus('success'); setDir(1); setStep(3) }
      else setStatus('error')
    } catch { setStatus('error') }
    finally { setSending(false) }
  }

  const reset = () => {
    setStep(0); setDir(1); setStatus(null)
    setForm({ requestType: 'message', name: '', email: '', message: '', company: '', projectType: '', budget: '', details: '' })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-info > *',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', delay: 0.05 }
      )
      gsap.fromTo('.contact-link',
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', delay: 0.35 }
      )
      gsap.fromTo('.contact-form-wrap',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', delay: 0.1 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={pageRef}>
      <div className="contact-page">
        {/* ── Info ── */}
        <div className="contact-info">
          <div className="eyebrow eyebrow--accent">Me contacter</div>
          <h1>Parlons de <em>votre projet</em></h1>
          <p>Une idée ou un besoin ? Je réponds vite et vous propose une voie claire.</p>

          <div className="contact-status">
            <span className="pulse-dot" />
            Dakar, Sénégal · GMT+0 · Disponible
          </div>

          <div className="contact-links">
            <a href="mailto:idykane03@gmail.com" className="contact-link">
              <div className="contact-link__icon contact-link__icon--yellow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div>
                <span className="contact-link__label">Email</span>
                <span className="contact-link__value">idykane03@gmail.com</span>
              </div>
            </a>
            <a href="tel:+221781194805" className="contact-link">
              <div className="contact-link__icon contact-link__icon--white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <span className="contact-link__label">Téléphone</span>
                <span className="contact-link__value">+221 78 119 48 05</span>
              </div>
            </a>
            <a href="https://www.linkedin.com/in/idrissa-kane-7a7ba7370/" target="_blank" rel="noreferrer" className="contact-link">
              <div className="contact-link__icon contact-link__icon--white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </div>
              <div>
                <span className="contact-link__label">LinkedIn</span>
                <span className="contact-link__value">idrissa-kane</span>
              </div>
            </a>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="contact-form-wrap">
          {step < 3 && (
            <div className="form-steps">
              {STEPS.map((label, i) => (
                <div key={label} className={`form-step-dot${step === i ? ' active' : ''}${step > i ? ' done' : ''}`} title={label}>
                  {step > i
                    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : i + 1}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait" custom={dir}>
            {step === 0 && (
              <motion.div key="s0" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
                <p className="form-title">Quel type de demande ?</p>
                <p className="form-subtitle">Choisissez le formulaire adapté.</p>
                <div className="request-type-grid">
                  {[
                    { value: 'message', label: 'Message rapide', desc: 'Une question, un bonjour…' },
                    { value: 'projet',  label: 'Demande de projet', desc: 'Brief complet, budget…' },
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      className={`request-type-card${form.requestType === opt.value ? ' is-active' : ''}`}
                      onClick={() => set('requestType', opt.value)}>
                      <div className="request-type-card__title">{opt.label}</div>
                      <div className="request-type-card__desc">{opt.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn--primary" onClick={goNext}>
                    Continuer
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
                <p className="form-title">{form.requestType === 'message' ? 'Votre message' : 'Votre projet'}</p>
                <p className="form-subtitle">Renseignez vos informations.</p>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="name">Nom complet *</label>
                    <input id="name" className="form-input" type="text" required value={form.name}
                      onChange={e => set('name', e.target.value)} placeholder="Votre nom" />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="email">Email *</label>
                    <input id="email" className="form-input" type="email" required value={form.email}
                      onChange={e => set('email', e.target.value)} placeholder="vous@exemple.com" />
                  </div>
                </div>
                {form.requestType === 'message' ? (
                  <div className="form-field">
                    <label className="form-label" htmlFor="message">Message *</label>
                    <textarea id="message" className="form-textarea" required value={form.message}
                      onChange={e => set('message', e.target.value)} placeholder="Votre message…" rows={5} />
                  </div>
                ) : (
                  <>
                    <div className="form-row">
                      <div className="form-field">
                        <label className="form-label" htmlFor="company">Entreprise</label>
                        <input id="company" className="form-input" type="text" value={form.company}
                          onChange={e => set('company', e.target.value)} placeholder="Nom de l'entreprise" />
                      </div>
                      <div className="form-field">
                        <label className="form-label" htmlFor="budget">Budget estimé (FRANC CFA)</label>
                        <input id="budget" className="form-input" type="number" min="0" value={form.budget}
                          onChange={e => set('budget', e.target.value)} placeholder="Ex: 500000" />
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="projectType">Type de projet *</label>
                      <select id="projectType" className="form-select" required value={form.projectType}
                        onChange={e => set('projectType', e.target.value)}>
                        {PROJECT_TYPES.map(o => (
                          <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="details">Description *</label>
                      <textarea id="details" className="form-textarea" required value={form.details}
                        onChange={e => set('details', e.target.value)} placeholder="Décrivez votre projet…" rows={5} />
                    </div>
                  </>
                )}
                <div className="form-actions">
                  <button type="button" className="btn btn--ghost" onClick={goPrev}>← Retour</button>
                  <button type="button" className="btn btn--primary" onClick={goNext}>
                    Vérifier
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.form key="s2" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} onSubmit={handleSubmit}>
                <p className="form-title">Tout est bon ?</p>
                <p className="form-subtitle">Vérifiez avant d'envoyer.</p>
                <div style={{ background: 'var(--bg-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    ['De', form.name],
                    ['Email', form.email],
                    form.requestType === 'message'
                      ? ['Message', form.message]
                      : ['Projet', `${form.projectType} — ${form.company || 'N/A'} — ${form.budget ? form.budget + ' FCFA' : 'Non précisé'}`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-muted)', minWidth: 56, fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>{label}</span>
                      <span style={{ color: 'var(--text)', flex: 1, wordBreak: 'break-word' }}>{value || '—'}</span>
                    </div>
                  ))}
                </div>
                {status === 'error' && (
                  <div className="form-feedback--error" style={{ marginBottom: '1rem' }}>
                    Erreur. Réessayez ou écrivez à idykane03@gmail.com.
                  </div>
                )}
                <div className="form-actions">
                  <button type="button" className="btn btn--ghost" onClick={goPrev}>← Modifier</button>
                  <motion.button type="submit" className="btn btn--primary" disabled={sending}
                    whileTap={{ scale: 0.97 }} style={{ opacity: sending ? 0.7 : 1 }}>
                    {sending ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-block', width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                        Envoi…
                      </>
                    ) : (
                      <>
                        Envoyer
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.div key="s3" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.4 }} style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-fg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </motion.div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '0.75rem' }}>Message envoyé !</h2>
                <p style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
                  Merci {form.name ? form.name.split(' ')[0] : ''} ! Je vous répondrai dans les 24h.
                </p>
                <button className="btn btn--ghost" onClick={reset}>Envoyer un autre message</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Socials ── */}
      <div className="socials-section">
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Retrouvez-moi aussi sur</div>
        <div className="socials-row">
          <a href="https://github.com/idy-00" target="_blank" rel="noreferrer" className="social-card">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/idrissa-kane-7a7ba7370/" target="_blank" rel="noreferrer" className="social-card">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
          <a href="/CV_IDRISSA_M_KANE.pdf" target="_blank" rel="noopener noreferrer" className="social-card">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            Télécharger le CV
          </a>
        </div>
      </div>
    </main>
  )
}
