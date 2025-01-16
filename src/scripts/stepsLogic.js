// Données des étapes
// Les mots de passe sont stockés uniquement sous forme de hash
const stepsData = [
    {
        id: "step1-link",
        storageKey: "step1-unlocked",
        href: "step1.html",
        correctAnswer: getPasswordHash("distributeur"),
    },
    {
        id: "step2-link",
        storageKey: "step2-unlocked",
        href: "step2.html",
        correctAnswer: getPasswordHash("tartiflette"),
    },
    {
        id: "step3-link",
        storageKey: "step3-unlocked",
        href: "step3.html",
        correctAnswer: getPasswordHash("nessie"),
    },
    {
        id: "step4-link",
        storageKey: "step4-unlocked",
        href: "step4.html",
    },
];

// Fonction pour créer un hash du mot de passe saisi
function getPasswordHash(pwd) {
    let pwdHash = 0;
    if (pwd.length === 0) return pwdHash; // Si le mot de passe est vide, retourne 0
    for (let i = 0; i < pwd.length; i++) {
        const char = pwd.charCodeAt(i); // Code Unicode d'un caractère
        pwdHash = (pwdHash << 5) - pwdHash + char; // Générer le hash
        pwdHash = pwdHash & pwdHash; // Forcer à rester dans les limites d'un entier 32 bits
    }
    return pwdHash;
}

// Fonction principale pour gérer la logique d'une étape
function handleStepLogic() {
    // Identifier la page actuelle : page = step1, step2, ...
    const page = document.body.getAttribute("data-page");
    if (!page) return;

    // Trouver l'index de l'étape actuelle dans stepsData
    const currentIndex = stepsData.findIndex((step) => step.storageKey.startsWith(page));
    if (currentIndex === -1) return;

    const currentStep = stepsData[currentIndex];
    const nextStep = stepsData[currentIndex + 1]; // Étape suivante (si elle existe)

    // Éléments du DOM
    const answerCheck = document.getElementById("answer-check");
    const answerForm = document.getElementById("answer-form");
    const continueSection = document.getElementById("continue-section");
    const errorMessage = document.getElementById("error-message");
    const stepLink = nextStep ? document.getElementById(nextStep.id) : null;

    // Vérifier si une réponse correcte est déjà enregistrée
    const savedAnswer = localStorage.getItem(`${page}-answer`);
    if (savedAnswer) {
        // Si oui, l'afficher dans le HTML
        document.getElementById("correct-answer").textContent = savedAnswer;

        // Configurer les sections pour refléter l'état déverrouillé
        handleDisplay(answerCheck, continueSection, null, "continueSection");
        return;
    }

    // Gérer l'affichage selon l'état de l'étape suivante
    if (nextStep && !localStorage.getItem(nextStep.storageKey)) {
        // Si non déverrouillée, afficher le formulaire
        handleDisplay(answerCheck, continueSection, errorMessage, "answerCheck");

        answerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const answer = document.getElementById("answer").value;
            const answerHash = getPasswordHash(answer); // Calculer le hash de la réponse saisie

            if (answerHash === currentStep.correctAnswer) {
                alert("Étape suivante déverrouillée !");
                unlockNextStep(nextStep, answerCheck, continueSection, stepLink, answer, page);
            } else {
                // Afficher un message d'erreur si la réponse est incorrecte
                errorMessage.style.display = "block";
            }
        });
    } else {
        // Si déverrouillée, afficher le lien Continuer
        handleDisplay(answerCheck, continueSection, null, "continueSection");
    }
}

// Fonction pour enregistrer une réponse et mettre à jour l'affichage
function unlockNextStep(nextStep, answerCheck, continueSection, stepLink, answer, page) {
    localStorage.setItem(nextStep.storageKey, true); // Déverrouiller l'étape suivante
    localStorage.setItem(`${page}-answer`, answer); // Stocker la réponse en clair avec un nom simplifié

    unlockStepLink(stepLink, nextStep);
    document.getElementById("correct-answer").textContent = answer; // Afficher la réponse correcte
    handleDisplay(answerCheck, continueSection, null, "continueSection");
}

// Fonction pour toujours déverrouiller l'étape 1
function unlockFirstStep() {
    if (!localStorage.getItem("step1-unlocked")) {
        localStorage.setItem("step1-unlocked", true);
    }
}

// Fonction pour gérer l'affichage des sections
function handleDisplay(answerCheck, continueSection, errorMessage, displayState) {
    // Gérer l'affichage selon la valeur passée dans displayState
    answerCheck.style.display = displayState === "answerCheck" ? "flex" : "none";
    continueSection.style.display = displayState === "continueSection" ? "flex" : "none";
    if (errorMessage) errorMessage.style.display = "none"; // Réinitialiser le message d'erreur
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

// Exécuter les fonctions au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    unlockFirstStep();
    updateHeaderLinks();
    handleStepLogic();
});
