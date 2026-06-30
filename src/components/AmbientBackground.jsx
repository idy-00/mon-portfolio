import { motion } from 'framer-motion'

export default function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      {/* ── Blurred image blobs ── */}
      <motion.div
        className="ambient-blob ambient-blob--img1"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], rotate: [0, 15, -10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img src="/images/bg-code-1.jpg" alt="" />
      </motion.div>

      <motion.div
        className="ambient-blob ambient-blob--img2"
        animate={{ x: [0, -50, 30, 0], y: [0, 40, -20, 0], rotate: [0, -12, 8, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      >
        <img src="/images/bg-code-2.jpg" alt="" />
      </motion.div>

      <motion.div
        className="ambient-blob ambient-blob--img3"
        animate={{ x: [0, 25, -40, 0], y: [0, -20, 35, 0], rotate: [0, 8, -15, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
      >
        <img src="/images/bg-code-3.jpg" alt="" />
      </motion.div>

      {/* ── Pure green light orbs ── */}
      <motion.div
        className="ambient-orb ambient-orb--1"
        animate={{ scale: [1, 1.3, 0.9, 1], x: [0, 60, -30, 0], y: [0, -40, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-orb ambient-orb--2"
        animate={{ scale: [1, 0.8, 1.2, 1], x: [0, -70, 40, 0], y: [0, 60, -30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
      <motion.div
        className="ambient-orb ambient-orb--3"
        animate={{ scale: [1, 1.4, 0.85, 1], x: [0, 35, -55, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 12 }}
      />
    </div>
  )
}
