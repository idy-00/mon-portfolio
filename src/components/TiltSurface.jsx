import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function TiltSurface({
  as: Tag = motion.div,
  children,
  className = '',
  intensity = 8,
  ...props
}) {
  const ref = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const sRotateX = useSpring(rotateX, { stiffness: 140, damping: 18 })
  const sRotateY = useSpring(rotateY, { stiffness: 140, damping: 18 })

  const onMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotateX.set(((e.clientY - cy) / rect.height) * -intensity)
    rotateY.set(((e.clientX - cx) / rect.width) * intensity)
  }

  const onMouseLeave = () => { rotateX.set(0); rotateY.set(0) }

  return (
    <Tag
      ref={ref}
      className={`tilt-surface ${className}`.trim()}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: sRotateX, rotateY: sRotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      {...props}
    >
      {children}
    </Tag>
  )
}
