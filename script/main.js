// Gestion des cartes cochables avec sauvegarde en localStorage
// La clé de stockage inclut le nom de la page (ex: index.html, luxray.html, Luxio.html)
// pour que les sélections ne se mélangent pas d'une page à l'autre.

const pageName = window.location.pathname.split("/").pop() || "index.html";
const STORAGE_KEY = "cardsSelection_" + pageName;

// Récupère l'objet de sélection stocké (ou objet vide si rien de stocké)
function getStoredSelection() {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// Sauvegarde l'objet de sélection complet
function saveSelection(selection) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
}

// Applique visuellement l'état coché/décoché sur une carte
function setCardState(cardEl, checked) {
  const checkbox = cardEl.querySelector(".card-checkbox");
  checkbox.checked = checked;
  cardEl.classList.toggle("checked", checked);
}

// Met à jour le localStorage pour une carte donnée
function updateStorage(id, checked) {
  const selection = getStoredSelection();
  if (checked) {
    selection[id] = true;
  } else {
    delete selection[id];
  }
  saveSelection(selection);
}

// Met à jour les compteurs "Trouvé" / "Manquant" affichés sur la page (si présents)
function updateCounter(total) {
  const foundEl = document.getElementById("card-counter-found");
  const missingEl = document.getElementById("card-counter-missing");
  const checkedCount = document.querySelectorAll(".card-select.checked").length;

  if (foundEl) foundEl.textContent = checkedCount;
  if (missingEl) missingEl.textContent = total - checkedCount;
}

document.addEventListener("DOMContentLoaded", () => {
  const themeSwitch = document.getElementById("theme-switch");
  const THEME_KEY = "siteTheme"; // clé globale, pas liée à une page en particulier

  if (themeSwitch) {
    // Applique le thème sauvegardé au chargement (clair si "light", sinon sombre par défaut)
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light") {
      document.body.classList.add("light-theme");
      themeSwitch.checked = true;
    }

    themeSwitch.addEventListener("change", () => {
      if (themeSwitch.checked) {
        document.body.classList.add("light-theme");
        localStorage.setItem(THEME_KEY, "light");
      } else {
        document.body.classList.remove("light-theme");
        localStorage.setItem(THEME_KEY, "dark");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card-select");
  const stored = getStoredSelection();
  const total = cards.length;

  cards.forEach((card) => {
    const id = card.dataset.id;
    const checkbox = card.querySelector(".card-checkbox");

    // Restaure l'état sauvegardé au chargement de la page
    if (stored[id]) {
      setCardState(card, true);
    }

    // Clic sur la carte entière (hors checkbox) = toggle
    card.addEventListener("click", (e) => {
      if (e.target === checkbox) return; // la checkbox gère son propre clic
      const newState = !checkbox.checked;
      setCardState(card, newState);
      updateStorage(id, newState);
      updateCounter(total);
    });

    // Clic direct sur la checkbox
    checkbox.addEventListener("change", () => {
      setCardState(card, checkbox.checked);
      updateStorage(id, checkbox.checked);
      updateCounter(total);
    });
  });

  // Affiche le compteur dès le chargement de la page
  updateCounter(total);
});
