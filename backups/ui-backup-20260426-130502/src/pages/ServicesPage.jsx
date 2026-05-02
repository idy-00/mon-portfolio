import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ServicesPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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
        <h1>Mes Services</h1>
        <p style={{ maxWidth: '800px', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          De la conception de la base de données jusqu'à l'animation de l'interface utilisateur, 
          je vous accompagne sur l'ensemble du cycle de vie de votre projet web. Voici ce que je peux construire pour vous.
        </p>
      </motion.section>

      <motion.section
        className="bento-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={item} className="bento-card col-span-2" style={{ padding: '2rem' }}>
          <img src="/images/saas.png" alt="SaaS Dashboard" style={{ width: '100%', height: '300px', objectFit: 'cover', objectPosition: 'top', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }} />
          <h2>Applications Web & SaaS</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Création d'outils métiers complexes sur mesure. Que ce soit une plateforme de gestion, un tableau de bord (dashboard) interactif ou un SaaS complet, je conçois des solutions performantes capables de gérer des milliers de données en temps réel avec <strong>React</strong> et <strong>Laravel</strong>.
          </p>
        </motion.div>

        <motion.div variants={item} className="bento-card" style={{ padding: '2rem' }}>
          <img src="/images/ecommerce.png" alt="E-Commerce" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'top', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }} />
          <h2>E-Commerce</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Développement de boutiques en ligne fluides et sécurisées. Je maîtrise l'intégration de solutions de paiement locales (comme <strong>PayDunya</strong>) ou internationales pour garantir des transactions sans accroc à vos clients.
          </p>
        </motion.div>

        <motion.div variants={item} className="bento-card" style={{ padding: '2rem' }}>
          <img src="/images/vitrine.jpg" alt="Site Vitrine" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'top', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }} />
          <h2>Sites Vitrines Premium</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Vous avez besoin d'une présence en ligne qui marque les esprits ? Je crée des sites vitrines ultra-modernes pour les entreprises, avec des animations fluides et un design soigné qui convertit les visiteurs en clients.
          </p>
        </motion.div>

        <motion.div variants={item} className="bento-card col-span-2" style={{ padding: '2rem' }}>
          <img src="/images/portfolio.jpg" alt="Portfolio Sur-Mesure" style={{ width: '100%', height: '300px', objectFit: 'cover', objectPosition: 'top', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }} />
          <h2>Portfolios Sur-Mesure</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Démarquez-vous avec un portfolio unique qui met en valeur vos compétences et vos réalisations. Je conçois des espaces personnels interactifs et haut de gamme, parfaits pour les freelances, les créatifs ou les professionnels souhaitant booster leur image de marque.
          </p>
        </motion.div>
      </motion.section>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ marginTop: '3rem', textAlign: 'center' }}
      >
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Un projet en tête ?</h3>
        <Link to="/contact" className="btn btn--primary">
          Discutons-en gratuitement
        </Link>
      </motion.div>
    </main>
  )
}
