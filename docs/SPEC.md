# Kubo — spécification du jeu

## Vision
Un block puzzle calme et lisible, avec un défi par jour, identique pour tous les joueurs, que l'on partage comme un Wordle.

## Règles
- **Grille** : 8 × 8 cases, vide au départ.
- **Plateau de pièces** : 3 pièces proposées en bas de l'écran. Quand les 3 sont posées, 3 nouvelles arrivent.
- **Pose** : le joueur glisse une pièce sur la grille. Elle se pose si toutes ses cases tombent sur des cases vides de la grille. Sinon elle retourne à sa place.
- **Pas de rotation** : les pièces se posent dans l'orientation proposée.
- **Effacement** : après une pose, toute ligne ou colonne entièrement remplie est vidée. Lignes et colonnes sont évaluées en même temps (une case au croisement compte pour les deux).
- **Fin de partie** : quand aucune des pièces restantes du plateau ne peut être posée nulle part.

## Score
- Pose : +1 point par case de la pièce.
- Effacement : `10 × n × n` points, où `n` est le nombre de lignes et colonnes vidées par la même pose (1 → 10, 2 → 40, 3 → 90).
- Série : si une pose efface au moins une ligne alors que la pose précédente en avait aussi effacé, le gain d'effacement est multiplié par le niveau de série (2, puis 3, etc.). Une pose sans effacement remet la série à 1.

## Pièces
Les 31 formes sont dans `src/game/pieces.ts`. Les cases sont en `[colonne, ligne]` depuis le coin haut-gauche. Chaque pièce a une couleur fixe.

## Modes
- **Défi du jour** : la suite de pièces vient de `createRng(dailySeed())`. Une seule tentative par jour. Une partie commencée est reprise telle quelle si on quitte l'app.
- **Partie libre** : graine aléatoire, rejouable à volonté, avec son propre meilleur score.

## Données sauvegardées (en local)
- meilleur score par mode ;
- état de la partie du jour (grille, plateau, score, nombre de tirages) et sa date ;
- série de jours consécutifs joués.

## Partage
En fin de défi du jour : un texte avec le nom du jeu, la date, le score et la grille finale en emojis (`SHARE_EMOJI` dans `src/theme.ts`).

## Direction visuelle
- Fond sombre en dégradé, blocs colorés à relief, coins arrondis. Référence : `assets/preview.png`.
- Couleurs uniquement depuis `src/theme.ts`.
- Portrait uniquement. Grille centrée, carrée, avec une marge latérale ; la taille de case se calcule depuis la largeur de l'écran.

## Hors périmètre
Comptes utilisateurs, classement en ligne, publicité, achats intégrés, musique de fond.

## Décisions à confirmer par Moussa
- Le jour change à minuit **UTC** (2 h du matin à Paris en été). À remplacer par l'heure locale ?
- Pondération du tirage : toutes les pièces ont la même probabilité pour l'instant.
