// Wishlist content - each item may define: id, title, description, image,
// link (legacy single store), links ([{ label, url }]), priority
// (high|medium|low), tags, price, priceChecked (YYYY-MM-DD).

export const wishlistData = [
  {
    id: 1,
    title: "Discos Rígidos",
    description:
      "Quero criar uma NAS porreira e desde que os meus Barracudas morreram, estou aberto a recomeçar um hobby meu.",
    image: "./images/barracuda.webp",
    links: [
      {
        label: "DiskPrices",
        url: "https://diskprices.com/",
      },
    ],
    priority: "high",
    tags: ["Tech", "Hobby", "NAS"],
  },
  {
    id: 2,
    title: "Botão de Ligar Motherboard",
    description:
      "Eu sei a teoria de ligar uma motherboard com uma chave de fendas apenas, mas sempre que tento, nunca consigo o fazer. Desta forma, sei que não preciso mais pensar nessa coisa. Existem alguns mais baratos, mas ele é todo gamer e fixe para autistas!",
    image: "./images/botaoTurnOnMotherboard.webp",
    links: [
      {
        label: "AliExpress",
        url: "https://aliexpress.com/item/1005008525013593.html",
      },
    ],
    priority: "low",
    tags: ["Tech", "Hobby", "Utilidade"],
    price: "1 a 10€",
  },
  {
    id: 3,
    title: "Beeper para a Motherboard",
    description:
      "Apenas algo útil de ter, que depois posso vir a utilizar para compreender o problema que o computador está a dar.",
    image: "./images/beeperMotherboard.webp",
    links: [
      {
        label: "AliExpress",
        url: "https://aliexpress.com/item/1005006471625880.html",
      },
    ],
    priority: "low",
    tags: ["Tech", "Hobby", "Utilidade"],
    price: "1 a 10€",
  },
  {
    id: 4,
    title: "Peluche da Ena",
    description:
      "Gosto imenso do estilo dela e gosto de peluches. Não sou muito de ter figures e similares, pois não sou consumista, mas aceito receber tais coisas, em especial se forem peluches, pois acredito que tem mais utilidade que uma mera figura de ação que só fica parada e preciso ter muito cuidado para não a estragar.",
    image: "./images/enaPlush.webp",
    links: [
      {
        label: "Fangamer EU",
        url: "https://www.fangamer.eu/products/ena-ena-plush",
      },
    ],
    priority: "low",
    tags: ["Hobby", "Plush", "Anime"],
    price: "38€",
  },
  {
    id: 5,
    title: "Assinatura no TorBox",
    description:
      "Eu sou um gajo de seedar e tal, mas adoraria ser um pouco normie, às vezes e simplesmente sentir a praticidade de ter tudo no Stremio, sem grandes problemas. Ser plug and play, sabem... Pronto, com esta assinatura, podia ter download speeds rápidas e acho que abriria uma parte de mim, capaz de consumir filmes e similares mais rápido.",
    links: [
      {
        label: "TorBox",
        url: "https://torbox.app/pricing",
      },
    ],
    priority: "medium",
    tags: ["Hobby", "Tech", "Anime", "Cinema"],
    price: "3$/mo",
    image: "./images/torbox.webp",
  },
  {
    id: 6,
    title: "Plush do Tux, o Pinguim do Linux",
    description:
      "Gosto de Pinguins e Gosto do Linux, portanto, claro que gosto do Tux. Não precisa ser um plush gigante, basta algo com o pinguim para acompanhar o setup.",
    image: "./images/plush-linux-penguin.webp",
    links: [
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=Tux%20Linux%20plush",
      },
      {
        label: "Amazon",
        url: "https://www.amazon.es/s?k=Tux%20Linux%20plush",
      },
    ],
    priority: "medium",
    tags: ["Plush", "Tech", "Linux"],
  },
  {
    id: 7,
    title: "PSVita ou outra retro console portátil porreira",
    description:
      "Não gosto de jogar no telemóvel, pois não sinto os botões, no touchscreen. Achava porreiro ter uma consola portátil retro para jogar por aí sem ser dependente do telemóvel.",
    priority: "low",
    image: "./images/psvita.webp",
    tags: ["Tech", "Gaming", "Retro"],
  },
  {
    id: 8,
    title: "Parafusos de HDD/SSDs",
    description:
      "Os parafusos que usamos para prender os discos rígidos ou SSDs às caixas dos computadores. São parafusos M3 ou #6-32 UNC. Um pack com vários tamanhos é o ideal para não ficar sem quando precisar.",
    priority: "low",
    image: "./images/parafusos-hdd-ssd.webp",
    links: [
      {
        label: "AliExpress",
        url: "https://www.aliexpress.com/w/wholesale-m3-hdd-screw.html",
      },
      {
        label: "Amazon",
        url: "https://www.amazon.es/s?k=M3%20HDD%20SSD%20screws",
      },
    ],
    tags: ["Tech", "Hobby", "Utilidade"],
    price: "2 a 15€",
  },
  {
    id: 9,
    title: "Casaco M65",
    description:
      "É o casaco do James Sunderland e do Travis Bickle. É mais que um casaco. É um símbolo da solidão, dureza das ruas e outras coisas todas existencialistas e niilistas. Adorava ter um, pois acho que se encaixa bem com o que sou.",
    priority: "medium",
    image: "./images/m65Casaco.webp",

    tags: ["Roupa", "Cinema"],
  },
  {
    id: 10,
    title: "Google Chromecast",
    description:
      "Eu não consigo dormir sem ver um vídeo do youtube... O meu método antigo morreu... Preciso de um novo.",
    priority: "high",
    links: [
      {
        label: "Amazon",
        url: "https://www.amazon.es/s?k=Google%20Chromecast",
      },
      {
        label: "Fnac",
        url: "https://www.fnac.pt/search/?search=Google%20Chromecast",
      },
    ],
    image: "./images/chromecast.webp",
    tags: ["Tech", "Entretenimento"],
    price: "30 a 60€",
  },
  {
    id: 11,
    title: "Keycaps PBT Black & Gold",
    description:
      "Gostava de experimentar melhorar o teclado que tenho. Sei que umas keycaps fazem uma grande diferença no quesito de beleza e a própria performance (que não ligo muito) de um teclado.",
    image: "./images/keycapsPBTBlackGold.webp",
    links: [
      {
        label: "Akko EU",
        url: "https://akkogear.eu/products/black-gold-cyrillic-keycap-set-98-key",
      },
    ],
    priority: "low",
    tags: ["Tech", "Hobby", "Setup"],
    price: "25,28€",
    priceChecked: "2026-10-22",
  },
  {
    id: 12,
    title: "Teclado Magnético Akko FUN68 HE",
    description:
      "Gostava de ter um teclado magnético. Eu já tenho um mecânico e não sou um gamer gamer, mas ainda gostava de experimentar escrever no teclado com tecnologias modernas. Não só isso, como este teclado é de 60%, ao invés dos 100% que eu tenho.",
    image: "./images/tecladoMagneticoFun68.webp",
    links: [
      {
        label: "Gamer Unlocked",
        url: "https://gamerunlocked.pt/produto/teclado-gaming-magnetico-akko-monsgeek-fun68-he-65-ansi-rapid-trigger-8k/",
      },
      {
        label: "Akko EU",
        url: "https://akkogear.eu/products/fun68-he-magnetic-keyboard",
      },
    ],
    priority: "medium",
    tags: ["Tech", "Gaming", "Setup"],
    price: "49,90€",
    priceChecked: "2026-10-22",
  },
  {
    id: 13,
    title: "Keycaps Temáticas Japonesas",
    description:
      "Gostava de umas keycaps com temática japonesa, minimalistas e bonitas. Algo com kanji subtil, elementos tradicionais ou estética wabi-sabi a condizer com o setup.",
    links: [
      {
        label: "Akko EU",
        url: "https://akkogear.eu/search?q=japanese%20keycap",
      },
      {
        label: "KBDfans",
        url: "https://kbdfans.com/search?keyword=Japanese%20keycap",
      },
      {
        label: "AliExpress",
        url: "https://www.aliexpress.com/w/wholesale-japanese-keycap-set.html",
      },
    ],
    priority: "low",
    tags: ["Tech", "Hobby", "Setup", "Keycaps"],
    price: "40 a 90€",
    image: "./images/keycapsJapan.webp",
  },
  {
    id: 14,
    title: "Wrist Rest",
    description:
      "O wrist rest que tenho no meu teclado, está todo escamado. É daquele material rasca, que com o contacto do suor e pele humana, começa a desfazer-se. Ele ainda funciona, mas está meio merdoso... Gostava de ter um novo. O que tenho atualmente, é um duro. Nunca experimentei um daqueles de almofada.",
    priority: "medium",
    tags: ["Tech", "Setup", "Utilidade"],
    image: "./images/wristRest.webp",
  },
  {
    id: 15,
    title: "Artbook do Hisashi Eguchi",
    image: "./images/eguchiArtbook.webp",
    description:
      "Eu esporro-me para as artes deste homem e ter a arte de forma física, seria algo engraçado de ter. Não o daria muito uso, mas isso não é o verdadeiro propósito de uma prenda? Receber prendas porque são uteis é muito adulto... E I mean, eu visto-me com base no que as mulheres dele estão vestidas",
    priority: "low",
    tags: ["Arte", "Hobby", "Livros"],
    price: "20 a 60€",
  },
  {
    id: 16,
    title: "Poster - The End of Evangelion",
    description:
      "É um sonho, desde que fiquei bué fã de animes e de Evangelion, ter o poster oficial do The End of Evangelion dos USA. Os posters que tenho no meu setup gamer, já perderam a cor, então, acho uma win-win situation",
    priority: "medium",
    image: "./images/evangelionPoster.webp",
    tags: ["Arte", "Anime", "Cinema", "Poster"],
    price: "5-15€",
  },
];
