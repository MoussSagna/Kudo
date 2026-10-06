# Sprint en cours : Écran de jeu, partie 1 — règles et affichage

**But** : toute la logique du jeu existe et est testée, et l'écran de jeu s'affiche fidèlement à la maquette, sans interaction.
**Hors périmètre** : gestes, glisser-déposer, animations, sons, sauvegarde, fin de partie à l'écran, défi du jour.
**Branche** : `sprint/game-screen-1`

**Règle pour K-05 à K-09** : tout va dans `src/game/`, en fonctions pures, sans React ni React Native, sans mutation des arguments, sans `Math.random()`. Chaque fonction a ses tests. Référence unique pour les règles : `docs/SPEC.md`.

## Stories

- [x] **K-05 — État du jeu**
  - Types : grille 8×8 (couleur ou vide par case), plateau de 3 emplacements (pièce ou vide), score, niveau de série, nombre de tirages, partie terminée ou non.
  - `createGame(seed)` renvoie une partie neuve : grille vide, 3 pièces tirées avec `createRng(seed)`. Même graine, même partie (testé).

- [ ] **K-06 — Pose**
  - `canPlace(grid, piece, col, row)` : vrai si toutes les cases de la pièce sont dans la grille et sur des cases vides. Tests : bords, coins, chevauchement.
  - `placePiece(...)` renvoie une nouvelle grille avec la pièce dans sa couleur.

- [ ] **K-07 — Effacement**
  - `clearLines(grid)` renvoie la nouvelle grille et le nombre de lignes et colonnes vidées. Lignes et colonnes sont détectées avant tout effacement, puis vidées ensemble. Tests : une ligne, une colonne, croisement ligne + colonne, aucune.

- [ ] **K-08 — Coup complet et score**
  - `applyMove(state, trayIndex, col, row)` : pose, efface, calcule le score selon `SPEC.md` (1 point par case, 10 × n × n par effacement, multiplicateur de série), vide l'emplacement du plateau, retire 3 nouvelles pièces quand le plateau est vide, puis met à jour « partie terminée ».
  - Un coup invalide renvoie l'état inchangé.
  - Tests chiffrés sur le score, dont deux effacements consécutifs (série ×2) et la remise à 1 de la série.

- [ ] **K-09 — Fin de partie**
  - `hasAnyMove(grid, tray)` : vrai si au moins une pièce restante peut être posée quelque part. Tests : grille vide, grille pleine, une seule place possible.

- [ ] **K-10 — Affichage de l'écran de jeu**
  - Maquette : `docs/design/jeu.png`.
  - Composants dans `src/components/` : la grille 8×8, une pièce (construite avec les images de blocs selon ses `cells`), le plateau de 3 pièces, l'en-tête de score.
  - La taille de case se calcule depuis la largeur de l'écran ; la grille reste carrée et centrée.
  - Affiche pour l'instant : le score, la grille, le plateau. N'affiche pas encore le bouton retour, le bouton pause, « Série ×2 » ni « Meilleur » : ils arriveront avec les sprints qui les rendent fonctionnels. Pas de bouton inactif.
  - Après l'écran de lancement, l'app affiche directement l'écran de jeu. Supprimer l'écran titre provisoire.
  - Pour la comparaison visuelle, créer un état d'exemple reproduisant la maquette et l'afficher via une constante de développement. Grille, ligne par ligne (r rouge, o orange, y jaune, g vert, c cyan, b bleu, p violet, . vide) : `........ / ........ / ..p..... / r.pp.c.c / ....y..o / ..cg..rg / yg..c..b / g.bbbb.b`. Plateau : les pièces `L_d`, `sq2`, `v3`. Score : 1240. Les couleurs des pièces viennent de `pieces.ts` ; un écart de couleur avec la maquette sur les pièces du plateau n'est pas un défaut.
  - Hors mode d'exemple, l'écran affiche une partie neuve créée par `createGame`.

## Vérification
- `npm run check` après chaque story.
- K-10 : boucle « Intégration des écrans » sur le simulateur iOS avec l'état d'exemple, 3 passages maximum. Les éléments volontairement absents (boutons, série, meilleur score) ne comptent pas comme des écarts.

## Questions ouvertes
_L'agent note ici ce qui le bloque._
- **`docs/SPEC.md`, « Décisions à confirmer »** : la demande était d'en retirer « le barème », mais la liste ne contient aucune ligne sur le barème. Elle contient deux lignes : le changement de jour à minuit UTC, et la pondération du tirage des pièces. `docs/SPEC.md` n'a donc pas été modifié. Laquelle faut-il retirer ?

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Branche :
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
- Dépendances ajoutées et pourquoi :
- Écarts par rapport au plan :
- Passages de la boucle d'intégration et écarts restants, par écran :
- Couverture de tests de `src/game/` :
- Proposition de stories détaillées pour le sprint suivant :
