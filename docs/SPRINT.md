# Sprint en cours : Écran de jeu, partie 3 — sensations

**But** : chaque action du joueur a une réponse visuelle, sonore et tactile.
**Hors périmètre** : meilleur score, sauvegarde, écran de fin définitif, en-tête, écran de réglages.
**Branche** : `sprint/game-screen-3`

**Règles communes**
- Les règles du jeu ne changent pas et restent dans `src/game/`. Si l'interface a besoin de savoir quelles lignes et colonnes viennent d'être effacées, exposer cette information par une fonction pure et testée, sans dupliquer la logique.
- Aucun effet ne bloque le jeu : on peut saisir la pièce suivante pendant une animation.
- Un module de préférences avec deux valeurs, sons et vibrations, à vrai par défaut. Tous les effets le consultent. L'écran de réglages les branchera plus tard.

## Stories

- [ ] **K-18 — Animations**
  - Pose : la pièce glisse de sa position sous le doigt jusqu'à ses cases (90 ms environ), puis ses blocs font un léger rebond d'échelle.
  - Effacement : les cases de la ligne ou de la colonne s'illuminent brièvement, puis rétrécissent jusqu'à disparaître, avec un court décalage de case en case. 250 à 300 ms au total.
  - Score : le nombre fait une petite pulsation quand il change, et le gain d'un effacement apparaît en « +N » près des cases effacées, monte et s'estompe.
  - Nouveau tirage : les trois pièces apparaissent en grossissant, légèrement décalées.
  - Toutes les durées dans un objet de constantes unique.
  - « Réduire les animations » : pas de mouvement ni d'échelle, de simples fondus.

- [ ] **K-16 — Sons**
  - `expo-audio`, sons du pack préchargés au démarrage de l'écran.
  - Saisie : pick. Pose valide : place. Retour au plateau : invalid. Effacement simple : clear. Effacement de 2 lignes ou plus, ou en série : combo. Fin de partie : gameover.
  - Une pose qui efface joue clear ou combo, pas place en plus.
  - Les sons respectent le mode silencieux de l'iPhone et ne coupent pas la musique de l'utilisateur.
  - Un échec de lecture ne doit jamais faire planter le jeu.

- [ ] **K-17 — Vibrations**
  - `expo-haptics`. Saisie : légère. Pose valide : moyenne. Effacement : retour de type succès. Retour au plateau : avertissement. Fin de partie : forte.

## Vérification
- `npm run check` après chaque story.
- L'agent ne peut ni faire de geste, ni entendre, ni sentir une vibration : il ne déclare aucun de ces effets vérifié.
- Pour les animations : un mode de démonstration réservé au développement (`EXPO_PUBLIC_SAMPLE_GAME=demo`) rejoue automatiquement une courte suite de coups : une pose simple, un effacement de ligne, un effacement ligne + colonne, un nouveau tirage. Vidéo dans `docs/design/captures/game-demo.mov`, avec les instants de chaque coup. Quelques images extraites pour confirmer que les animations se déclenchent, sans juger leur qualité.
- Dans la revue : une liste de contrôle à dérouler à la main sur un vrai téléphone, avec pour chaque action le son et la vibration attendus.

## Questions ouvertes
_L'agent note ici ce qui le bloque._

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._
- Branche :
- Ce qui a été livré :
- Comment le vérifier (commandes, ce qu'on doit voir à l'écran) :
- Vidéo de démonstration et instants de chaque coup :
- Liste de contrôle sons et vibrations, à dérouler à la main sur un vrai téléphone :
- Dépendances ajoutées et pourquoi :
- Écarts par rapport au plan :
- Proposition de stories détaillées pour le sprint suivant :
