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

- [x] **K-37 — Changement de jour pendant que l'app est ouverte**
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

### Branche
`sprint/daily-challenge`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### Ce qui a été livré
- **K-21** : le défi est sauvegardé après chaque coup, avec son jour (`src/storage/daily.ts`, clé `kubo:daily:v1`). Sur l'accueil, un défi d'aujourd'hui en cours donne le bouton « Reprendre », qui rouvre la partie telle quelle (grille, plateau, score, série de combos, statistiques, tirages à venir). Un défi en cours d'un jour passé est abandonné. Partie libre : non sauvegardée ; le bouton retour demande « Quitter la partie ? Ta progression sera perdue. » dès que le score dépasse 0.
- **K-22** : le dernier coup du défi l'enregistre comme résultat du jour (date, score, grille finale, statistiques). Tant que le jour n'a pas changé, la carte de l'accueil affiche « Défi terminé », le score et « Voir ».
- **K-23** : série de jours consécutifs avec son record (`src/game/streak.ts`). Pastille « Série : N jours » sur l'accueil dès 1 jour (« 1 jour » au singulier).
- **K-36** `src/screens/TomorrowScreen.tsx` : « Défi du jour terminé », score, compte à rebours jusqu'à minuit, série et record, semaine du lundi au dimanche, « Reviens demain pour la prolonger. », boutons « Partie libre » et « Revoir mon résultat ». À zéro, retour à l'accueil.
- **K-37** : au retour de l'app au premier plan, la date est relue ; si le jour a changé, l'accueil montre le nouveau défi et la série est recalculée. Un défi commencé avant minuit et fini après compte pour son jour de départ (le jour vient de la graine de la partie).
- **Logique pure et testée** : `src/game/days.ts` (jours AAAA-MM-JJ, lendemain, semaine, temps restant, compte à rebours), `src/game/daily.ts` (état du défi : à jouer, en cours, terminé), `src/game/streak.ts`, `src/game/serialize.ts` (lecture défensive d'une partie sauvegardée). Seul `src/clock.ts` lit l'horloge.

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 202 tests réussis.
- Outils de développement (arrêter d'abord tout serveur Expo ; ils se combinent) :
  - `EXPO_PUBLIC_FAKE_DATE=2026-10-08` : l'app se croit ce jour-là, à l'heure réelle.
  - `EXPO_PUBLIC_RESET_DATA=1` : **efface toutes les données sauvegardées** (tutoriel vu, records, défi, série) à chaque démarrage de l'app. À retirer ensuite, sinon tout est effacé à chaque lancement.
  - `EXPO_PUBLIC_SAMPLE_DAILY=tomorrow` : ouvre « Reviens demain » avec les données de la maquette (1 780 points, série de 5 jours, record 12) ; `done` : accueil avec le défi terminé ; `progress` : accueil avec un défi en cours. Rien n'est lu ni écrit dans le stockage avec ces trois états.
- **Vérifié par l'agent** : `npm run check`, `expo-doctor`, et l'affichage sur le simulateur iOS de l'accueil dans ses trois états, de la pastille de série, de l'écran « Reviens demain » et de l'en-tête de jeu.
- **Non vérifié par l'agent** : tout ce qui demande de jouer ou de toucher l'écran — la sauvegarde réelle après un coup, la reprise, la fermeture de l'app, la tentative unique, « Voir », « Revoir mon résultat », la confirmation en partie libre, le compte à rebours qui défile et son passage à zéro, le retour au premier plan après minuit. Ces comportements ne sont couverts que par les tests de la logique et du stockage.

### Liste de contrôle à dérouler à la main
Commencer par un lancement avec `EXPO_PUBLIC_RESET_DATA=1 EXPO_PUBLIC_FAKE_DATE=2026-10-08`, puis relancer sans `RESET_DATA`.

| # | Action | Ce que tu dois observer |
|---|---|---|
| 1 | Accueil, « Jouer », poser deux ou trois pièces, bouton retour | Retour à l'accueil sans confirmation ; le bouton est devenu « Reprendre » |
| 2 | « Reprendre » | Même grille, même plateau, même score ; les tirages suivants sont ceux qu'aurait eus la partie |
| 3 | En plein défi, fermer complètement l'app, la rouvrir | « Reprendre », et la partie est intacte |
| 4 | Finir le défi | Écran de fin habituel, avec « Partager mon score » et « Retour à l'accueil » |
| 5 | « Retour à l'accueil » | Carte « Défi terminé » avec le score, bouton « Voir » ; pastille « Série : 1 jour » |
| 6 | « Voir » | Écran « Reviens demain » : score, compte à rebours qui descend chaque seconde, « Série : 1 jour », « Record : 1 », le jeudi rempli dans la semaine |
| 7 | « Revoir mon résultat » | L'écran de fin du défi avec sa vraie grille et ses vraies statistiques ; aucun moyen de rejouer le défi |
| 8 | « Partie libre » depuis « Reviens demain » | Une partie libre démarre |
| 9 | En partie libre avec un score supérieur à 0, bouton retour | Alerte « Quitter la partie ? Ta progression sera perdue. » ; « Annuler » reste en jeu, « Quitter » ramène à l'accueil. À 0 point, pas d'alerte |
| 10 | Relancer avec `EXPO_PUBLIC_FAKE_DATE=2026-10-09`, finir le défi | Nouveau défi disponible ; après la fin, « Série : 2 jours » |
| 11 | Relancer avec `2026-10-10`, finir le défi | « Série : 3 jours », « Record : 3 », trois jours remplis dans la semaine |
| 12 | Relancer avec `2026-10-12` (un jour manqué) | Pas de pastille de série sur l'accueil ; après le défi, « Série : 1 jour », « Record : 3 » |
| 13 | Commencer un défi sans le finir, relancer avec la date du lendemain | Bouton « Jouer » et non « Reprendre » : l'ancien défi est abandonné |
| 14 | Sans date simulée : finir le défi, régler l'heure du téléphone à 23 h 59, ouvrir « Reviens demain » | À 00:00:00, retour à l'accueil avec le nouveau défi |
| 15 | Mettre l'app en arrière-plan avant minuit, y revenir après | L'accueil affiche la nouvelle date et « Jouer » |

### Dépendances ajoutées et pourquoi
- Aucune.

### Écarts par rapport au plan
- **Écran de fin juste après le défi** : son bouton « Retour à l'accueil » mène à l'accueil, d'où « Voir » ouvre « Reviens demain ». « Reviens demain » ne s'ouvre pas automatiquement.
- **« Revoir mon résultat »** : l'écran de fin rouvert n'affiche pas la pastille « Nouveau record », même si le défi en avait établi un ; cette information n'est pas sauvegardée.
- **Semaine de « Reviens demain »** : les jours joués sont remplis en orange, sans marque particulière pour aujourd'hui. Les 14 derniers jours joués sont mémorisés.
- **Série sur l'accueil** : elle tient encore le lendemain du dernier défi, tant que ce jour-là n'est pas fini ; elle disparaît après un jour entier manqué.
- **Date simulée** : elle remplace le jour mais garde l'heure réelle, pour que le compte à rebours reste vivant.
- **Confirmation en partie libre** : alerte native du système (`Alert`), pas un écran dessiné.
- **Icônes** : la flamme de la pastille et la coche sont dessinées avec des vues ; plus simples que sur les maquettes.
- **Réécriture d'une partie sauvegardée abîmée** : elle est ignorée à la lecture, puis remplacée au prochain coup ; rien n'est supprimé activement.
- **Captures lentes** : la machine était très chargée (pgAdmin et le simulateur), certaines captures ont mis plus de dix minutes. Le lancement avec `EXPO_PUBLIC_RESET_DATA=1` a effacé les données d'Expo Go **sur le simulateur** (tutoriel vu, records).
- **Android** : rien n'a été testé.

### Passages de la boucle d'intégration et écarts restants, par écran
- **« Reviens demain » : 2 passages** (`demain-1.png`, `demain-2.png`), avec les données de la maquette et la date simulée du mardi 6 octobre.
  - Passage 1 : titre trop petit (251 pt de large pour 270), compte à rebours et titre de la série un peu petits. Corrigés.
  - Passage 2 : titre 270 pt, compte à rebours 191 pt (maquette 200), cartes, semaine (lundi et mardi remplis), boutons conformes.
  - Écarts restants : chiffres du compte à rebours environ 5 % plus étroits ; la coche repose sur l'image du bloc vert du pack, avec son reflet.
  - Volontairement absent : le bouton des réglages.
- **Accueil, trois états : 1 capture chacun** (`accueil-a-jouer.png`, `accueil-en-cours.png`, `accueil-termine.png`) : « Jouer », « Reprendre », « Défi terminé / Voir » ; la pastille « Série : 5 jours » est à la place prévue par `accueil.png`.
- **En-tête de jeu : 1 capture** (`jeu-entete-3.png`) après la correction du sprint précédent : le titre fait 98 pt de large (maquette 95), la date 115 pt (maquette 117).

### Proposition de stories détaillées pour le sprint suivant (Réglages)
- **K-28 — Réglages** : maquette `docs/design/reglages.png` ; interrupteurs sons et vibrations, sauvegardés (le module `preferences` existe déjà, en mémoire) ; bouton des réglages sur l'accueil et sur « Reviens demain ».
- À prévoir dans les réglages : « Revoir le tutoriel » et, en développement, « Effacer les données ».
- Points à trancher : faut-il ouvrir « Reviens demain » directement après l'écran de fin du défi ? Faut-il sauvegarder aussi la partie libre ?
