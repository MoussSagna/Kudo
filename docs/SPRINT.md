# Sprint en cours : Finition et premier build

**But** : une version de Kubo installable hors d'Expo Go, propre sur toutes les tailles d'iPhone, accessible, et sans aucun outil de développement.
**Hors périmètre** : publication sur les stores, nouvelles fonctionnalités.
**Branche** : `sprint/release`

## Stories

- [x] **K-41 — Outils de développement exclus de la version finale**
  - Toutes les variables `EXPO_PUBLIC_*` de développement (états d'exemple, date simulée, effacement des données, tutoriel forcé, scénario `stress`) et le contrôle `[KUBO-DIVERGENCE]` sont ignorés hors mode développement (`__DEV__`).
  - Un test vérifie qu'en mode production, aucune de ces variables n'a d'effet.

- [x] **K-29 — Tailles d'écran et accessibilité**
  - L'app reste en portrait et ne cible que l'iPhone (pas de version iPad pour cette première version) : règle `app.json` en conséquence.
  - Vérifie chaque écran sur le plus petit iPhone disponible dans le simulateur (type iPhone SE) et sur le plus grand (type Pro Max) : rien ne déborde, rien ne se chevauche, la grille et le plateau tiennent sans défilement.
  - Taille de texte du système : limite l'agrandissement là où il casserait la mise en page (titres, score, grille), sans le bloquer pour les textes courants.
  - VoiceOver : chaque bouton et lien a un libellé en français ; le score, la série et le compte à rebours sont lisibles. Le glisser-déposer n'est pas rendu jouable au lecteur d'écran dans cette version : note-le dans le backlog, section « Idées ».
  - Contrastes : vérifie que les textes secondaires (`#A9B0DA` et équivalents) restent lisibles sur leur fond.

- [ ] **K-30 — Préparer le build**
  - Identifiant d'application : `com.moussasagna.kubo` pour iOS et Android. Nom affiché sous l'icône : « Kubo ».
  - Vérifie l'icône, l'icône adaptative Android et le splash natif (fond `#12162B`) dans `app.json`, et que le passage du splash natif à l'écran de lancement animé se fait sans flash, comme demandé en K-31.
  - Ajoute un fichier `eas.json` avec un profil `preview` (installation interne) et un profil `production`.
  - Rédige `docs/BUILD.md` : comment produire un build iOS installable sur mon iPhone, comment produire un APK Android, et ce qui nécessite mon intervention (connexion à mon compte Expo, compte Apple, appareil branché). Tu ne te connectes à aucun compte et tu ne lances aucun build distant toi-même.
  - Si c'est possible sans compte, lance un build local en configuration Release pour le simulateur iOS et vérifie que l'app démarre, que le splash et l'icône sont les bons et qu'aucun outil de développement n'est actif. Sinon, dis-le.

## Vérification
- `npm run check` après chaque story, et le scénario `stress` une fois en fin de sprint (en mode développement).
- Captures de chaque écran sur le petit et le grand iPhone ; 3 passages maximum par écran s'il y a des corrections.
- Liste de contrôle à dérouler à la main sur le build installé : premier lancement complet (splash natif, animation, tutoriel, accueil), une partie de chaque mode, réglages, VoiceOver sur l'accueil et les réglages.

## Fin du sprint
Un commit par story, push après chacune, revue de sprint remplie, puis arrêt. Pas de fusion par l'agent.

## Questions ouvertes
_L'agent note ici ce qui le bloque._

- **K-30 — le build Release plante au lancement sur iOS 27.** Le build local pour le simulateur (Xcode 27, iPhone 18 Pro, iOS 27) se compile et s'installe, mais l'app se ferme dès le lancement : `UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption` (rapports `Kubo-2026-10-09-080943.ips` et `Kubo-2026-10-09-113741.ips` dans `~/Library/Logs/DiagnosticReports/`). iOS 27 exige le cycle de vie « UIScene » ; Expo 57.0.27 contient `ExpoAppSceneDelegate` mais son gabarit natif (`node_modules/expo/template.tgz`) ne le branche pas. Je n'ai pas tenté de correctif : cela revient à modifier le projet natif généré (plugin maison) ou à changer de version d'Expo ou de gabarit, ce qui dépasse la story et demande ton accord. Que veux-tu : (a) que j'essaie le gabarit `expo-template-bare-minimum@57.0.29`, plus récent que celui livré avec Expo, (b) un plugin de configuration qui branche `ExpoAppSceneDelegate`, (c) attendre une mise à jour d'Expo, ou (d) tenter d'abord un build EAS de ton côté ?
- **K-30 — chemin du projet avec un espace.** Depuis `Mouss coding/Kubo`, la compilation native échoue dans un script d'`expo-constants`. J'ai compilé depuis une copie temporaire sans espace. Veux-tu déplacer le projet, ou garder cette contrainte documentée dans `docs/BUILD.md` ?

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._

### Branche
`sprint/release`, créée depuis `main` après la fusion de `sprint/settings`, poussée sur `origin`. Non fusionnée : c'est Moussa qui fusionne dans `main` après validation.

### État du sprint
- K-41 et K-29 : terminées.
- **K-30 : non cochée.** La configuration, `eas.json` et `docs/BUILD.md` sont livrés, le build local se compile et s'installe, mais **l'app plante au lancement** dans ce build (voir « Questions ouvertes »). Le but du sprint — une version installable hors d'Expo Go — n'est donc pas atteint.

### Ce qui a été livré
- **K-41** `src/dev/devFlags.ts` : seul endroit du code qui lit les variables `EXPO_PUBLIC_*`. Hors `__DEV__`, `readDevFlags` rend toujours « aucun outil » : date simulée, effacement des données, tutoriel forcé, parties et défis d'exemple, ouverture sur les réglages, scénario `stress` et son contrôle `[KUBO-DIVERGENCE]`. Test : en production, avec toutes les variables renseignées, aucun outil n'est demandé.
- **K-29**
  - `app.json` : `supportsTablet` à `false` ; l'orientation était déjà `portrait`.
  - Petits écrans : la taille des cases dépend maintenant aussi de la hauteur (`src/components/boardCellSize.ts`, testé), pour le jeu et le tutoriel ; l'accueil, l'écran de fin et « Reviens demain » ont une mise en page resserrée sous 700 pt de haut (`useIsCompactScreen`).
  - Taille de texte du système (`TEXT_SCALE` dans `src/theme.ts`) : figée pour le score, le compte à rebours, la grille, les illustrations et l'écran de lancement ; × 1,15 au plus pour les titres et libellés de boutons ; × 1,35 pour les textes courants ; × 1,8 dans les réglages, qui défilent. L'accueil et « Reviens demain » défilent si un grand texte les rend plus hauts que l'écran.
  - VoiceOver : bloc du score (« Score : 1240. Série de combos : 2. Meilleur score : … »), compte à rebours (« Prochain défi dans 2 heures 14 minutes »), semaine (« Jours joués cette semaine : lundi, mardi »), statistiques de fin (« 38 pièces posées »), étape du tutoriel (« Étape 1 sur 3 »), titres annoncés comme titres. Les boutons et liens avaient déjà leur libellé.
  - Contrastes calculés (WCAG) : `#A9B0DA` de 6,3 à 8,4 selon le fond ; `#8F97C4` de 4,7 à 6,3 ; jaune `#FFD23F` de 9,3 à 12,4. Tous au-dessus de 4,5. Aucune couleur changée.
  - Backlog, « Idées » : le jeu au lecteur d'écran, et la piste de l'interrupteur éteint.
- **K-30** (partiel)
  - `app.json` : `ios.bundleIdentifier` et `android.package` à `com.moussasagna.kubo`. Nom « Kubo », icône 1024 × 1024 sans transparence, icône adaptative (premier plan transparent, fond `#12162B`), splash natif sur `#12162B` : vérifiés dans la configuration, inchangés.
  - `eas.json` : profils `preview` (interne, APK pour Android) et `production`.
  - `docs/BUILD.md` : build iOS pour ton iPhone, APK Android, build local, ce qui demande ton intervention, liste de contrôle.

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 238 tests réussis.
- Scénario `stress` en mode développement, relancé une fois en fin de sprint : 66 coups, 22 tirages, **0 `[KUBO-DIVERGENCE]`**.
- **Vérifié par l'agent sur simulateur** (Expo Go, mode développement) : chaque écran sur un iPhone SE (3e génération, 375 × 667) et un iPhone 18 Pro Max — accueil, tutoriel (5 états), jeu (partie d'exemple et plus grandes pièces), fin de défi, fin de partie libre, « Reviens demain », réglages. Rien ne déborde ni ne se chevauche ; la grille et le plateau tiennent sans défilement. Avec la plus grande taille de texte du système : accueil, jeu, réglages, « Reviens demain », écran de fin, tutoriel.
- **Vérifié sur le build Release local** : compilation et installation sans compte ; sur l'écran d'accueil du simulateur, l'icône de Kubo et le nom « Kubo » ; au lancement, le fond `#12162B` du splash.
- **Non vérifié** :
  - dans le build Release : tout ce qui suit le splash — l'animation de lancement et l'absence de flash, le tutoriel, le jeu, l'absence d'outil actif à l'écran — puisque l'app se ferme ;
  - VoiceOver n'a pas été écouté : les libellés sont dans le code, leur lecture réelle reste à faire sur ton téléphone ;
  - l'écran de lancement n'a pas été capturé sur les deux tailles (il ne dure que trois secondes) ;
  - Android : rien n'a été testé ; aucun build distant n'a été lancé.

