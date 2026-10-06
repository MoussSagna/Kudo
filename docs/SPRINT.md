# Sprint en cours : Sprint 0 bis — étape 2

**But** : l'écran de lancement s'anime, puis passe à l'écran titre.
**Hors périmètre** : tout autre écran, la logique de jeu.
**Branche** : `sprint/0-bis-2-launch-animation`

## Stories

- [ ] **K-31b — Animation de l'écran de lancement**
  - Réalisée avec `react-native-reanimated` (`withDelay`, `withSequence`, `withSpring`, `withTiming`), installé avec `npx expo install react-native-reanimated` et ce qu'il exige. Pas de Moti.
  - Passage à l'écran titre déclenché avec l'API recommandée par la version installée (pas de fonction marquée obsolète) ; « réduire les animations » lu avec le hook `useReducedMotion` de Reanimated.
  - L'état final de l'animation est exactement l'écran statique actuel : ne changer ni les tailles ni les positions.
  - Séquence :
    1. La case vide apparaît en fondu (150 ms).
    2. Les 8 blocs tombent d'environ 180 pt au-dessus de leur place, un par un, avec 50 ms d'écart, dans cet ordre : ligne du bas de gauche à droite, puis ligne du milieu, puis ligne du haut. Transition `spring` avec un léger rebond, opacité de 0 à 1.
    3. Quand le dernier bloc est posé, le logo entier fait une pulsation : échelle 1 → 1,07 → 1 en 150 ms environ.
    4. « Kubo » monte de 22 pt en fondu (250 ms).
    5. L'accroche monte de 14 pt en fondu (250 ms), 120 ms après le titre.
  - Durée totale, de la première image au passage à l'écran titre : 1,5 seconde au maximum. Toutes les durées et tous les délais sont regroupés dans un seul objet de constantes en haut du fichier.
  - Le passage à l'écran titre se déclenche à la fin de l'animation, pas sur une minuterie indépendante.
  - Si « réduire les animations » est activé sur l'appareil : afficher directement l'état final pendant 1 seconde, sans mouvement.
  - Jouée une seule fois, au lancement à froid.
  - Vérification de l'état final : boucle « Intégration des écrans » avec une capture prise en fin d'animation, comparée à `docs/design/splash.png`. 3 passages maximum.
  - Vérification du mouvement : vidéo du lancement avec `xcrun simctl io booted recordVideo docs/design/captures/splash.mov`. C'est Moussa qui juge le rythme et le rebond ; l'agent ne déclare pas l'animation « conforme ».
  - Vérifier aussi le cas « réduire les animations » (Réglages du simulateur > Accessibilité > Mouvement), puis remettre le réglage d'origine.

## Questions ouvertes
_L'agent note ici ce qui le bloque._
- **Disque plein (résolu)** : une installation d'essai de `moti` hors du projet a saturé le disque et bloqué toutes les commandes ; espace libéré par Moussa, et les installations d'essai sont désormais interdites (`AGENTS.md`).
- **Moti abandonné (décidé par Moussa)** : `moti` 0.30.0 amène, via `framer-motion` 6.5.1, une deuxième copie de React (19.3.0 contre 19.2.3 dans le projet) ; K-31b se fait en `react-native-reanimated` pur.

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Branche :
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
- Dépendances ajoutées et pourquoi :
- Écarts par rapport au plan :
- Passages de la boucle d'intégration et écarts restants, par écran :
- Proposition de stories détaillées pour le sprint suivant :
