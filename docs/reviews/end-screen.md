# Fin de partie (archivé)

**But** : une partie se termine sur un vrai écran de résultat, avec le meilleur score mémorisé et un score partageable.
**Hors périmètre** : accueil, défi du jour, « Reviens demain », réglages, tutoriel.
**Branche** : `sprint/end-screen`

## Stories

- [x] **K-32 — Correctif du plateau**
  - Une pièce de 5 blocs de haut ou de large ne doit plus toucher les bords du plateau : réduire l'échelle des pièces dans le plateau pour que la plus grande tienne avec une marge. Vérifier avec `v5`, `h5` et `sq3`.

- [x] **K-33 — Statistiques de partie**
  - L'état du jeu compte, en fonctions pures et testées : le nombre de pièces posées, le nombre de lignes et colonnes effacées, et la meilleure série atteinte.

- [x] **K-19 — Meilleur score**
  - Installer `@react-native-async-storage/async-storage` avec `npx expo install`.
  - Dans `src/storage/`, lecture et écriture du meilleur score, clé versionnée. Une erreur de lecture donne 0, une erreur d'écriture est ignorée sans planter. Tests avec le mock officiel.
  - L'en-tête de l'écran de jeu affiche « Meilleur : N » et la pastille « Série ×N » quand la série vaut 2 ou plus, comme sur `docs/design/jeu.png`.
  - Si la partie bat le meilleur score, il est enregistré à la fin de la partie.

- [x] **K-15 — Écran de fin de partie**
  - Maquette : `docs/design/resultat.png`. Il remplace le bandeau provisoire.
  - Contenu : le titre « Partie terminée », le score en grand, la pastille « Nouveau record » seulement si le record est battu, la grille finale en miniature, les trois statistiques (pièces posées, lignes effacées, meilleure série).
  - Boutons : « Partager mon score » (principal) et « Rejouer » (secondaire).
  - Volontairement absents pour l'instant : la ligne « Défi du mardi 6 octobre », « Partie libre » et « Retour à l'accueil ». Ils arriveront avec l'accueil et le défi du jour. Pas de bouton inactif.
  - Enchaînement : à la fin de la partie, la grille reste visible environ 600 ms, puis l'écran de résultat apparaît en fondu. Le son `highscore` remplace `gameover` quand le record est battu.

- [x] **K-26 — Partage**
  - Une fonction pure et testée construit le texte : « Kubo — N points », la grille finale en 8 lignes d'emojis (`SHARE_EMOJI` de `src/theme.ts`), puis une ligne de statistiques.
  - Le bouton ouvre la feuille de partage du système avec `Share` de React Native, sans nouvelle dépendance. Un partage annulé ne produit aucune erreur.

## Vérification
- `npm run check` après chaque story.
- K-15 : boucle « Intégration des écrans » sur le simulateur iOS à partir de l'état `over`, 3 passages maximum. Les éléments volontairement absents ne sont pas des écarts. Vérifier les deux variantes, avec et sans « Nouveau record ».
- K-32 et K-19 : une capture de l'écran de jeu comparée à `docs/design/jeu.png`.
- L'agent ne peut pas ouvrir la feuille de partage ni vérifier la persistance après un redémarrage réel. Il fournit une liste de contrôle : battre le record, fermer et rouvrir l'app, partager vers Notes ou Messages, annuler un partage.

## Questions ouvertes
- **K-32 — échelle des pièces du plateau** : la story demande de « réduire l'échelle des pièces pour que la plus grande tienne ». Réduire toutes les pièces à la même échelle les ferait passer de 30 pt à 20 pt par bloc, loin de la maquette `jeu.png`. Le choix retenu : seules les pièces trop longues sont réduites (barres de 5 à 20 pt par bloc, barres de 4 à 25 pt), les autres gardent la taille de la maquette. **Tranché par Moussa** : échelle unique pour toutes les pièces, la plus grande qui laisse au moins 8 pt de marge à `h5` et `v5` (correctif `fix(K-32)` fait au début du sprint suivant).

