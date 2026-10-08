# Sprint en cours : Réglages

**But** : le joueur peut couper les sons et les vibrations, et retrouver les règles.
**Hors périmètre** : comptes, notifications, langues, thèmes, suppression des données.
**Branche** : `sprint/settings`

## Stories

- [x] **K-28 — Écran des réglages**
  - Maquette : `docs/design/reglages.png`.
  - Contenu : le bouton retour et le titre « Réglages » ; une carte avec deux interrupteurs, « Sons » (« Pose, effacement, combo ») et « Vibrations » (« Retour tactile à la pose ») ; la carte « Comment jouer » avec ses trois règles ; en bas, « Kubo · version X », la version étant lue depuis la configuration de l'app.
  - Ajoute sous les trois règles un lien « Revoir le tutoriel », qui rejoue le tutoriel puis revient aux réglages.
  - Les interrupteurs sont de vrais composants accessibles (rôle « switch », état annoncé par VoiceOver), avec une cible tactile d'au moins 44 pt.

- [x] **K-39 — Préférences sauvegardées**
  - Les deux réglages sont sauvegardés et relus au démarrage, avant le premier son possible. Clé versionnée ; une valeur illisible redonne « activé ».
  - Le module de préférences existant devient la seule source de vérité ; le changement d'un réglage s'applique immédiatement, sans relancer l'app.
  - Activer les sons joue `place` en confirmation ; activer les vibrations déclenche une vibration légère.
  - Tests sur la lecture, l'écriture et la valeur par défaut.

- [x] **K-40 — Accès aux réglages**
  - Le bouton des réglages apparaît en haut à droite de l'accueil et de « Reviens demain », comme sur leurs maquettes.
  - Le retour depuis les réglages ramène à l'écran d'où l'on vient.

- [x] **K-38 — Deux retouches du défi du jour**
  - Écran de fin du défi du jour : sous les statistiques, une ligne « Prochain défi dans 5 h 12 », mise à jour chaque minute.
  - « Nouveau record » est sauvegardé avec le résultat du défi, et la pastille s'affiche aussi quand on revoit son résultat.

## Vérification
- `npm run check` après chaque story.
- Boucle « Intégration des écrans » sur les réglages, 3 passages maximum.
- Une capture de l'accueil et de « Reviens demain » avec le bouton des réglages, et de l'écran de fin du défi avec la ligne du prochain défi.
- Relance le scénario `stress` une fois, pour vérifier l'absence de régression : zéro `[KUBO-DIVERGENCE]`.
- Liste de contrôle à dérouler à la main : couper les sons puis jouer, couper les vibrations puis jouer, fermer et rouvrir l'app (réglages conservés), les interrupteurs avec VoiceOver, « Revoir le tutoriel », le retour vers l'écran d'origine, la ligne du prochain défi, la pastille en revoyant un résultat record.

## Fin du sprint
Un commit par story, push après chacune, revue de sprint remplie, puis arrêt. Pas de fusion par l'agent.

## Questions ouvertes
_L'agent note ici ce qui le bloque._

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._

