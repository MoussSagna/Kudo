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

- [x] **K-25 — Deux modes de jeu**
  - « Jouer » lance une partie avec la graine du jour ; « Partie libre » lance une partie avec une graine aléatoire.
  - Le mode fait partie de l'état de la partie. Chaque mode a son propre meilleur score, stocké séparément. Le meilleur score déjà enregistré devient celui de la partie libre.
  - L'en-tête de l'écran de jeu affiche, comme sur `docs/design/jeu.png`, le bouton retour et, au centre, « Défi du jour » avec la date, ou « Partie libre ».
  - Le bouton pause de la maquette est abandonné : le jeu n'a pas de minuterie.
  - Le bouton retour ramène à l'accueil. La partie en cours est alors perdue ; c'est accepté pour ce sprint, la sauvegarde arrive au suivant.

- [x] **K-34 — Écran de fin selon le mode**
  - Défi du jour : la ligne « Défi du mercredi 7 octobre » au-dessus du titre ; boutons « Partager mon score », « Partie libre », « Retour à l'accueil ».
  - Partie libre : pas de ligne de date ; boutons « Partager mon score », « Rejouer », « Retour à l'accueil ».
  - Le texte partagé indique le mode : « Kubo — défi du 7 octobre — N points » ou « Kubo — partie libre — N points ». Mettre à jour la fonction et ses tests.

- [x] **K-35 — Transitions**
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

### Branche
`sprint/home`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### Ce qui a été livré
- **Décision heure locale** : `dailySeed` utilise la date locale de l'appareil ; `docs/SPEC.md` est à jour et la question est retirée des « Décisions à confirmer » (commit `fix(dailySeed)`).
- **K-24** `src/screens/HomeScreen.tsx` : logo et « Kubo », accroche, carte « Défi du jour » avec la date du jour en français et « Jouer », ligne « Partie libre » avec son meilleur score, lien « Comment jouer ? » qui rejoue le tutoriel puis revient à l'accueil. Au lancement : écran de lancement, tutoriel au premier lancement, puis accueil.
- **K-25** deux modes : `GameState.mode` vaut `daily` ou `free` ; `startGame(mode, maintenant)` crée la partie avec la graine du jour ou une graine tirée de l'horloge. Un meilleur score par mode (`kubo:bestScore:v1` pour la partie libre, donc le record existant est conservé ; `kubo:bestScore:daily:v1` pour le défi). En-tête de l'écran de jeu (`GameHeader`) : bouton retour, « DÉFI DU JOUR » avec la date, ou « PARTIE LIBRE ».
- **K-34** écran de fin selon le mode : ligne « DÉFI DU MARDI 6 OCTOBRE » et bouton « Partie libre » pour le défi ; bouton « Rejouer » pour la partie libre ; « Retour à l'accueil » dans les deux cas. Le texte partagé commence par « Kubo — défi du 7 octobre — N points » ou « Kubo — partie libre — N points ».
- **K-35** fondu entre les écrans (`useScreenFade`, 160 ms à la sortie puis 160 ms à l'entrée, réglable par `MOTION.screenFadeMs`). Toujours sans librairie de navigation : `src/screens/MainScreens.tsx` garde une seule route dans un état.
- Dates en français : `src/game/dates.ts` (« mercredi 7 octobre », « 1er mars »), testé.

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 138 tests réussis.
- `npx expo start --ios` : écran de lancement, puis accueil (ou tutoriel au tout premier lancement).
- Outils de développement : `EXPO_PUBLIC_TUTORIAL=0` saute le tutoriel même s'il n'a jamais été vu ; `EXPO_PUBLIC_SAMPLE_GAME=1`, `over`, `record`, `overfree`, `end`, `demo`, `big` ouvrent directement une partie d'exemple.
- **Vérifié par l'agent** : `npm run check`, `expo-doctor`, et sur le simulateur iOS l'affichage de l'accueil, de l'en-tête de l'écran de jeu et des deux variantes de l'écran de fin.
- **Non vérifié par l'agent** : tout ce qui demande de toucher l'écran — chaque bouton de l'accueil, le bouton retour, les trois boutons de l'écran de fin, « Comment jouer ? », et donc **les fondus entre les écrans, qu'aucune capture n'a pu montrer**. Les records séparés et la graine du jour ne sont vérifiés que par les tests.

### Liste de contrôle à dérouler à la main
| # | Action | Ce que tu dois observer |
|---|---|---|
| 1 | Lancer l'app | Écran de lancement, puis accueil : logo, « Kubo », carte « Défi du jour » avec la date d'aujourd'hui, « Partie libre » avec ton meilleur score actuel, « Comment jouer ? » |
| 2 | Toucher « Jouer » | Fondu vers l'écran de jeu ; en-tête « DÉFI DU JOUR » et la date ; « Meilleur : 0 » (record du défi, distinct) |
| 3 | Noter les trois pièces, toucher le bouton retour, puis « Jouer » de nouveau | Retour à l'accueil en fondu ; la nouvelle partie propose exactement les mêmes trois pièces, puis les mêmes tirages |
| 4 | Toucher « Partie libre » | Écran de jeu, en-tête « PARTIE LIBRE » sans date ; « Meilleur » affiche ton ancien record ; les pièces changent d'une partie à l'autre |
| 5 | En pleine partie, toucher le bouton retour | Retour à l'accueil ; la partie est perdue (accepté pour ce sprint) |
| 6 | Finir un défi du jour | Écran de fin avec « DÉFI DU … » au-dessus du titre, boutons « Partager mon score », « Partie libre », « Retour à l'accueil » |
| 7 | Toucher « Partager mon score » après un défi | Le texte commence par « Kubo — défi du 7 octobre — N points » |
| 8 | Toucher « Partie libre » sur cet écran | Une partie libre neuve démarre |
| 9 | Finir une partie libre | Écran de fin sans ligne de date, boutons « Partager mon score », « Rejouer », « Retour à l'accueil » ; le texte partagé commence par « Kubo — partie libre — N points » |
| 10 | Toucher « Rejouer » | Nouvelle partie libre, score 0 |
| 11 | Toucher « Retour à l'accueil » sur l'écran de fin | Accueil ; « Meilleur score » de la partie libre est à jour si tu viens de le battre |
| 12 | Battre le record du défi, puis ouvrir une partie libre | Les deux « Meilleur » sont différents : chacun son mode. Après fermeture et réouverture de l'app, les deux sont conservés |
| 13 | Toucher « Comment jouer ? » | Le tutoriel se rejoue depuis l'étape 1 ; « Passer » ou « C'est parti » ramène à l'accueil, pas à une partie |
| 14 | Regarder chaque changement d'écran | Fondu court, sans écran blanc ni saut ; avec « Réduire les animations », le fondu reste (il n'a pas de mouvement) |
| 15 | Changer la date du téléphone au lendemain, relancer | La carte affiche la nouvelle date et « Jouer » propose d'autres pièces |

