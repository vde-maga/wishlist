// Card rendering - handles all DOM manipulation for cards

import { escapeHTML } from "./utils.js";
import { isReserved, toggleReservation } from "./reservation.js";

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

  let footerBlock = "";
  if (hasPrice || hasLink || true) {
    footerBlock = `
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
  }

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
