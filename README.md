# JeuDePiste

Le Nil est une Progressive Web App permettant aux (futur-e-s) étudiant-e-s du Cnam-Enjmin de découvrir le bâtiment du Nil grâce à un jeu de piste. Dans ce jeu, vous êtes invité-e à explorer l'école à la recherche d'un mystérieux cryptide.  
L'application peut être consultée en tant que site web à l'adresse https://le-nil.netlify.app ou installée en tant que PWA sur ordinateur, tablette ou mobile.

## Déroulement du jeu de piste

Le jeu commence lorsque vous scannez un QR code sur l'un des flyers déposés à l'entrée du bâtiment. Ce QR code donne accès à un lien vers la page d'accueil de l'application.

Si vous acceptez de commencer à jouer, vous êtes redirigé-e vers la première étape : une énigme à résoudre en retrouvant l'empreinte du cryptide dans le bâtiment. Tant que la bonne réponse à la question n'a pas été saisie, il n'est pas possible de passer à l'étape suivante.

Les autres étapes suivent le même principe : chacune va vous amener vers un nouvel endroit du bâtiment, où vous trouverez un indice permettant de débloquer l'étape suivante. À la fin du jeu, vous pouvez découvrir l'apparence du cryptide sous forme de modèle 3D.

## Fontionnalités incluses

Le jeu fait appel à diverses fonctionnalités du web moderne telles que définies par le site whatwebcando.today.

- Installation sur l'écran d'accueil : le jeu est une PWA. Les paramètres définis dans le fichier manifest.json permettent de l'installer sur l'écran d'accueil d'un appareil fixe ou mobile comme une application.

- Réalité augmentée : le modèle 3D du cryptide est visualisable en AR grâce à l'API WebXR.

- D'autres fonctionnalités comme la reconnaissance de forme (lecture de QR code) et la technologie NFC sont utilisées sur des flyers ou jetons accessibles aux joueur-euses mais ne sont pas directement prises en charge par l'application.

## Prérequis et compatibilité

- L'utilisation de l'AR requiert un navigateur chrome ou chromium et un téléphone prenant en charge ces fonctionnalités.
- L'utilisation de la technologie NFC requiert un téléphone mobile compatible.
