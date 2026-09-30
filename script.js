const state = {
  filter: "todos",
  search: "",
  quote: JSON.parse(localStorage.getItem("sublifoxQuote") || "[]")
};

const cards = [...document.querySelectorAll(".product-card")];
const filters = [...document.querySelectorAll(".filter")];
const search = document.querySelector("#product-search");
const visibleCount = document.querySelector("#visible-count");
const emptyState = document.querySelector("#empty-state");
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
    const categories = card.dataset.category.split(" ");
    const matchesCategory = state.filter === "todos" || categories.includes(state.filter);
    const matchesSearch = !term || normalize(`${card.dataset.name} ${card.textContent}`).includes(term);
    const show = matchesCategory && matchesSearch;
    card.hidden = !show;
    if (show) count += 1;
  });
  visibleCount.textContent = count;
  emptyState.hidden = count !== 0;
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    applyFilters();
  });
});

search.addEventListener("input", (event) => {
  state.search = event.target.value;
  applyFilters();
});

document.querySelectorAll("[data-jump-filter]").forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.dataset.jumpFilter;
    const button = filters.find((item) => item.dataset.filter === target);
    if (button) button.click();
  });
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
  const message = [
    "Hola Sublifox, quiero cotizar estos productos:",
    "",
    ...lines,
    "",
    "Cantidad aproximada:",
    "Fecha en que lo necesito:",
    "Ciudad de entrega:"
  ].join("\n");
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
