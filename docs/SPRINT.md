# Sprint en cours : Fin de partie

**But** : une partie se termine sur un vrai écran de résultat, avec le meilleur score mémorisé et un score partageable.
**Hors périmètre** : accueil, défi du jour, « Reviens demain », réglages, tutoriel.
**Branche** : `sprint/end-screen`

## Stories

- [ ] **K-32 — Correctif du plateau**
  - Une pièce de 5 blocs de haut ou de large ne doit plus toucher les bords du plateau : réduire l'échelle des pièces dans le plateau pour que la plus grande tienne avec une marge. Vérifier avec `v5`, `h5` et `sq3`.

- [ ] **K-33 — Statistiques de partie**
  - L'état du jeu compte, en fonctions pures et testées : le nombre de pièces posées, le nombre de lignes et colonnes effacées, et la meilleure série atteinte.

- [ ] **K-19 — Meilleur score**
  - Installer `@react-native-async-storage/async-storage` avec `npx expo install`.
  - Dans `src/storage/`, lecture et écriture du meilleur score, clé versionnée. Une erreur de lecture donne 0, une erreur d'écriture est ignorée sans planter. Tests avec le mock officiel.
  - L'en-tête de l'écran de jeu affiche « Meilleur : N » et la pastille « Série ×N » quand la série vaut 2 ou plus, comme sur `docs/design/jeu.png`.
  - Si la partie bat le meilleur score, il est enregistré à la fin de la partie.

- [ ] **K-15 — Écran de fin de partie**
  - Maquette : `docs/design/resultat.png`. Il remplace le bandeau provisoire.
  - Contenu : le titre « Partie terminée », le score en grand, la pastille « Nouveau record » seulement si le record est battu, la grille finale en miniature, les trois statistiques (pièces posées, lignes effacées, meilleure série).
  - Boutons : « Partager mon score » (principal) et « Rejouer » (secondaire).
  - Volontairement absents pour l'instant : la ligne « Défi du mardi 6 octobre », « Partie libre » et « Retour à l'accueil ». Ils arriveront avec l'accueil et le défi du jour. Pas de bouton inactif.
  - Enchaînement : à la fin de la partie, la grille reste visible environ 600 ms, puis l'écran de résultat apparaît en fondu. Le son `highscore` remplace `gameover` quand le record est battu.

- [ ] **K-26 — Partage**
  - Une fonction pure et testée construit le texte : « Kubo — N points », la grille finale en 8 lignes d'emojis (`SHARE_EMOJI` de `src/theme.ts`), puis une ligne de statistiques.
  - Le bouton ouvre la feuille de partage du système avec `Share` de React Native, sans nouvelle dépendance. Un partage annulé ne produit aucune erreur.

## Vérification
- `npm run check` après chaque story.
- K-15 : boucle « Intégration des écrans » sur le simulateur iOS à partir de l'état `over`, 3 passages maximum. Les éléments volontairement absents ne sont pas des écarts. Vérifier les deux variantes, avec et sans « Nouveau record ».
- K-32 et K-19 : une capture de l'écran de jeu comparée à `docs/design/jeu.png`.
- L'agent ne peut pas ouvrir la feuille de partage ni vérifier la persistance après un redémarrage réel. Il fournit une liste de contrôle : battre le record, fermer et rouvrir l'app, partager vers Notes ou Messages, annuler un partage.

## Questions ouvertes
_L'agent note ici ce qui le bloque._

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Branche :
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
- Liste de contrôle à dérouler à la main :
- Dépendances ajoutées et pourquoi :
- Écarts par rapport au plan :
- Passages de la boucle d'intégration et écarts restants, par écran :
- Proposition de stories détaillées pour le sprint suivant :
