
/* === DUVA Filter Script (Improved Version) === */

/* === Collect Filter Selections === */
function getSelectedFilters() {
  const selectedFilters = {};

  // Checkboxes (e.g., Application, Mounting)
  document.querySelectorAll("input[type='checkbox']:checked").forEach((checkbox) => {
    const name = checkbox.name;
    const value = checkbox.value.toLowerCase();

    if (!selectedFilters[name]) {
      selectedFilters[name] = [];
    }
    selectedFilters[name].push(value);
  });

  // Dropdowns (e.g., Wattage, CRI)
  document.querySelectorAll("select").forEach((dropdown) => {
    const name = dropdown.name;
    const value = dropdown.value.trim().toLowerCase();

    if (value && value !== "select") {
      selectedFilters[name] = value;
    }
  });

  return selectedFilters;
}

/* === Extract Data from CMS Card === */
function getCMSDataFromCard(card) {
  const attributes = [
    "application", "mounting", "form", "wattage", "cri", "cct",
    "beam", "ip", "ik", "finish", "name", "tags", "family", "lumen"
  ];
  const cardData = {};
  attributes.forEach((attr) => {
    cardData[attr] = (card.getAttribute("data-" + attr) || "").toLowerCase();
  });
  return cardData;
}

/* === Apply Filter Logic === */
function applyFilters() {
  const selectedFilters = getSelectedFilters();
  const cards = document.querySelectorAll(".collection-item");

  cards.forEach((card) => {
    const cardData = getCMSDataFromCard(card);
    let visible = true;

    for (const filterKey in selectedFilters) {
      const selectedValue = selectedFilters[filterKey];

      if (Array.isArray(selectedValue)) {
        const match = selectedValue.some((val) =>
          cardData[filterKey].includes(val)
        );
        if (!match) {
          visible = false;
          break;
        }
      } else {
        if (!cardData[filterKey].includes(selectedValue)) {
          visible = false;
          break;
        }
      }
    }

    card.style.display = visible ? "block" : "none";
  });
}

/* === Event Listeners for Filters === */
document.querySelectorAll("input[type='checkbox'], select").forEach((element) => {
  element.addEventListener("change", applyFilters);
});

/* === Apply Filter Button === */
const applyBtn = document.querySelector(".link-block-6");
if (applyBtn) {
  applyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    applyFilters();
  });
}

/* === Reset Filter Button (Optional) === */
const resetBtn = document.querySelector(".filter.reset-button");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    document.querySelectorAll("input[type='checkbox']").forEach((cb) => {
      cb.checked = false;
    });
    document.querySelectorAll("select").forEach((dropdown) => {
      dropdown.selectedIndex = 0;
    });
    applyFilters();
  });
}

/* === End DUVA Filter Script === */
