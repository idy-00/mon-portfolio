import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/* ── Large 3D Cube built with framer-motion ── */
function Cube({ size = 200, duration = 20 }) {
  const faces = [
    { name: 'front',  rX: 0,   rY: 0,   tZ: size / 2 },
    { name: 'back',   rX: 0,   rY: 180, tZ: size / 2 },
    { name: 'left',   rX: 0,   rY: -90, tZ: size / 2 },
    { name: 'right',  rX: 0,   rY: 90,  tZ: size / 2 },
    { name: 'top',    rX: 90,  rY: 0,   tZ: size / 2 },
    { name: 'bottom', rX: -90, rY: 0,   tZ: size / 2 },
  ]

  return (
    <motion.div
      className="geo-cube"
      style={{ width: size, height: size }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
        rotateZ: [0, 180],
      }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {faces.map(({ name, rX, rY, tZ }) => (
        <motion.div
          key={name}
          className="geo-face"
          style={{
            width: size,
            height: size,
            transform: `rotateX(${rX}deg) rotateY(${rY}deg) translateZ(${tZ}px)`,
          }}
        />
      ))}
    </motion.div>
  )
}

/* ── Outer spinning ring with dots ── */
function Ring({ radius = 180, count = 16, duration = 24, reverse = false, color = 'accent' }) {
  return (
    <motion.div
      className="geo-ring"
      style={{ width: radius * 2, height: radius * 2 }}
      animate={{ rotateZ: reverse ? [360, 0] : [0, 360] }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {/* Circle outline */}
      <div
        className={`geo-ring__circle geo-ring__circle--${color}`}
        style={{ width: radius * 2, height: radius * 2 }}
      />
      {/* Dots */}
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i
        const x = radius + radius * Math.cos((angle * Math.PI) / 180)
        const y = radius + radius * Math.sin((angle * Math.PI) / 180)
        return (
          <motion.div
            key={i}
            className={`geo-dot geo-dot--${color}`}
            style={{ left: x, top: y }}
            animate={{ scale: [1, 2, 1], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        )
      })}
    </motion.div>
  )
}

/* ── Orbiting particle ── */
function Orbiter({ radius = 160, duration = 10, delay = 0, size = 8 }) {
  return (
    <motion.div
      className="geo-orbiter-arm"
      style={{ width: radius * 2, height: radius * 2 }}
      animate={{ rotateZ: [0, 360] }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      <motion.div
        className="geo-orbiter-dot"
        style={{ width: size, height: size }}
        animate={{
          scale: [1, 1.6, 1],
          boxShadow: [
            '0 0 10px var(--accent), 0 0 30px var(--accent-dim)',
            '0 0 20px var(--accent), 0 0 60px var(--accent)',
            '0 0 10px var(--accent), 0 0 30px var(--accent-dim)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </motion.div>
  )
}

/* ── Pulsing core ── */
function Core() {
  return (
    <motion.div
      className="geo-core"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.5, 0.9, 0.5],
        boxShadow: [
          '0 0 30px var(--accent), 0 0 60px var(--accent-dim)',
          '0 0 60px var(--accent), 0 0 120px var(--accent)',
          '0 0 30px var(--accent), 0 0 60px var(--accent-dim)',
        ],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ── Main exported component ── */
export default function Scene3D({ className = '' }) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), { stiffness: 60, damping: 20 })
  const rotY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), { stiffness: 60, damping: 20 })

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  const handleLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`scene3d-wrapper ${className}`}
      aria-hidden="true"
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    >
      <motion.div
        className="scene3d-stage"
        style={{ rotateX: rotX, rotateY: rotY }}
      >
        {/* Large outer ring */}
        <Ring radius={180} count={16} duration={28} color="accent" />

        {/* Medium ring, tilted and reversed */}
        <div className="geo-ring-tilt geo-ring-tilt--1">
          <Ring radius={140} count={12} duration={22} reverse color="accent2" />
        </div>

        {/* Small inner ring, different tilt */}
        <div className="geo-ring-tilt geo-ring-tilt--2">
          <Ring radius={100} count={8} duration={18} color="accent" />
        </div>

        {/* Wireframe cube at center */}
        <div className="geo-cube-wrap">
          <Cube size={80} duration={16} />
        </div>

        {/* Orbiting particles */}
        <Orbiter radius={160} duration={12} delay={0} size={8} />
        <Orbiter radius={130} duration={9}  delay={2} size={6} />
        <Orbiter radius={190} duration={15} delay={4} size={5} />
        <Orbiter radius={110} duration={8}  delay={1} size={7} />

        {/* Core glow */}
        <Core />
      </motion.div>
    </motion.div>
  )
}
