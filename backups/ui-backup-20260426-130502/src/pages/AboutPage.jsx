import { motion } from 'framer-motion'

export default function AboutPage() {
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
        className="intro-section"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="decor-glow"></div>
        <h1>L'humain derrière le code</h1>
        <p className="lead-text">
          Tombé dans la marmite de l'informatique dès mon plus jeune âge, j'ai rapidement compris que je voulais faire plus qu'utiliser des logiciels : <strong>je voulais les créer.</strong> Aujourd'hui, je suis un développeur passionné qui construit des solutions web complètes, de l'idée initiale jusqu'au déploiement final.
        </p>
      </motion.section>

      <motion.section
        className="bento-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Parcours et Motivation */}
        <motion.div variants={item} className="bento-card col-span-2">
          <h2>Pourquoi je fais ça ?</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
            Ce qui m'anime au quotidien, c'est la résolution de problèmes. J'aime prendre un besoin métier complexe et le transformer en un système logique et fonctionnel. Mon parcours m'a amené à toucher à tout : de la conception d'architectures de bases de données robustes jusqu'à l'intégration de maquettes interactives. Je ne code pas juste pour aligner des lignes de texte ; <strong>je code pour créer un impact réel et faciliter la vie des gens.</strong>
          </p>
        </motion.div>

        {/* Philosophie */}
        <motion.div variants={item} className="bento-card">
          <h2>Focus Utilisateur</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Une application extrêmement puissante ne vaut rien si l'utilisateur s'y perd. 
            J'accorde une importance capitale à l'<strong>expérience utilisateur (UX)</strong>, aux détails visuels et à la fluidité des interactions. Le code doit être solide derrière, mais magique devant.
          </p>
        </motion.div>

        {/* Competences */}
        <motion.div variants={item} className="bento-card col-span-2 skill-box">
          <h2>La technique au service du projet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Je n'empile pas les technologies pour le plaisir, je choisis les bons outils pour résoudre les bons problèmes.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--primary)' }}>Frontend & Interfaces</strong>
              <div className="chip-grid">
                <span className="chip primary">React.js</span>
                <span className="chip primary">JavaScript (ES6+)</span>
                <span className="chip">Tailwind CSS</span>
                <span className="chip">Framer Motion</span>
              </div>
            </div>
            
            <div>
              <strong style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--secondary)' }}>Backend & Architecture</strong>
              <div className="chip-grid">
                <span className="chip secondary">Laravel</span>
                <span className="chip secondary">PHP</span>
                <span className="chip">MySQL</span>
                <span className="chip">Conception d API</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ce que j'apporte */}
        <motion.div variants={item} className="bento-card" style={{ background: 'linear-gradient(145deg, rgba(20,184,166,0.05) 0%, rgba(99,102,241,0.05) 100%)', borderColor: 'var(--line-strong)' }}>
          <h2 style={{ color: 'var(--text-main)' }}>Ce que j'apporte à votre équipe</h2>
          <ul className="tool-list" style={{ marginTop: '1rem' }}>
            <li>
              <strong style={{ color: 'var(--primary)' }}>Vision Full Stack</strong>
              Autonomie totale sur l'ensemble d'un projet, du modèle de données jusqu'à l'interface.
            </li>
            <li>
              <strong style={{ color: 'var(--primary)' }}>Intégration Métier</strong>
              Capacité à comprendre vos enjeux (paiements, gestion, etc.) pour proposer des solutions techniques adaptées.
            </li>
            <li>
              <strong style={{ color: 'var(--primary)' }}>Esprit d'initiative</strong>
              Toujours force de proposition pour améliorer le code, le design ou l'expérience.
            </li>
          </ul>
        </motion.div>

      </motion.section>
    </main>
  )
}
