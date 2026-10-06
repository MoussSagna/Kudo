# Sprint 0 — Socle (archivé)

**But** : un projet propre, qui démarre dans Expo Go et affiche l'écran titre.
**Hors périmètre** : toute logique de jeu, la grille, les pièces, les gestes.

## Stories

- [x] **K-01 — Créer le projet**
  - Projet Expo avec le modèle TypeScript, `strict: true` dans `tsconfig.json`.
  - Arborescence `src/` créée comme décrit dans `AGENTS.md`.
  - `npm run start` lance l'app sans erreur.

- [x] **K-02 — Intégrer les assets et configurer l'app**
  - `images/` et `sounds/` du pack sont dans `assets/`, le README du pack dans `assets/README.md`.
  - `theme.ts` est dans `src/`, `pieces.ts` dans `src/game/`, imports corrigés en conséquence.
  - `app.json` : `name` Kubo, `slug` kubo, orientation portrait, icône, icône adaptative et splash avec le fond `#12162B`.
  - L'icône et le splash s'affichent correctement.

- [x] **K-03 — Outillage qualité**
  - ESLint configuré avec la config Expo.
  - Jest configuré (`jest-expo`), avec un test sur `createRng` : même graine, même suite.
  - `npm run check` enchaîne types, lint et tests, et passe.

- [x] **K-04 — Écran titre**
  - Un écran unique avec le fond en dégradé (`UI.backgroundTop` vers `UI.background`) et le titre « Kubo » centré.
  - Respect des zones sûres (encoche, barre du bas).
  - Barre d'état en clair sur fond sombre.

## Questions ouvertes
- **K-02 — `expo-splash-screen` ajouté sans validation préalable.** Avec le SDK 57, la clé `splash` de `app.json` n'existe plus pour iOS/Android : le splash se configure uniquement par le plugin `expo-splash-screen`, absent du modèle `blank-typescript`. Il a été installé pour satisfaire le critère « splash avec le fond `#12162B` ». **Résolu** : `expo-splash-screen` est autorisé par Moussa dans le Sprint 0 bis (K-31a).

