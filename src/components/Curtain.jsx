import { forwardRef } from 'react'

/** Rideau de transition. Piloté par App (timeline GSAP) : monte, couvre, sort par le haut. */
const Curtain = forwardRef(function Curtain(_, ref) {
  return (
    <div ref={ref} className="curtain" aria-hidden="true">
      <div className="curtain__n" data-curtain-n>SN·00</div>
      <div className="curtain__t" data-curtain-t>Accueil</div>
    </div>
  )
})

export default Curtain
