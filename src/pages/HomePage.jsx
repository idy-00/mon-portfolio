import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

/* ── Text scramble hook ──
   Chaque lettre apparait une par une avec quelques flickers
   lents avant de se stabiliser sur la vraie valeur.
── */
const CHARSET = 'abcdefghijklmnopqrstuvwxyz'

function useScramble(words, { startDelay = 700, charInterval = 90, flickerCount = 5, flickerSpeed = 55 } = {}) {
  const target = words.join(' ')
  const [chars, setChars] = useState(Array(target.length).fill(''))

  useEffect(() => {
    const timers = []

    Array.from(target).forEach((finalChar, idx) => {
      if (finalChar === ' ') {
        timers.push(setTimeout(() => {
          setChars(prev => { const n = [...prev]; n[idx] = ' '; return n })
        }, startDelay + idx * charInterval))
        return
      }

      const charStart = startDelay + idx * charInterval

      for (let f = 0; f < flickerCount; f++) {
        timers.push(setTimeout(() => {
          setChars(prev => {
            const n = [...prev]
            n[idx] = CHARSET[Math.floor(Math.random() * CHARSET.length)]
            return n
          })
        }, charStart + f * flickerSpeed))
      }

      timers.push(setTimeout(() => {
        setChars(prev => { const n = [...prev]; n[idx] = finalChar; return n })
      }, charStart + flickerCount * flickerSpeed))
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  return chars
}

/* ── Animated counter ── */
function Counter({ to, suffix = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const spring = useSpring(count, { stiffness: 80, damping: 20 })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => count.set(to), delay)
    return () => clearTimeout(timeout)
  }, [isInView])

  useEffect(() => {
    spring.on('change', v => setDisplay(Math.round(v).toString()))
  }, [])

  return <span ref={ref}>{display}{suffix}</span>
}

/* ── Photo tilt 3D ── */
function TiltPhoto({ src, alt }) {
  const ref = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const sRotateX = useSpring(rotateX, { stiffness: 200, damping: 25 })
  const sRotateY = useSpring(rotateY, { stiffness: 200, damping: 25 })

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotateX.set(((e.clientY - cy) / rect.height) * -14)
    rotateY.set(((e.clientX - cx) / rect.width) * 14)
  }

  const onMouseLeave = () => { rotateX.set(0); rotateY.set(0) }

  return (
    <motion.div
      ref={ref}
      className="hero__photo-container"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: sRotateX, rotateY: sRotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
    >
      <div className="hero__photo-glow" />
      <div className="hero__photo-ring" />
      <img src={src} alt={alt} className="hero__photo" />
    </motion.div>
  )
}

/* ── Scramble letter ── */
function ScrambleLetter({ finalChar, current }) {
  const isRevealed = current === finalChar
  return (
    <span
      style={{
        display: 'inline-block',
        color: current && !isRevealed ? 'var(--text-muted)' : 'inherit',
        transition: 'color 0.12s',
      }}
    >
      {current || ' '}
    </span>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

export default function HomePage() {
  // "Idrissa Kane" => indices 0-6: Idrissa, 7: space, 8-11: Kane
  const chars = useScramble(['Idrissa', 'Kane'])

  return (
    <main>
      {/* ── Hero ── */}
      <motion.section className="hero" variants={container} initial="hidden" animate="show">
        <div className="hero__mesh">
          <motion.div
            className="hero__blob hero__blob--1"
            animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="hero__blob hero__blob--2"
            animate={{ x: [0, -25, 15, 0], y: [0, 20, -25, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="hero__blob hero__blob--3"
            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.14, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div className="hero__content" variants={container}>
          <motion.div variants={fadeUp}>
            <div className="status-badge">
              <span className="pulse-dot" />
              Disponible pour de nouveaux projets
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h1 className="hero__name" aria-label="Idrissa Kane">
              {/* "Idrissa" — indices 0 a 6, pas de coupure possible */}
              <span style={{ whiteSpace: 'nowrap' }}>
                {'Idrissa'.split('').map((ch, i) => (
                  <ScrambleLetter key={i} finalChar={ch} current={chars[i]} />
                ))}
              </span>
              {' '}
              {/* "Kane" — indices 8 a 11 dans le tableau chars */}
              <span style={{ whiteSpace: 'nowrap' }}>
                {'Kane'.split('').map((ch, i) => (
                  <ScrambleLetter key={i} finalChar={ch} current={chars[i + 8]} />
                ))}
              </span>
            </h1>
            <p className="hero__title">
              <span className="gradient-text">Développeur Full Stack</span>
            </p>
          </motion.div>

          <motion.p className="hero__desc" variants={fadeUp}>
            Je conçois des applications web robustes et des interfaces immersives. De l'architecture backend jusqu'à l'animation de l'interface, je transforme vos idées en solutions digitales qui ont du sens.
          </motion.p>

          <motion.div className="hero__actions" variants={fadeUp}>
            <Link to="/projets" className="btn btn--primary">
              Voir mes réalisations
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/contact" className="btn btn--outline">
              Discuter d'un projet
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} style={{ marginTop: '1rem' }}>
            <div className="scroll-cue">
              <span>Découvrir</span>
              <div className="scroll-cue__arrow">
                <span /><span /><span />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="hero__photo-wrap">
          <TiltPhoto src="/images/profil.png" alt="Idrissa Kane — Portrait" />
        </div>
      </motion.section>

      {/* ── Stats ── */}
      <motion.section
        className="stats-row"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        {[
          { value: 6, suffix: '+', label: 'Projets livrés', desc: 'Web, SaaS, Desktop' },
          { value: 2, suffix: ' ans', label: "D'expérience", desc: 'Full Stack' },
          { value: 100, suffix: '%', label: 'Orienté résultats', desc: 'Impact mesurable' },
        ].map(({ value, suffix, label, desc }, i) => (
          <motion.div
            key={label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="stat-card__value">
              <Counter to={value} suffix={suffix} delay={i * 120} />
            </div>
            <div className="stat-card__label">{label}</div>
            <div className="stat-card__desc">{desc}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Tagline ── */}
      <motion.section
        className="tagline-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <h2>
          L&apos;alliance parfaite entre{' '}
          <span className="gradient-text">logique algorithmique</span>{' '}
          et esthétisme web.
        </h2>
      </motion.section>
    </main>
  )
}
