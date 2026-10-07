# Sprint en cours : Défi du jour et « Reviens demain »

**But** : le défi du jour ne se joue qu'une fois, se reprend si on le quitte, et donne envie de revenir le lendemain.
**Hors périmètre** : réglages, notifications, classement en ligne.
**Branche** : `sprint/daily-challenge`

**Règles communes**
- Toute la logique de dates (jour courant, jour suivant, série, temps restant) est en fonctions pures qui reçoivent la date en argument, avec des tests. Aucun `new Date()` caché dans la logique.
- Les dates sont des jours locaux au format AAAA-MM-JJ.
- Les données sauvegardées ont une clé versionnée. Une donnée illisible ou d'un format inconnu est ignorée, sans planter.

## Stories

- [x] **K-21 — Sauvegarde et reprise du défi**
  - L'état du défi est sauvegardé après chaque coup, avec sa date.
  - Sur l'accueil, si un défi d'aujourd'hui est en cours, le bouton de la carte devient « Reprendre » et rouvre la partie exactement où elle en était : grille, plateau, score, série de combos, statistiques, tirages à venir.
  - Quitter le jeu par le bouton retour ou fermer l'app ne perd plus le défi.
  - Un défi en cours d'un jour passé est abandonné : il ne compte pas.
  - Partie libre : elle n'est pas sauvegardée. Si le score est supérieur à 0, le bouton retour demande une confirmation (« Quitter la partie ? Ta progression sera perdue. »).

- [x] **K-22 — Une seule tentative par jour**
  - Quand le défi se termine, son résultat est enregistré : date, score, grille finale, statistiques.
  - Tant que la date n'a pas changé, le défi ne peut plus être rejoué. Sur l'accueil, la carte affiche « Défi terminé », le score, et un bouton « Voir » qui ouvre l'écran « Reviens demain ».
  - Sur l'écran de fin du défi, « Retour à l'accueil » reste disponible, et « Partager mon score » aussi.

- [x] **K-23 — Série de jours**
  - La série compte les jours consécutifs où un défi a été terminé. Elle retombe à 0 si un jour complet est manqué. Le record de série est conservé.
  - Cas à tester : premier défi, lendemain, jour manqué, deux lancements le même jour, changement de mois et d'année.
  - Sur l'accueil, la pastille « Série : N jours » apparaît quand N vaut 1 ou plus (« 1 jour » au singulier), comme sur `docs/design/accueil.png`.

- [x] **K-36 — Écran « Reviens demain »**
  - Maquette : `docs/design/demain.png`.
  - Contenu : « Défi du jour terminé », le score, le compte à rebours jusqu'à minuit heure locale (heures, minutes, secondes), la série avec son record, la semaine du lundi au dimanche avec les jours joués remplis, et la phrase « Reviens demain pour la prolonger. ».
  - Boutons : « Partie libre » et « Revoir mon résultat », qui rouvre l'écran de fin du défi du jour avec ses vraies données.
  - Le bouton des réglages de la maquette reste absent pour l'instant.
  - Quand le compte à rebours atteint zéro, l'écran revient à l'accueil, où le nouveau défi est disponible.

- [ ] **K-37 — Changement de jour pendant que l'app est ouverte**
  - Au retour de l'app au premier plan, la date est relue. Si le jour a changé, l'accueil affiche le nouveau défi et la série est recalculée.
  - Un défi commencé avant minuit et encore ouvert après minuit peut être terminé : il compte pour son jour de départ.

## Outils de développement
- `EXPO_PUBLIC_FAKE_DATE=2026-10-08` fait croire à l'app qu'on est ce jour-là, pour tester la série sans attendre.
- Un état d'exemple pour ouvrir directement « Reviens demain » avec les données de la maquette (1 780 points, série de 5 jours, record 12).
- Un moyen d'effacer toutes les données sauvegardées, documenté dans la revue.

## Vérification
- `npm run check` après chaque story.
- Boucle « Intégration des écrans » sur « Reviens demain », 3 passages maximum.
- Une capture de l'accueil dans ses trois états : défi à jouer, défi en cours, défi terminé. Refaire aussi la capture de l'en-tête de jeu modifié au sprint précédent.
- Liste de contrôle à dérouler à la main : quitter et reprendre un défi, fermer l'app en pleine partie, finir le défi puis tenter de le rejouer, « Voir », « Revoir mon résultat », le compte à rebours, la série sur trois jours avec la date simulée, un jour manqué, la confirmation en partie libre.

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
