// données des étapes
// Les mdp sont hashés pour ne pas les avoir en clair dans le code source
const stepsData = [
  {
    id: "step1-link",
    storageKey: "step1-unlocked",
    href: "step1.html",
    correctPassword: -5491951, //hash de "elephant"
  },
  {
    id: "step2-link",
    storageKey: "step2-unlocked",
    href: "step2.html",
    correctPassword: -1580711874, //hash de "distributeur"
  },
  {
    id: "step3-link",
    storageKey: "step3-unlocked",
    href: "step3.html",
    correctPassword: -5491951, //hash de "elephant"
  },
  {
    id: "step4-link",
    storageKey: "step4-unlocked",
    href: "step4.html",
    correctPassword: -5491951, //hash de "elephant"
  },
  {
    id: "step5-link",
    storageKey: "step5-unlocked",
    href: "step5.html",
    correctPassword: -5491951, //hash de "elephant"
  },
];

// Fonction pour créer un hash du mot de passe saisi
function getPasswordHash(pwd) {
  let pwdHash = 0;
  //si le mot de passe est vide, la fonction retourne 0
  if (pwd.length === 0) return pwdHash;
  for (i = 0; i < pwd.length; i++) {
    char = pwd.charCodeAt(i); // charCodeAt() retourne un entier correspondant au code Unicode d'un caractère donné d'une chaîne
    pwdHash = (pwdHash << 5) - pwdHash + char; // Opérations appliquées sur chaque caractère pour générer le hash
    pwdHash = pwdHash & pwdHash;
  }
  return pwdHash;
}

// Fonction pour mettre à jour les liens du header
function updateHeaderLinks() {
  stepsData.forEach((step) => {
    const link = document.getElementById(step.id);

    if (localStorage.getItem(step.storageKey)) {
      // Active dynamiquement le lien si l'étape est déverrouillée
      link.removeAttribute("role");
      link.removeAttribute("aria-disabled");
      link.setAttribute("href", step.href);
      link.innerHTML = step.href.match(/\d+/)[0]; // Remplace l'icône cadenas par le numéro
    }
  });
}

// Fonction pour activer dynamiquement le lien de l'étape déverrouillée
function unlockStepLink(stepLink, step) {
  if (stepLink) {
    stepLink.removeAttribute("role");
    stepLink.removeAttribute("aria-disabled");
    stepLink.setAttribute("href", step.href);
    stepLink.innerHTML = step.href.match(/\d+/)[0].replace("step", ""); // Affiche le numéro de l'étape
  }
}

function handlePasswordProtection() {
  // Identifier la page actuelle : page = step2, step3, ...
  const page = document.body.getAttribute("data-page");
  if (!page) return;

  // Trouver les données de l'étape actuelle
  // Explication : recherche dans stepsData l'étape correspondant à la page actuelle
  // Vérifie si storageKey de chaque étape commence par la valeur de page (ex "step2")
  const step = stepsData.find((step) => step.storageKey.startsWith(page));

  if (!step) return; // Sortir si aucune correspondance

  // Éléments du DOM
  const passwordCheck = document.getElementById("password-check");
  const passwordForm = document.getElementById("password-form");
  const pageContent = document.getElementById("page-content");
  const errorMessage = document.getElementById("error-message");
  const stepLink = document.getElementById(step.id);

  // Si l'étape n'est pas déverrouillée afficher le formulaire
  if (!localStorage.getItem(step.storageKey)) {
    passwordCheck.style.display = "block";

    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // on récupère le mot de passe saisi par l'utilisateur lors de l'envoi du formulaire
      const password = document.getElementById("password").value;
      //On récupère le hash de ce mot de passe
      const passwordHash = getPasswordHash(password);

      // Si mot de passe correct :
      if (passwordHash === step.correctPassword) {
        localStorage.setItem(step.storageKey, true); // on déverrouille l'étape
        passwordCheck.style.display = "none"; // on masque le formulaire
        pageContent.style.display = "block"; // on affiche le contenu

        // Met à jour dynamiquement le lien dans le header
        unlockStepLink(stepLink, step);

        alert("Étape déverrouillée !");
      } else {
        // Message d'erreur en cas de mot de passe incorrect
        errorMessage.style.display = "block";
      }
    });
  } else {
    // Si l'étape est déjà déverrouillée, activer le lien et montrer le contenu
    unlockStepLink(stepLink, step);
    pageContent.style.display = "block"; // on affiche le contenu
  }
}

// Exécuter les fonctions au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderLinks();
  handlePasswordProtection();
});
