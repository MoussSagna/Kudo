# Sprint en cours : Sprint 0 ter — Tutoriel

**But** : au premier lancement, le joueur voit trois écrans d'explication avant l'écran titre. Aux lancements suivants, il ne les voit plus.
**Hors périmètre** : la logique de jeu, la vraie grille, l'écran d'accueil définitif, les réglages. Les illustrations sont des images fixes, sans interaction ni animation.
**Branche** : `sprint/tutorial`

## Stories

- [ ] **K-27a — Mémoriser que le tutoriel a été vu**
  - Installer `@react-native-async-storage/async-storage` avec `npx expo install`.
  - Dans `src/storage/`, deux fonctions : lire si le tutoriel a été vu, et le marquer comme vu. Une seule clé, versionnée (par exemple `kubo:tutorialSeen:v1`).
  - En cas d'erreur de lecture, considérer le tutoriel comme non vu.
  - Tests unitaires avec le mock officiel d'AsyncStorage.

- [ ] **K-27b — Les trois écrans**
  - Maquettes : `docs/design/tuto-1.png`, `tuto-2.png`, `tuto-3.png`.
  - Structure commune : en haut « 1 / 3 » à gauche et « Passer » à droite ; une illustration centrée ; un titre et un texte ; trois points de progression ; un bouton principal jaune.
  - Textes :
    1. « Glisse une pièce sur la grille » — « Choisis l'une des trois pièces et pose-la où tu veux. Les pièces ne tournent pas. » — bouton « Suivant »
    2. « Complète des lignes » — « Une ligne ou une colonne pleine disparaît. Plusieurs d'un coup rapportent beaucoup plus de points. » — bouton « Suivant »
    3. « Un défi par jour » — « Tu n'as qu'une tentative. La partie s'arrête quand plus aucune pièce ne rentre. » — bouton « C'est parti »
  - Illustrations construites avec les images de blocs du pack, pas avec des captures des maquettes. Les grilles des écrans 1 et 2 font 6 × 6 cases. Reproduire la disposition des blocs visible sur chaque maquette.
  - Un seul composant d'écran réutilisé trois fois, qui reçoit son illustration, ses textes et le libellé de son bouton.
  - Cibles tactiles d'au moins 44 pt pour « Passer » et le bouton.

- [ ] **K-27c — Navigation et enchaînement**
  - « Suivant » passe à l'écran suivant ; on peut aussi balayer horizontalement entre les trois écrans (défilement paginé natif, sans nouvelle dépendance). Les points de progression suivent.
  - « Passer » et « C'est parti » marquent le tutoriel comme vu, puis mènent à l'écran titre.
  - Enchaînement au lancement : écran de lancement animé, puis tutoriel si jamais vu, sinon écran titre. La lecture du stockage se fait pendant l'animation de lancement, pour ne provoquer ni attente ni affichage bref du mauvais écran.
  - Pas de librairie de navigation : un état simple dans le composant racine suffit.
  - Prévoir un moyen de revoir le tutoriel en développement (par exemple une variable d'environnement ou une constante), et l'expliquer dans la revue de sprint.

## Vérification
- Boucle « Intégration des écrans » sur chacun des trois écrans, 3 passages maximum par écran, sur le simulateur iOS.
- Vérifier les deux parcours : premier lancement (tutoriel affiché) et second lancement (tutoriel absent). Vérifier aussi « Passer » dès le premier écran.
- `npm run check` après chaque story.

## Questions ouvertes
_L'agent note ici ce qui le bloque._

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Branche :
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
- Dépendances ajoutées et pourquoi :
- Écarts par rapport au plan :
- Passages de la boucle d'intégration et écarts restants, par écran :
- Proposition de stories détaillées pour le sprint suivant :
