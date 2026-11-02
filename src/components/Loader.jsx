import { forwardRef } from 'react'

/** Loader du premier chargement : compteur 000 → nombre de projets. Piloté par App. */
const Loader = forwardRef(function Loader(_, ref) {
  return (
    <div ref={ref} className="loader" aria-hidden="true">
      <div className="loader__n" data-loader-n>000</div>
      <div className="loader__t mono">serial|dev · chargement de la série</div>
    </div>
  )
})

export default Loader
