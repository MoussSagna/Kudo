# Tutoriel interactif (archivé)

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

- [x] **K-27f — Étape 3 et enchaînement**
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

## Revue de sprint
### Branche
`sprint/tutorial-interactive`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### Ce qui a été livré
- **Correctif K-32** `src/components/trayCellSize.ts` : toutes les pièces du plateau ont la même taille de bloc, la plus grande qui laisse au moins 8 pt de marge à `h5` et `v5` (20 pt sur un écran de 390 pt de large, 21 pt sur le simulateur). La hauteur du plateau ne dépend plus de la taille des blocs.
- **K-27a** `src/storage/tutorial.ts` : repris de `sprint/tutorial` par `git cherry-pick`, avec ses tests ; l'écriture ignore désormais une erreur, comme le meilleur score.
- **K-27d** étape 1 : grille préparée, pièce `L_d` seule au centre du plateau, flèche qui monte et descend, cases suggérées qui clignotent ; toute pose valide est acceptée ; puis « Bien joué ! », le texte, la pastille « +4 » et « Suivant ».
- **K-27e** étape 2 : pièce `h3`, ligne 6 encadrée en jaune, trois cases qui clignotent ; seule la pose qui complète la ligne est acceptée, les autres renvoient la pièce au plateau et affichent « Vise les trois cases vides de la ligne » ; puis l'effacement se joue, et « Ligne effacée ! », le texte, la pastille « +10 » et « Suivant ».
- **K-27f** étape 3 (carte « Défi du jour », bouton « C'est parti ») et enchaînement : écran de lancement, puis tutoriel s'il n'a jamais été vu, sinon écran de jeu. « Passer » et « C'est parti » marquent le tutoriel comme vu.
- **Règles du tutoriel** `src/game/tutorial.ts` : les deux étapes (`PLACE_STEP`, `CLEAR_STEP`) et la fonction pure `isTutorialMoveAccepted`, testées. Les coups passent par `playMove` / `applyMove`.
- **Réutilisation** : le tutoriel emploie `Grid`, `Tray`, `DraggablePiece`, `MoveEffects`, les sons et les vibrations du jeu. Pour cela, trois hooks ont été extraits de l'écran de jeu : `usePieceDrag`, `useFeedback`, `useBoardLayout`. Aucun composant de jeu n'est dupliqué.
- Le tutoriel a son propre état de partie : il ne lit ni n'écrit le meilleur score, et ses statistiques ne sortent pas de l'étape.

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 120 tests réussis.
- Outils de développement (arrêter d'abord tout serveur Expo en cours) : `EXPO_PUBLIC_TUTORIAL=1a`, `1b`, `2a`, `2b` ou `3` ouvre directement cet état ; `EXPO_PUBLIC_TUTORIAL=1` rejoue le tutoriel depuis le début même s'il a déjà été vu.
- **Vérifié par l'agent** : `npm run check`, `expo-doctor`, l'affichage des cinq états sur le simulateur iOS, et le premier lancement sans aucun réglage (le tutoriel s'ouvre après l'écran de lancement).
- **Non vérifié par l'agent** : tous les gestes (poser la pièce aux étapes 1 et 2, la mauvaise pose et son aide), les boutons « Suivant », « Passer » et « C'est parti », le passage à l'écran de jeu, l'absence du tutoriel au second lancement, la reprise au début après une fermeture, et le mode « réduire les animations » du tutoriel. Seules les règles et le stockage sont couverts par des tests.

### Liste de contrôle à dérouler à la main
Pour repartir d'un « premier lancement » : désinstaller Expo Go ou effacer ses données, ou lancer avec `EXPO_PUBLIC_TUTORIAL=1`.

| # | Action | Ce que tu dois observer |
|---|---|---|
| 1 | Premier lancement | Écran de lancement, puis étape « 1 / 3 » : la flèche bouge, quatre cases clignotent sur la grille |
| 2 | Étape 1 : poser la pièce sur les cases qui clignotent | Aperçu, pose, son et vibration du jeu ; puis « Bien joué ! », pastille « +4 », bouton « Suivant » à la place du plateau |
| 3 | Étape 1 (en la rejouant) : poser la pièce ailleurs, à un endroit libre | Acceptée aussi, même suite |
| 4 | Étape 1 : relâcher la pièce sur des cases occupées | Retour au plateau, son de refus ; l'étape continue |
| 5 | Toucher « Suivant » | Étape « 2 / 3 » : ligne encadrée en jaune, trois cases qui clignotent, deuxième point de progression allumé |
| 6 | Étape 2 : poser la barre ailleurs que dans la ligne (par exemple en haut de la grille) | Retour au plateau comme une pose invalide ; l'aide « Vise les trois cases vides de la ligne » apparaît au-dessus du plateau |
| 7 | Étape 2 : poser la barre dans les trois cases vides | La ligne s'illumine et s'efface, « +10 » monte ; puis « Ligne effacée ! », bande claire sur la ligne, pastille « +10 », bouton « Suivant » |
| 8 | Toucher « Suivant » | Étape « 3 / 3 » : carte « Défi du jour », bouton « C'est parti » |
| 9 | Toucher « C'est parti » | Écran de jeu, partie neuve : score 0, grille vide, « Meilleur » inchangé |
| 10 | Fermer complètement l'app, la rouvrir | Écran de lancement, puis directement l'écran de jeu : plus de tutoriel |
| 11 | Rejouer le tutoriel (`EXPO_PUBLIC_TUTORIAL=1`), toucher « Passer » à l'étape 1 | Écran de jeu avec une partie neuve |
| 12 | Même chose en touchant « Passer » à l'étape 2, puis à l'étape 3 | Écran de jeu à chaque fois |
| 13 | Sur un premier lancement réel, faire l'étape 1, fermer l'app à l'étape 2, la rouvrir | Le tutoriel reprend à l'étape « 1 / 3 » |
| 14 | Après le tutoriel, battre un record dans une partie | Le tutoriel n'a laissé aucun score : « Meilleur » ne reflète que les vraies parties |
| 15 | Activer « Réduire les animations » dans les réglages du téléphone, relancer le tutoriel | La flèche ne bouge pas, les cases suggérées restent affichées sans clignoter |

### Dépendances ajoutées et pourquoi
- Aucune.

### Écarts par rapport au plan
- **Conflit du `cherry-pick` de K-27a** : un seul, dans `docs/SPRINT.md` (l'ancien commit cochait une case de l'ancien fichier de sprint). Le fichier actuel a été gardé et K-27a y a été cochée. Le code et les tests se sont appliqués sans conflit. `markTutorialSeen` a ensuite été modifiée pour ignorer une erreur d'écriture, avec un test en plus.
- **Taille des pièces dans le plateau du tutoriel** : 21 pt par bloc, contre 30 pt sur les maquettes, conséquence de l'échelle unique décidée pour K-32.
- **Couleurs** : `L_d` est orange (maquette : bleue), d'où des cases suggérées orange à l'étape 1 ; écart accepté d'avance.
- **Aide de l'étape 2** : elle s'affiche au-dessus du plateau, en jaune ; les maquettes ne montrent pas cet état. Elle apparaît quand la pièce est relâchée sur une case de la grille qui ne convient pas, pas quand elle est relâchée hors de la grille.
- **Message de réussite** : il attend la fin des animations du coup (environ 0,2 s à l'étape 1, 0,5 s à l'étape 2), puis apparaît en fondu. Le « +10 » animé du jeu et la pastille fixe « +10 » se suivent.
- **Icônes** : la coche, l'horloge, les personnages et l'icône de partage sont dessinés avec des vues, faute de librairie d'icônes ; ils sont plus simples que sur les maquettes.
- **Étape 3** : son bouton est 5 pt plus haut que sur la maquette, pour rester hors de la zone de l'indicateur d'accueil.
- **Passage du tutoriel au jeu** : l'écran de jeu remplace le tutoriel sans transition.
- **Branche `sprint/tutorial`** : rien d'autre n'en a été repris ; les composants de l'étape 3 ont été réécrits.
- **Captures** : le bouton bleu d'Expo Go masque « Passer » sur les captures du simulateur ; ce n'est pas un défaut de l'app.
- **Android** : rien n'a été testé.

### Passages de la boucle d'intégration et écarts restants, par écran
- **Étape 1a : 2 passages** (`tuto-1a-1.png`, `tuto-1a-2.png`). Passage 1 : grille 3 pt trop bas, sous-titre 8 pt trop large. Passage 2 : corrigés. Écarts restants : aucun notable, hors taille et couleur de la pièce.
- **Étape 1b : 2 passages** (`tuto-1b-1.png`, `tuto-1b-2.png`). Passage 1 : coche trop fine, pastille « +4 » 5 pt trop étroite. Passage 2 : corrigés. Écarts restants : aucun notable.
- **Étape 2a : 1 passage** (`tuto-2a-1.png`). Conforme : titre, texte sur deux lignes, cadre jaune, cases suggérées, plateau, flèche, points de progression.
- **Étape 2b : 1 passage** (`tuto-2b-1.png`). Conforme : coche, titre, bande claire, pastille « +10 », bouton.
- **Étape 3 : 1 passage** (`tuto-3-1.png`). Conforme : carte (308 × 266 pt pour 310 × 270), semaine, trois lignes, titre, texte, points, bouton. Écart restant : icônes simplifiées.
- **Écran de jeu : 1 capture** (`jeu-echelle-unique.png`) après le correctif K-32 : `v5`, `h5` et `sq3` ont la même taille de bloc et tiennent avec une marge.

### Proposition de stories détaillées pour le sprint suivant (Accueil)
- **K-24 — Écran d'accueil** : maquette `docs/design/accueil.png` ; défi du jour, partie libre, série, meilleur score.
- **K-25 — Partie libre** : lancée depuis l'accueil ; l'en-tête de l'écran de jeu reçoit enfin son bouton retour, et l'écran de résultat ses boutons « Partie libre » et « Retour à l'accueil ».
- Points à trancher : l'accueil sans le défi du jour (prévu au sprint suivant) affiche-t-il déjà sa carte, ou seulement la partie libre ? Faut-il une petite navigation entre accueil, jeu et résultat, toujours sans librairie ?

### Validation
Sprint validé par Moussa, qui a déroulé la liste de contrôle sur son téléphone. Les écarts sont acceptés. Branche `sprint/tutorial-interactive` fusionnée dans `main` par l'agent, sur autorisation ponctuelle.
