// Card rendering and filter UI - handles all DOM manipulation

import { escapeHTML, getStoreLinks } from "./utils.js";
import {
  getActiveFilterCount,
  getUniqueTags,
  getFilterState,
} from "./filters.js";

const PRIORITY_BADGES = {
  high: { text: "ALTA PRIORIDADE", class: "badge-high" },
  medium: { text: "SERIA GIRO", class: "badge-medium" },
  low: { text: "IDEIA SOLTA", class: "badge-low" },
};

const PRIORITY_FILTER_LABELS = {
  high: "Prioridade alta",
  medium: "Prioridade média",
  low: "Prioridade baixa",
};

const PRICE_FILTER_LABELS = {
  low: "Preço até 50€",
  medium: "Preço 50–150€",
  high: "Preço 150€+",
};

const SORT_FILTER_LABELS = {
  "price-asc": "↑ Barato",
  "price-desc": "↓ Caro",
  priority: "★ Prioridade",
  newest: "Recente",
};

const budgetFormatter = new Intl.NumberFormat("pt-PT", {
  maximumFractionDigits: 2,
});

const getPriorityBadge = (priority) => {
  const style = PRIORITY_BADGES[priority] || PRIORITY_BADGES.medium;
  return `<span class="badge ${style.class}">${escapeHTML(style.text)}</span>`;
};

const renderChip = (type, value, label, removeLabel) => `
  <button type="button" class="filter-chip" data-remove-filter="${type}"${
    value ? ` data-value="${escapeHTML(value)}"` : ""
  } aria-label="${escapeHTML(removeLabel)}">
    ${escapeHTML(label)} <span aria-hidden="true">×</span>
  </button>
`;

const buildActiveFilterChips = (state) => {
  const chips = [];
  const search = state.search.trim();

  if (search) {
    chips.push(
      renderChip(
        "search",
        "",
        `Pesquisa: “${search}”`,
        `Remover pesquisa ${search}`,
      ),
    );
  }

  state.tags.forEach((tag) => {
    chips.push(renderChip("tag", tag, `Tag: ${tag}`, `Remover tag ${tag}`));
  });

  if (state.priority) {
    chips.push(
      renderChip(
        "priority",
        state.priority,
        PRIORITY_FILTER_LABELS[state.priority] || state.priority,
        "Remover filtro de prioridade",
      ),
    );
  }

  if (state.priceRange) {
    chips.push(
      renderChip(
        "price",
        state.priceRange,
        PRICE_FILTER_LABELS[state.priceRange] || state.priceRange,
        "Remover filtro de preço",
      ),
    );
  }

  if (state.budget !== null) {
    chips.push(
      renderChip(
        "budget",
        "",
        `Até ${budgetFormatter.format(state.budget)}€`,
        "Remover orçamento máximo",
      ),
    );
  }

  if (state.sortOrder) {
    chips.push(
      renderChip(
        "sort",
        state.sortOrder,
        `Ordem: ${SORT_FILTER_LABELS[state.sortOrder] || state.sortOrder}`,
        "Remover ordenação",
      ),
    );
  }

  return chips.join("");
};

