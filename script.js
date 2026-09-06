document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("wishlist-grid");

  // Função para mapear a prioridade a uma cor/estilo
  const getPriorityBadge = (priority) => {
    const styles = {
      high: { text: "QUERO MUITO", class: "badge-high" },
      medium: { text: "SERIA GIRO", class: "badge-medium" },
      low: { text: "IDEIA SOLTAS", class: "badge-low" },
    };
    const style = styles[priority] || styles.medium;
    return `<span class="badge ${style.class}">${style.text}</span>`;
  };

  // Renderiza cada item
  const renderItems = () => {
    // Limpa o grid (boa prática se chamarmos esta função novamente)
    grid.innerHTML = "";

    wishlistData.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";

      card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="card-image" loading="lazy">
                    <div class="card-tags">
                        ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h2 class="card-title">${item.title}</h2>
                        ${getPriorityBadge(item.priority)}
                    </div>
                    <p class="card-desc">${item.description}</p>
                    <div class="card-footer">
                        <span class="card-price">${item.price}</span>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="card-btn">
                            Ver Loja ↗
                        </a>
                    </div>
                </div>
            `;
      grid.appendChild(card);
    });
  };

  renderItems();
});
