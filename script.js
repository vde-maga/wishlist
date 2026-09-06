document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("wishlist-grid");

  const escapeHTML = (str) => {
    if (typeof str !== "string") return str;
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  };

  const getReservedItems = () => {
    try {
      const reserved = localStorage.getItem("wishlist_reserved");
      return reserved ? JSON.parse(reserved) : [];
    } catch (e) {
      console.error("Error reading reserved items:", e);
      return [];
    }
  };

  const toggleReservation = (id) => {
    const reserved = getReservedItems();
    const index = reserved.indexOf(id);

    if (index > -1) {
      reserved.splice(index, 1);
    } else {
      reserved.push(id);
    }

    try {
      localStorage.setItem("wishlist_reserved", JSON.stringify(reserved));
    } catch (e) {
      console.error("Error saving reserved items:", e);
    }

    renderItems();
  };

  const isReserved = (id) => {
    return getReservedItems().includes(id);
  };

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
            <button onclick="toggleReservation(${item.id})" class="card-btn ${reserved ? "card-btn--reserved" : "card-btn--reserve"}">
              ${reserved ? "✓ Reservado" : "Reservar"}
            </button>
          </div>
        </div>
      `;
    }

    return `
      <article class="card ${!hasImage ? "card--no-image" : ""} ${reserved ? "card--reserved" : ""}">
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
        '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem;">⚠️ Erro ao carregar a wishlist. Verifica o ficheiro data.js.</p>';
      return;
    }

    if (wishlistData.length === 0) {
      grid.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center;">🎁 A wishlist está vazia. Adiciona itens no data.js!</p>';
      return;
    }

    grid.innerHTML = wishlistData
      .map((item, index) => renderCard(item, index))
      .join("");
  };

  window.toggleReservation = toggleReservation;

  renderItems();
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const getStoredTheme = () => {
    try {
      return localStorage.getItem("wishlist_theme");
    } catch (e) {
      console.error("Error reading theme preference:", e);
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem("wishlist_theme", theme);
    } catch (e) {
      console.error("Error saving theme preference:", e);
    }
  };

  const applyTheme = (theme) => {
    document.body.classList.remove("dark-mode", "light-mode");

    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.textContent = "☀️";
    } else {
      document.body.classList.add("light-mode");
      themeIcon.textContent = "🌙";
    }
  };

  const initTheme = () => {
    const storedTheme = getStoredTheme();
    const theme = storedTheme || getSystemTheme();
    applyTheme(theme);
  };

  const toggleTheme = () => {
    const currentTheme = document.body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    setStoredTheme(newTheme);
  };

  themeToggle.addEventListener("click", toggleTheme);

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const storedTheme = getStoredTheme();
      if (!storedTheme) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });

  initTheme();
});
