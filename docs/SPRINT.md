# Sprint en cours : Écran de jeu, partie 1 — règles et affichage

**But** : toute la logique du jeu existe et est testée, et l'écran de jeu s'affiche fidèlement à la maquette, sans interaction.
**Hors périmètre** : gestes, glisser-déposer, animations, sons, sauvegarde, fin de partie à l'écran, défi du jour.
**Branche** : `sprint/game-screen-1`

**Règle pour K-05 à K-09** : tout va dans `src/game/`, en fonctions pures, sans React ni React Native, sans mutation des arguments, sans `Math.random()`. Chaque fonction a ses tests. Référence unique pour les règles : `docs/SPEC.md`.

## Stories

- [x] **K-05 — État du jeu**
  - Types : grille 8×8 (couleur ou vide par case), plateau de 3 emplacements (pièce ou vide), score, niveau de série, nombre de tirages, partie terminée ou non.
  - `createGame(seed)` renvoie une partie neuve : grille vide, 3 pièces tirées avec `createRng(seed)`. Même graine, même partie (testé).

- [x] **K-06 — Pose**
  - `canPlace(grid, piece, col, row)` : vrai si toutes les cases de la pièce sont dans la grille et sur des cases vides. Tests : bords, coins, chevauchement.
  - `placePiece(...)` renvoie une nouvelle grille avec la pièce dans sa couleur.

- [x] **K-07 — Effacement**
  - `clearLines(grid)` renvoie la nouvelle grille et le nombre de lignes et colonnes vidées. Lignes et colonnes sont détectées avant tout effacement, puis vidées ensemble. Tests : une ligne, une colonne, croisement ligne + colonne, aucune.

- [x] **K-08 — Coup complet et score**
  - `applyMove(state, trayIndex, col, row)` : pose, efface, calcule le score selon `SPEC.md` (1 point par case, 10 × n × n par effacement, multiplicateur de série), vide l'emplacement du plateau, retire 3 nouvelles pièces quand le plateau est vide, puis met à jour « partie terminée ».
  - Un coup invalide renvoie l'état inchangé.
  - Tests chiffrés sur le score, dont deux effacements consécutifs (série ×2) et la remise à 1 de la série.

- [x] **K-09 — Fin de partie**
  - `hasAnyMove(grid, tray)` : vrai si au moins une pièce restante peut être posée quelque part. Tests : grille vide, grille pleine, une seule place possible.

- [x] **K-10 — Affichage de l'écran de jeu**
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
- **Série : « ligne » inclut-il les colonnes ?** `docs/SPEC.md` dit « efface au moins une ligne ». Le code compte lignes et colonnes ensemble (toute pose qui efface quelque chose prolonge la série). À confirmer.
- **Graine d'une partie neuve** : hors mode d'exemple, l'écran crée la partie avec `Date.now()` comme graine, en attendant le défi du jour (K-20) et la partie libre (K-25). À confirmer.

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._

