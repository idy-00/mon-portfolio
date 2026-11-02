# serial|dev v2 : décisions prises seul

1. `logs/` est dans `.gitignore` → j'ajoute `logs/serial-v2-*.md` et `logs/bundle-*.txt` avec `git add -f`. Les captures `logs/screens/` restent hors git (poids).
2. Lenis : `lenis@1.3.27` (publiée le 2026-10-15, > 2 semaines). Les `2.0.0-dev.*` sont écartées.
3. Transition : le rideau est piloté par le changement de `location` (PUSH comme POP). L'URL change tout de suite, le contenu change quand l'écran est couvert. Le bouton retour marche sans interception.
4. « Dernières sorties » : les 6 projets du prototype validé (Finora360, PayTrack, Jëli, ImmoClair, Emirati Vape, ESA), pris par slug dans `projects.js`.
5. Années d'expérience : pas dans les données. Calculé `année courante − 2024` (début pro déclaré « 2 ans »), une seule constante `EXPERIENCE_START` dans `src/lib/site.js`.
6. Filtres /projets : dérivés de `category` (SaaS si « SaaS », Mobile si « Mobile », EdTech si « EdTech » ou « Bureau », sinon Web).
7. Nom / sous-titre : `title` coupé sur « — » (ex. « Finora360 — Pilotage financier »). Sans sous-titre, on affiche la catégorie.
8. Projet « mobile » = capture dont le nom contient `-mobile-`.
9. `/insights` : ses styles sont extraits de l'ancien `index.css` vers `src/styles/insights.css`, scopés `.insights-page`, pour ne pas fuir sur le reste.
10. `framer-motion` retiré : plus aucun import après la refonte (GSAP seul).
11. Portrait : `profil.png` est en 1180×896 paysage. `profil-crop.webp` = recadrage 4:5 centré sur le visage (x 242→959), ce qui sort le logo Gemini (x ≈ 1100–1150) du cadre.
