// Card rendering and filter UI - handles all DOM manipulation

import { escapeHTML, sanitizeURL } from "./utils.js";
import { getUniqueTags, getFilterState } from "./filters.js";

const PRIORITY_BADGES = {
  high: { text: "ALTA PRIORIDADE", class: "badge-high" },
  medium: { text: "SERIA GIRO", class: "badge-medium" },
  low: { text: "IDEIA SOLTA", class: "badge-low" },
};

const getPriorityBadge = (priority) => {
  const style = PRIORITY_BADGES[priority] || PRIORITY_BADGES.medium;
  return `<span class="badge ${style.class}">${escapeHTML(style.text)}</span>`;
};

const renderCard = (item, index) => {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const hasImage = !!item.image;
  const hasPrice = !!item.price;
  const link = sanitizeURL(item.link);
  const hasLink = !!link;
  const hasDescription = !!item.description;

  let mediaBlock = "";
  if (hasImage) {
    mediaBlock = `
      <div class="card-image-wrapper">
        <img src="${escapeHTML(item.image)}" alt="Foto de ${escapeHTML(item.title)}" class="card-image" loading="${index < 3 ? "eager" : "lazy"}" decoding="async" width="640" height="400">
        ${tags.length ? `<div class="card-tags">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>` : ""}
      </div>
    `;
  } else if (tags.length) {
    mediaBlock = `<div class="card-tags-top">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>`;
  }

  const footerBlock = `
    <div class="card-footer ${!hasPrice ? "no-price" : ""}">
      ${hasPrice ? `<span class="card-price">${escapeHTML(item.price)}</span>` : ""}
      <div class="card-actions">
        ${
          hasLink
            ? `<a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer" class="card-btn">Ver Loja ↗</a>`
            : ""
        }
      </div>
    </div>
  `;

  return `
    <article class="card ${!hasImage ? "card--no-image" : ""}" style="--card-index: ${index}">
      ${mediaBlock}
      <div class="card-content">
        <div class="card-header">
          <h2 class="card-title">${escapeHTML(item.title)}</h2>
          ${getPriorityBadge(item.priority)}
        </div>
        ${hasDescription ? `<p class="card-desc">${escapeHTML(item.description)}</p>` : ""}
        ${footerBlock}
      </div>
    </article>
  `;
};

export const renderItems = (grid, data, { hasFilter = false } = {}) => {
  if (!grid) return;
  if (typeof data === "undefined" || !Array.isArray(data)) {
    grid.innerHTML = `
      <div class="grid-message">
        <span class="grid-message-icon" aria-hidden="true">⚠️</span>
        <p>Erro ao carregar a wishlist. Verifica o ficheiro <code>data.js</code>.</p>
      </div>`;
    return;
  }
  if (data.length === 0) {
    grid.innerHTML = hasFilter
      ? `
      <div class="grid-message">
        <span class="grid-message-icon" aria-hidden="true">🔍</span>
        <p>Nenhum item corresponde aos filtros selecionados.</p>
        <button type="button" class="filter-btn reset grid-message-action" data-filter="reset">Limpar filtros</button>
      </div>`
      : `
      <div class="grid-message">
        <span class="grid-message-icon" aria-hidden="true">🎁</span>
        <p>A wishlist está vazia. Adiciona itens no <code>data.js</code>!</p>
      </div>`;
    return;
  }
  grid.innerHTML = data.map((item, index) => renderCard(item, index)).join("");
};

export const renderFilters = (container, data) => {
  if (!container) return;
  const uniqueTags = getUniqueTags(data);

  const tagsHTML =
    uniqueTags.length > 0
      ? `
    <div class="filter-row">
      <span class="filter-label" id="filter-label-tags">Tags</span>
      <div class="filter-buttons" role="group" aria-labelledby="filter-label-tags">
        ${uniqueTags.map((tag) => `<button type="button" class="filter-btn" data-filter="tag" data-value="${escapeHTML(tag)}" aria-pressed="false">${escapeHTML(tag)}</button>`).join("")}
      </div>
    </div>
  `
      : "";

  container.innerHTML = `
    <button type="button" class="filters-toggle" aria-expanded="true" aria-controls="filters-content">
      <span class="filters-toggle-title">Filtros</span>
      <span class="filters-toggle-icon" aria-hidden="true">▼</span>
    </button>
    <div class="filters-content" id="filters-content">
      ${tagsHTML}
      <div class="filter-row">
        <span class="filter-label" id="filter-label-priority">Prioridade</span>
        <div class="filter-buttons" role="group" aria-labelledby="filter-label-priority">
          <button type="button" class="filter-btn" data-filter="priority" data-value="high" aria-pressed="false">Alta</button>
          <button type="button" class="filter-btn" data-filter="priority" data-value="medium" aria-pressed="false">Média</button>
          <button type="button" class="filter-btn" data-filter="priority" data-value="low" aria-pressed="false">Baixa</button>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label" id="filter-label-price">Preço</span>
        <div class="filter-buttons" role="group" aria-labelledby="filter-label-price">
          <button type="button" class="filter-btn" data-filter="price" data-value="low" aria-pressed="false" title="Até 50€">€</button>
          <button type="button" class="filter-btn" data-filter="price" data-value="medium" aria-pressed="false" title="50€ a 150€">€€</button>
          <button type="button" class="filter-btn" data-filter="price" data-value="high" aria-pressed="false" title="150€ ou mais">€€€</button>
          <button type="button" class="filter-btn" data-filter="sort" data-value="price-asc" aria-pressed="false">↑ Barato</button>
          <button type="button" class="filter-btn" data-filter="sort" data-value="price-desc" aria-pressed="false">↓ Caro</button>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">Ações</span>
        <div class="filter-buttons">
          <button type="button" class="filter-btn reset" id="reset-filters">Limpar</button>
        </div>
      </div>
      <div class="filter-results" id="filter-results" role="status" aria-live="polite"></div>
    </div>
  `;

  const toggle = container.querySelector(".filters-toggle");
  const content = container.querySelector(".filters-content");

  // Collapse filters by default on small screens to save vertical space.
  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  if (isSmallScreen) {
    container.classList.add("collapsed");
    toggle.setAttribute("aria-expanded", "false");
  }
  applyCollapseState(container, content, toggle);

  if (toggle) {
    toggle.addEventListener("click", () => {
      container.classList.toggle("collapsed");
      applyCollapseState(container, content, toggle);
    });
  }
};

// Sync aria-expanded and remove collapsed content from the a11y/focus tree.
const applyCollapseState = (container, content, toggle) => {
  const collapsed = container.classList.contains("collapsed");
  if (toggle) toggle.setAttribute("aria-expanded", String(!collapsed));
  if (content) {
    content.inert = collapsed;
    content.setAttribute("aria-hidden", String(collapsed));
  }
};

export const updateFilterButtons = (container) => {
  if (!container) return;
  const state = getFilterState();

  container.querySelectorAll(".filter-btn").forEach((btn) => {
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
    let isActive = false;

    if (filter === "tag") isActive = state.tags.includes(value);
    else if (filter === "priority") isActive = state.priority === value;
    else if (filter === "price") isActive = state.priceRange === value;
    else if (filter === "sort") isActive = state.sortOrder === value;

    btn.classList.toggle("active", isActive);
    if (filter === "reset") return;
    btn.setAttribute("aria-pressed", String(isActive));
  });
};
