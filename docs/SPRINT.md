# Sprint en cours : Sprint 0 bis — étape 1

**But** : au lancement, l'app affiche l'écran de lancement fidèle à la maquette, puis passe à l'écran titre.
**Hors périmètre** : toute animation, Moti, la logique de jeu.

## Stories

- [x] **K-31a — Écran de lancement statique**
  - Maquette de référence : `docs/design/splash.png`.
  - Fond uni `#12162B`.
  - Logo : grille 3×3 construite avec les images de blocs du pack (pas une image unique), car chaque bloc sera animé séparément plus tard. Disposition, ligne par ligne : violet, violet, cyan / case vide, jaune, cyan / rouge, jaune, jaune.
  - Sous le logo : « Kubo » en Fredoka Bold, puis « Un puzzle par jour. » en DM Sans, couleur `#A9B0DA`.
  - Le tout centré verticalement et horizontalement, zones sûres respectées.
  - L'écran reste affiché environ 1 seconde, puis laisse place à l'écran titre existant.
  - Le splash natif reste visible jusqu'à ce que les polices soient chargées (`expo-splash-screen`), pour éviter un flash ou un texte dans la mauvaise police.
  - Dépendances autorisées pour cette story : `expo-font`, `expo-splash-screen`, `@expo-google-fonts/fredoka`, `@expo-google-fonts/dm-sans`. Les ajouter à la « Stack imposée » de `AGENTS.md`. Appliquer ces deux polices à l'écran titre aussi.
  - Composant découpé pour préparer l'animation : un composant par bloc du logo, un pour le titre, un pour l'accroche.
  - Vérification visuelle obligatoire : boucle « Intégration des écrans » de `AGENTS.md` sur le simulateur iOS (`npx expo start --ios`, captures `docs/design/captures/splash-<n>.png`), 3 passages maximum. Durée de l'écran allongée temporairement pour la capture, puis remise à la valeur normale avant le commit.

## Questions ouvertes
_L'agent note ici ce qui le bloque._
- **Nom de la maquette** : `docs/design/splash.png` n'existe pas. Le fichier présent s'appelle `docs/design/0 · Écran de lancement.png` ; c'est lui qui a servi de référence. Faut-il renommer les maquettes (`splash.png`, `accueil.png`...) ?
- **Maquettes non suivies par Git** : `docs/design/` et `ecrans.zip` (à la racine) ne sont pas commités. Faut-il commiter `docs/design/` et supprimer ou ignorer `ecrans.zip` ?

## Revue de sprint
_À remplir par l'agent à la fin, puis attendre la validation._

### Ce qui a été livré
- **K-31a** : écran de lancement statique `src/screens/LaunchScreen.tsx`, affiché 1 seconde au lancement, puis remplacé par l'écran titre.
- Composants découpés pour l'animation à venir : `LogoBlock` (un par case du logo), `Logo` (grille 3×3), `LaunchTitle`, `LaunchTagline`, dans `src/components/`.
- Polices Fredoka Bold et DM Sans chargées dans `App.tsx` ; le splash natif reste affiché jusqu'à la fin du chargement.
- Écran titre : « Kubo » passe en Fredoka Bold.
- `src/theme.ts` : ajout de `UI.textSoft` (`#A9B0DA`) et de `FONTS` (noms des deux polices).
- `AGENTS.md` : `expo-splash-screen`, `expo-font` et les deux paquets de polices ajoutés à la « Stack imposée ».

### Comment le vérifier
- `npm run check` : sans erreur ni avertissement, 3 tests réussis.
- `npx expo start --ios` (ou `npm run start` puis Expo Go sur téléphone).
- À l'écran, pendant environ 1 seconde : fond uni bleu très sombre, logo 3×3 (violet, violet, cyan / case vide, jaune, cyan / rouge, jaune, jaune), « Kubo » en blanc dans une police ronde et grasse, puis « Un puzzle par jour. » en bleu-gris clair. Ensuite l'écran titre : fond en dégradé et « Kubo » centré, dans la même police.
- Vérifié par l'agent sur le simulateur iOS (iPhone 18 Pro, Expo Go) : écran de lancement, puis passage à l'écran titre, sans erreur dans les logs Metro.
- **Non vérifié** : le splash natif personnalisé et l'absence de flash à la transition (Expo Go affiche son propre écran de chargement) ; Android ; un vrai téléphone.

