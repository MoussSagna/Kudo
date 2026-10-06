# Kubo — backlog

Un sprint = un incrément que l'on peut lancer et montrer. Ordre fixe. Le détail du sprint en cours est dans `SPRINT.md`.

## Sprint 0 — Socle
But : un projet propre qui démarre.
- **K-01** Projet Expo TypeScript strict créé, lancé dans Expo Go.
- **K-02** Assets du pack copiés, `app.json` configuré (nom Kubo, icône, splash, portrait).
- **K-03** `npm run check` en place (types, lint, Jest) avec un test d'exemple.
- **K-04** Écran unique avec le fond en dégradé et le titre « Kubo ».

## Sprint 1 — La grille et les règles
But : la logique du jeu existe et est testée ; la grille s'affiche.
- **K-05** Types et état de jeu (`GameState`), création d'une partie depuis une graine.
- **K-06** `canPlace` et `placePiece`.
- **K-07** `clearLines` (lignes et colonnes simultanées).
- **K-08** Calcul du score, série comprise.
- **K-09** `hasAnyMove` et détection de fin de partie.
- **K-10** Affichage de la grille 8×8 et du plateau de 3 pièces (sans interaction).

## Sprint 2 — Jouable
But : on peut jouer une partie complète.
- **K-11** Glisser une pièce du plateau avec le doigt.
- **K-12** Aperçu de la position sur la grille pendant le glisser.
- **K-13** Pose valide, retour au plateau si invalide.
- **K-14** Effacement, score affiché, nouveau tirage.
- **K-15** Écran de fin de partie avec score et bouton « Rejouer ».

## Sprint 3 — Sensations
But : le jeu est agréable à manipuler.
- **K-16** Sons (prise, pose, refus, effacement, combo, fin).
- **K-17** Vibrations.
- **K-18** Animations de pose et d'effacement.
- **K-19** Meilleur score sauvegardé et affiché, son de record.

## Sprint 4 — Défi du jour
But : tout le monde joue la même partie, une fois par jour.
- **K-20** Suite de pièces issue de la graine du jour.
- **K-21** Sauvegarde et reprise de la partie du jour.
- **K-22** Une seule tentative par jour, écran « Reviens demain » avec compte à rebours.
- **K-23** Série de jours consécutifs.

## Sprint 5 — Partage et navigation
But : le jeu a un début, une fin, et se partage.
- **K-24** Écran d'accueil (défi du jour, partie libre, série, meilleur score).
- **K-25** Mode partie libre.
- **K-26** Partage du résultat en emojis.

## Sprint 6 — Finition
But : prêt à être montré ou publié.
- **K-27** Tutoriel au premier lancement.
- **K-28** Réglages (son, vibrations).
- **K-29** Accessibilité et tailles d'écran (petits téléphones, tablettes).
- **K-30** Build de test (EAS).
- **K-31** Écran de lancement animé.
  - Fond uni `#12162B`, identique au splash natif, pour éviter tout flash à la transition.
  - Les 9 cases du logo (grille 3×3 de l'icône) tombent une par une, de bas en haut, avec un léger rebond ; le logo fait ensuite une courte pulsation ; puis « Kubo » monte en fondu, suivi de « Un puzzle par jour. ».
  - Durée totale inférieure à 1,5 seconde, puis transition vers l'accueil.
  - Jouée uniquement au lancement à froid, une seule fois.
  - Réalisée avec `moti` (`MotiView`, `MotiText`, `MotiImage`) : chute et rebond des blocs avec une transition `spring` et un `delay` croissant par bloc, pulsation du logo en séquence, apparition des textes avec une transition `timing`.
  - Avant d'installer `moti`, vérifie qu'il est compatible avec la version de `react-native-reanimated` du projet. S'il ne l'est pas, n'installe rien, ne force pas de version : note-le dans « Questions ouvertes » et arrête-toi.
  - `expo-splash-screen` garde le splash natif affiché jusqu'à ce que l'écran animé soit prêt.
  - Si le système demande de réduire les animations, afficher directement le logo complet, sans mouvement.

## Idées (non planifiées)
_L'agent ajoute ici ce qui sort du périmètre._
- `SHARE_EMOJI` (`src/theme.ts`) : `cyan` et `blue` utilisent le même emoji 🟦, donc indistinguables dans le partage (K-26). À trancher avec Moussa.
