import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [result1, setResult1] = useState('')
  const [result2, setResult2] = useState('')

  const onSubmit1 = async (event) => {
    event.preventDefault()
    setResult1('Envoi en cours...')
    const formData = new FormData(event.target)

    // ⚠️ REMPLACE CECI PAR TA CLÉ WEB3FORMS (obtenue sur web3forms.com)
    formData.append('access_key', '93c30406-b560-4ef6-a0ae-56ea104c99f2')
    formData.append('subject', 'Nouveau message de contact - Portfolio')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.success) {
        setResult1('✅ Message envoyé avec succès !')
        event.target.reset()
      } else {
        setResult1("❌ Erreur lors de l'envoi.")
      }
    } catch (err) {
      setResult1('❌ Erreur de connexion.')
    }
  }

  const onSubmit2 = async (event) => {
    event.preventDefault()
    setResult2('Envoi en cours...')
    const formData = new FormData(event.target)

    // ⚠️ REMPLACE CECI PAR TA CLÉ WEB3FORMS (obtenue sur web3forms.com)
    formData.append('access_key', '93c30406-b560-4ef6-a0ae-56ea104c99f2')
    formData.append('subject', 'Nouvelle Demande de Projet - Portfolio')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.success) {
        setResult2('✅ Demande envoyée avec succès !')
        event.target.reset()
      } else {
        setResult2("❌ Erreur lors de l'envoi.")
      }
    } catch (err) {
      setResult2('❌ Erreur de connexion.')
    }
  }

  return (
    <main>
      <motion.section
        className="panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1>Contact</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '800px' }}>
          Vous avez un projet en tête ou vous cherchez un développeur pour renforcer votre équipe ?
          N'hésitez pas à me contacter directement ou à utiliser l'un des formulaires ci-dessous.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>

          <a href="mailto:idykane03@gmail.com" className="bento-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 1.5rem', textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.2rem', boxShadow: '0 0 20px rgba(20, 184, 166, 0.2)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>Email Direct</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-main)' }}>idykane03@gmail.com</span>
          </a>

          <a href="tel:+221781194805" className="bento-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 1.5rem', textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.2rem', boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>Téléphone</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-main)' }}>+221 78 119 48 05</span>
          </a>

        </div>
      </motion.section>

      <section className="forms-grid">
        <motion.form
          className="form-card"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          onSubmit={onSubmit1}
        >
          <h2>Message rapide</h2>

          <label htmlFor="name">Nom complet</label>
          <input id="name" name="name" type="text" required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />

          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" required />

          <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
            Envoyer
          </button>
          {result1 && (
            <p style={{ marginTop: '1rem', textAlign: 'center', color: result1.includes('✅') ? '#10b981' : '#f59e0b', fontSize: '0.9rem', fontWeight: '500' }}>
              {result1}
            </p>
          )}
        </motion.form>

        <motion.form
          className="form-card"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          onSubmit={onSubmit2}
        >
          <h2>Demande de projet</h2>

          <label htmlFor="company">Entreprise / Client</label>
          <input id="company" name="company" type="text" required />

          <label htmlFor="project-type">Type de projet</label>
          <select id="project-type" name="project-type" required defaultValue="">
            <option value="" disabled>
              Choisir une option
            </option>
            <option value="site-vitrine">Site vitrine</option>
            <option value="app-web">Application web</option>
            <option value="ecommerce">E-commerce</option>
            <option value="autre">Autre besoin</option>
          </select>

          <label htmlFor="budget">Budget estimé (EUR)</label>
          <input id="budget" name="budget" type="number" min="0" required />

          <label htmlFor="details">Description du besoin</label>
          <textarea id="details" name="details" rows="5" required />

          <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
            Envoyer la demande
          </button>
          {result2 && (
            <p style={{ marginTop: '1rem', textAlign: 'center', color: result2.includes('✅') ? '#10b981' : '#f59e0b', fontSize: '0.9rem', fontWeight: '500' }}>
              {result2}
            </p>
          )}
        </motion.form>
      </section>
    </main>
  )
}