### Branche
`sprint/game-screen-1`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### Ce qui a été livré
- **K-05** `src/game/state.ts` : types `Grid`, `Tray`, `GameState` ; `createEmptyGrid`, `drawTray(seed, drawIndex)`, `createGame(seed)`.
- **K-06** `src/game/placement.ts` : `canPlace`, `placePiece`. `src/game/notation.ts` : `gridFrom` (grille écrite en lettres) et `pieceById`, utilisés par les tests et par l'état d'exemple.
- **K-07** `src/game/lines.ts` : `clearLines` (détection de toutes les lignes et colonnes pleines, puis effacement d'un seul coup).
- **K-08** `src/game/moves.ts` : `applyMove`, `clearPoints`, `hasAnyMove`.
- **K-09** tests de `hasAnyMove` et de la fin de partie dans `applyMove`.
- **K-10** écran de jeu `src/screens/GameScreen.tsx` et composants `Grid`, `PieceView`, `Tray`, `ScoreHeader` (plus `formatScore`). L'écran titre provisoire est supprimé : après l'écran de lancement, l'app affiche l'écran de jeu.
- État d'exemple de la maquette : `src/game/sampleGame.ts`.
- Documents : backlog réorganisé par écran, maquettes du tutoriel interactif renommées (`tuto-1a.png`, `tuto-1b.png`, `tuto-2a.png`, `tuto-2b.png`, `tuto-3.png`) et commitées.

### Choix de conception à connaître
- **Série** : `GameState.streak` est le multiplicateur qui s'appliquera au prochain effacement. Il vaut 1 au départ, passe à 2 après une pose qui efface, puis 3, etc. ; une pose sans effacement le remet à 1. Le premier effacement d'une série est donc multiplié par 1, le suivant par 2, comme dans `docs/SPEC.md`.
- **Tirages reproductibles** : l'état ne contient pas de générateur aléatoire, seulement la graine et le nombre de tirages. Le tirage suivant se recalcule à partir des deux, ce qui rend l'état sauvegardable tel quel (utile pour K-21).
- **Coup invalide** : `applyMove` renvoie exactement le même objet d'état (emplacement vide, hors grille, case occupée, partie terminée).

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 59 tests réussis.
- `npx expo start --ios` : après l'écran de lancement, l'écran de jeu affiche « SCORE », 0, une grille vide et trois pièces tirées au hasard.
- Pour afficher la partie de la maquette : `EXPO_PUBLIC_SAMPLE_GAME=1 npx expo start --ios` (développement uniquement). On doit voir le score 1 240, la grille de la maquette et les pièces `L_d`, `sq2`, `v3`.
- Vérifié par l'agent sur le simulateur iOS (iPhone 18 Pro, Expo Go) : l'état d'exemple et une partie neuve.
- **Non vérifié** : Android, un vrai téléphone, les petits écrans et les tablettes (K-29).

### Dépendances ajoutées et pourquoi
- Aucune. La police DM Sans Bold (libellé « SCORE ») vient du paquet `@expo-google-fonts/dm-sans` déjà installé.

### Écarts par rapport au plan
- **`docs/SPEC.md` non modifié** : la ligne « barème » à retirer n'existe pas dans « Décisions à confirmer » (voir « Questions ouvertes »).
- **`hasAnyMove` livré avec K-08** et non K-09, car `applyMove` en a besoin pour mettre à jour « partie terminée ». K-09 apporte ses tests et ceux de la fin de partie.
- **Place réservée à l'en-tête** : l'écran garde 77 pt vides au-dessus du score, là où la maquette place le bouton retour, le titre et le bouton pause, pour que le score et la grille soient déjà à leur position finale. Le titre « DÉFI DU JOUR / Mardi 6 octobre » n'est pas affiché non plus (défi du jour hors périmètre).
- **`src/theme.ts`** : ajout des couleurs `UI.panel` (fond de la grille) et `UI.tray` (fond du plateau), et de la police `FONTS.bodyBold`.
- **Deux tests de fin de partie étaient faux à la première écriture** (grilles de test contenant des lignes déjà pleines) ; ils ont été corrigés, le code du jeu n'a pas changé.
- **Travail sur le tutoriel statique** : interrompu par Moussa. Il reste sur la branche `sprint/tutorial`, non fusionnée (K-27a testée, plus un commit `wip(K-27b)` non vérifié visuellement). Les anciennes maquettes `tuto-1/2/3.png` y sont supprimées. À décider : garder cette branche comme base du tutoriel interactif (le stockage « tutoriel vu » est réutilisable) ou l'abandonner.
- **Dossier vide** `docs/design/Kubo — écrans de l'application-png/` présent sur le disque, non suivi par Git ; laissé tel quel.

### Passages de la boucle d'intégration et écarts restants, par écran
- **Écran de jeu : 3 passages** (`jeu-1.png`, `jeu-2.png`, `jeu-3.png`), avec l'état d'exemple.
  - Passage 1 : libellé « SCORE » trop petit, trop espacé et 4 pt trop bas ; chiffres du score un peu petits ; espace score → grille de 31,5 pt pour 29,5. Corrigés.
  - Passage 2 : positions et tailles conformes ; libellé encore 4 pt trop large. Espacement des lettres réduit.
  - Passage 3 : libellé à 50 pt de large pour 48,5.
  - Écarts restants : le libellé « SCORE » reste environ 1,5 pt trop large. Les cases font 45 pt au lieu de 44 et l'espace grille → plateau 72 pt au lieu de 67, à cause de l'écran plus grand du simulateur (402 × 874 contre 390 × 844). La pièce `L_d` est orange (couleur de `pieces.ts`) et non bleue : écart accepté d'avance. Le bouton bleu en haut à droite des captures est celui d'Expo Go.
  - Volontairement absents : bouton retour, bouton pause, titre, « Série ×2 », « Meilleur ».

### Couverture de tests de `src/game/`
- Globale : 97,5 % des instructions, 96,7 % des fonctions.
- `state.ts`, `placement.ts`, `lines.ts`, `moves.ts`, `notation.ts` : 100 %.
- `pieces.ts` (fourni par le pack) : 90,9 % ; `dailySeed` n'est pas encore testée ni utilisée (défi du jour, K-20).
- `sampleGame.ts` : 0 % ; c'est une constante de données, sans logique.

### Proposition de stories détaillées pour le sprint suivant (Écran de jeu, partie 2 — jouable)
- Préalable : installer `react-native-gesture-handler` avec `npx expo install` (déjà dans la « Stack imposée »).
- **K-11 — Glisser une pièce** : chaque pièce du plateau suit le doigt ; elle grossit à la taille des cases de la grille et se place au-dessus du doigt pour rester visible.
- **K-12 — Aperçu** : pendant le glisser, la position visée s'affiche en transparence sur la grille si la pose est valide (`canPlace`). Fonction pure à tester : convertir la position du doigt en case de grille.
- **K-13 — Pose** : au relâcher, `applyMove` si la position est valide ; sinon la pièce retourne à sa place sur le plateau.
- **K-14 — Effacement, score, nouveau tirage** : l'écran reflète l'état renvoyé par `applyMove` (hook `useGame`).
- **K-16 — Sons**, **K-17 — Vibrations**, **K-18 — Animations de pose et d'effacement**.
- Points à trancher avant de commencer : les deux questions ouvertes sur la série et sur la graine, et l'apparition éventuelle de « Série ×2 » dans ce sprint, puisque la série devient visible en jouant.
