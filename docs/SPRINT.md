# Sprint en cours : Sprint 0 bis — étape 2

**But** : l'écran de lancement s'anime, puis passe à l'écran titre.
**Hors périmètre** : tout autre écran, la logique de jeu.
**Branche** : `sprint/0-bis-2-launch-animation`

## Stories

- [x] **K-31b — Animation de l'écran de lancement**
  - Réalisée avec `react-native-reanimated` (`withDelay`, `withSequence`, `withSpring`, `withTiming`), installé avec `npx expo install react-native-reanimated` et ce qu'il exige. Pas de Moti.
  - Passage à l'écran titre déclenché avec l'API recommandée par la version installée (pas de fonction marquée obsolète) ; « réduire les animations » lu avec le hook `useReducedMotion` de Reanimated.
  - L'état final de l'animation est exactement l'écran statique actuel : ne changer ni les tailles ni les positions.
  - Séquence :
    1. La case vide apparaît en fondu (150 ms).
    2. Les 8 blocs tombent d'environ 180 pt au-dessus de leur place, un par un, avec 50 ms d'écart, dans cet ordre : ligne du bas de gauche à droite, puis ligne du milieu, puis ligne du haut. Transition `spring` avec un léger rebond, opacité de 0 à 1.
    3. Quand le dernier bloc est posé, le logo entier fait une pulsation : échelle 1 → 1,07 → 1 en 150 ms environ.
    4. « Kubo » monte de 22 pt en fondu (250 ms).
    5. L'accroche monte de 14 pt en fondu (250 ms), 120 ms après le titre.
    6. Pause : tout reste affiché et immobile pendant 400 ms.
    7. Sortie, tout en même temps, en 300 ms : les blocs et la case vide passent de l'opacité 1 à 0 et de l'échelle 1 à 0,8 ; le titre et l'accroche passent de l'opacité 1 à 0, sans bouger.
    8. L'écran titre apparaît ensuite en fondu (opacité 0 à 1, 200 ms), sur le même fond `#12162B`, sans écran vide perceptible entre les deux.
  - Durée totale, de la première image au début de l'écran titre : 3,1 secondes environ (2,4 d'entrée, 0,4 de pause, 0,3 de sortie), 3,3 secondes au maximum. Toutes les durées et tous les délais sont regroupés dans un seul objet de constantes en haut du fichier.
  - Le passage à l'écran titre se déclenche à la fin de la sortie, pas sur une minuterie indépendante.
  - Si « réduire les animations » est activé sur l'appareil : afficher directement l'état final pendant 1 seconde, sans mouvement ni changement d'échelle, puis un simple fondu de 200 ms vers l'écran titre.
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

### Branche
`sprint/0-bis-2-launch-animation`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### Ce qui a été livré
- **K-31b** : l'écran de lancement s'anime en `react-native-reanimated` pur, puis passe à l'écran titre.
- Séquence : fondu de la case vide (150 ms) ; chute des 8 blocs depuis 180 pt, 50 ms d'écart, ligne du bas puis milieu puis haut, ressort avec léger rebond et fondu ; pulsation du logo (1 → 1,07 → 1 en 150 ms) ; « Kubo » monte de 22 pt en fondu (250 ms) ; l'accroche monte de 14 pt en fondu (250 ms), 120 ms après le titre.
- Toutes les durées, délais et distances sont dans l'objet `LAUNCH`, en haut de `src/screens/LaunchScreen.tsx`. Durée totale calculée : 1 470 ms.
- Le passage à l'écran titre est déclenché par la fin de l'animation de l'accroche (`scheduleOnRN` de `react-native-worklets`, l'API recommandée ; `runOnJS` est marquée obsolète).
- « Réduire les animations » (`useReducedMotion`) : l'état final s'affiche directement pendant 1 seconde, sans mouvement.
- Jouée une seule fois, au lancement à froid.
- Fichiers : `src/screens/LaunchScreen.tsx`, `src/components/Logo.tsx`, `LogoBlock.tsx`, `LaunchTitle.tsx`, `LaunchTagline.tsx`, nouveau hook `src/hooks/useRiseIn.ts`.
- Documents : règle des branches et interdiction des installations d'essai dans `AGENTS.md`, Moti retiré, maquettes renommées et commitées.

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 3 tests réussis.
- `npx expo start --ios` (ou Expo Go sur téléphone).
- À l'écran : les blocs tombent un par un en partant du bas, le logo fait une petite pulsation, « Kubo » puis « Un puzzle par jour. » montent en fondu ; environ 1,5 seconde après le début, l'écran titre apparaît.
- **Vidéo du mouvement** : `docs/design/captures/splash.mov` (dossier ignoré par Git, donc présent uniquement sur ce Mac). L'animation commence vers 12,1 s dans la vidéo. **Le rythme et le rebond sont à juger par Moussa** ; l'agent ne se prononce pas dessus.
- Vérifié par l'agent sur le simulateur iOS (iPhone 18 Pro, Expo Go), à partir d'images extraites de la vidéo : ordre de la séquence, passage à l'écran titre environ 1,5 s après la première image (mesure à 30 images/s, soit ± 35 ms), aucune erreur à l'écran.
- Mode « réduire les animations » vérifié : logo, titre et accroche affichés complets et immobiles, écran titre environ 1 seconde plus tard. Réglage du simulateur remis à sa valeur d'origine (désactivé).
- **Non vérifié** : Android, un vrai téléphone, un build hors Expo Go.

