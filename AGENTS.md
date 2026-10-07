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

### Branches
- Ne committe jamais directement sur `main`.
- Au début de chaque sprint, crée une branche depuis `main` à jour : `git checkout main && git pull && git checkout -b sprint/<nom-du-sprint>` (exemples : `sprint/0-bis-2-launch-animation`, `sprint/1-grid-and-rules`).
- Tous les commits du sprint, y compris ceux de documentation, vont sur cette branche. Pousse-la avec `git push -u origin <branche>` après chaque story.
- En fin de sprint, ne fusionne pas toi-même. Indique dans la revue de sprint le nom de la branche et arrête-toi : c'est Moussa qui fusionne dans `main` après validation.
- Si tu constates que tu es sur `main` au moment de committer, arrête-toi et crée la branche avant de continuer.
- Jamais de `git push --force`, ni de réécriture d'historique sur une branche poussée.

## Définition de terminé (Definition of Done)
Une story est terminée quand :
- tous ses critères d'acceptation sont vérifiés ;
- `npm run check` passe sans erreur ni avertissement ;
- la logique de jeu ajoutée est couverte par des tests ;
- l'app se lance dans Expo Go sans erreur ni warning rouge ;
- aucun code mort, `any`, `console.log` ou TODO n'est laissé.

## Intégration des écrans

Les maquettes de référence sont dans `docs/design/` (un PNG par écran, 390 × 844).
Pour toute story qui crée ou modifie un écran, applique cette boucle :

1. Ouvre la maquette correspondante et liste ce que tu vois : structure, espacements, tailles de texte, couleurs, rayons, alignements.
2. Intègre l'écran.
3. Lance l'app sur l'émulateur et prends une capture :
   - Android : `adb exec-out screencap -p > docs/design/captures/<ecran>-<n>.png`
   - iOS : `xcrun simctl io booted screenshot docs/design/captures/<ecran>-<n>.png`
4. Ouvre la capture et compare-la à la maquette, point par point. Note chaque écart visible : position, taille, espacement, couleur, élément manquant ou en trop.
5. Corrige les écarts, puis reprends à l'étape 3.

Règles de la boucle :
- 3 passages maximum (3 captures). Arrête-toi plus tôt s'il ne reste aucun écart notable.
- Après le 3e passage, n'itère plus, même s'il reste des écarts : liste-les dans la revue de sprint et laisse Moussa décider.
- Compare toujours avec une capture réelle. Ne déclare jamais un écran conforme sans l'avoir regardé.
- Les écarts dus à la taille d'écran de l'émulateur (proportions, zones sûres) ne sont pas des défauts : la maquette donne les proportions, pas des pixels exacts.
- Les données affichées dans les maquettes (scores, dates, séries) sont des exemples.
- Si l'émulateur n'est pas disponible ou que la capture échoue, ne contourne pas : arrête-toi et dis-le.
- Dans la revue de sprint, indique pour chaque écran le nombre de passages effectués et les écarts restants.

## Stack imposée
- Expo (dernière version stable du SDK), TypeScript en mode `strict`.
- `react-native-gesture-handler` + `react-native-reanimated` pour le glisser-déposer et les animations.
- `@react-native-async-storage/async-storage` pour la sauvegarde.
- `expo-audio` pour les sons (avec `expo-asset`, qu'il exige), `expo-haptics` pour les vibrations.
- `expo-linear-gradient` pour les fonds en dégradé, `react-native-safe-area-context` pour les zones sûres.
- `expo-splash-screen` pour le splash natif, `expo-font` pour charger les polices.
- `@expo-google-fonts/fredoka` (titres, Fredoka Bold) et `@expo-google-fonts/dm-sans` (textes, DM Sans).
- Jest pour les tests.
- Pas de moteur de jeu, pas de backend, pas de librairie d'état global. Toute nouvelle dépendance doit être justifiée dans la revue de sprint.
- Installe les paquets Expo avec `npx expo install` pour avoir des versions compatibles.
- Pas d'installation d'essai de paquets hors du projet. Pour vérifier une compatibilité, utilise `npm view <paquet> dependencies peerDependencies` et la documentation, qui ne téléchargent rien.

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
