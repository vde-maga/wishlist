document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("wishlist-grid");

  const escapeHTML = (str) => {
    if (typeof str !== "string") return str;
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: { text: "QUERO MUITO", class: "badge-high" },
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

    let mediaBlock = "";
    if (hasImage) {
      mediaBlock = `
                <div class="card-image-wrapper">
                    <img src="${escapeHTML(item.image)}" alt="Photo of ${escapeHTML(item.title)}" class="card-image" loading="${index < 3 ? "eager" : "lazy"}" decoding="async">
                    ${tags.length ? `<div class="card-tags">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>` : ""}
                </div>
            `;
    } else if (tags.length) {
      mediaBlock = `<div class="card-tags-top">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>`;
    }

    let footerBlock = "";
    if (hasPrice || hasLink) {
      footerBlock = `
                <div class="card-footer ${!hasPrice ? "no-price" : ""}">
                    ${hasPrice ? `<span class="card-price">${escapeHTML(item.price)}</span>` : ""}
                    ${
                      hasLink
                        ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="card-btn">Ver Loja ↗</a>`
                        : `<span class="card-btn card-btn--disabled">Só uma ideia 💭</span>`
                    }
                </div>
            `;
    }

    return `
            <article class="card ${!hasImage ? "card--no-image" : ""}">
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

  const renderItems = () => {
    if (typeof wishlistData === "undefined" || !Array.isArray(wishlistData)) {
      grid.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem;">⚠️ Failed to load wishlist. Please check data.js.</p>';
      return;
    }

    if (wishlistData.length === 0) {
      grid.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center;">🎁 Wishlist is empty. Add items to data.js!</p>';
      return;
    }

    grid.innerHTML = wishlistData
      .map((item, index) => renderCard(item, index))
      .join("");
  };

  renderItems();
});