### Liste de contrôle à dérouler à la main
Elle est dans `docs/BUILD.md`, section « Liste de contrôle sur le build installé » (9 points). Elle ne pourra être déroulée qu'une fois le plantage au lancement réglé. En attendant, dans Expo Go :
| # | Action | Ce que tu dois observer |
|---|---|---|
| 1 | Réglages iOS › Accessibilité › Taille du texte au maximum, puis ouvrir chaque écran | Les textes courants grossissent, les titres un peu, le score et la grille pas du tout ; rien ne se chevauche ; l'accueil et « Reviens demain » défilent si besoin |
| 2 | VoiceOver sur l'accueil | « Série : N jours », « Réglages, bouton », la carte du défi, « Partie libre, Meilleur score… », « Comment jouer ? » |
| 3 | VoiceOver en jeu | « Score : … Meilleur score : … » en un seul élément ; « Retour à l'accueil, bouton ». La grille et les pièces ne sont pas annoncées |
| 4 | VoiceOver sur « Reviens demain » | « Prochain défi dans X heures Y minutes », « Jours joués cette semaine : … » |
| 5 | Une partie sur un petit iPhone si tu en as un | La grille est plus petite que la largeur de l'écran, le plateau ne la touche pas |

### Dépendances ajoutées et pourquoi
- Aucune.

