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

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Branche :
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