## Revue de sprint
### Branche
`sprint/end-screen`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### Ce qui a été livré
- **K-32** `src/components/fitTrayCellSize.ts` : les pièces trop longues sont dessinées plus petites dans le plateau (barres de 5 : 20 pt par bloc ; barres de 4 : 25 pt), couchées ou debout à la même taille. Les autres pièces gardent la taille de la maquette. Testé sur les 31 pièces.
- **K-33** `GameState.stats` : pièces posées, lignes et colonnes effacées, meilleure série ; mis à jour par la fonction pure `updateStats`, appelée par `playMove`.
- **K-19** `src/storage/bestScore.ts` (clé `kubo:bestScore:v1`), hook `useBestScore`. L'en-tête affiche « Meilleur : N » et la pastille verte « Série ×N » dès que la série vaut 2. Le record est enregistré à la fin de la partie.
- **K-15** `src/screens/ResultScreen.tsx` remplace le bandeau provisoire : titre, score, pastille « ★ Nouveau record » si le record est battu, grille finale en miniature, trois statistiques, « Partager mon score » et « Rejouer ». Il apparaît en fondu 600 ms après le dernier coup. Le son `highscore` remplace `gameover` quand le record est battu.
- **K-26** `src/game/share.ts` : `buildShareText` construit « Kubo — N points », 8 lignes d'emojis, puis les statistiques. Le bouton ouvre la feuille de partage avec `Share` de React Native.

Exemple de texte partagé :

```
Kubo — 1 780 points
🟪🟪⬛🟩⬛🟥🟥⬛
🟪⬛🟦🟩⬛🟥⬛🟨
⬛🟦🟦⬛🟧🟧⬛🟨
🟩🟦⬛🟨🟧⬛🟪🟪
🟩⬛🟥🟨⬛🟦🟦⬛
⬛🟧🟥⬛🟩🟩⬛🟦
🟨🟧⬛🟪🟪⬛🟦🟦
🟨⬛🟦🟦⬛🟥⬛🟩
38 pièces posées · 21 lignes effacées · meilleure série ×4
```

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 101 tests réussis.
- États d'exemple (développement, arrêter d'abord tout serveur Expo en cours) : `EXPO_PUBLIC_SAMPLE_GAME=over` ouvre l'écran de résultat de la maquette sans record, `=record` avec la pastille « Nouveau record », `=big` met les trois plus grandes pièces dans le plateau, `=1` montre l'en-tête avec « Série ×2 », `=end` permet de finir une partie en un coup.
- **Vérifié par l'agent** : `npm run check`, `expo-doctor` (21/21), et sur le simulateur iOS l'affichage du plateau avec `v5`, `h5` et `sq3`, de l'en-tête, et de l'écran de résultat dans ses deux variantes.
- **Non vérifié par l'agent** : la fin de partie déclenchée en jouant (attente de 600 ms, fondu, sons `gameover` et `highscore`), la feuille de partage, « Rejouer » depuis l'écran de résultat, l'enregistrement réel du record et sa relecture après un redémarrage. Aucun de ces points ne peut être exécuté sans geste ; seules les fonctions sous-jacentes sont testées.

### Liste de contrôle à dérouler à la main
Sur un vrai téléphone de préférence (Expo Go suffit).

| # | Action | Ce que tu dois observer |
|---|---|---|
| 1 | Lancer une partie normale | « Meilleur : 0 » au premier lancement, pas de pastille « Série » |
| 2 | Effacer une ligne | La pastille « Série ×2 » apparaît ; elle disparaît après une pose sans effacement |
| 3 | Terminer une partie avec un score supérieur à 0 (`EXPO_PUBLIC_SAMPLE_GAME=end`, point jaune en haut à gauche) | La grille reste visible environ une demi-seconde, puis l'écran de résultat arrive en fondu ; pastille « ★ Nouveau record » ; son de record au lieu du son de fin |
| 4 | Lire l'écran de résultat | Score, grille finale en miniature identique à la grille de fin, statistiques cohérentes avec la partie |
| 5 | Toucher « Rejouer » | Retour à l'écran de jeu, grille vide, score 0, « Meilleur » affiche le record qui vient d'être établi |
| 6 | Terminer une partie avec un score inférieur au record | Écran de résultat sans pastille ; son de fin normal ; « Meilleur » inchangé |
| 7 | Fermer complètement l'app (la balayer hors du sélecteur d'apps), puis la rouvrir | « Meilleur » affiche toujours le record |
| 8 | Toucher « Partager mon score », choisir Notes ou Messages | La feuille de partage s'ouvre ; le texte contient « Kubo — N points », 8 lignes de 8 emojis reproduisant la grille, puis la ligne de statistiques |
| 9 | Toucher « Partager mon score », puis fermer la feuille sans rien choisir | Retour à l'écran de résultat, sans message d'erreur ni blocage |
| 10 | Jouer jusqu'à obtenir une barre de 5 dans le plateau | Elle est plus petite que les autres pièces et ne touche pas les bords ; saisie, elle grossit bien à la taille des cases |

