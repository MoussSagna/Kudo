# Pack d'assets — Block puzzle quotidien

Assets pour un jeu React Native (Expo) : grille 8x8, pièces à glisser, défi du jour.

## Installation
- Copier `images/` et `sounds/` dans `assets/` du projet Expo.
- Copier `src/theme.ts` et `src/pieces.ts` dans `src/`.
- Dans `app.json` : `icon` -> `assets/images/app/icon.png`,
  `android.adaptiveIcon.foregroundImage` -> `adaptive-icon.png` avec `backgroundColor: "#12162B"`,
  splash -> `splash-icon.png` avec `backgroundColor: "#12162B"`, `web.favicon` -> `favicon.png`.

## Contenu
- `images/blocks/` : 7 blocs colorés + `cell_empty`, en 40 / 80 / 120 px (@1x, @2x, @3x). Fond transparent.
- `images/app/` : icône 1024, icône adaptative Android, logo de splash, favicon.
- `sounds/` : WAV mono 44,1 kHz — pick, place, invalid, clear, combo, gameover, highscore.
- `src/theme.ts` : palette, couleurs d'interface, `require` des images et sons, emojis de partage.
- `src/pieces.ts` : 31 formes de pièces, aléatoire à graine, graine du jour.
- `preview.png` : aperçu du rendu attendu (référence visuelle, pas un asset du jeu).

## Notes pour l'agent
- Les blocs sont des tuiles carrées : une pièce = plusieurs `Image` positionnées selon `cells` ([colonne, ligne]).
- Lire les sons avec `expo-audio`, vibrations avec `expo-haptics`.
- Défi du jour : `nextPieces(createRng(dailySeed()))`, appeler `nextPieces` avec le même `rng` à chaque nouveau tirage.