### Dépendances ajoutées et pourquoi
- `react-native-reanimated` 4.5.1 : animations (déjà dans la « Stack imposée »).
- `react-native-worklets` 0.10.1 : exigé par Reanimated 4, fournit `scheduleOnRN`.
- Aucun `babel.config.js` ajouté : `babel-preset-expo` active le plugin des worklets automatiquement.
- `moti` : **non installé**, abandonné (voir « Questions ouvertes »).

### Écarts par rapport au plan
- **Durée totale** : 1 470 ms par construction ; la mesure sur vidéo donne 1,47 à 1,53 s, ce qui ne permet pas de distinguer 1 470 de 1 500 ms. Pour une marge plus nette, baisser `endHoldMs` (100 ms) ou `blockSettleMs` (350 ms).
- **Pulsation** : elle démarre après un délai fixe (`blockSettleMs`, 350 ms après le départ du dernier bloc) et non sur la fin réelle du ressort, pour garder une durée totale prévisible.
- **Début masqué dans Expo Go** : l'écran de chargement d'Expo Go se dissipe en fondu pendant les 300 premières millisecondes environ ; la case vide et les premiers blocs apparaissent donc sous ce fondu. Cela ne devrait pas se produire dans un vrai build, mais ce n'est pas vérifié.
- **« Réduire les animations »** : réglage changé en ligne de commande (`defaults write com.apple.Accessibility ReduceMotionEnabled`) et non par l'écran Réglages du simulateur, que l'agent ne peut pas manipuler. Reanimated lit ce réglage au démarrage de l'app ; un changement en cours d'exécution n'est pris en compte qu'au lancement suivant.
- **Serveur Metro** : un serveur lancé par Moussa tournait déjà sur le port 8081 ; l'agent l'a utilisé sans l'arrêter.
- **Disque plein** : une installation d'essai de `moti` hors du projet a saturé le disque (voir « Questions ouvertes »).

