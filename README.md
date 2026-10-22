# A Minha Wishlist

Página pessoal de wishlist / lista de prendas, estática e sem dependências
de runtime. Feita com HTML, CSS e JavaScript (ES Modules) puros.

**Live:** https://vde-maga.github.io/wishlist/

## Estrutura

```
.
├── index.html            # Página única (meta tags, layout, bootstrap de tema)
├── data.js               # Conteúdo da wishlist (ES module: wishlistData)
├── robots.txt            # Regras de indexação
├── sitemap.xml           # Sitemap
├── css/                  # CSS modular (reset → layout → components → …)
├── js/                   # Módulos ES
│   ├── app.js            # Entry point / wiring de eventos
│   ├── renderer.js       # Render de cards e painel de filtros
│   ├── filters.js        # Filtragem, ordenação e estado no URL
│   ├── theme.js          # Tema claro/escuro
│   ├── storage.js        # Persistência (localStorage)
│   └── utils.js          # Funções puras (escape, preço, links de loja)
├── images/               # Imagens otimizadas (.webp)
└── scripts/
    ├── optimize-images.sh  # Pipeline de otimização de imagens (ImageMagick)
    └── check-links.js      # Verificação dos links das lojas
```

## Adicionar um item

Edita `data.js` e acrescenta uma entrada ao array `wishlistData`:

```js
{
  id: 11,
  title: "Nome do item",
  description: "Porquê que o quero...",
  image: "./images/ficheiro.webp",   // opcional
  link: "https://loja.exemplo/item", // opcional (link único)
  links: [                            // opcional (várias lojas)
    { label: "Loja A", url: "https://loja-a.exemplo/item" },
    { label: "Loja B", url: "https://loja-b.exemplo/item" },
  ],
  priority: "medium",                // high | medium | low (default: medium)
  tags: ["Tech", "Hobby"],           // opcional
  price: "38€",                      // opcional
  priceChecked: "2026-10-22",        // opcional (data de verificação)
}
```

Campos são todos opcionais exceto `id` e `title`. Se `links` existir, tem
precedência sobre `link`. O parsing de preço aceita valores simples (`38€`),
intervalos (`1 a 10€`) e sufixos não-EUR (`3$/mo`).

## Filtrar e pesquisar

- **Pesquisa** — por título, descrição ou tags, sem distinguir maiúsculas nem
  acentos. O atalho `/` foca o campo de pesquisa.
- **Tags** — multi-seleção (lógica OR)
- **Prioridade** — alta / média / baixa
- **Preço** — `€` (até 50€), `€€` (50–150€), `€€€` (150€+)
- **Orçamento máximo** — campo numérico para mostrar apenas itens até um valor
- **Ordenar** — preço ascendente/descendente, prioridade ou mais recente
- **Surpreende-me** — escolhe um item aleatório entre os resultados visíveis,
  faz scroll até ele e destaca-o
- **Copiar lista** — copia os resultados visíveis em Markdown, com preço e links
- **Filtros ativos** — cada filtro aparece como um chip removível por cima dos
  resultados; o número total fica no botão **Filtros**

Itens sem preço definido nunca são escondidos pelos filtros de preço/orçamento
e são colocados no fim quando se ordena por preço. O chip de preço verificado
aparece nos itens que têm `priceChecked` definido.

A pesquisa e os filtros são guardados na query string (por exemplo,
`?q=teclado&tags=Tech&budget=50&sort=priority`). O URL pode ser guardado ou
partilhado e o estado é restaurado ao abrir a página.

Em ecrãs pequenos (< 768px) o painel de filtros aparece colapsado por defeito
para poupar espaço vertical. O número de filtros ativos fica visível no botão
**Filtros**.

## Partilhar e ampliar

Cada card tem um link direto (`#item-12`) e um botão **Partilhar**. Em
dispositivos com Web Share API abre o menu nativo; nos restantes copia o link
para a área de transferência.

Clicar na imagem de um card abre uma lightbox nativa (`<dialog>`). Fecha com o
botão **Fechar**, com `Esc` ou clicando fora da imagem.

## Imprimir

O site tem uma folha de estilos de impressão (`css/print.css`) que esconde
filtros, botões e navegação, e apresenta a wishlist em cards compactos com
imagem, descrição, preço e link da loja. Usa **Imprimir → Guardar como PDF** no
browser.

## Desenvolvimento

Sem build step. Basta servir a raiz por HTTP:

```sh
python3 -m http.server 8000
# ou
npx serve .
```

### Otimização de imagens (Nix + ImageMagick)

```sh
nix develop          # shell com ImageMagick
nix run .#optimize   # corre scripts/optimize-images.sh
```

Flags do script: `--check` (só reporta), `--all` (recomprime tudo),
`--keep-originals`.

### Qualidade de código

```sh
npm install     # instala ESLint + Prettier (devDependencies)
npm run lint    # ESLint
npm run format  # Prettier (escreve)
npm run check:links  # verifica os links das lojas em data.js
```

O CI (`.github/workflows/ci.yml`) corre a verificação de sintaxe, lint e
formatação em cada push/PR. O workflow `check-links.yml` verifica os links
mensalmente (ou manualmente via **Actions → Check links**).

## Deploy

GitHub Pages a servir a branch `main`. Faz merge de `dev` → `main` para
publicar.

## Licença

MIT — ver [LICENSE](./LICENSE).
