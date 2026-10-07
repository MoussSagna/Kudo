# Sprint en cours : Écran de jeu, partie 2 — jouable

**But** : on peut jouer une partie complète au doigt, du premier coup à la fin de partie.
**Hors périmètre** : sons, vibrations, animations d'effacement, meilleur score, sauvegarde, écran de fin de partie définitif, en-tête (retour, pause). Ils viennent dans les sprints suivants.
**Branche** : `sprint/game-screen-2`

**Règles communes**
- Toute règle de jeu passe par `applyMove` et `canPlace`. L'interface ne recalcule jamais une règle elle-même.
- Le glisser se fait sur le fil d'interface avec `react-native-gesture-handler` et `react-native-reanimated` : aucun `setState` à chaque image pendant le geste.
- `GestureHandlerRootView` à la racine de l'app.

## Stories

- [x] **K-11 — Glisser une pièce**
  - Chaque pièce du plateau se saisit au doigt et suit le geste.
  - À la saisie, la pièce passe de sa taille de plateau à la taille des cases de la grille, et se place au-dessus du doigt (décalage vertical d'environ 70 pt) pour rester visible.
  - Une seule pièce à la fois. Un emplacement vide du plateau ne réagit pas.
  - Hook `useGame` dans `src/hooks/` : il détient l'état du jeu et expose l'action de pose.

- [x] **K-12 — Aperçu sur la grille**
  - Une fonction pure et testée convertit la position de la pièce à l'écran en case de grille (colonne, ligne) pour son coin haut-gauche, avec arrondi à la case la plus proche. Tests : centre d'une case, bord entre deux cases, hors grille.
  - Pendant le geste, si la pièce peut être posée à la case visée, ses cases s'affichent en transparence sur la grille. Sinon, aucun aperçu.
  - L'aperçu ne se met à jour que lorsque la case visée change.

- [x] **K-13 — Pose et retour**
  - Au relâchement sur une position valide : la pièce se pose exactement là où l'aperçu l'indiquait, via `applyMove`.
  - Au relâchement ailleurs ou sur une position invalide : la pièce revient à sa place dans le plateau avec un ressort court.
  - Geste annulé par le système : même retour au plateau.

- [x] **K-14 — Effacement, score, nouveau tirage, fin**
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

### Branche
`sprint/game-screen-2`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### Ce qui a été livré
- **K-11** `src/components/DraggablePiece.tsx` : chaque pièce du plateau suit le doigt, passe à la taille des cases de la grille et se place 70 pt au-dessus du doigt. Une seule pièce à la fois. Hook `src/hooks/useGame.ts` (état du jeu, `place`, `restart`). `GestureHandlerRootView` à la racine.
- **K-12** `src/game/targetCell.ts` : conversion position à l'écran → case de grille, testée. Aperçu translucide sur la grille quand la pose est possible ; il n'est recalculé que lorsque la case visée change.
- **K-13** pose via `applyMove` à la case de l'aperçu ; retour au plateau avec un ressort court si la position est invalide, hors grille, ou si le geste est annulé.
- **K-14** l'écran reflète l'état après chaque pose ; en fin de partie, les pièces ne se saisissent plus et le bandeau provisoire `GameOverBanner` affiche « Partie terminée », le score et « Rejouer ».
- Documents : précision « une ligne ou une colonne » dans `docs/SPEC.md` ; K-16 à K-18 déplacées dans « Écran de jeu, partie 3 — sensations ».

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 68 tests réussis.
- `npx expo start --ios`, puis dérouler la liste de contrôle ci-dessous.
- **Vérifié par l'agent** : `npm run check`, `expo-doctor`, et l'affichage au repos sur le simulateur iOS (iPhone 18 Pro, Expo Go) pour trois états : la partie de la maquette, la partie à un coup de la fin, la partie terminée avec son bandeau.
- **Non vérifié par l'agent** : tout ce qui demande un geste. Le glisser-déposer, l'aperçu, la pose, le retour au plateau, l'effacement en jouant et le bouton « Rejouer » n'ont été exécutés par personne. Seule la logique sous-jacente (`targetCell`, `canPlace`, `applyMove`) est couverte par des tests.

### Liste de contrôle du glisser-déposer, à dérouler à la main
Lancer avec `EXPO_PUBLIC_SAMPLE_GAME=1 npx expo start --ios` pour les points 1 à 9 (partie de la maquette : pièces `L_d`, `sq2`, `v3`).

1. **Saisie** — poser le doigt sur une pièce du plateau et commencer à glisser. *Attendu* : la pièce suit le doigt sans retard ni saccade ; elle grossit jusqu'à la taille des cases de la grille en un instant (environ 0,1 s).
2. **Décalage au-dessus du doigt** — pendant le glisser. *Attendu* : la pièce reste visible, environ 70 pt au-dessus du doigt, et passe au-dessus de la grille et du plateau sans être masquée.
3. **Une seule pièce** — pendant qu'une pièce est tenue, toucher une autre pièce avec un second doigt. *Attendu* : la seconde ne bouge pas. Toucher un emplacement vide du plateau : rien ne se passe.
4. **Aperçu** — amener la pièce au-dessus de cases vides. *Attendu* : ses cases apparaissent en transparence sur la grille, alignées sur les cases ; l'aperçu saute d'une case à l'autre et ne tremble pas quand on bouge de quelques points.
5. **Pas d'aperçu** — amener la pièce sur des cases occupées, ou hors de la grille. *Attendu* : aucun aperçu.
6. **Pose valide** — relâcher quand l'aperçu est visible. *Attendu* : la pièce se pose exactement sur les cases de l'aperçu, dans sa couleur ; son emplacement du plateau reste vide ; le score augmente du nombre de cases (4 pour `L_d` ou `sq2`, 3 pour `v3`).
7. **Pose invalide** — relâcher sur des cases occupées, sur le plateau, ou hors de la grille. *Attendu* : la pièce revient à sa place dans le plateau, à sa petite taille, avec un ressort court ; le score ne change pas.
8. **Pose sur le bord** — poser `v3` dans la colonne de droite, puis essayer de la faire dépasser d'une case à droite ou en bas. *Attendu* : contre le bord, l'aperçu s'affiche et la pose réussit ; en dépassant de plus d'une demi-case, pas d'aperçu et retour au plateau.
9. **Nouveau tirage** — poser les trois pièces. *Attendu* : dès la troisième pose, trois nouvelles pièces apparaissent dans le plateau, à leur taille normale et à leur place.
10. **Effacement d'une ligne** — en partie normale, compléter une ligne. *Attendu* : la ligne se vide d'un coup (sans animation) ; le score augmente des cases posées plus 10.
11. **Effacement d'une colonne** — compléter une colonne. *Attendu* : même comportement, plus 10.
12. **Ligne et colonne ensemble** — compléter une ligne et une colonne avec la même pièce. *Attendu* : les deux se vident ensemble, y compris la case au croisement ; plus 40.
13. **Série** — effacer avec deux poses de suite. *Attendu* : le second effacement d'une ligne rapporte 20 au lieu de 10. Après une pose sans effacement, le suivant rapporte de nouveau 10.
14. **Fin de partie** — voir la section suivante. *Attendu* : le bandeau « Partie terminée » s'affiche avec le score ; les pièces restantes ne se saisissent plus.
15. **Rejouer** — toucher « Rejouer ». *Attendu* : le bandeau disparaît, la grille est vide, le score vaut 0, trois nouvelles pièces sont proposées et se saisissent normalement.
16. **Geste annulé** — pendant un glisser, faire apparaître le centre de notifications ou recevoir un appel. *Attendu* : la pièce revient au plateau et l'aperçu disparaît.

### Comment provoquer rapidement une fin de partie
- `EXPO_PUBLIC_SAMPLE_GAME=end npx expo start --ios` : la grille est presque pleine, le plateau contient un point jaune, un carré et une barre de trois. **Poser le point jaune dans la case libre du coin en haut à gauche** : rien ne s'efface, les deux autres pièces n'ont plus de place, la partie se termine avec 481 points. (Le poser sur une case libre des lignes 2, 4, 6 ou 8 efface au contraire une ligne et une colonne, et la partie continue.)
- `EXPO_PUBLIC_SAMPLE_GAME=over npx expo start --ios` : la partie est déjà terminée, pour voir directement le bandeau et tester « Rejouer ».
- Ces variables ne sont lues qu'en développement. Si un serveur Expo tourne déjà, l'arrêter d'abord : la variable est lue au démarrage du serveur.

### Dépendances ajoutées et pourquoi
- `react-native-gesture-handler` ~2.32.0 : le glisser-déposer (déjà dans la « Stack imposée »).

### Écarts par rapport au plan
- **Exception de lint** : une ligne `eslint-disable-next-line react-hooks/refs` dans `DraggablePiece.tsx`. La règle signale la lecture d'une référence « pendant le rendu », alors que la mesure n'a lieu qu'au début du geste, sur le fil d'interface. C'est un faux positif ; l'alternative était de renommer les variables pour tromper la règle.
- **Décalage de 70 pt** : il s'ajoute à la position de saisie. Si l'on attrape la pièce par un coin, elle garde ce décalage par rapport au doigt ; elle n'est pas recentrée sous le doigt.
- **Pose sans transition** : au relâchement sur une position valide, la pièce passe directement de sa position sous le doigt à ses cases (jusqu'à une demi-case d'écart). L'animation de pose est prévue en K-18.
- **Bandeau de fin** : il se superpose au centre de l'écran et masque une partie de la grille. C'est provisoire.
- **Trois états d'exemple** au lieu d'un : la maquette (`1`), un coup avant la fin (`end`), partie terminée (`over`). Le dernier n'était pas demandé ; il a permis de vérifier l'affichage du bandeau sans geste.
- **Captures** : la première tentative a dépassé le délai de la commande (trois démarrages de serveur à la suite) et s'est terminée en arrière-plan ; les trois captures sont valides.
- **Android** : non testé. L'ordre d'affichage de la pièce tenue au-dessus de la grille repose sur `zIndex`, à vérifier sur Android.

### Passages de la boucle d'intégration et écarts restants, par écran
- **Écran de jeu au repos : 1 passage** (`jeu-repos-1.png`, état de la maquette). Rien n'a bougé par rapport à la capture validée au sprint précédent (`jeu-3.png`) : mêmes positions pour le score, la grille et le plateau. Écarts restants inchangés (libellé « SCORE » environ 1,5 pt trop large ; différences dues à la taille d'écran du simulateur).

### Proposition de stories détaillées pour le sprint suivant (Écran de jeu, partie 3 — sensations)
- Préalable : installer `expo-audio` et `expo-haptics` avec `npx expo install`.
- **K-16 — Sons** : hook `useSounds` ; prise, pose, refus (retour au plateau), effacement, combo (2 lignes ou plus, ou série), fin de partie. Les sons sont préchargés au lancement.
- **K-17 — Vibrations** : légère à la prise et à la pose, plus marquée à l'effacement, d'erreur au refus.
- **K-18 — Animations** : la pièce glisse jusqu'à ses cases à la pose ; les lignes effacées disparaissent en fondu ou en échelle avant de se vider ; respect de « réduire les animations ».
- Points à trancher : faut-il afficher « Série ×2 » dans ce sprint, puisque le combo devient audible ? Les réglages son et vibrations (K-28) arrivent plus tard : tout est-il actif par défaut d'ici là ?
