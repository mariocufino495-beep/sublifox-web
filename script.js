const categoryNames = {
  textil: "Estampados y camisetas",
  mugs: "Mugs y termos",
  laser: "Láser, MDF y acrílico",
  publicidad: "Publicidad y avisos",
  vinilos: "Vinilos y vehículos",
  papeleria: "Papelería e impresión",
  detalles: "Detalles y recordatorios",
  todos: "Todos los productos"
};

const state = {
  filter: "textil",
  search: "",
  quote: JSON.parse(localStorage.getItem("sublifoxQuote") || "[]")
};

const cards = [...document.querySelectorAll(".product-card")];
const filters = [...document.querySelectorAll(".filter")];
const search = document.querySelector("#product-search");
const visibleCount = document.querySelector("#visible-count");
const emptyState = document.querySelector("#empty-state");
const activeCategoryTitle = document.querySelector("#active-category-title");
const drawer = document.querySelector("#quote-drawer");
const backdrop = document.querySelector(".drawer-backdrop");
const quoteList = document.querySelector("#quote-list");
const quoteEmpty = document.querySelector("#quote-empty");
const quoteCount = document.querySelector(".quote-count");
const sendQuote = document.querySelector("#send-quote");
const toast = document.querySelector(".toast");

document.querySelector("#year").textContent = new Date().getFullYear();

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function applyFilters() {
  const term = normalize(state.search.trim());
  let count = 0;
  cards.forEach((card) => {
    const matchesCategory = state.filter === "todos" || card.dataset.category === state.filter;
    const matchesSearch = !term || normalize(`${card.dataset.name} ${card.textContent}`).includes(term);
    const show = matchesCategory && matchesSearch;
    card.hidden = !show;
    if (show) count += 1;
  });
  visibleCount.textContent = count;
  activeCategoryTitle.textContent = categoryNames[state.filter] || "Productos";
  emptyState.hidden = count !== 0;
}

function setCategory(filter) {
  state.filter = filter;
  state.search = "";
  search.value = "";
  filters.forEach((item) => item.classList.toggle("active", item.dataset.filter === filter));
  applyFilters();
  document.querySelector(".category-window-head").scrollIntoView({behavior:"smooth", block:"start"});
}

filters.forEach((button) => button.addEventListener("click", () => setCategory(button.dataset.filter)));
document.querySelector("[data-filter-all]").addEventListener("click", () => setCategory("todos"));

search.addEventListener("input", (event) => {
  state.search = event.target.value;
  if (state.search.trim()) {
    state.filter = "todos";
    filters.forEach((item) => item.classList.remove("active"));
  }
  applyFilters();
});

function saveQuote() {
  localStorage.setItem("sublifoxQuote", JSON.stringify(state.quote));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1900);
}

function renderQuote() {
  quoteList.innerHTML = "";
  state.quote.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "quote-item";
    row.innerHTML = `<div><strong>${item.product}</strong><small>${item.price}</small></div><button type="button" aria-label="Quitar ${item.product}" data-remove="${index}">Quitar</button>`;
    quoteList.appendChild(row);
  });
  quoteCount.textContent = state.quote.length;
  quoteEmpty.hidden = state.quote.length > 0;
  sendQuote.disabled = state.quote.length === 0;
  
const shirtMaterial = document.querySelector("#shirt-material");
const shirtWeight = document.querySelector("#shirt-weight");
const shirtWeightWrap = document.querySelector("#shirt-weight-wrap");
const shirtPrice = document.querySelector("#shirt-price");
const shirtAddQuote = document.querySelector("#shirt-add-quote");

function getShirtConfiguration() {
  if (!shirtMaterial) return null;
  const material = shirtMaterial.value;

  if (material === "peruano") {
    const weight = shirtWeight.value;
    return {
      product: `Camiseta personalizada — Algodón peruano ${weight} g`,
      price: weight === "250" ? "$74.900" : "$64.900",
      prefix: "Desde"
    };
  }

  if (material === "durazno") {
    return {
      product: "Camiseta personalizada — Piel durazno",
      price: "Consultar precio",
      prefix: ""
    };
  }

  if (material === "basica") {
    return {
      product: "Camiseta personalizada — Básica algodón",
      price: "Consultar precio",
      prefix: ""
    };
  }

  if (material === "comp-corta") {
    return {
      product: "Camiseta de compresión — Manga corta",
      price: "$66.000",
      prefix: "Desde"
    };
  }

  if (material === "comp-larga") {
    return {
      product: "Camiseta de compresión — Manga larga",
      price: "$69.000",
      prefix: "Desde"
    };
  }

  if (material === "croptop") {
    return {
      product: "Crop top personalizado",
      price: "Consultar precio",
      prefix: ""
    };
  }

  return {
    product: "Polo personalizado",
    price: "Consultar precio",
    prefix: ""
  };
}

function updateShirtConfigurator() {
  if (!shirtMaterial) return;
  const config = getShirtConfiguration();
  const isPeruvian = shirtMaterial.value === "peruano";
  shirtWeightWrap.hidden = !isPeruvian;
  shirtPrice.innerHTML = config.prefix
    ? `<small>${config.prefix}</small><strong>${config.price}</strong>`
    : `<strong>${config.price}</strong>`;
}

if (shirtMaterial) {
  shirtMaterial.addEventListener("change", updateShirtConfigurator);
  shirtWeight.addEventListener("change", updateShirtConfigurator);

  shirtAddQuote.addEventListener("click", () => {
    const config = getShirtConfiguration();
    if (state.quote.some((item) => item.product === config.product)) {
      showToast("Esta configuración ya está en tu lista");
      return;
    }
    state.quote.push({ product: config.product, price: config.price });
    renderQuote();
    showToast("Camiseta agregada a tu cotización");
  });

  updateShirtConfigurator();
}

document.querySelectorAll(".add-quote").forEach((button) => {
    const added = state.quote.some((item) => item.product === button.dataset.product);
    button.classList.toggle("added", added);
    button.textContent = added ? "Agregado" : "Agregar a cotización";
  });
  saveQuote();
}

document.querySelectorAll(".add-quote").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product;
    if (state.quote.some((item) => item.product === product)) {
      showToast("Este producto ya está en tu lista");
      return;
    }
    state.quote.push({ product, price: button.dataset.price });
    renderQuote();
    showToast("Producto agregado a tu cotización");
  });
});

quoteList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  state.quote.splice(Number(button.dataset.remove), 1);
  renderQuote();
});

function openDrawer() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.querySelector(".quote-trigger").setAttribute("aria-expanded", "true");
  backdrop.hidden = false;
  document.body.classList.add("drawer-open");
  document.querySelector(".drawer-close").focus();
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.querySelector(".quote-trigger").setAttribute("aria-expanded", "false");
  backdrop.hidden = true;
  document.body.classList.remove("drawer-open");
}

document.querySelector(".quote-trigger").addEventListener("click", openDrawer);
document.querySelector(".drawer-close").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
});

document.querySelector("#clear-quote").addEventListener("click", () => {
  state.quote = [];
  renderQuote();
  showToast("Cotización vaciada");
});

sendQuote.addEventListener("click", () => {
  const lines = state.quote.map((item, index) => `${index + 1}. ${item.product} — ${item.price}`);
  const message = ["Hola Sublifox, quiero cotizar estos productos:", "", ...lines, "", "Cantidad aproximada:", "Fecha en que lo necesito:", "Ciudad de entrega:"].join("\n");
  window.open(`https://wa.me/573027499180?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

renderQuote();
applyFilters();