const wishlistData = [
  {
    id: 1,
    title: "Teclado Mecânico Custom",
    description: "Switches Cherry MX Brown, keycaps PBT.",
    image: "./images/et.jpeg",
    link: "https://exemplo.com/teclado",
    price: "150€",
    priority: "high",
    tags: ["Tech", "Hobby"],
  },
  {
    id: 2,
    title: "Jantar no Restaurante X",
    description: "Aquele restaurante Michelin que queremos experimentar.",
    // SEM imagem, SEM preço, SEM link, SEM tags
    priority: "high",
  },
  {
    id: 3,
    title: "Aprender a tocar Saxofone",
    // SEM imagem, SEM descrição, SEM tags, SEM preço
    link: "https://exemplo.com/aulas-saxofone",
    priority: "low",
  },
  {
    id: 4,
    title: "Livro: 'The Design of Everyday Things'",
    description: "Edição revista e ampliada. Capa dura.",
    image: "./images/livro.jpg",
    // SEM preço (porque é um livro que já tenho na wishlist da Fnac e o preço varia)
    // SEM tags
    link: "https://exemplo.com/livro",
    priority: "medium",
  },
];
