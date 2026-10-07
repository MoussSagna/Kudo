# Sprint en cours : Accueil

**But** : l'app s'ouvre sur un écran d'accueil d'où l'on lance le défi du jour ou une partie libre, et l'on peut y revenir.
**Hors périmètre** : la tentative unique par jour, la sauvegarde et la reprise d'une partie, la série de jours, l'écran « Reviens demain », les réglages. Ils viennent au sprint suivant.
**Branche** : `sprint/home`

**Décision inscrite dans `docs/SPEC.md`** : le défi du jour change à minuit, heure locale de l'appareil. La graine est calculée à partir de la date locale (AAAAMMJJ), plus à partir de la date UTC. `dailySeed` et ses tests sont adaptés.

## Stories

- [x] **K-24 — Écran d'accueil**
  - Maquette : `docs/design/accueil.png`.
  - Contenu : le logo et « Kubo », l'accroche, la carte « Défi du jour » avec la date du jour en français (par exemple « Mercredi 7 octobre ») et le bouton « Jouer », la ligne « Partie libre » avec son meilleur score, le lien « Comment jouer ? ».
  - Volontairement absents pour l'instant : la pastille « Série » et le bouton des réglages. Pas de bouton inactif.
  - « Comment jouer ? » rejoue le tutoriel, puis revient à l'accueil.
  - Enchaînement au lancement : écran de lancement, tutoriel au premier lancement, puis accueil. L'app ne s'ouvre plus directement sur une partie.

- [ ] **K-25 — Deux modes de jeu**
  - « Jouer » lance une partie avec la graine du jour ; « Partie libre » lance une partie avec une graine aléatoire.
  - Le mode fait partie de l'état de la partie. Chaque mode a son propre meilleur score, stocké séparément. Le meilleur score déjà enregistré devient celui de la partie libre.
  - L'en-tête de l'écran de jeu affiche, comme sur `docs/design/jeu.png`, le bouton retour et, au centre, « Défi du jour » avec la date, ou « Partie libre ».
  - Le bouton pause de la maquette est abandonné : le jeu n'a pas de minuterie.
  - Le bouton retour ramène à l'accueil. La partie en cours est alors perdue ; c'est accepté pour ce sprint, la sauvegarde arrive au suivant.

- [ ] **K-34 — Écran de fin selon le mode**
  - Défi du jour : la ligne « Défi du mercredi 7 octobre » au-dessus du titre ; boutons « Partager mon score », « Partie libre », « Retour à l'accueil ».
  - Partie libre : pas de ligne de date ; boutons « Partager mon score », « Rejouer », « Retour à l'accueil ».
  - Le texte partagé indique le mode : « Kubo — défi du 7 octobre — N points » ou « Kubo — partie libre — N points ». Mettre à jour la fonction et ses tests.

- [ ] **K-35 — Transitions**
  - Fondu court entre les écrans : accueil, jeu, fin de partie, tutoriel. Durée dans l'objet `MOTION`. Respect de « réduire les animations ».
  - Toujours sans librairie de navigation.

## Vérification
- `npm run check` après chaque story.
- Boucle « Intégration des écrans » sur l'accueil, 3 passages maximum. Les éléments volontairement absents ne sont pas des écarts.
- Une capture de l'écran de jeu et des deux variantes de l'écran de fin, comparées à leurs maquettes.
- Liste de contrôle à dérouler à la main : chaque bouton de l'accueil, retour depuis le jeu, fin de partie dans chaque mode et ses trois boutons, records séparés, même suite de pièces en relançant le défi du jour deux fois, « Comment jouer ? ».

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
