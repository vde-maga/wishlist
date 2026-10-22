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
    priority: "medium",
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
    links: [
      {
        label: "Facebook Marketplace",
        url: "https://www.facebook.com/marketplace",
      },
      {
        label: "Wallapop",
        url: "https://es.wallapop.com/",
      },
      {
        label: "OLX",
        url: "https://www.olx.pt/",
      },
    ],
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
    links: [
      {
        label: "Grailed",
        url: "https://www.grailed.com/search/m65%20field%20jacket",
      },
      {
        label: "Vinted",
        url: "https://www.vinted.pt/catalog?search_text=m65%20casaco",
      },
      {
        label: "Depop",
        url: "https://www.depop.com/search/?q=m65%20jacket",
      },
    ],
    tags: ["Roupa", "Vintage", "Cinema"],
  },
  {
    id: 10,
    title: "Google Chromecast",
    description:
      "Eu não consigo dormir sem ver um vídeo do youtube... O meu método antigo morreu... Preciso de um novo.",
    priority: "medium",
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
    priority: "medium",
    tags: ["Tech", "Hobby", "Setup", "Keycaps"],
    price: "40 a 90€",
  },
  {
    id: 14,
    title: "Deskmat XL Minimalista",
    description:
      "O complemento perfeito para o teclado e keycaps. Um deskmat XL (900x400mm ou similar) minimalista, em tons neutros ou com arte subtil, ficava brutal a ligar todo o setup.",
    links: [
      {
        label: "Akko EU",
        url: "https://akkogear.eu/search?q=deskmat",
      },
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=minimalist%20xl%20deskmat",
      },
      {
        label: "AliExpress",
        url: "https://www.aliexpress.com/w/wholesale-xl-deskmat.html",
      },
    ],
    priority: "medium",
    tags: ["Tech", "Setup", "Desk"],
    price: "15 a 40€",
  },
  {
    id: 15,
    title: "Wrist Rest em Madeira ou Cortiça",
    description:
      "Prático e estético. Um wrist rest em madeira maciça ou cortiça, simples e minimalista, que fica muito bem com um setup mais limpo.",
    links: [
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=wooden%20keyboard%20wrist%20rest",
      },
      {
        label: "AliExpress",
        url: "https://www.aliexpress.com/w/wholesale-wooden-wrist-rest-keyboard.html",
      },
    ],
    priority: "low",
    tags: ["Tech", "Setup", "Utilidade"],
    price: "15 a 40€",
  },
  {
    id: 16,
    title: "Cabo Coiled USB-C",
    description:
      "Pequeno detalhe, mas fica brutal num setup. Cabo coiled em cores neutras ou com detalhes minimalistas.",
    links: [
      {
        label: "Akko EU",
        url: "https://akkogear.eu/search?q=coiled%20cable",
      },
      {
        label: "AliExpress",
        url: "https://www.aliexpress.com/w/wholesale-coiled-usb-c-cable.html",
      },
    ],
    priority: "low",
    tags: ["Tech", "Setup", "Cabo"],
    price: "10 a 30€",
  },
  {
    id: 17,
    title: "Artbook Japonês",
    description:
      "Algo visual para folhear. Gosto de artbooks com ilustrações minimalistas, arquitectura, natureza ou arte moderna japonesa. Não precisa ser enorme, basta ter ilustrações bonitas.",
    links: [
      {
        label: "Amazon",
        url: "https://www.amazon.es/s?k=Japanese%20artbook",
      },
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=japanese%20art%20book",
      },
      {
        label: "CDJapan",
        url: "https://www.cdjapan.co.jp/searchuni?q=artbook&order=rel",
      },
    ],
    priority: "medium",
    tags: ["Arte", "Hobby", "Livros"],
    price: "20 a 60€",
  },
  {
    id: 18,
    title: "Poster - The End of Evangelion",
    description:
      "Um poster bonito do The End of Evangelion. Prefiro algo minimalista, com cores desaturadas ou um print mais artístico, ao invés de cartazes demasiado carregados.",
    links: [
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=The%20End%20of%20Evangelion%20poster",
      },
      {
        label: "Redbubble",
        url: "https://www.redbubble.com/shop/the%20end%20of%20evangelion%20poster",
      },
      {
        label: "PosterSpy",
        url: "https://posterspy.com/?s=evangelion",
      },
    ],
    priority: "medium",
    tags: ["Arte", "Anime", "Cinema", "Poster"],
    price: "10 a 40€",
  },
  {
    id: 19,
    title: "Poster - Drive My Car",
    description:
      "Gosto muito da atmosfera do Drive My Car. Um poster minimalista ou com fotografia seria perfeito para pendurar.",
    links: [
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=Drive%20My%20Car%20poster",
      },
      {
        label: "Redbubble",
        url: "https://www.redbubble.com/shop/drive%20my%20car%20poster",
      },
      {
        label: "PosterSpy",
        url: "https://posterspy.com/?s=drive%20my%20car",
      },
    ],
    priority: "medium",
    tags: ["Arte", "Cinema", "Poster"],
    price: "10 a 30€",
  },
  {
    id: 20,
    title: "Poster - The Man Who Stole the Sun",
    description:
      "Um filme japonês único. Adorava ter um poster deste, preferencialmente com arte minimalista ou em linha mais vintage.",
    links: [
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=The%20Man%20Who%20Stole%20the%20Sun%20poster",
      },
      {
        label: "Redbubble",
        url: "https://www.redbubble.com/shop/the%20man%20who%20stole%20the%20sun%20poster",
      },
    ],
    priority: "medium",
    tags: ["Arte", "Cinema", "Poster", "Japão"],
    price: "10 a 30€",
  },
  {
    id: 21,
    title: "Prints Ligne Claire (Blake & Mortimer / Hergé style)",
    description:
      "Adoro a estética ligne claire - traços limpos, cores vivas e composição cuidadosa. Prints de Blake & Mortimer, ou ilustrações originais neste estilo ficam lindos emoldurados.",
    links: [
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=ligne%20claire%20print",
      },
      {
        label: "Redbubble",
        url: "https://www.redbubble.com/shop/ligne%20claire%20print",
      },
      {
        label: "Wallapop",
        url: "https://es.wallapop.com/search?keywords=ligne%20claire%20print",
      },
    ],
    priority: "medium",
    tags: ["Arte", "BD", "Poster", "Ligne Claire"],
    price: "10 a 40€",
  },
  {
    id: 22,
    title: "Washi Tape Japonês",
    description:
      "Pequenos detalhes que alegram. Washi tape com padrões minimalistas, motivos tradicionais ou geométricos japoneses. Ótimo para decorar cadernos ou o setup.",
    links: [
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=japanese%20washi%20tape%20minimal",
      },
      {
        label: "Amazon",
        url: "https://www.amazon.es/s?k=Japanese%20washi%20tape",
      },
    ],
    priority: "low",
    tags: ["Arte", "Decoração", "Hobby"],
    price: "3 a 15€",
  },
  {
    id: 23,
    title: "Caneca Cerâmica Minimalista",
    description:
      "Aconchegante, prática e combina com tudo. Uma caneca cerâmica simples, com acabamento matte ou em tons terrosos, fica sempre bem.",
    links: [
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=minimalist%20ceramic%20mug",
      },
      {
        label: "Amazon",
        url: "https://www.amazon.es/s?k=caneca%20ceramica%20minimalista",
      },
    ],
    priority: "low",
    tags: ["Casa", "Utilidade"],
    price: "10 a 25€",
  },
  {
    id: 24,
    title: "Tote Bag Minimalista",
    description:
      "Prático para o dia a dia. Uma tote bag em canvas cru ou preto, com design minimalista ou inspirado em Linux/tecnologia.",
    links: [
      {
        label: "Etsy",
        url: "https://www.etsy.com/search?q=minimalist%20canvas%20tote%20bag",
      },
      {
        label: "Redbubble",
        url: "https://www.redbubble.com/shop/minimalist%20tote%20bag",
      },
    ],
    priority: "low",
    tags: ["Roupa", "Utilidade"],
    price: "10 a 25€",
  },
];
