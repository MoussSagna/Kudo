# Sprint en cours : Tutoriel interactif

**But** : au premier lancement, le joueur apprend en faisant lui-même les deux gestes du jeu, puis arrive sur l'écran de jeu.
**Hors périmètre** : accueil, défi du jour, réglages.
**Branche** : `sprint/tutorial-interactive`

**Règles communes**
- Le tutoriel réutilise la grille, le plateau, le glisser-déposer, les animations, les sons et les vibrations du jeu. Aucun composant de jeu dupliqué.
- Les coups passent par `applyMove`. Les restrictions propres au tutoriel sont dans une fonction pure et testée.
- Le tutoriel ne touche ni au meilleur score ni aux statistiques.

## Stories

- [x] **K-27a — Mémoriser que le tutoriel a été vu**
  - Reprendre le commit K-27a de la branche `sprint/tutorial` (`git cherry-pick`), l'adapter au module de stockage actuel, garder ses tests. Ne rien reprendre d'autre. Signaler tout conflit au lieu de le résoudre à l'aveugle.

- [x] **K-27d — Étape 1 : poser une pièce**
  - Maquettes : `docs/design/tuto-1a.png` (consigne) et `tuto-1b.png` (réussite).
  - Grille de départ, ligne par ligne (mêmes lettres que l'état d'exemple) : `........ / ........ / ........ / ........ / ........ / ........ / r......y / rr.gg.yy`
  - Plateau : une seule pièce, `L_d`, au centre. Une flèche animée au-dessus d'elle invite à la glisser vers le haut.
  - Son emplacement suggéré clignote sur la grille : cases (colonne, ligne) (3,3), (4,3), (5,3), (5,4), en comptant depuis 0.
  - Toute pose valide est acceptée, pas seulement l'emplacement suggéré.
  - Après la pose : « Bien joué ! », le texte « Chaque case posée rapporte 1 point. Les pièces ne tournent pas. », la pastille « +4 », et le bouton « Suivant » à la place du plateau.

- [x] **K-27e — Étape 2 : compléter une ligne**
  - Maquettes : `tuto-2a.png` et `tuto-2b.png`.
  - Grille de départ : `........ / ........ / ........ / ........ / ........ / ...p.... / oyy...cr / b.rr.pp.`
  - Plateau : la pièce `h3`. La ligne 6 est encadrée en jaune et ses trois cases vides clignotent.
  - Seule la pose qui complète la ligne est acceptée. Toute autre pose renvoie la pièce au plateau, comme une pose invalide, et fait apparaître l'aide « Vise les trois cases vides de la ligne ».
  - Après la pose : l'effacement se joue normalement, puis « Ligne effacée ! », le texte « Les colonnes comptent aussi. Plusieurs d'un coup rapportent beaucoup plus. », et le bouton « Suivant ».

- [ ] **K-27f — Étape 3 et enchaînement**
  - Maquette : `tuto-3.png`. Écran d'explication sans geste, bouton « C'est parti ». La semaine affichée est une illustration fixe.
  - En haut de chaque étape : « 1 / 3 », « 2 / 3 », « 3 / 3 » à gauche, « Passer » à droite ; en bas, les trois points de progression.
  - « Passer » et « C'est parti » marquent le tutoriel comme vu et mènent à l'écran de jeu avec une partie neuve.
  - Au lancement : écran de lancement, puis tutoriel s'il n'a jamais été vu, sinon écran de jeu. La lecture du stockage se fait pendant l'animation de lancement.
  - Si l'app est fermée en cours de tutoriel, il reprend au début au prochain lancement.
  - « Réduire les animations » : la flèche et le clignotement deviennent fixes.

## Outils de développement
- `EXPO_PUBLIC_TUTORIAL=1a`, `1b`, `2a`, `2b` ou `3` ouvre directement cet état ; `EXPO_PUBLIC_TUTORIAL=1` rejoue le tutoriel depuis le début même s'il a été vu.

## Vérification
- `npm run check` après chaque story.
- Boucle « Intégration des écrans » sur les cinq états, 3 passages maximum chacun. Les couleurs des pièces viennent de `pieces.ts` : un écart de couleur avec la maquette n'est pas un défaut.
- L'agent ne peut pas faire les gestes. Il fournit une liste de contrôle à dérouler à la main : chaque étape réussie, la mauvaise pose à l'étape 2, « Passer » à chaque étape, premier lancement puis second lancement, fermeture en cours de tutoriel.

## Questions ouvertes
_L'agent note ici ce qui le bloque._

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Branche :
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
- Liste de contrôle à dérouler à la main :
- Dépendances ajoutées et pourquoi :
- Écarts par rapport au plan :
- Passages de la boucle d'intégration et écarts restants, par écran :
- Proposition de stories détaillées pour le sprint suivant :
