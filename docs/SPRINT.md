# Sprint en cours : Écran de jeu, partie 3 — sensations

**But** : chaque action du joueur a une réponse visuelle, sonore et tactile.
**Hors périmètre** : meilleur score, sauvegarde, écran de fin définitif, en-tête, écran de réglages.
**Branche** : `sprint/game-screen-3`

**Règles communes**
- Les règles du jeu ne changent pas et restent dans `src/game/`. Si l'interface a besoin de savoir quelles lignes et colonnes viennent d'être effacées, exposer cette information par une fonction pure et testée, sans dupliquer la logique.
- Aucun effet ne bloque le jeu : on peut saisir la pièce suivante pendant une animation.
- Un module de préférences avec deux valeurs, sons et vibrations, à vrai par défaut. Tous les effets le consultent. L'écran de réglages les branchera plus tard.

## Stories

- [x] **K-18 — Animations**
  - Pose : la pièce glisse de sa position sous le doigt jusqu'à ses cases (90 ms environ), puis ses blocs font un léger rebond d'échelle.
  - Effacement : les cases de la ligne ou de la colonne s'illuminent brièvement, puis rétrécissent jusqu'à disparaître, avec un court décalage de case en case. 250 à 300 ms au total.
  - Score : le nombre fait une petite pulsation quand il change, et le gain d'un effacement apparaît en « +N » près des cases effacées, monte et s'estompe.
  - Nouveau tirage : les trois pièces apparaissent en grossissant, légèrement décalées.
  - Toutes les durées dans un objet de constantes unique.
  - « Réduire les animations » : pas de mouvement ni d'échelle, de simples fondus.

- [x] **K-16 — Sons**
  - `expo-audio`, sons du pack préchargés au démarrage de l'écran.
  - Saisie : pick. Pose valide : place. Retour au plateau : invalid. Effacement simple : clear. Effacement de 2 lignes ou plus, ou en série : combo. Fin de partie : gameover.
  - Une pose qui efface joue clear ou combo, pas place en plus.
  - Les sons respectent le mode silencieux de l'iPhone et ne coupent pas la musique de l'utilisateur.
  - Un échec de lecture ne doit jamais faire planter le jeu.

- [x] **K-17 — Vibrations**
  - `expo-haptics`. Saisie : légère. Pose valide : moyenne. Effacement : retour de type succès. Retour au plateau : avertissement. Fin de partie : forte.

## Vérification
- `npm run check` après chaque story.
- L'agent ne peut ni faire de geste, ni entendre, ni sentir une vibration : il ne déclare aucun de ces effets vérifié.
- Pour les animations : un mode de démonstration réservé au développement (`EXPO_PUBLIC_SAMPLE_GAME=demo`) rejoue automatiquement une courte suite de coups : une pose simple, un effacement de ligne, un effacement ligne + colonne, un nouveau tirage. Vidéo dans `docs/design/captures/game-demo.mov`, avec les instants de chaque coup. Quelques images extraites pour confirmer que les animations se déclenchent, sans juger leur qualité.
- Dans la revue : une liste de contrôle à dérouler à la main sur un vrai téléphone, avec pour chaque action le son et la vibration attendus.

## Questions ouvertes
_L'agent note ici ce qui le bloque._

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._

### Branche
`sprint/game-screen-3`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### Ce qui a été livré
- **K-18 — Animations** (`src/components/MoveEffects.tsx`, `ScoreHeader.tsx`, `DraggablePiece.tsx`) :
  - pose : la pièce glisse de l'endroit où elle a été relâchée jusqu'à ses cases (90 ms), puis ses blocs rebondissent (échelle 1,1) ;
  - effacement : les cases s'illuminent en blanc (90 ms), puis rétrécissent et s'effacent (150 ms), avec 8 ms de décalage de case en case, soit 300 ms au plus ;
  - score : pulsation à chaque changement ; le gain de l'effacement (« +10 », « +80 ») monte depuis la pièce posée et s'estompe ;
  - nouveau tirage : les trois pièces grossissent l'une après l'autre ;
  - toutes les valeurs sont dans l'objet `MOTION` de `src/motion.ts` ;
  - « réduire les animations » : aucune translation ni échelle, seulement des fondus.
