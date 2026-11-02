import { useEffect, useState } from 'react'

// Dakar = GMT+0 toute l'année : l'heure UTC suffit.
const now = () => new Date().toISOString().slice(11, 19)

function useDakarTime() {
  const [t, setT] = useState(now)
  useEffect(() => {
    const id = setInterval(() => setT(now()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function Clock({ className = '' }) {
  const t = useDakarTime()
  return <time className={className} dateTime={t}>{t}</time>
}