const renderCard = (item, index) => {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const hasImage = !!item.image;
  const hasPrice = !!item.price;
  const hasPriceChecked =
    hasPrice &&
    typeof item.priceChecked === "string" &&
    item.priceChecked.trim();
  const storeLinks = getStoreLinks(item);
  const hasDescription = !!item.description;

  let mediaBlock = "";
  if (hasImage) {
    mediaBlock = `
      <div class="card-image-wrapper">
        <button
          type="button"
          class="card-image-button"
          data-lightbox-src="${escapeHTML(item.image)}"
          data-lightbox-alt="Foto de ${escapeHTML(item.title)}"
          aria-label="Ampliar foto de ${escapeHTML(item.title)}"
          title="Ampliar imagem"
        >
          <img src="${escapeHTML(item.image)}" alt="Foto de ${escapeHTML(item.title)}" class="card-image" loading="${index < 3 ? "eager" : "lazy"}" decoding="async" width="640" height="400">
        </button>
        ${tags.length ? `<div class="card-tags">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>` : ""}
      </div>
    `;
  } else if (tags.length) {
    mediaBlock = `<div class="card-tags-top">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>`;
  }

  const footerBlock = `
    <div class="card-footer ${!hasPrice ? "no-price" : ""}">
      ${
        hasPrice
          ? `<div class="card-price-group">
              <span class="card-price">${escapeHTML(item.price)}</span>
              ${
                hasPriceChecked
                  ? `<time class="price-checked" datetime="${escapeHTML(item.priceChecked)}">Verificado ${escapeHTML(item.priceChecked)}</time>`
                  : ""
              }
            </div>`
          : ""
      }
      <div class="card-actions">
        ${storeLinks
          .map(
            (storeLink) =>
              `<a href="${escapeHTML(storeLink.url)}" target="_blank" rel="noopener noreferrer" class="card-btn">${escapeHTML(storeLink.label)} ↗</a>`,
          )
          .join("")}
        <button type="button" class="card-btn card-btn-share" data-share-id="${escapeHTML(String(item.id))}" title="Partilhar este item">Partilhar</button>
      </div>
    </div>
  `;

  return `
    <article class="card ${!hasImage ? "card--no-image" : ""}" id="item-${escapeHTML(String(item.id))}" style="--card-index: ${index}">
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
  const state = getFilterState();
  const searchValue = state.search;
  const budgetValue = state.budget === null ? "" : String(state.budget);

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
      <span class="filters-toggle-title">
        Filtros
        <span class="filters-count" id="filters-count" aria-hidden="true" hidden></span>
      </span>
      <span class="filters-toggle-icon" aria-hidden="true">▼</span>
    </button>
    <div class="filters-search">
      <input
        type="search"
        id="wishlist-search"
        name="q"
        class="filters-search-input"
        value="${escapeHTML(searchValue)}"
        placeholder="Pesquisar por título, descrição ou tag…"
        aria-label="Pesquisar na wishlist"
        aria-keyshortcuts="/"
        title="Atalho: /"
        autocomplete="off"
        maxlength="100"
      >
    </div>
    <div class="active-filters" id="active-filters" hidden></div>
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
          <label class="budget-input">
            <span>Até</span>
            <input
              type="number"
              id="budget-max"
              name="budget"
              min="0"
              step="0.01"
              inputmode="decimal"
              value="${escapeHTML(budgetValue)}"
              placeholder="50"
              aria-label="Orçamento máximo em euros"
              title="Mostrar apenas itens até este valor"
            >
            <span aria-hidden="true">€</span>
          </label>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label" id="filter-label-sort">Ordenar</span>
        <div class="filter-buttons" role="group" aria-labelledby="filter-label-sort">
          <button type="button" class="filter-btn" data-filter="sort" data-value="price-asc" aria-pressed="false">↑ Barato</button>
          <button type="button" class="filter-btn" data-filter="sort" data-value="price-desc" aria-pressed="false">↓ Caro</button>
          <button type="button" class="filter-btn" data-filter="sort" data-value="priority" aria-pressed="false" title="Alta prioridade primeiro">★ Prioridade</button>
          <button type="button" class="filter-btn" data-filter="sort" data-value="newest" aria-pressed="false" title="Adicionados mais recentemente">Recente</button>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">Ações</span>
        <div class="filter-buttons">
          <button type="button" class="filter-btn random" id="random-item" title="Escolher um item aleatório entre os resultados">🎲 Surpreende-me</button>
          <button type="button" class="filter-btn" id="copy-list" title="Copiar os itens visíveis em Markdown">📋 Copiar lista</button>
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
  const activeCount = getActiveFilterCount();
  const countBadge = container.querySelector("#filters-count");
  const toggle = container.querySelector(".filters-toggle");

  if (countBadge) {
    countBadge.textContent = String(activeCount);
    countBadge.hidden = activeCount === 0;
  }

  if (toggle) {
    toggle.setAttribute(
      "aria-label",
      activeCount === 0
        ? "Filtros"
        : `Filtros, ${activeCount} ${activeCount === 1 ? "filtro ativo" : "filtros ativos"}`,
    );
  }

  const activeFiltersElement = container.querySelector("#active-filters");
  if (activeFiltersElement) {
    const chips = buildActiveFilterChips(state);
    activeFiltersElement.innerHTML = chips;
    activeFiltersElement.hidden = !chips;
  }

  container.querySelectorAll(".filter-btn").forEach((btn) => {
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
    if (!filter) return;

    let isActive = false;

    if (filter === "tag") isActive = state.tags.includes(value);
    else if (filter === "priority") isActive = state.priority === value;
    else if (filter === "price") isActive = state.priceRange === value;
    else if (filter === "sort") isActive = state.sortOrder === value;

    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
};
