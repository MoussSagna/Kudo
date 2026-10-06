# Sprint en cours : Sprint 0 — Socle

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

- [ ] **K-03 — Outillage qualité**
  - ESLint configuré avec la config Expo.
  - Jest configuré (`jest-expo`), avec un test sur `createRng` : même graine, même suite.
  - `npm run check` enchaîne types, lint et tests, et passe.

- [ ] **K-04 — Écran titre**
  - Un écran unique avec le fond en dégradé (`UI.backgroundTop` vers `UI.background`) et le titre « Kubo » centré.
  - Respect des zones sûres (encoche, barre du bas).
  - Barre d'état en clair sur fond sombre.

## Questions ouvertes
_L'agent note ici ce qui le bloque._
- **K-02 — `expo-splash-screen` ajouté sans validation préalable.** Avec le SDK 57, la clé `splash` de `app.json` n'existe plus pour iOS/Android : le splash se configure uniquement par le plugin `expo-splash-screen`, absent du modèle `blank-typescript`. Il a été installé pour satisfaire le critère « splash avec le fond `#12162B` ». À confirmer par Moussa (et à ajouter à la « Stack imposée » si accepté).

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
- Dépendances ajoutées et pourquoi :
- Écarts par rapport au plan :
- Proposition de stories détaillées pour le sprint suivant :