### Écarts par rapport au plan
- **Petits écrans** : sur l'iPhone SE, la grille ne remplit plus la largeur (cases d'environ 35 pt au lieu de 42) pour que le plateau tienne ; logo, titres et cartes sont réduits sur l'accueil, l'écran de fin et « Reviens demain ».
- **Bas de l'écran de jeu** : la marge minimale passe de 34 à 16 pt sur les téléphones sans barre d'accueil ; rien ne change sur les autres.
- **Textes courants** : ils ne suivent pas le système sans limite (× 1,35, × 1,8 dans les réglages), parce que la plupart vivent dans des cartes de hauteur fixe. C'est un choix de l'agent, à ajuster si tu veux aller plus loin.
- **Dates longues** : la date de la carte du défi et la ligne « Défi du … » de l'écran de fin rétrécissent pour tenir sur une ligne.
- **Test K-41** : il porte sur la fonction qui lit les variables. Un test qui aurait parcouru le code source pour interdire toute autre lecture demandait les types de Node, donc une dépendance ; je l'ai vérifié à la main (`process.env` n'apparaît que dans `src/dev/devFlags.ts`).
- **Code de développement embarqué** : le scénario `stress` et ses messages restent dans le fichier JavaScript du build, inactifs.
- **Interrupteur éteint** : sa piste a un contraste de 1,9 sur la carte ; noté dans les idées, pas corrigé.
- **Captures** : `docs/design/captures/` est ignoré par git ; les captures de ce sprint sont dans `docs/design/captures/tailles/` sur cette machine seulement.
- **Simulateurs** : j'ai créé un simulateur « Kubo iPhone SE » (aucun petit iPhone n'était installé) et utilisé l'iPhone 18 Pro Max ; j'y ai installé Expo Go en le recopiant depuis l'iPhone 18 Pro, avec son autorisation d'ouverture des liens. Les deux sont éteints. J'ai redémarré l'iPhone 18 Pro pour fermer une alerte système restée ouverte, et j'en ai désinstallé le build Release qui plantait.
- **Machine très chargée** (pgAdmin, charge système au-dessus de 100) : le build Release a pris environ trois heures.

### Passages de la boucle d'intégration et écarts restants, par écran
Captures dans `docs/design/captures/tailles/`, suffixes `-se` et `-max`. La roue bleue en haut à droite est le bouton d'Expo Go ; elle recouvre le bouton des réglages.
- **Accueil : 3 passages.** 1 : sur le SE, le logo et la carte se chevauchaient, l'accroche disparaissait. 2 : mise en page resserrée, tout tient. 3 : contrôle après l'ajout du défilement pour les grands textes. Reste : avec le texte au maximum sur le SE, l'accroche touche presque la carte.
- **Jeu : 2 passages.** 1 : sur le SE, le plateau recouvrait les deux dernières lignes de la grille. 2 : grille et plateau entiers, sans défilement, y compris avec les pièces de 5 cases.
- **Tutoriel, étapes 1 et 2 : 2 passages.** Même défaut et même correction que le jeu. Étape 3 : 1 passage, rien à corriger.
- **Écran de fin (défi et partie libre) : 3 passages.** 1 : sur le SE, les boutons sortaient de l'écran. 2 : tout tient, avec de la place perdue en bas. 3 : grille un peu agrandie. Reste : sur le Pro Max, un vide sous « Retour à l'accueil », comme avant ce sprint.
- **« Reviens demain » : 3 passages.** 1 : sur le SE, le titre passait sous la carte du compte à rebours et les boutons recouvraient la série. 2 : mise en page resserrée. 3 : contrôle après l'ajout du défilement. Avec le texte au maximum sur le SE, le second bouton n'est visible qu'en faisant défiler.
- **Réglages : 2 passages.** 1 : rien à corriger en taille normale (la version se lit en faisant défiler sur le SE) ; avec le texte au maximum, les libellés des interrupteurs se coupaient en plein mot. 2 : limite à × 1,8, libellés entiers.
- **Pro Max** : aucun défaut relevé sur aucun écran.

### Proposition pour la suite
- Trancher la question du plantage au lancement (« Questions ouvertes »), puis refaire le build Release et dérouler la liste de contrôle de `docs/BUILD.md`.
- Ensuite seulement : enregistrement de ton iPhone et premier build `preview`.