### Passages de la boucle d'intégration et écarts restants, par écran
- **Écran de lancement (état final) : 1 passage** (`splash-1.png`, capture prise en fin d'animation avec `endHoldMs` allongé temporairement, puis remis à 100 ms).
  - Positions et tailles identiques à l'écran statique validé en K-31a.
  - Écarts restants : aucun notable (toujours environ 8 pt plus bas que la maquette, à cause de l'encoche de l'iPhone 18 Pro).

### Retour de Moussa : animation ralentie
- Demande : animation trop rapide, à allonger d'environ 50 % ; durée visée 2,2 s, 2,3 s au maximum. Seul l'objet `LAUNCH` a changé ; ordre, positions, état final et mode « réduire les animations » sont inchangés.
- Nouvelles valeurs : case vide 225 ms ; écart entre blocs 75 ms ; fondu des blocs 180 ms ; ressort plus souple (`duration` 350, `dampingRatio` 0,5) ; attente avant la pulsation 525 ms ; pulsation 220 ms ; titre 350 ms ; accroche 350 ms, 180 ms après le titre ; pause finale 125 ms.
- Durée totale : 2 150 ms par construction, 2,23 s mesurés sur la vidéo (échantillonnage à 60 images/s). L'écart d'environ 80 ms est la latence d'affichage ; la pause finale a été ramenée de 175 à 125 ms pour garder de la marge sous 2,3 s.
- Vidéo : `docs/design/captures/splash-v2.mov`, l'animation commence à 12,75 s. État final confirmé par la capture `splash-v2-final.png`, identique à `splash-1.png`.
- Les chiffres de durée donnés plus haut dans cette revue (1 470 ms, 1,5 s) décrivent la première version.

### Ajout demandé par Moussa : sortie en fondu
- Après l'accroche : pause de 400 ms, sortie de 300 ms (le logo passe à l'opacité 0 et à l'échelle 0,8 ; titre et accroche s'effacent sans bouger), puis l'écran titre monte en fondu en 200 ms sur le fond `#12162B`.
- Le passage à l'écran titre est déclenché par la fin de la sortie. `pauseMs`, `exitMs`, `exitLogoScale` et `titleScreenFadeInMs` sont dans `LAUNCH` ; `endHoldMs` est remplacé par `pauseMs`.
- Durée totale, de la première image au début de l'écran titre : 2 725 ms par construction, 2,78 s mesurés sur la vidéo. C'est moins que les 2,9 s visées, car l'entrée dure 2 025 ms une fois l'ancienne pause finale retirée (2,2 s l'incluait).
- Entre la fin de la sortie et le début du fondu de l'écran titre, la vidéo montre environ 50 ms de fond uni (le temps que l'écran titre soit monté). À juger par Moussa.
- L'échelle de sortie est appliquée au logo entier, pas à chaque bloc séparément.
- « Réduire les animations » vérifié : état final immobile pendant environ 1,07 s, puis fondu croisé d'environ 200 ms vers l'écran titre, sans changement d'échelle. Réglage du simulateur remis à sa valeur d'origine.
- Vidéo : `docs/design/captures/splash-v3.mov`, l'animation commence à 12,20 s. Capture pendant la pause : `splash-v3-pause.png`, identique à l'état final validé.
- `App.tsx` : l'écran titre est monté par-dessus l'écran de lancement pendant son fondu, puis l'écran de lancement est retiré.

### Retour de Moussa : chute des blocs ralentie
- Demande : chute beaucoup trop rapide ; on doit voir chaque bloc tomber, atterrir et rebondir. Seule la chute a changé ; pulsation, textes, pause et sortie gardent leurs réglages.
- Le ressort est remplacé par un mouvement décomposé : descente de 450 ms en `withTiming` avec accélération (ease-in), puis rebond de 14 pt en 200 ms (montée puis retombée). L'opacité passe de 0 à 1 pendant le premier tiers de la chute (150 ms). Hauteur de départ inchangée (180 pt). Écart entre deux blocs : 110 ms.
- Trois réglages distincts dans `LAUNCH` : `blockDropMs` (durée de chute), `blockStaggerMs` (écart entre blocs), `blockBounceHeight` (amplitude du rebond) ; `blockBounceMs` règle la durée du rebond. `blockSpring`, `blockSettleMs` et `blockFadeMs` disparaissent.
- La pulsation part exactement quand le dernier bloc est stabilisé (fin de son rebond).
- Durée totale, de la première image au début de l'écran titre : 3 095 ms par construction, 3,17 s mesurés sur la vidéo. Le critère passe à « 3,1 secondes environ, 3,3 secondes au maximum ».
- Mesure sur le bloc rouge (premier à tomber) : chute de 442 ms, rebond de 14 pt, stabilisé 200 ms après l'atterrissage. Quatre images extraites pendant sa chute (`splash-v4-chute.png`, à 100 ms d'intervalle) le montrent à 223, 249, 294 et 356 pt du haut de l'écran, pour une position finale à 394 pt.
- Vidéo : `docs/design/captures/splash-v4.mov`, l'animation commence à 14,38 s.
- Le mode « réduire les animations » n'a pas été retesté : son code n'a pas changé.

### Proposition de stories détaillées pour le sprint suivant
- Sprint 1 — La grille et les règles (K-05 à K-10) : la proposition détaillée est dans `docs/reviews/sprint-0.md`. Branche suggérée : `sprint/1-grid-and-rules`.
- Point toujours à trancher avant K-08 : pour la série, « efface au moins une ligne » inclut-il les colonnes ?
