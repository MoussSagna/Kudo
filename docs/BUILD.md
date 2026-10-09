# Kubo — produire un build

Ce document explique comment obtenir une version de Kubo installable hors d'Expo Go.
L'agent ne se connecte à aucun compte et ne lance aucun build distant : tout ce qui est marqué **Moussa** demande ton intervention.

## À savoir avant de lancer un build iOS
**Le build local Release plante au lancement sur le simulateur iOS 27 (Xcode 27).** Constaté le 9 octobre 2026 : l'app se compile, s'installe, affiche le fond du splash, puis se ferme. Le rapport de crash désigne `UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption` : iOS 27 exige que l'app adopte le cycle de vie « UIScene ». Expo 57.0.27 fournit la classe prévue pour cela (`ExpoAppSceneDelegate`), mais le projet natif qu'il génère ne la branche pas (ni dans `Info.plist`, ni dans `AppDelegate.swift`).

Ce que cela implique :
- tant que ce point n'est pas réglé, un build fait avec Xcode 27 ne démarrera pas, sur simulateur comme sur iPhone ;
- un build EAS dépend de la version de Xcode de l'image choisie : rien n'a été essayé, l'agent ne lançant aucun build distant ;
- pistes, à décider par Moussa : attendre ou installer une version d'Expo 57 dont le projet généré adopte « UIScene » ; ou ajouter un plugin de configuration qui le branche. Voir « Questions ouvertes » dans `docs/SPRINT.md`.

## Ce qui est déjà prêt dans le dépôt
- `app.json` : nom « Kubo », identifiant `com.moussasagna.kubo` (iOS et Android), portrait, iPhone uniquement, icône, icône adaptative Android et splash natif sur fond `#12162B`.
- `eas.json` : deux profils.
  - `preview` : installation interne, hors stores. iOS : un fichier `.ipa` signé pour les appareils enregistrés. Android : un `.apk`.
  - `production` : build pour les stores, numéro de build incrémenté automatiquement. Non utilisé pour l'instant.
- Les outils de développement (variables `EXPO_PUBLIC_*`, scénario `stress`) sont ignorés dans tout build qui n'est pas en mode développement.

## Ce qui demande ton intervention
| Étape | Pourquoi |
|---|---|
| Compte Expo (gratuit) et `eas login` | Les builds `preview` et `production` tournent sur les serveurs d'Expo |
| `eas init`, une seule fois | Relie le projet à ton compte ; ajoute `extra.eas.projectId` dans `app.json`, à committer |
| Compte Apple Developer (payant) | Obligatoire pour installer un build sur un iPhone hors Expo Go |
| Enregistrer ton iPhone (`eas device:create`) | Un build interne iOS ne s'installe que sur les appareils déclarés |
| Répondre aux questions d'EAS sur les certificats | EAS crée et garde le certificat et le profil de provisionnement ; il te demande ton identifiant Apple |
| Autoriser l'installation sur le téléphone | iOS : mode développeur à activer. Android : autoriser les sources inconnues |

## Avant tout build
```
npm install
npm run check
```
`npm run check` doit passer sans erreur ni avertissement.

Installe l'outil en ligne de commande d'Expo, puis connecte-toi (**Moussa**) :
```
npm install --global eas-cli
eas login
eas init
```

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
   Au premier lancement, EAS demande ton identifiant Apple et propose de créer le certificat et le profil : accepte. Le build dure une quinzaine de minutes.
3. À la fin, EAS affiche un lien et un QR code. Ouvre-le sur l'iPhone et installe.
4. Au premier lancement de l'app, iOS peut demander d'activer le mode développeur : Réglages › Confidentialité et sécurité › Mode développeur, puis redémarrage.

Si tu ajoutes un autre iPhone plus tard, refais `eas device:create` puis un nouveau build : la liste des appareils est figée dans chaque build.

## APK Android
1. **Moussa** — lance le build :
   ```
   eas build --platform android --profile preview
   ```
   Au premier lancement, EAS propose de créer la clé de signature : accepte, il la conserve.
2. Télécharge le `.apk` depuis le lien affiché, ou scanne le QR code sur le téléphone.
3. Sur le téléphone, autorise l'installation depuis cette source si Android le demande.

Aucun compte Google n'est nécessaire pour un APK installé à la main. Android n'a pas été testé pendant le développement : prévois une vérification complète sur ce premier APK.

## Build local pour le simulateur iOS (sans compte)
Utile pour vérifier la version finale sans rien signer. Il faut Xcode et CocoaPods.
```
npx expo run:ios --configuration Release --no-bundler
```
- **Le chemin du projet ne doit contenir aucun espace.** Depuis `…/Mouss coding/Kubo`, la compilation échoue dans un script d'`expo-constants` (« No such file or directory: /Users/…/Mouss »). Copie ou clone le projet dans un dossier sans espace, par exemple `~/dev/kubo`, et lance la commande depuis là. Les builds EAS ne sont pas concernés : ils tournent sur les serveurs d'Expo.
- La commande génère le dossier `ios/` (ignoré par git), installe les pods, compile, installe et lance l'app sur le simulateur ouvert. Compte dix à vingt minutes la première fois.
- Elle modifie aussi les scripts `ios` et `android` de `package.json` : annule ce changement avec `git checkout package.json` pour garder le lancement dans Expo Go.
- Pour repartir de zéro : supprime le dossier `ios/`.

Un build branché sur un vrai iPhone par câble (`npx expo run:ios --configuration Release --device`) est possible aussi, mais il demande ton compte Apple dans Xcode pour signer (**Moussa**).

## Liste de contrôle sur le build installé
| # | Action | Ce que tu dois observer |
|---|---|---|
| 1 | Écran d'accueil du téléphone | L'icône de Kubo, avec « Kubo » dessous |
| 2 | Premier lancement | Splash natif sur fond bleu nuit, puis l'animation du logo, sans flash blanc ni saut entre les deux |
| 3 | Suite du premier lancement | Le tutoriel en trois étapes, puis l'accueil |
| 4 | Défi du jour | Une partie complète, sons et vibrations, écran de fin avec « Prochain défi dans… » |
| 5 | Partie libre | Une partie complète, le meilleur score est conservé |
| 6 | Réglages | Les deux interrupteurs, « Revoir le tutoriel », la version |
| 7 | Fermer et rouvrir | Pas de tutoriel la deuxième fois ; défi, série et réglages conservés |
| 8 | VoiceOver sur l'accueil et les réglages | Chaque bouton est annoncé en français, les interrupteurs disent leur état |
| 9 | Nulle part | Aucun bouton d'outils, aucune date ni partie d'exemple |
