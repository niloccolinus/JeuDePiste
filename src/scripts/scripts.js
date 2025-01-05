function updateHeaderLinks() {
  const steps = [
    { id: "step2-link", storageKey: "step2-unlocked", href: "step2.html" },
    { id: "step3-link", storageKey: "step3-unlocked", href: "step3.html" },
    { id: "step4-link", storageKey: "step4-unlocked", href: "step4.html" },
    { id: "step5-link", storageKey: "step5-unlocked", href: "step5.html" },
  ];

  steps.forEach((step) => {
    const link = document.getElementById(step.id);
    if (localStorage.getItem(step.storageKey)) {
      link.removeAttribute("role");
      link.removeAttribute("aria-disabled");
      link.setAttribute("href", step.href);
      link.innerHTML = step.href.match(/\d+/)[0]; // Remplace cadenas par numéro
    }
  });
}

// Appeler la fonction au chargement
document.addEventListener("DOMContentLoaded", updateHeaderLinks);