Attention pour les points 3 et 6 avec `=end` : la partie d'exemple se termine toujours à 481 points. Elle bat le record la première fois, plus les suivantes.

### Dépendances ajoutées et pourquoi
- `@react-native-async-storage/async-storage` 2.2.0 : sauvegarde du meilleur score (dans la « Stack imposée »).

### Écarts par rapport au plan
- **K-32** : seules les pièces trop longues sont réduites, pas toutes (voir « Questions ouvertes »).
- **Ordre K-15 / K-26** : le commit de K-15 contient l'écran avec « Rejouer » seul ; le bouton « Partager mon score » arrive avec le commit de K-26, pour ne pas livrer un bouton inactif. Les passages 2 et 3 de la boucle ont donc été faits après K-26.
- **Meilleure série** : c'est le plus grand multiplicateur appliqué à un effacement. Elle vaut ×1 tant que deux coups de suite n'ont pas effacé, y compris pour une partie sans aucun effacement.
- **Texte de partage** : accord au singulier (« 1 point », « 0 pièce posée »). Les emojis `cyan` et `blue` sont identiques (🟦), comme noté dans « Idées » du backlog.
- **Pastille** : « ★ Nouveau record » et non « Nouveau record du jour » comme sur la maquette, conformément à la story. L'étoile est un caractère de texte ; l'icône de partage est dessinée avec des vues, faute de librairie d'icônes.
- **État d'exemple `over`** : c'est désormais la partie de la maquette `resultat.png` (1 780 points) et non plus la partie à 481 points. Un état `record` et un état `big` ont été ajoutés.
- **`formatScore`** : déplacé de `src/components/` vers `src/game/`, pour que la fonction de partage puisse l'utiliser.
- **`src/theme.ts`** : ajout de `UI.accentEdge` (tranche du bouton jaune).
- **Android** : rien n'a été testé.

### Passages de la boucle d'intégration et écarts restants, par écran
- **Écran de résultat : 3 passages** (`resultat-1.png`, `resultat-2.png`, `resultat-3.png`).
  - Passage 1 (variante record, sans le bouton de partage) : titre trop petit, grille miniature trop petite, chiffres des statistiques trop petits, libellés un peu grands. Corrigés.
  - Passage 2 (variante record, écran complet) : titre, score, pastille, grille, cartes et boutons à 1 pt près des positions de la maquette ; libellé « Partager mon score » 9 pt trop étroit. Corrigé.
  - Passage 3 (variante sans record) : même mise en page, l'emplacement de la pastille reste vide ; libellé du bouton de partage à 187 pt de large, comme la maquette.
  - Écarts restants : aucun notable. La pastille est plus courte que sur la maquette (texte plus court). Tout l'écran est environ 15 pt plus bas que sur la maquette, à cause de la zone sûre plus haute du simulateur.
  - Volontairement absents : « Défi du mardi 6 octobre », « Partie libre », « Retour à l'accueil ».
- **Écran de jeu : 2 captures** comparées à `jeu.png` (`jeu-entete-1.png`, `jeu-entete-2.png`) : la pastille « Série ×2 » et « Meilleur » ont été descendues de 2 à 3 pt après la première ; elles sont à leur place sur la seconde. Le reste de l'écran n'a pas bougé.
- **Plateau avec les grandes pièces : 1 capture** (`jeu-grandes-pieces.png`) : `v5`, `h5` et `sq3` tiennent dans leur emplacement avec une marge.

### Proposition de stories détaillées pour le sprint suivant (Tutoriel interactif)
- **K-27a — Stockage « tutoriel vu »** : reprendre le commit de la branche `sprint/tutorial`.
- **K-27b — Étapes guidées** : maquettes `tuto-1a` à `tuto-3` ; une grille réduite et une pièce imposée par étape, avec le moteur et le glisser-déposer du jeu.
- **K-27c — Enchaînement** : écran de lancement, puis tutoriel au premier lancement, sinon écran de jeu ; « Passer » marque le tutoriel comme vu.
- Points à trancher : le moteur suppose aujourd'hui une grille 8 × 8 ; un tutoriel sur une grille plus petite demande de le rendre paramétrable, ou de garder la grille 8 × 8 avec des cases préremplies.

### Validation
Sprint validé par Moussa, qui a déroulé la liste de contrôle sur son téléphone. Les écarts sont acceptés, sauf l'échelle des pièces du plateau (K-32), remplacée par une échelle unique. Branche `sprint/end-screen` fusionnée dans `main` par l'agent, sur autorisation ponctuelle.
