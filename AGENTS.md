# Kubo — consignes pour l'agent

Kubo est un block puzzle mobile avec un défi quotidien. Lis ce fichier en entier avant toute action.

## À lire avant de coder
1. `docs/SPEC.md` : les règles du jeu. C'est la référence, ne les invente pas.
2. `docs/BACKLOG.md` : toutes les stories, par sprint.
3. `docs/SPRINT.md` : le sprint en cours. **C'est le seul périmètre autorisé.**
4. `assets/README.md` : le pack d'assets déjà fourni.

## Méthode de travail (agile) — règles strictes
- Tu ne travailles que sur les stories listées dans `docs/SPRINT.md`. Jamais sur un sprint futur, même si ça te semble plus rapide.
- Une story à la fois, dans l'ordre. Pour chaque story :
  1. relis ses critères d'acceptation ;
  2. code le minimum qui les satisfait ;
  3. écris ou mets à jour les tests ;
  4. lance `npm run check` (types + lint + tests) ;
  5. coche la story dans `docs/SPRINT.md` et fais un commit `feat(K-xx): ...`.
- Quand toutes les stories du sprint sont cochées : remplis la section « Revue de sprint » de `docs/SPRINT.md`, puis **arrête-toi et attends la validation de Moussa**. Ne démarre pas le sprint suivant de toi-même.
- Si une story est ambiguë, bloquée, ou contredit `docs/SPEC.md` : ne devine pas. Note la question dans « Questions ouvertes » de `docs/SPRINT.md` et passe à la story suivante si elle est indépendante, sinon arrête-toi.
- Une idée hors périmètre va dans « Idées » en bas de `docs/BACKLOG.md`. Elle ne se code pas.
- Tu ne modifies pas `docs/SPEC.md` ni l'ordre du backlog sans accord.

## Définition de terminé (Definition of Done)
Une story est terminée quand :
- tous ses critères d'acceptation sont vérifiés ;
- `npm run check` passe sans erreur ni avertissement ;
- la logique de jeu ajoutée est couverte par des tests ;
- l'app se lance dans Expo Go sans erreur ni warning rouge ;
- aucun code mort, `any`, `console.log` ou TODO n'est laissé.

## Stack imposée
- Expo (dernière version stable du SDK), TypeScript en mode `strict`.
- `react-native-gesture-handler` + `react-native-reanimated` pour le glisser-déposer et les animations.
- `@react-native-async-storage/async-storage` pour la sauvegarde.
- `expo-audio` pour les sons, `expo-haptics` pour les vibrations.
- Jest pour les tests.
- Pas de moteur de jeu, pas de backend, pas de librairie d'état global. Toute nouvelle dépendance doit être justifiée dans la revue de sprint.
- Installe les paquets Expo avec `npx expo install` pour avoir des versions compatibles.

## Architecture
```
assets/            images et sons du pack (ne pas regénérer)
src/
  game/            logique pure : aucune importation de React ou React Native
  components/      composants d'affichage (Grid, Block, PieceView, Tray...)
  screens/         écrans
  hooks/           hooks (useGame, useSounds...)
  storage/         lecture / écriture AsyncStorage
  theme.ts         palette et assets (fourni dans le pack)
  game/pieces.ts   formes et aléatoire à graine (fourni dans le pack)
```
- La règle la plus importante : `src/game/` ne contient que des fonctions pures et testables (état en entrée, nouvel état en sortie, pas de mutation). L'interface ne fait qu'afficher cet état.
- L'aléatoire passe toujours par un `rng` injecté, jamais par `Math.random()` dans `src/game/`.
- Textes de l'interface en français, code et commits en anglais.

## Scripts attendus dans package.json
- `npm run start` : lance Expo
- `npm run check` : `tsc --noEmit`, lint, puis tests
