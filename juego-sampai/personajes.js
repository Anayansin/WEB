const TIPOS = {
  agua: {
    nombre: "Agua",
    emoji: "🌊",
  },
  fuego: {
    nombre: "Fuego",
    emoji: "🔥",
  },
  planta: {
    nombre: "Planta",
    emoji: "🌳",
  },
  curacion: {
    nombre: "Curacion",
    emoji: "🩹",
  },
};

// Esta estructura será la base del personaje también durante la batalla.
// Más adelante sólo le agregaremos datos nuevos, como ataques especiales
// o acciones extra como sanar.
const personajes = [
  {
    id: "planta-01",
    nombre: "Plantito Patata",
    tipo: "planta",
    imagen: "Planta.png",
    hp: 100,
    // Cuanto daño recibe de cada tipo.
    // 0.5 = resiste, 1 = normal, 2 = debilidad
    resistencias: {
      agua: 0.5,
      fuego: 2,
      planta: 1,
    },
    // Preferencia de elemento para sus ataques.
    preferenciaAtaque: "planta",
    // Nuevo atributo para batalla:
    // lista de ataques que el personaje puede usar.
    ataques: [
      { id: "planta-rapido", nombre: "Hoja Veloz", tipo: "planta", poderBase: 18 },
      { id: "planta-tecnico", nombre: "Liana Curva", tipo: "agua", poderBase: 16 },
      { id: "planta-pesado", nombre: "Raiz Martillo", tipo: "planta", poderBase: 22 },
      { id: "planta-sanar", nombre: "Fotosintesis", tipo: "curacion", poderBase: 16 },
    ],
  },
  {
    id: "agua-01",
    nombre: "Burbujon Mojadito",
    tipo: "agua",
    imagen: "Agua.png",
    hp: 95,
    resistencias: {
      agua: 1,
      fuego: 0.5,
      planta: 2,
    },
    preferenciaAtaque: "agua",
    ataques: [
      { id: "agua-rapido", nombre: "Salpicon", tipo: "agua", poderBase: 18 },
      { id: "agua-tecnico", nombre: "Bruma Fria", tipo: "fuego", poderBase: 16 },
      { id: "agua-pesado", nombre: "Tsunami Mini", tipo: "agua", poderBase: 22 },
      { id: "agua-sanar", nombre: "Gota Vital", tipo: "curacion", poderBase: 16 },
    ],
  },
  {
    id: "fuego-01",
    nombre: "Fueguito Toston",
    tipo: "fuego",
    imagen: "Fuego.png",
    hp: 90,
    resistencias: {
      agua: 2,
      fuego: 1,
      planta: 0.5,
    },
    preferenciaAtaque: "fuego",
    ataques: [
      { id: "fuego-rapido", nombre: "Chispa Ninja", tipo: "fuego", poderBase: 18 },
      { id: "fuego-tecnico", nombre: "Ascuas Tacticas", tipo: "planta", poderBase: 16 },
      { id: "fuego-pesado", nombre: "Bola de Lava", tipo: "fuego", poderBase: 22 },
      { id: "fuego-sanar", nombre: "Calor Interno", tipo: "curacion", poderBase: 16 },
    ],
  },
];