### Dépendances ajoutées et pourquoi
- Aucune.

### Écarts par rapport au plan
- **Bouton pause** : il ne figurait pas dans le backlog, rien à retirer ; il est mentionné comme abandonné dans la story K-25.
- **Bouton « Jouer » en K-24** : dans le commit de K-24, « Jouer » et « Partie libre » lançaient tous deux une partie ordinaire ; les deux modes arrivent avec le commit de K-25.
- **Défi rejouable** : on peut rejouer le défi du jour autant de fois qu'on veut, avec les mêmes pièces ; la tentative unique est au sprint suivant. Le texte de la carte dit déjà « Une seule tentative ».
- **Record du défi** : il se compare à tous les défis passés, pas seulement à celui du jour. La pastille de l'écran de fin dit « ★ Nouveau record ».
- **Fondus et « réduire les animations »** : les fondus sont conservés tels quels dans ce mode, puisqu'ils n'ont ni mouvement ni changement d'échelle.
- **Écran de fin** : il s'ouvre toujours avec son propre fondu, par-dessus la grille ; le fondu de K-35 s'applique quand on le quitte.
- **Icônes** : les chevrons (retour, « Partie libre ») sont dessinés avec des vues.
- **Exemples de développement** : avec `EXPO_PUBLIC_SAMPLE_GAME`, l'app s'ouvre directement sur la partie d'exemple, sans tutoriel ni accueil. Ajout de l'état `overfree` et de `EXPO_PUBLIC_TUTORIAL=0`.
- **Incident** : un script de modification s'est arrêté à mi-chemin pendant K-34 (une chaîne ne correspondait pas à cause d'une espace insécable). Les captures prises à ce moment-là montraient l'ancien écran ; elles ont été refaites après correction. Une capture a aussi mis vingt minutes à aboutir, le serveur de développement ayant tardé à démarrer.
- **Android** : rien n'a été testé.

### Passages de la boucle d'intégration et écarts restants, par écran
- **Accueil : 2 passages** (`accueil-1.png`, `accueil-2.png`).
  - Passage 1 : accroche 7 pt trop haute, date de la carte trop petite, texte de la carte un peu large. Corrigés.
  - Passage 2 : logo (125 pt de large), « Kubo » (167 pt pour 164), carte (232 pt de haut pour 233), ligne « Partie libre » (77 pt) et lien conformes.
  - Écarts restants : l'accroche est encore environ 4 pt plus haute que sur la maquette ; le bas de l'écran est 10 pt plus haut, pour rester hors de la zone de l'indicateur d'accueil.
  - Volontairement absents : la pastille « Série » et le bouton des réglages.
- **Écran de jeu : 1 capture** (`jeu-modes-1.png`) comparée à `jeu.png` : bouton retour et titre « DÉFI DU JOUR / Mardi 6 octobre » en place ; le score et la grille n'ont pas bougé. Le titre était légèrement trop large (104 pt pour 95) : espacement et taille réduits après la capture, **sans nouvelle capture**.
- **Écran de fin, défi du jour : 1 capture** (`resultat-defi-1.png`) comparée à `resultat.png` : ligne de date à 80 pt du haut (maquette 80), « Partie libre », « Retour à l'accueil » centré à 788,5 pt (maquette 788,5).
- **Écran de fin, partie libre : 1 capture** (`resultat-libre-1.png`) : même mise en page sans ligne de date, bouton « Rejouer ».

### Proposition de stories détaillées pour le sprint suivant (Défi du jour et « Reviens demain »)
- **K-20 — Suite de pièces du jour** : déjà en place avec `startGame('daily', …)` ; reste à la figer au moment où la partie commence, si minuit passe en cours de partie.
- **K-21 — Sauvegarde et reprise** : l'état du défi du jour est sauvegardé à chaque coup et repris tel quel ; le bouton retour ne fait plus perdre la partie.
- **K-22 — Tentative unique** : une fois le défi terminé, « Jouer » laisse place à l'écran « Reviens demain » (`docs/design/demain.png`) avec un compte à rebours jusqu'à minuit, heure locale.
- **K-23 — Série de jours** : compteur de jours consécutifs joués, avec la pastille « Série » de l'accueil.
- Points à trancher : la partie libre doit-elle aussi être sauvegardée et reprise ? Le record du défi doit-il être par jour (« Nouveau record du jour » de la maquette) ou global comme aujourd'hui ?
