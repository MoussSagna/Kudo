# Kubo — backlog

Un sprint = un écran (ou une moitié d'écran quand il est gros), que l'on peut lancer et montrer. Ordre fixe. Le détail du sprint en cours est dans `SPRINT.md`.

## Sprint 0 — Socle
But : un projet propre qui démarre.
- **K-01** Projet Expo TypeScript strict créé, lancé dans Expo Go.
- **K-02** Assets du pack copiés, `app.json` configuré (nom Kubo, icône, splash, portrait).
- **K-03** `npm run check` en place (types, lint, Jest) avec un test d'exemple.
- **K-04** Écran unique avec le fond en dégradé et le titre « Kubo ».

## Sprint 0 bis — Écran de lancement
But : au lancement, l'app affiche l'écran de lancement, puis passe à l'écran titre.
- **K-31a** Écran de lancement statique.
  - Fond uni `#12162B`, identique au splash natif, pour éviter tout flash à la transition.
  - Logo en grille 3×3 construit avec les images de blocs du pack, « Kubo » en Fredoka Bold, « Un puzzle par jour. » en DM Sans.
  - Affiché environ 1 seconde, puis transition vers l'écran titre.
  - `expo-splash-screen` garde le splash natif affiché jusqu'à ce que les polices soient chargées.
- **K-31b** Animation de l'écran de lancement.
  - Les 9 cases du logo (grille 3×3 de l'icône) tombent une par une, de bas en haut, avec un léger rebond ; le logo fait ensuite une courte pulsation ; puis « Kubo » monte en fondu, suivi de « Un puzzle par jour. ».
  - Sortie : une pause de 400 ms, puis une sortie de 300 ms (blocs et case vide : opacité 1 → 0 et échelle 1 → 0,8 ; titre et accroche : opacité 1 → 0, sans bouger), puis l'écran titre apparaît en fondu (200 ms) sur le même fond `#12162B`.
  - Durée totale, de la première image au début de l'écran titre : 3,1 secondes environ, 3,3 secondes au maximum.
  - Jouée uniquement au lancement à froid, une seule fois.
  - Réalisée avec `react-native-reanimated` (`withDelay`, `withSequence`, `withSpring`, `withTiming`).
  - `expo-splash-screen` garde le splash natif affiché jusqu'à ce que l'écran animé soit prêt.
  - Si le système demande de réduire les animations, afficher directement le logo complet, sans mouvement ni changement d'échelle, pendant 1 seconde, puis un simple fondu de 200 ms vers l'écran titre.

## Écran de jeu, partie 1 — règles et affichage
But : toute la logique du jeu existe et est testée ; l'écran de jeu s'affiche, sans interaction.
- **K-05** Types et état de jeu (`GameState`), création d'une partie depuis une graine.
- **K-06** `canPlace` et `placePiece`.
- **K-07** `clearLines` (lignes et colonnes simultanées).
- **K-08** Coup complet (`applyMove`) et calcul du score, série comprise.
- **K-09** `hasAnyMove` et détection de fin de partie.
- **K-10** Affichage de l'écran de jeu : score, grille 8×8 et plateau de 3 pièces (sans interaction).

## Écran de jeu, partie 2 — jouable
But : on peut jouer une partie complète au doigt, du premier coup à la fin de partie.
- **K-11** Glisser une pièce du plateau avec le doigt.
- **K-12** Aperçu de la position sur la grille pendant le glisser.
- **K-13** Pose valide, retour au plateau si invalide.
- **K-14** Effacement, score affiché, nouveau tirage.

## Écran de jeu, partie 3 — sensations
But : le jeu est agréable à manipuler.
- **K-16** Sons (prise, pose, refus, effacement, combo, fin).
- **K-17** Vibrations.
- **K-18** Animations de pose et d'effacement.

## Fin de partie
But : la partie a une fin, un record et se partage.
- **K-32** Correctif du plateau : une pièce de 5 blocs ne touche plus les bords.
- **K-33** Statistiques de partie (pièces posées, lignes et colonnes effacées, meilleure série).
- **K-19** Meilleur score sauvegardé et affiché, son de record.
- **K-15** Écran de fin de partie avec score, statistiques, « Partager mon score » et « Rejouer ».
- **K-26** Partage du résultat en emojis.

## Tutoriel interactif
But : au premier lancement, le joueur apprend en jouant.
- **K-27** Tutoriel au premier lancement. Utilise le moteur et le glisser-déposer du jeu. Maquettes : `tuto-1a`, `tuto-1b`, `tuto-2a`, `tuto-2b`, `tuto-3`.
  - **K-27a** Mémoriser que le tutoriel a été vu.
  - **K-27d** Étape 1 : poser une pièce.
  - **K-27e** Étape 2 : compléter une ligne.
  - **K-27f** Étape 3 et enchaînement.

## Accueil
But : le jeu a un point d'entrée.
- **K-24** Écran d'accueil (défi du jour, partie libre, meilleur score, « Comment jouer ? »).
- **K-25** Deux modes de jeu : défi du jour et partie libre, chacun avec son meilleur score ; en-tête de l'écran de jeu avec bouton retour.
- **K-34** Écran de fin selon le mode.
- **K-35** Transitions en fondu entre les écrans.

## Défi du jour et « Reviens demain »
But : tout le monde joue la même partie, une fois par jour.
- **K-20** Suite de pièces issue de la graine du jour (livrée avec K-25).
- **K-21** Sauvegarde et reprise du défi du jour ; confirmation avant de quitter une partie libre.
- **K-22** Une seule tentative par jour.
- **K-23** Série de jours consécutifs.
- **K-36** Écran « Reviens demain » avec compte à rebours.
- **K-37** Changement de jour pendant que l'app est ouverte.

## Réglages
But : le joueur règle le son et les vibrations.
- **K-28** Réglages (son, vibrations).

## Finition
But : prêt à être montré ou publié.
- **K-29** Accessibilité et tailles d'écran (petits téléphones, tablettes).
- **K-30** Build de test (EAS).

## Idées (non planifiées)
_L'agent ajoute ici ce qui sort du périmètre._
- `SHARE_EMOJI` (`src/theme.ts`) : `cyan` et `blue` utilisent le même emoji 🟦, donc indistinguables dans le partage (K-26). À trancher avec Moussa.
