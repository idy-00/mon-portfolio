import { Link } from 'react-router-dom'
import Scramble from './Scramble'
import Clock from './Clock'

/** Nav fixe en mix-blend-mode: difference : IK, page courante, heure de Dakar, Menu. */
export default function Nav({ here, menuOpen, onToggle, buttonRef }) {
  return (
    <header className="nav">
      <Link className="nav__id" to="/" aria-label="Accueil, Idrissa Kane">
        <span className="nav__mark" aria-hidden="true">IK</span>
        <Scramble className="nav__here" text={`${here.sn} ${here.name}`} aria-hidden="true" />
      </Link>
      <div className="nav__right">
        <span className="nav__clock" aria-label="Heure à Dakar">DAKAR <Clock /></span>
        <button
          ref={buttonRef}
          className="nav__menu"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={onToggle}
        >
          <Scramble text={menuOpen ? 'Fermer' : 'Menu'} dur={400} />
          <i aria-hidden="true"><b /><b /></i>
        </button>
      </div>
    </header>
  )
}