- **Logique** : `playMove` (`src/game/moves.ts`) décrit un coup — lignes et colonnes effacées, grille avant effacement, points de pose et d'effacement. `applyMove` s'appuie dessus, sans logique dupliquée. `clearLines` renvoie aussi les index effacés.
- **K-16 — Sons** (`src/hooks/useSounds.ts`) : les six sons sont chargés au montage de l'écran. Saisie : pick ; pose : place ; retour au plateau : invalid ; effacement simple : clear ; 2 lignes ou plus, ou série : combo ; fin de partie : gameover. Le choix place / clear / combo est fait par la fonction pure `moveFeedback` (`src/game/feedback.ts`), testée.
- **K-17 — Vibrations** (`src/haptics.ts`) : saisie légère, pose moyenne, effacement « succès », retour au plateau « avertissement », fin de partie forte.
- **Préférences** (`src/storage/preferences.ts`) : `sounds` et `haptics`, à vrai par défaut, consultées avant chaque son et chaque vibration. Pas encore sauvegardées.
- **Mode démonstration** : `EXPO_PUBLIC_SAMPLE_GAME=demo` rejoue seul trois coups (`DEMO_GAME`, `DEMO_MOVES`, hook `useDemoMoves`).

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 80 tests réussis.
- Animations : `EXPO_PUBLIC_SAMPLE_GAME=demo npx expo start --ios` (arrêter d'abord tout serveur Expo en cours).
- Sons et vibrations : sur un vrai téléphone, avec la liste de contrôle ci-dessous.
- **Vérifié par l'agent** : `npm run check`, `expo-doctor` (21/21), et le déclenchement des animations sur le simulateur iOS à partir d'images extraites de la vidéo, en mode normal et avec « réduire les animations » (réglage remis à sa valeur d'origine). La démonstration se joue jusqu'au bout sans erreur avec les sons et les vibrations branchés.
- **Non vérifié par l'agent** : la qualité des animations ; tous les sons ; toutes les vibrations ; le mode silencieux ; la cohabitation avec la musique de l'utilisateur ; les effets déclenchés par un geste (saisie, retour au plateau). L'agent ne peut ni faire de geste, ni entendre, ni sentir une vibration.

### Vidéo de démonstration et instants de chaque coup
`docs/design/captures/game-demo.mov` (dossier ignoré par Git, présent uniquement sur ce Mac).

| Instant | Ce qui se passe | Images extraites : ce qu'elles montrent |
|---|---|---|
| 12,85 s | l'app apparaît, écran de lancement | — |
| 16,2 s | l'écran de jeu apparaît ; les trois pièces du plateau grossissent | — |
| 17,70 s | coup 1 : carré orange posé en haut à gauche, sans effacement | carré décalé d'une demi-case, puis sur ses cases, puis légèrement agrandi ; score 0 → 4 |
| 19,58 s | coup 2 : point jaune, la ligne du bas s'efface | cases blanchies de gauche à droite, puis réduites, puis vides ; « +10 » qui monte ; score 4 → 15, chiffres agrandis de 128 à 142 px puis revenus à 128 |
| 21,52 s | coup 3 : barre de deux, une ligne et une colonne s'effacent ensemble | ligne et colonne blanchies, puis réduites ; « +80 » qui monte ; score 15 → 97 |
| 21,6 à 22,1 s | nouveau tirage | les trois nouvelles pièces grossissent l'une après l'autre, de gauche à droite |

Ces images confirment que chaque animation se déclenche. **Leur rythme et leur rendu sont à juger par Moussa.**

### Liste de contrôle sons et vibrations, à dérouler à la main sur un vrai téléphone
Expo Go suffit. Monter le volume, désactiver le mode silencieux, vérifier que les vibrations système sont activées.

| # | Action | Son attendu | Vibration attendue |
|---|---|---|---|
| 1 | Saisir une pièce | pick | légère |
| 2 | La poser sur des cases vides, sans rien effacer | place | moyenne |
| 3 | La relâcher sur des cases occupées ou hors de la grille | invalid | avertissement (deux impulsions) |
| 4 | Compléter une ligne seule, sans effacement au coup précédent | clear, et pas place | succès |
| 5 | Compléter une colonne seule, sans effacement au coup précédent | clear | succès |
| 6 | Compléter une ligne et une colonne (ou deux lignes) avec la même pièce | combo | succès |
| 7 | Effacer une ligne juste après un coup qui avait déjà effacé | combo | succès |
| 8 | Poser sans effacer, puis effacer une ligne | clear (la série est retombée) | succès |
| 9 | Fin de partie (`EXPO_PUBLIC_SAMPLE_GAME=end`, point jaune en haut à gauche) | place, puis gameover une demi-seconde après | moyenne, puis forte |
| 10 | Toucher « Rejouer » | aucun | aucune |
| 11 | Activer le mode silencieux de l'iPhone, puis refaire 1 et 2 | aucun son | vibrations inchangées |
| 12 | Lancer de la musique (Musique, Spotify), puis jouer | les sons du jeu s'entendent par-dessus | la musique ne s'arrête pas et ne baisse pas |
| 13 | Enchaîner très vite saisie et pose | chaque son repart du début, sans blocage ni retard croissant | — |

À observer aussi pendant le jeu : on peut saisir la pièce suivante pendant qu'une ligne s'efface, sans attendre la fin de l'animation.

### Dépendances ajoutées et pourquoi
- `expo-audio` ~57.0.5 : les sons (dans la « Stack imposée »).
- `expo-haptics` ~57.0.3 : les vibrations (dans la « Stack imposée »).
- `expo-asset` ~57.0.19 : **non prévu**. `expo-audio` l'exige en dépendance directe ; sans lui, `expo-doctor` échoue et prévient que l'app peut planter hors d'Expo Go. À ajouter à la « Stack imposée » si Moussa confirme.

### Écarts par rapport au plan
- **`app.json`** : `npx expo install` a ajouté le plugin `expo-audio`. Il est configuré avec `microphonePermission: false`, `recordAudioAndroid: false` et `enableBackgroundPlayback: false`, pour que l'app ne demande ni micro ni lecture en arrière-plan.
- **Fin de partie** : le son et la vibration de fin arrivent 450 ms après ceux du dernier coup, pour ne pas se superposer.
- **Vibration d'un combo** : identique à celle d'un effacement simple (« succès »), la story ne distinguant pas les deux.
- **« +N »** : il affiche le gain de l'effacement seul (multiplicateur de série compris), sans les points de pose, et part du centre de la pièce posée.
- **Blocs de la dernière pièce posée** : ils sont dessinés par la couche d'animation jusqu'au coup suivant, à la même position et avec la même image que la grille.
- **Préférences** : en mémoire seulement ; la sauvegarde viendra avec l'écran de réglages (K-28).
- **Son `highscore`** : non utilisé (meilleur score hors périmètre).
- **Défaut d'affichage constaté, non corrigé** : une pièce de 5 blocs de haut (`v5`) occupe toute la hauteur du plateau et touche ses bords. Ce défaut date de K-10 et n'a pas été traité, car il sort du périmètre de ce sprint.
- **Android** : rien n'a été testé sur Android.

### Proposition de stories détaillées pour le sprint suivant (Fin de partie)
- **K-15 — Écran de fin de partie** : maquette `docs/design/resultat.png` ; remplace le bandeau provisoire ; score, bouton « Rejouer ».
- **K-19 — Meilleur score** : sauvegardé avec AsyncStorage, affiché sur l'écran de jeu (« Meilleur ») et sur l'écran de fin ; son `highscore` quand il est battu.
- **K-26 — Partage** : texte avec le nom du jeu, la date, le score et la grille finale en emojis.
- Points à trancher : corriger la pièce `v5` qui touche les bords du plateau dans ce sprint ou en K-29 ? Les emojis `cyan` et `blue` sont identiques dans `SHARE_EMOJI` (noté dans « Idées » du backlog).
