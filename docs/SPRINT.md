# Sprint en cours : Sprint 0 bis — étape 1

**But** : au lancement, l'app affiche l'écran de lancement fidèle à la maquette, puis passe à l'écran titre.
**Hors périmètre** : toute animation, Moti, la logique de jeu.

## Stories

- [ ] **K-31a — Écran de lancement statique**
  - Maquette de référence : `docs/design/splash.png`.
  - Fond uni `#12162B`.
  - Logo : grille 3×3 construite avec les images de blocs du pack (pas une image unique), car chaque bloc sera animé séparément plus tard. Disposition, ligne par ligne : violet, violet, cyan / case vide, jaune, cyan / rouge, jaune, jaune.
  - Sous le logo : « Kubo » en Fredoka Bold, puis « Un puzzle par jour. » en DM Sans, couleur `#A9B0DA`.
  - Le tout centré verticalement et horizontalement, zones sûres respectées.
  - L'écran reste affiché environ 1 seconde, puis laisse place à l'écran titre existant.
  - Le splash natif reste visible jusqu'à ce que les polices soient chargées (`expo-splash-screen`), pour éviter un flash ou un texte dans la mauvaise police.
  - Dépendances autorisées pour cette story : `expo-font`, `expo-splash-screen`, `@expo-google-fonts/fredoka`, `@expo-google-fonts/dm-sans`. Les ajouter à la « Stack imposée » de `AGENTS.md`. Appliquer ces deux polices à l'écran titre aussi.
  - Composant découpé pour préparer l'animation : un composant par bloc du logo, un pour le titre, un pour l'accroche.
  - Vérification visuelle obligatoire : boucle « Intégration des écrans » de `AGENTS.md` sur le simulateur iOS (`npx expo start --ios`, captures `docs/design/captures/splash-<n>.png`), 3 passages maximum. Durée de l'écran allongée temporairement pour la capture, puis remise à la valeur normale avant le commit.

## Questions ouvertes
_L'agent note ici ce qui le bloque._

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
- Dépendances ajoutées et pourquoi :
- Écarts par rapport au plan :
- Passages de la boucle d'intégration et écarts restants, par écran :
- Proposition de stories détaillées pour le sprint suivant :
