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
12. Contraste : `--smoke` (2.76:1) jamais pour du texte. Nouveau jeton `--dim` (#6c6b71, 3.86:1) réservé aux grands titres inactifs de l'index. Le petit texte reste en `--ash` (6.27:1) ou plus clair.
13. Pages non chargées en lazy : le rideau dure 0,75 s et masque le changement ; un chunk qui arrive en retard casserait ce minutage. Le bundle fait 160 kB gzip, acceptable.
14. ESLint : `globalIgnores` pour les dossiers de skills, logs, generated et design-reference. Les scripts Node de sync (qu'il ne fallait pas toucher) sont passés en `warn` pour `no-unused-vars`/`no-empty` : 14 warnings, 0 erreur.
15. `/insights` : seul un correctif lint (état initial paresseux, `catch {}`) ; rendu inchangé. Il garde ses cartes bordées, hors menu.
16. Commits intermédiaires : entre l'étape 2 et l'étape 8, les pages pas encore réécrites s'affichent sans style (leur ancien CSS a été retiré à l'étape 2). Chaque commit compile.
17. CSS découpé par page (`pages.css`, `projects.css`, `services.css`, `about.css`, `contact.css`) : plus lisible et contourne un hook qui bloque les gros heredocs.
18. Services : cartes empilées seulement ≥ 861 px ; numéros décoratifs (01–04) rendus en `::before` pour sortir du calcul de contraste axe (aria-hidden ne suffit pas).
19. À propos : portrait épinglé (+130 %) seulement ≥ 900 px ; sous 900 px la ligne de scan suit le passage du portrait sans pin. Canvas reconstruit par ResizeObserver (le pin change sa taille).
20. Contact : rien n'est envoyé à un serveur. Le message est typé côté client, puis lien `wa.me` + copie. Validation : nom et projet requis.
21. Reduced-motion : la rangée horizontale de l'accueil devient une grille 2 colonnes (sans pin, les cartes 3 à 6 étaient inaccessibles).
22. `npm run sync-projects:local` testé : OK, mais il a remis `chez-coco` sans URL live (réponse GitHub instable). `projects.js` et `sitemap.xml` restaurés à la version commitée.
23. Test QA de restauration du scroll : passé à la molette + clic sur une ligne visible (avant, `window.scrollTo` brut + re-scroll de Playwright faussaient la mesure). Résultat 1200 px → 1200 px.