## Revue de sprint
### Ce qui a été livré
- **K-01** : projet Expo SDK 57 (modèle `blank-typescript`, sans expo-router), `strict: true`, arborescence `src/` (`game/`, `components/`, `screens/`, `hooks/`, `storage/`), `AGENTS.md` déplacé à la racine.
- **K-02** : `images/`, `sounds/`, `README.md` et `preview.png` du pack dans `assets/` ; `theme.ts` dans `src/`, `pieces.ts` dans `src/game/` (import `../theme`) ; `app.json` configuré (Kubo / kubo / portrait / icône / icône adaptative / splash / favicon, fond `#12162B`) ; `block-puzzle-assets/` supprimé. Aucun asset modifié.
- **K-03** : ESLint (config Expo), Jest (`jest-expo`), 3 tests sur `createRng`, `npm run check` = `tsc --noEmit` + lint + tests.
- **K-04** : écran titre `src/screens/TitleScreen.tsx` (dégradé `UI.backgroundTop` → `UI.background`, titre « Kubo » centré, zones sûres, barre d'état claire).

### Comment le vérifier
- `npm run check` : doit se terminer sans erreur ni avertissement, avec 3 tests réussis.
- `npm run start`, puis scanner le QR code avec Expo Go (téléphone sur le même Wi-Fi).
- À l'écran : fond en dégradé du bleu nuit (`#1E2550`, en haut) vers le bleu très sombre (`#12162B`, en bas), le mot « Kubo » en blanc, gras, centré ; heure et icônes de la barre d'état en blanc ; rien d'autre. Aucun écran rouge, aucun avertissement jaune.
- Vérifié par l'agent : `npm run check`, `npx expo-doctor` (21/21), démarrage de Metro, compilation des bundles iOS et Android (`expo export`), résolution de la config native (`expo config --type prebuild`).
- **Non vérifié par l'agent** : l'affichage réel sur téléphone (à confirmer par Moussa).

### Dépendances ajoutées et pourquoi
- `expo-linear-gradient` : fond en dégradé de K-04 (validé, ajouté à la « Stack imposée »).
- `react-native-safe-area-context` : zones sûres de K-04 (validé, ajouté à la « Stack imposée »).
- `expo-splash-screen` : seul moyen de configurer le splash avec le SDK 57 (**non validé au préalable**, voir « Questions ouvertes »).
- Développement : `eslint`, `eslint-config-expo`, `jest`, `jest-expo`, `@types/jest` (outillage demandé par K-03).

### Écarts par rapport au plan
- **Icône et splash (K-02)** : vérifiés uniquement côté configuration. Expo Go n'affiche ni l'icône ni le splash personnalisés ; ils ne seront visibles que dans un build (K-30) ou un development build.
- **`expo-splash-screen`** installé sans validation préalable (voir « Questions ouvertes »).
- **Fichiers du modèle Expo** : son `AGENTS.md`, sa `LICENSE` et son dossier `.claude/` ont été écartés pour ne pas écraser les consignes du projet ; son `CLAUDE.md` (une ligne, `@AGENTS.md`) a été conservé pour que l'agent charge `AGENTS.md` automatiquement.
- **`.gitignore`** : remplacé par celui du modèle Expo, qui contient les quatre entrées demandées et quelques autres (`ios/`, `android/`, fichiers de clés...).
- **`tsconfig.json`** : `"types": ["jest"]` ajouté, nécessaire avec TypeScript 6 pour que les tests soient typés.
- **`src/`** : les dossiers encore vides (`components/`, `hooks/`, `storage/`) contiennent un `.gitkeep` pour exister dans Git.
- **Dépôt distant** : il s'appelle `Kudo` (avec un d) alors que le jeu s'appelle Kubo ; utilisé tel que fourni.

### Proposition de stories détaillées pour le sprint suivant (Sprint 1)
- **K-05 — Types et état de jeu**
  - `src/game/state.ts` : types `Grid` (8×8, case = `BlockColor | null`) et `GameState` (grille, plateau de 3 emplacements, score, série, nombre de tirages, fin de partie).
  - `createGame(seed)` renvoie une grille vide, un plateau de 3 pièces, un score de 0 et une série à 1.
  - Tests : même graine → même plateau ; grille vide 8×8.
- **K-06 — `canPlace` et `placePiece`**
  - `canPlace(grid, piece, col, row)` : faux si une case sort de la grille ou tombe sur une case occupée.
  - `placePiece` renvoie une nouvelle grille sans muter l'ancienne.
  - Tests : bords, coins, chevauchement, non-mutation.
- **K-07 — `clearLines`**
  - Lignes et colonnes pleines détectées avant tout effacement, puis vidées ensemble.
  - Renvoie la nouvelle grille et le nombre `n` de lignes + colonnes vidées.
  - Tests : une ligne, une colonne, croisement ligne + colonne, aucun effacement.
- **K-08 — Score et série**
  - +1 par case posée ; `10 × n × n` par effacement ; multiplicateur de série selon `docs/SPEC.md` ; série remise à 1 après une pose sans effacement.
  - Tests : les exemples de la spec (1 → 10, 2 → 40, 3 → 90) et une série de 2 puis 3.
- **K-09 — `hasAnyMove` et fin de partie**
  - Vrai si au moins une pièce restante du plateau peut être posée quelque part.
  - L'état passe en fin de partie quand c'est faux ; nouveau tirage de 3 pièces quand le plateau est vide (avec le même `rng`).
  - Tests : grille vide, grille pleine, une seule place possible.
- **K-10 — Affichage de la grille et du plateau**
  - Composants `Grid`, `Block`, `PieceView`, `Tray` ; grille carrée centrée, taille de case calculée depuis la largeur de l'écran.
  - Images depuis `src/theme.ts` uniquement, aucune interaction.
- **Point à trancher avant K-08** : la spec dit « efface au moins une ligne » pour la série ; je comprends « au moins une ligne ou colonne ». À confirmer.
