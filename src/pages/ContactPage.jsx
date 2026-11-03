import { useEffect, useRef, useState } from 'react'
import { gsap, REDUCE } from '../lib/motion'
import { usePageMotion } from '../lib/usePageMotion'
import { CONTACT, NEXT_SERIAL } from '../lib/site'
import GlyphCanvas from '../components/GlyphCanvas'
import Clock from '../components/Clock'
import NextPage from '../components/NextPage'

const TYPES = ['Site vitrine', 'E‑commerce', 'SaaS', 'App mobile', 'Autre']

/* Copie dans le presse-papiers, sinon sélectionne le texte pour Ctrl+C */
async function copy(text, selectEl) {
  try { await navigator.clipboard.writeText(text); return 'Copié' } catch {
    if (selectEl) {
      const r = document.createRange(); r.selectNodeContents(selectEl)
      const s = getSelection(); s.removeAllRanges(); s.addRange(r)
    }
    return 'Ctrl+C'
  }
}

function CopyButton({ text, label, selectRef, className = 'btn btn--ghost btn--sm' }) {
  const [state, setState] = useState(label)
  const t = useRef(null)
  useEffect(() => () => clearTimeout(t.current), [])
  return (
    <button className={className} type="button" onClick={async () => {
      setState(await copy(text, selectRef?.current))
      clearTimeout(t.current); t.current = setTimeout(() => setState(label), 1800)
    }}>
      <span aria-live="polite">{state}</span>
    </button>
  )
}

export default function ContactPage() {
  const ref = useRef(null)
  const emailRef = useRef(null)
  const [type, setType] = useState('')
  const [error, setError] = useState(false)
  const [job, setJob] = useState(null) // { lines, txt }
  const [typed, setTyped] = useState(0)

  usePageMotion(ref, ({ q }) => {
    if (REDUCE) return
    gsap.from(q('.cli, .k-side > *'), { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: q('.k-grid')[0], start: 'top 85%' } })
  })

  // le message se tape tout seul, 3 caractères à la fois
  const total = job ? job.lines.reduce((n, l) => n + l.length, 0) : 0
  useEffect(() => {
    if (!job || typed >= total) return
    const id = setTimeout(() => setTyped((n) => Math.min(total, n + 3)), 14)
    return () => clearTimeout(id)
  }, [job, typed, total])

  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = String(f.get('nom') || '').trim()
    const when = String(f.get('delai') || '').trim()
    const msg = String(f.get('projet') || '').trim()
    if (!name || !msg) { setError(true); setJob(null); return }
    setError(false)
    const txt = `Bonjour Idrissa, je suis ${name}.${type ? ` Projet : ${type.replace('‑', '-')}.` : ''}${when ? ` Délai : ${when}.` : ''} ${msg}`
    const lines = ['> compilation du message…', `> ${txt}`, "✓ message prêt. Ouvrez WhatsApp pour l'envoyer, ou copiez-le."]
    setJob({ lines, txt })
    setTyped(REDUCE ? lines.reduce((n, l) => n + l.length, 0) : 0)
  }

  let left = typed
  const shownLines = job ? job.lines.map((l) => { const s = l.slice(0, Math.max(0, left)); left -= l.length; return s }) : []
  const done = job && typed >= total

  return (
    <div ref={ref} className="contact">
      <section className="k-hero" aria-label="Prochain numéro">
        <GlyphCanvas mode="rain" text={NEXT_SERIAL} />
        <div className="k-hero__cap wrap">
          <h1 className="h-m">Le prochain numéro, c'est le vôtre.</h1>
          <span className="mono" data-scramble>SN·04 · Contact</span>
        </div>
      </section>

      <section className="k-grid wrap" aria-label="Écrire">
        <div className="cli">
          <div className="term__bar" aria-hidden="true"><i /><i /><i /><span>nouveau-projet.sh</span></div>
          <form onSubmit={submit} noValidate>
            <div className="cli__f"><label htmlFor="f-nom">$ nom</label><input id="f-nom" name="nom" autoComplete="name" placeholder="votre nom" required aria-invalid={error || undefined} /></div>
            <div className="cli__f">
              <span className="cli__l" id="f-type">$ type</span>
              <div className="cli__opts" role="group" aria-labelledby="f-type">
                {TYPES.map((t) => (
                  <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(type === t ? '' : t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="cli__f"><label htmlFor="f-delai">$ délai</label><input id="f-delai" name="delai" placeholder="ex. 6 semaines" /></div>
            <div className="cli__f"><label htmlFor="f-projet">$ projet</label><textarea id="f-projet" name="projet" rows="3" placeholder="en deux phrases, ce que vous voulez construire" required aria-invalid={error || undefined} /></div>
            <button className="btn btn--solid cli__run" type="submit">Préparer le message ↵</button>
          </form>
          <div className="cli__out" aria-live="polite">
            {error && <p className="cli__err"><span>✗ nom et projet sont requis.</span> Remplissez les deux lignes puis relancez.</p>}
            {job && (
              <>
                <div>
                  {shownLines.map((l, i) => <div key={i} className={i === 2 ? 'ok' : undefined}>{l}</div>)}
                </div>
                {done && (
                  <div className="cli__acts">
                    <a className="btn btn--solid" href={`https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(job.txt)}`} target="_blank" rel="noreferrer">Ouvrir WhatsApp</a>
                    <CopyButton text={job.txt} label="Copier le message" className="btn btn--ghost" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="k-side">
          <div>
            <span className="mono">Email</span>
            <div className="k-email">
              <a className="email" ref={emailRef} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <CopyButton text={CONTACT.email} label="Copier" selectRef={emailRef} />
            </div>
          </div>
          <div><span className="mono">WhatsApp</span><p className="h-m"><a href={`https://wa.me/${CONTACT.wa}`} target="_blank" rel="noreferrer">{CONTACT.phone}</a></p></div>
          <div><span className="mono">Heure à Dakar</span><p className="h-m"><Clock /></p></div>
          <div className="k-links">
            <a className="btn btn--ghost btn--sm" href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
            <a className="btn btn--ghost btn--sm" href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="btn btn--ghost btn--sm" href={CONTACT.tiktok} target="_blank" rel="noreferrer">TikTok @idycodes</a>
            <a className="btn btn--ghost btn--sm" href={CONTACT.cv} target="_blank" rel="noreferrer">CV</a>
          </div>
        </div>
      </section>

      <NextPage to="/" kicker="Retour au début · SN·00" title="Accueil" />
    </div>
  )
}
