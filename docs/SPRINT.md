# Sprint en cours : Réglages

**But** : le joueur peut couper les sons et les vibrations, et retrouver les règles.
**Hors périmètre** : comptes, notifications, langues, thèmes, suppression des données.
**Branche** : `sprint/settings`

## Stories

- [ ] **K-28 — Écran des réglages**
  - Maquette : `docs/design/reglages.png`.
  - Contenu : le bouton retour et le titre « Réglages » ; une carte avec deux interrupteurs, « Sons » (« Pose, effacement, combo ») et « Vibrations » (« Retour tactile à la pose ») ; la carte « Comment jouer » avec ses trois règles ; en bas, « Kubo · version X », la version étant lue depuis la configuration de l'app.
  - Ajoute sous les trois règles un lien « Revoir le tutoriel », qui rejoue le tutoriel puis revient aux réglages.
  - Les interrupteurs sont de vrais composants accessibles (rôle « switch », état annoncé par VoiceOver), avec une cible tactile d'au moins 44 pt.

- [ ] **K-39 — Préférences sauvegardées**
  - Les deux réglages sont sauvegardés et relus au démarrage, avant le premier son possible. Clé versionnée ; une valeur illisible redonne « activé ».
  - Le module de préférences existant devient la seule source de vérité ; le changement d'un réglage s'applique immédiatement, sans relancer l'app.
  - Activer les sons joue `place` en confirmation ; activer les vibrations déclenche une vibration légère.
  - Tests sur la lecture, l'écriture et la valeur par défaut.

- [ ] **K-40 — Accès aux réglages**
  - Le bouton des réglages apparaît en haut à droite de l'accueil et de « Reviens demain », comme sur leurs maquettes.
  - Le retour depuis les réglages ramène à l'écran d'où l'on vient.

- [ ] **K-38 — Deux retouches du défi du jour**
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
- Branche :
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