### Dépendances ajoutées et pourquoi
- `expo-font` : chargement des polices (autorisée par la story).
- `@expo-google-fonts/fredoka` : Fredoka Bold pour le titre (autorisée par la story).
- `@expo-google-fonts/dm-sans` : DM Sans pour l'accroche (autorisée par la story).
- `expo-splash-screen` : déjà installée au Sprint 0, désormais utilisée dans le code pour retenir le splash natif.

### Écarts par rapport au plan
- **Maquette** : référence utilisée `docs/design/0 · Écran de lancement.png` et non `docs/design/splash.png`, qui n'existe pas (voir « Questions ouvertes »).
- **Centrage vertical** : la maquette place l'ensemble légèrement au-dessus du centre (environ 48 % de la hauteur). Un décalage de 24 pt vers le haut a été appliqué pour la suivre, au lieu d'un centrage strict.
- **DM Sans sur l'écran titre** : l'écran titre ne contient que le mot « Kubo » ; seule Fredoka Bold y est donc appliquée.
- **`src/theme.ts` modifié** (fichier issu du pack) pour y ajouter la couleur de l'accroche et les noms de polices, puisque les couleurs ne doivent venir que de ce fichier.
- **`app.json`** : `npx expo install expo-font` a ajouté le plugin `expo-font` automatiquement.
- **Simulateur** : le premier `npx expo start --ios` a échoué sur un délai d'attente pendant le démarrage à froid du simulateur ; la même commande a réussi au second essai. La première capture montrait la fenêtre d'accueil du menu développeur d'Expo Go ; elle a été écartée, l'accueil a été marqué comme vu dans les réglages d'Expo Go du simulateur (`defaults write host.exp.Exponent EXDevMenuIsOnboardingFinished`), et la capture refaite.

### Passages de la boucle d'intégration et écarts restants, par écran
- **Écran de lancement : 2 passages** (`splash-1.png`, `splash-2.png`).
  - Passage 1 : blocs trop petits (53 pt contre 55), espace logo → titre trop serré (23 pt contre 40), titre et accroche trop petits, ensemble trop bas. Corrigés.
  - Passage 2 : bloc 55,5 pt (maquette 55), pas de grille 66 pt (66), espace logo → titre 42 pt (40,5), largeur du titre 184 pt (181,5), largeur de l'accroche 142,5 pt (143).
  - Écarts restants : aucun notable. L'ensemble est environ 8 pt plus bas que sur la maquette, à cause de l'encoche plus haute de l'iPhone 18 Pro (zone sûre). Le bouton bleu en haut à droite des captures est celui d'Expo Go.
- **Écran titre** : pas de maquette dédiée, donc pas de boucle ; une capture de contrôle confirme la police et la transition.

### Proposition de stories détaillées pour le sprint suivant (Sprint 0 bis — étape 2)
- **K-31b — Animation de l'écran de lancement avec Moti**
  - Préalable : installer `react-native-reanimated` avec `npx expo install`, puis vérifier la compatibilité de `moti` avec cette version. Si incompatible : ne rien installer, noter dans « Questions ouvertes », s'arrêter.
  - `LogoBlock` : chute avec rebond (`spring`), `delay` croissant par bloc, de bas en haut.
  - `Logo` : courte pulsation une fois les 9 cases en place.
  - `LaunchTitle` puis `LaunchTagline` : montée en fondu (`timing`).
  - Durée totale inférieure à 1,5 seconde, puis transition vers l'écran titre ; jouée une seule fois, au lancement à froid.
  - Réglage système « réduire les animations » : logo complet affiché directement, sans mouvement.
  - Point à trancher : la case vide du logo tombe-t-elle comme les autres ou est-elle présente dès le départ ?
