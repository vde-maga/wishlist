// Card rendering and filter UI - handles all DOM manipulation

import { escapeHTML } from "./utils.js";
import { isReserved } from "./reservation.js";
import { getUniqueTags, getFilterState } from "./filters.js";

const getPriorityBadge = (priority) => {
  const styles = {
    high: { text: "ALTA PRIORIDADE", class: "badge-high" },
    medium: { text: "SERIA GIRO", class: "badge-medium" },
    low: { text: "IDEIA SOLTA", class: "badge-low" },
  };
  const style = styles[priority] || styles.medium;
  return `<span class="badge ${escapeHTML(style.class)}">${escapeHTML(style.text)}</span>`;
};

const renderCard = (item, index) => {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const hasImage = !!item.image;
  const hasPrice = !!item.price;
  const hasLink = !!item.link;
  const hasDescription = !!item.description;
  const reserved = isReserved(item.id);

  let mediaBlock = "";
  if (hasImage) {
    mediaBlock = `
      <div class="card-image-wrapper ${reserved ? "card-image-wrapper--reserved" : ""}">
        <img src="${escapeHTML(item.image)}" alt="Foto de ${escapeHTML(item.title)}" class="card-image" loading="${index < 3 ? "eager" : "lazy"}" decoding="async">
        ${tags.length ? `<div class="card-tags">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>` : ""}
        ${reserved ? '<div class="reserved-overlay">RESERVADO</div>' : ""}
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
          hasLink && !reserved
            ? `<a href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer" class="card-btn">Ver Loja ↗</a>`
            : ""
        }
        <button onclick="window.handleReservation(${item.id})" class="card-btn ${reserved ? "card-btn--reserved" : "card-btn--reserve"}">
          ${reserved ? "✓ Reservado" : "Reservar"}
        </button>
      </div>
    </div>
  `;

  return `
    <article class="card ${!hasImage ? "card--no-image" : ""} ${reserved ? "card--reserved" : ""}" style="--card-index: ${index}">
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

export const renderItems = (grid, data) => {
  if (!grid) return;
  if (typeof data === "undefined" || !Array.isArray(data)) {
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem;">⚠️ Erro ao carregar a wishlist. Verifica o ficheiro data.js.</p>';
    return;
  }
  if (data.length === 0) {
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center;">🎁 A wishlist está vazia. Adiciona itens no data.js!</p>';
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
      <span class="filter-label">Tags</span>
      <div class="filter-buttons">
        ${uniqueTags.map((tag) => `<button class="filter-btn" data-filter="tag" data-value="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`).join("")}
      </div>
    </div>
  `
      : "";

  container.innerHTML = `
    <div class="filters-toggle">
      <span class="filters-toggle-title">Filtros</span>
      <span class="filters-toggle-icon">▼</span>
    </div>
    <div class="filters-content">
      ${tagsHTML}
      <div class="filter-row">
        <span class="filter-label">Prioridade</span>
        <div class="filter-buttons">
          <button class="filter-btn" data-filter="priority" data-value="high">Alta</button>
          <button class="filter-btn" data-filter="priority" data-value="medium">Média</button>
          <button class="filter-btn" data-filter="priority" data-value="low">Baixa</button>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">Preço</span>
        <div class="filter-buttons">
          <button class="filter-btn" data-filter="price" data-value="low">€</button>
          <button class="filter-btn" data-filter="price" data-value="medium">€€</button>
          <button class="filter-btn" data-filter="price" data-value="high">€€€</button>
          <button class="filter-btn" data-filter="sort" data-value="price-asc">↑ Barato</button>
          <button class="filter-btn" data-filter="sort" data-value="price-desc">↓ Caro</button>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">Estado</span>
        <div class="filter-buttons">
          <button class="filter-btn" data-filter="reserved" data-value="available">Disponíveis</button>
          <button class="filter-btn" data-filter="reserved" data-value="reserved">Reservados</button>
          <button class="filter-btn reset" id="reset-filters">Limpar</button>
        </div>
      </div>
      <div class="filter-results" id="filter-results"></div>
    </div>
  `;

  const toggle = container.querySelector(".filters-toggle");
  if (toggle) {
    toggle.addEventListener("click", () =>
      container.classList.toggle("collapsed"),
    );
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
    else if (filter === "reserved") isActive = state.reserved === value;

    btn.classList.toggle("active", isActive);
  });
};
