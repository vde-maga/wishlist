document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("wishlist-grid");

  const getPriorityBadge = (priority) => {
    const styles = {
      high: { text: "QUERO MUITO", class: "badge-high" },
      medium: { text: "SERIA GIRO", class: "badge-medium" },
      low: { text: "IDEIA SOLTA", class: "badge-low" },
    };
    const style = styles[priority] || styles.medium;
    return `<span class="badge ${style.class}">${style.text}</span>`;
  };

  const renderCard = (item) => {
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const hasImage = !!item.image;
    const hasPrice = !!item.price;
    const hasLink = !!item.link;
    const hasDescription = !!item.description;

    let mediaBlock = "";
    if (hasImage) {
      mediaBlock = `
                <div class="card-image-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="card-image" loading="lazy">
                    ${tags.length ? `<div class="card-tags">${tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>` : ""}
                </div>
            `;
    } else if (tags.length) {
      mediaBlock = `<div class="card-tags-top">${tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>`;
    }

    let footerBlock = "";
    if (hasPrice || hasLink) {
      footerBlock = `
                <div class="card-footer ${!hasPrice ? "no-price" : ""}">
                    ${hasPrice ? `<span class="card-price">${item.price}</span>` : ""}
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
                        <h2 class="card-title">${item.title}</h2>
                        ${getPriorityBadge(item.priority)}
                    </div>
                    ${hasDescription ? `<p class="card-desc">${item.description}</p>` : ""}
                    ${footerBlock}
                </div>
            </article>
        `;
  };

  const renderItems = () => {
    grid.innerHTML = wishlistData.map((item) => renderCard(item)).join("");
  };

  renderItems();
});
