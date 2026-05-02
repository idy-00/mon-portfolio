import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function HomePage() {
  return (
    <main>
      <motion.section 
        className="hero neon-frame" 
        variants={container} 
        initial="hidden" 
        animate="show"
      >
        <motion.div variants={itemFadeUp} className="hero__intro">
          <div className="status-badge">
            <span className="pulse-dot"></span>
            Dispo pour de nouveaux défis techniques
          </div>
          <h1>
            Idrissa Kane
            <span className="gradient-text">Développeur Full Stack React & Laravel</span>
          </h1>
          <p className="hero-desc">
            Je conçois des applications web robustes et des interfaces immersives. De l'architecture backend complexe à l'intégration de paiements, je transforme des idées en solutions digitales performantes et orientées utilisateur.
          </p>
          <div className="hero__actions">
            <Link to="/projets" className="btn btn--primary">
              Voir mes réalisations
            </Link>
            <Link to="/contact" className="btn btn--secondary">
              Discuter d'un projet
            </Link>
          </div>
        </motion.div>

        <motion.figure variants={itemFadeUp} className="hero__photo-wrap">
          <div className="photo-decoration"></div>
          <img src="/images/profil.png" alt="Idrissa Kane - Portrait" className="hero__photo" />
        </motion.figure>
      </motion.section>

      <motion.section
        className="stats-banner"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <article>
          <div className="stat-number">React & Laravel</div>
          <p>Stack de Prédilection</p>
        </article>
        <article>
          <div className="stat-number">6+</div>
          <p>Projets Techniques</p>
        </article>
        <article>
          <div className="stat-number">UI/UX</div>
          <p>Interfaces Modernes</p>
        </article>
      </motion.section>

      <motion.section
        className="section-title-wrap"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2>L'alliance parfaite entre logique algorithmique et esthétisme web.</h2>
      </motion.section>
    </main>
  )
}
