# Sprint en cours : Écran de jeu, partie 2 — jouable

**But** : on peut jouer une partie complète au doigt, du premier coup à la fin de partie.
**Hors périmètre** : sons, vibrations, animations d'effacement, meilleur score, sauvegarde, écran de fin de partie définitif, en-tête (retour, pause). Ils viennent dans les sprints suivants.
**Branche** : `sprint/game-screen-2`

**Règles communes**
- Toute règle de jeu passe par `applyMove` et `canPlace`. L'interface ne recalcule jamais une règle elle-même.
- Le glisser se fait sur le fil d'interface avec `react-native-gesture-handler` et `react-native-reanimated` : aucun `setState` à chaque image pendant le geste.
- `GestureHandlerRootView` à la racine de l'app.

## Stories

- [ ] **K-11 — Glisser une pièce**
  - Chaque pièce du plateau se saisit au doigt et suit le geste.
  - À la saisie, la pièce passe de sa taille de plateau à la taille des cases de la grille, et se place au-dessus du doigt (décalage vertical d'environ 70 pt) pour rester visible.
  - Une seule pièce à la fois. Un emplacement vide du plateau ne réagit pas.
  - Hook `useGame` dans `src/hooks/` : il détient l'état du jeu et expose l'action de pose.

- [ ] **K-12 — Aperçu sur la grille**
  - Une fonction pure et testée convertit la position de la pièce à l'écran en case de grille (colonne, ligne) pour son coin haut-gauche, avec arrondi à la case la plus proche. Tests : centre d'une case, bord entre deux cases, hors grille.
  - Pendant le geste, si la pièce peut être posée à la case visée, ses cases s'affichent en transparence sur la grille. Sinon, aucun aperçu.
  - L'aperçu ne se met à jour que lorsque la case visée change.

- [ ] **K-13 — Pose et retour**
  - Au relâchement sur une position valide : la pièce se pose exactement là où l'aperçu l'indiquait, via `applyMove`.
  - Au relâchement ailleurs ou sur une position invalide : la pièce revient à sa place dans le plateau avec un ressort court.
  - Geste annulé par le système : même retour au plateau.

- [ ] **K-14 — Effacement, score, nouveau tirage, fin**
  - Après une pose, la grille, le score et le plateau reflètent le nouvel état : lignes et colonnes pleines vidées, score mis à jour, trois nouvelles pièces quand le plateau est vide. Sans animation pour l'instant.
  - Quand la partie est terminée, les pièces ne se saisissent plus et un bandeau provisoire s'affiche : « Partie terminée », le score, un bouton « Rejouer » qui lance une partie neuve. Ce bandeau sera remplacé par l'écran de fin de partie.

## Vérification
- `npm run check` après chaque story.
- Affichage au repos : une capture sur le simulateur, comparée à `docs/design/jeu.png`, pour confirmer que rien n'a bougé. 1 passage suffit.
- L'agent ne peut pas exécuter de geste sur le simulateur : il ne déclare pas le glisser-déposer vérifié. Il fournit dans la revue une liste de contrôle à dérouler à la main, avec pour chaque point ce que Moussa doit observer : saisie, décalage au-dessus du doigt, aperçu, pose valide, pose invalide, pose sur le bord, effacement d'une ligne, d'une colonne, des deux, nouveau tirage, fin de partie, rejouer.
- Indiquer comment provoquer vite une fin de partie pour la tester (une graine ou un état d'exemple).

## Questions ouvertes
_L'agent note ici ce qui le bloque._

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Branche :
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
- Liste de contrôle du glisser-déposer, à dérouler à la main :
- Comment provoquer rapidement une fin de partie :
- Dépendances ajoutées et pourquoi :
- Écarts par rapport au plan :
- Passages de la boucle d'intégration et écarts restants, par écran :
- Proposition de stories détaillées pour le sprint suivant :