### Branche
`sprint/settings`, créée depuis `main` après la fusion de `sprint/daily-challenge`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### Ce qui a été livré
- **K-28** `src/screens/SettingsScreen.tsx` : bouton retour, titre « Réglages », carte des deux interrupteurs, carte « Comment jouer » avec ses trois règles et le lien « Revoir le tutoriel », « Kubo · version 1.0.0 » en bas (version lue dans `app.json`). Le tutoriel rejoué depuis les réglages y revient, qu'il soit terminé ou passé. `src/components/SwitchRow.tsx` : toute la ligne est l'interrupteur (rôle `switch`, libellé, description en indication, état coché annoncé), haute de 65 pt.
- **K-39** `src/storage/preferences.ts` : les deux réglages sont sauvegardés sous la clé `kubo:preferences:v1` et relus au démarrage, avant que l'écran suivant l'écran de lancement n'apparaisse, donc avant tout son. Toute valeur absente ou illisible vaut « activé ». Sons et vibrations lisent ce module à chaque déclenchement : un changement s'applique tout de suite. Activer les sons joue `place` ; activer les vibrations déclenche une vibration légère.
- **K-40** `src/components/SettingsButton.tsx` : bouton rond en haut à droite de l'accueil et de « Reviens demain ». Le retour des réglages ramène à l'écran d'origine (à l'accueil si le défi terminé n'est plus celui du jour).
- **K-38** :
  - écran de fin du défi du jour : ligne « Prochain défi dans 5 h 12 » sous les statistiques, relue à chaque changement de minute (`src/hooks/useTimeUntilNextDay.ts`, format dans `src/game/days.ts`) ;
  - « Nouveau record » est sauvegardé avec le résultat du défi (`isNewRecord`, même clé `kubo:daily:v1`) et la pastille s'affiche en revoyant son résultat.

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 228 tests réussis.
- Outils de développement ajoutés (arrêter d'abord tout serveur Expo) :
  - `EXPO_PUBLIC_SETTINGS=1` : ouvre l'app sur les réglages ;
  - `EXPO_PUBLIC_SAMPLE_DAILY=result` : ouvre l'app sur le résultat du défi du jour revu, avec un nouveau record.
- **Vérifié par l'agent** : `npm run check` après chaque story ; l'affichage sur le simulateur iOS (iPhone 18 Pro, Expo Go) des réglages, de l'accueil, de « Reviens demain » et de l'écran de fin du défi, sans erreur ni avertissement dans Metro ; le scénario `stress`, relancé une fois : 66 coups, 22 tirages, **0 `[KUBO-DIVERGENCE]`**.
- **Non vérifié par l'agent** : tout ce qui demande de toucher l'écran ou d'écouter — basculer un interrupteur, le son et la vibration de confirmation, le silence en jeu une fois les sons coupés, la conservation après fermeture de l'app, VoiceOver, « Revoir le tutoriel » et son retour, l'ouverture des réglages par leur bouton et le retour vers l'écran d'origine, le passage d'une minute à l'autre sur la ligne du prochain défi, la pastille après une vraie partie record. Ces comportements ne sont couverts que par les tests des préférences, du stockage et de la logique de dates.
- Android : rien n'a été testé.

### Liste de contrôle à dérouler à la main
| # | Action | Ce que tu dois observer |
|---|---|---|
| 1 | Accueil, bouton en haut à droite | Les réglages s'ouvrent ; les deux interrupteurs sont activés au premier lancement |
| 2 | Couper « Sons », revenir, jouer une partie libre | Aucun son (prise, pose, refus, effacement, fin) ; les vibrations restent |
| 3 | Réactiver « Sons » | Le son de pose se fait entendre tout de suite |
| 4 | Couper « Vibrations », jouer | Aucune vibration ; les sons restent |
| 5 | Réactiver « Vibrations » | Une vibration légère tout de suite |
| 6 | Couper les deux, fermer complètement l'app, la rouvrir | Les deux interrupteurs sont toujours coupés, et le jeu est muet dès le premier coup |
| 7 | VoiceOver sur les réglages | « Sons, interrupteur, activé / désactivé », avec l'indication « Pose, effacement, combo » ; un double appui bascule et l'état est annoncé ; de même pour « Vibrations » |
| 8 | « Revoir le tutoriel », le terminer ; recommencer avec « Passer » | Retour aux réglages dans les deux cas ; le retour mène ensuite à l'écran d'origine |
| 9 | Ouvrir les réglages depuis l'accueil, retour | Accueil |
| 10 | Défi terminé, « Voir », bouton des réglages, retour | « Reviens demain » |
| 11 | Finir le défi du jour | Sous les statistiques : « Prochain défi dans X h YY » (ou « YY min » à moins d'une heure) ; la valeur baisse d'une minute en même temps que l'horloge |
| 12 | Finir le défi sur un record, « Retour à l'accueil », « Voir », « Revoir mon résultat » | La pastille « ★ Nouveau record » est là ; elle y est encore après fermeture et réouverture de l'app |
| 13 | « Revoir mon résultat » d'un défi sans record | Pas de pastille |

### Dépendances ajoutées et pourquoi
- Aucune. La version vient d'un import de `app.json`, sans `expo-constants`.

### Écarts par rapport au plan
- **Version affichée** : « 1.0.0 », telle qu'écrite dans `app.json` ; la maquette montre « 1.0 ».
- **Interrupteurs** : dessinés (piste 60 × 34, vert du pack, pastille blanche) plutôt que le `Switch` natif, pour suivre la maquette et faire de toute la ligne la cible tactile. Éteinte, la piste prend la couleur `dotInactive` ; la maquette ne montre pas cet état.
- **« Revoir le tutoriel »** : lien jaune avec un chevron, aligné sur le texte des règles ; il n'est pas sur la maquette, sa forme est un choix de l'agent.
- **Défilement** : les réglages défilent si l'écran est trop petit pour tout afficher.
- **Résultat enregistré avant K-38** : il est relu comme n'étant pas un record.
- **Ligne du prochain défi** : affichée seulement tant que le jour du défi est le jour courant ; elle disparaît à minuit (ou pour un défi fini après minuit), sans texte de remplacement. À moins d'une heure, elle s'écrit « 12 min ». Elle ajoute environ 5 pt à la hauteur de l'écran de fin du défi (l'espace avant « Partager mon score » passe de 29 à 14 pt de part et d'autre de la ligne).
- **Record et sauvegarde** : le record est maintenant calculé juste avant l'enregistrement du dernier coup du défi, pour être sauvegardé avec lui.
- **Icône des réglages** : deux curseurs dessinés avec des vues, un peu plus épais que sur la maquette.
- **Liste des sons** : l'écran des réglages charge tous les sons du jeu pour n'en jouer qu'un (`place`), en réutilisant `useSounds` tel quel.
- **Serveur Expo** : un serveur tournait déjà sur le port 8081 (`expo start --ios`, lancé à 22 h 37) ; je ne l'ai pas arrêté. Mes captures viennent d'un second serveur sur le port 8082, arrêté à la fin ; Expo Go du simulateur a été relancé sur le 8081.

### Passages de la boucle d'intégration et écarts restants, par écran
- **Réglages : 2 passages** (`reglages-1.png`, `reglages-2.png`). Le simulateur fait 402 pt de large pour 390 sur la maquette.
  - Passage 1 : titre trop grand (121 pt de large pour 114), descriptions des interrupteurs et textes des règles trop grands (environ 7 %), « Comment jouer » trop petit (129 pt pour 136), blocs des règles trop petits (28 pt visibles pour 31), première ligne de la carte des interrupteurs 2,5 pt trop haute. Corrigés.
  - Passage 2 : titre 113 pt (maquette 114), « Pose, effacement, combo » 164 pt (164), « Comment jouer » 136 pt (136), titre de règle 216 pt (216), blocs 31,5 pt (31), interrupteurs 60 × 34.
  - Écarts restants : carte des interrupteurs haute de 140 pt pour 138 ; les textes des règles 2 et 3 coupent leurs lignes ailleurs, l'écran étant plus large ; « 1.0.0 » ; le lien ajouté.
  - Sur les captures, la roue bleue en haut à droite est le bouton d'outils d'Expo Go, pas un élément de l'app.
- **Accueil et « Reviens demain » avec le bouton des réglages : 1 capture chacun** (`accueil-reglages.png`, `demain-reglages.png`). **Le bouton d'outils d'Expo Go recouvre exactement le bouton des réglages sur ces deux captures : on ne l'y voit pas.** Je n'ai aucun moyen de déplacer ce bouton flottant sans toucher l'écran. Pour contrôler le dessin de l'icône, j'ai décalé le bouton de 70 pt vers le bas le temps de deux captures non conservées (décalage retiré, absent du code) : rond de 44 pt, deux curseurs, pastille gauche en haut et droite en bas, comme sur la maquette. Sa position réelle (aligné à droite, sur la ligne du bouton retour ou de la pastille de série) n'a donc pas été vue : à vérifier sur ton téléphone.
- **Écran de fin du défi : 1 capture** (`resultat-defi-prochain.png`, état `EXPO_PUBLIC_SAMPLE_DAILY=result`) : la pastille « ★ Nouveau record » et la ligne « Prochain défi dans 1 h 02 » à 22 h 58, tout l'écran tient sans chevauchement.

### Proposition pour la suite
- Le sprint suivant du backlog est « Finition » (K-29 accessibilité et tailles d'écran, K-30 build de test). Avec un build de test, le bouton d'Expo Go ne gênerait plus les captures.
