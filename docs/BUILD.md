# Kubo — produire un build

Ce document explique comment obtenir une version de Kubo installable hors d'Expo Go.
Les builds se font dans le cloud avec EAS Build. Ce qui est marqué **Moussa** demande ton intervention.

## Ce qui marche, et ce qui ne marche pas
- **Marche : build EAS avec Xcode 26.6.** Le build iOS `simulator` du 9 octobre 2026 démarre sans planter sur le simulateur iOS 27 : splash natif, animation de lancement sans flash, tutoriel, accueil, aucun outil de développement.
- **Ne marche pas : build local avec Xcode 27.** L'app se compile et s'installe, puis se ferme au lancement (`UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`). Une app compilée avec Xcode 27 doit adopter le cycle de vie « UIScene », ce que le projet natif généré par Expo 57 ne fait pas. Décision : on ne touche pas au projet natif ; on compile avec Xcode 26 sur EAS, et on passera à Expo SDK 58 à sa sortie stable (voir « Idées » du backlog).

## Ce qui est en place
- `app.json` : nom « Kubo », identifiant `com.moussasagna.kubo` (iOS et Android), portrait, iPhone uniquement, icône, icône adaptative Android, splash natif sur fond `#12162B`, et le lien vers le projet EAS `@mousgamee/kubo` (`extra.eas.projectId`, `owner`).
- `eas.json` : trois profils.
  - `simulator` : build iOS pour le simulateur, sans signature ni compte Apple.
  - `preview` : installation interne, hors stores. iOS : un `.ipa` signé pour les appareils enregistrés. Android : un `.apk`.
  - `production` : build pour les stores, numéro de build incrémenté automatiquement. Non utilisé pour l'instant.
- **Image de compilation iOS** : `macos-tahoe-26.5-xcode-26.6`, fixée dans les trois profils. C'est l'image que la documentation d'EAS donne pour le SDK 57 (« latest, sdk-57 »), page [Build server infrastructure](https://docs.expo.dev/build-reference/infrastructure/). Ne la remplace pas par une image Xcode 27 tant que le projet est sur Expo 57.
- Projet EAS : <https://expo.dev/accounts/mousgamee/projects/kubo>. La clé de signature Android a été créée par EAS au premier build et y est conservée.
- Les outils de développement (variables `EXPO_PUBLIC_*`, scénario `stress`) sont ignorés dans tout build qui n'est pas en mode développement.

## Ce qui demande ton intervention
| Étape | Pourquoi |
|---|---|
| `eas login` | La connexion à ton compte Expo se fait dans ton terminal ; l'agent ne saisit jamais d'identifiants |
| Compte Apple Developer (payant) | Obligatoire pour installer un build sur un iPhone hors Expo Go |
| Enregistrer ton iPhone (`eas device:create`) | Un build interne iOS ne s'installe que sur les appareils déclarés |
| Répondre aux questions d'EAS sur les certificats Apple | EAS crée et garde le certificat et le profil de provisionnement ; il te demande ton identifiant Apple |
| Autoriser l'installation sur le téléphone | iOS : mode développeur à activer. Android : autoriser les sources inconnues |

## Avant tout build
```
npm install
npm run check
eas whoami
```
`npm run check` doit passer sans erreur ni avertissement. `eas whoami` doit afficher ton compte ; sinon, `eas login` (**Moussa**). EAS envoie les fichiers suivis par git : committe avant de lancer un build.

## Build iOS pour le simulateur
Sans compte Apple. C'est le moyen de vérifier la version finale sur ton Mac.
```
eas build --platform ios --profile simulator
```
1. À la fin (une dizaine de minutes), EAS affiche le lien d'une archive `.tar.gz`. Télécharge-la et décompresse-la : elle contient `Kubo.app`.
2. Ouvre un simulateur, puis installe et lance :
   ```
   xcrun simctl install booted Kubo.app
   xcrun simctl launch booted com.moussasagna.kubo
   ```
   Tu peux aussi répondre « oui » quand `eas build` propose d'installer le build sur le simulateur.

## Build iOS installable sur ton iPhone
1. **Moussa** — enregistre ton iPhone, une seule fois :
   ```
   eas device:create
   ```
   La commande donne un lien ou un QR code à ouvrir sur l'iPhone, qui installe un profil d'enregistrement.
2. **Moussa** — lance le build :
   ```
   eas build --platform ios --profile preview
   ```
   Au premier lancement, EAS demande ton identifiant Apple et propose de créer le certificat et le profil : accepte.
3. À la fin, EAS affiche un lien et un QR code. Ouvre-le sur l'iPhone et installe.
4. Au premier lancement de l'app, iOS peut demander d'activer le mode développeur : Réglages › Confidentialité et sécurité › Mode développeur, puis redémarrage.

Si tu ajoutes un autre iPhone plus tard, refais `eas device:create` puis un nouveau build : la liste des appareils est figée dans chaque build.
Ce build n'a pas encore été fait : seul le build `simulator` a été vérifié.

## APK Android
```
eas build --platform android --profile preview
```
1. Télécharge le `.apk` depuis le lien affiché, ou scanne le QR code sur le téléphone.
2. Sur le téléphone, autorise l'installation depuis cette source si Android le demande.

Aucun compte Google n'est nécessaire pour un APK installé à la main. Android n'a pas été testé pendant le développement : prévois une vérification complète sur le premier APK.

## Build local (déconseillé pour l'instant)
```
npx expo run:ios --configuration Release --no-bundler
```
- Avec Xcode 27, l'app obtenue plante au lancement (voir plus haut). À réserver à un Mac avec Xcode 26, ou à l'après-SDK 58.
- **Le chemin du projet ne doit contenir aucun espace**, sinon la compilation échoue dans un script d'`expo-constants` (« No such file or directory »). Le dossier de travail `~/dev/kubo` convient.
- La commande génère le dossier `ios/` (ignoré par git) et modifie les scripts `ios` et `android` de `package.json` : annule ce changement avec `git checkout package.json` pour garder le lancement dans Expo Go.

## Liste de contrôle sur le build installé
| # | Action | Ce que tu dois observer |
|---|---|---|
| 1 | Écran d'accueil du téléphone | L'icône de Kubo, avec « Kubo » dessous |
| 2 | Premier lancement | Splash natif sur fond bleu nuit, puis l'animation du logo, sans flash blanc |
| 3 | Suite du premier lancement | Le tutoriel en trois étapes, puis l'accueil |
| 4 | Défi du jour | Une partie complète, sons et vibrations, écran de fin avec « Prochain défi dans… » |
| 5 | Partie libre | Une partie complète, le meilleur score est conservé |
| 6 | Réglages | Les deux interrupteurs, « Revoir le tutoriel », la version |
| 7 | Fermer et rouvrir | Pas de tutoriel la deuxième fois ; défi, série et réglages conservés |
| 8 | VoiceOver sur l'accueil et les réglages | Chaque bouton est annoncé en français, les interrupteurs disent leur état |
| 9 | Nulle part | Aucun bouton d'outils, aucune date ni partie d'exemple |
