# serial|dev v2 : plan des fichiers

Branche `feat/serial-v2` depuis `main` (e7fdc51). Référence : `design-reference/serial-proto.html`.

## Créés

| Fichier | Rôle |
|---|---|
| `src/styles/tokens.css` | Tokens uniques : couleurs, fonts, gouttière, easing |
| `src/styles/base.css` | Reset, typo (h-xl/h-l/h-m/lede/mono), grain (classe `.grain`), chrome (loader, curtain, nav, menu, next, foot), boutons |
| `src/styles/pages.css` | Styles par page (accueil, projets, étude de cas, services, à propos, contact) |
| `src/styles/insights.css` | Règles de l'ancien `index.css` utilisées par `/insights`, scopées `.insights-page` |
| `src/lib/motion.js` | Registre GSAP unique (ScrollTrigger, Flip), `REDUCE`, Lenis singleton, `scrambleTo()`, `whenIntroDone()` |
| `src/lib/site.js` | Pages SN·00→04, ordre NextPage, dérivés projets (N°, nom/sous-titre, filtre, hôte, capture, mobile), stats |
| `src/lib/usePageMotion.js` | Hook : `gsap.context()` + init commune (`[data-scramble]`, barre NextPage) + `ctx.revert()` |
| `src/components/Scramble.jsx` | Texte qui se décode (au montage, au changement, ou à l'entrée dans l'écran) |
| `src/components/SplitChars.jsx` | Titre lettre par lettre dans un masque |
| `src/components/Odometer.jsx` | Chiffres en colonnes qui roulent |
| `src/components/NextPage.jsx` | Bandeau « Page suivante » + barre de progression + footer |
| `src/components/GlyphCanvas.jsx` | Moteur de glyphes, modes `compile` (IK) et `rain` (N°023) |
| `src/components/AsciiPortrait.jsx` | Portrait ASCII → photo, ligne de scan verte |
| `src/components/Menu.jsx` | Overlay plein écran en volet clip-path |
| `src/components/Nav.jsx` | Nav fixe `mix-blend-mode: difference`, page courante, horloge Dakar, bouton Menu |
| `src/components/Curtain.jsx` | Rideau de transition (expo.inOut 0.75 s, N° + nom scramble) |
| `src/components/Loader.jsx` | Compteur 000 → 022 au premier chargement |
| `src/components/Phone.jsx` | Cadre téléphone (projets mobiles) |
| `src/components/Clock.jsx` | Heure de Dakar en direct |
| `public/images/profil-crop.webp` | Portrait recadré 4:5 sans le logo Gemini (original intact) |

## Modifiés

| Fichier | Changement |
|---|---|
| `src/App.jsx` | Réécrit : Lenis, routeur avec `displayLocation` (rideau puis swap), scroll top (PUSH) / restauration (POP), refresh ScrollTrigger |
| `src/main.jsx` | Imports CSS → `styles/*` |
| `src/pages/HomePage.jsx` | Hero vidéo clip-path, sélection de texte, signature IK, scroll horizontal, téléphones, odomètres, marquee |
| `src/pages/ProjectsPage.jsx` | SplitChars, filtres Flip, index + aperçu collant |
| `src/pages/ProjectDetailPage.jsx` | Étude de cas : scène épinglée selon le type de projet |
| `src/pages/ServicesPage.jsx` | Cartes empilées sticky + terminal |
| `src/pages/AboutPage.jsx` | Portrait ASCII, graphe git, valeurs, odomètres |
| `src/pages/ContactPage.jsx` | Pluie de glyphes N°023, formulaire CLI → WhatsApp |
| `src/pages/InsightsPage.jsx` | Inchangé fonctionnellement (wrapper `.insights-page` déjà présent) |
| `package.json` | + `lenis`, − `framer-motion` (plus utilisé) |

## Supprimés

- `src/index.css`, `src/serial.css` (remplacés par `src/styles/*`)
- `src/components/TiltSurface.jsx`, `AmbientBackground.jsx`, `Scene3D.jsx`, `IPhoneFrame.jsx` (effets souris / décor)
- `CustomCursor`, `MagneticWrap`, `SiteGrain`, `ScrollProgress`, `BackToTop`, tous les `data-cursor`

## Intouchés

`scripts/*`, `src/data/projects-base.js` (format), `src/data/projects.js` (généré), `public/*` existants.
