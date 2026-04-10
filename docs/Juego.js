const personajes = [
    {
        tipo: "Fuego",
        nombre: "Yuna",
        vida: 20,
        daño: 10,
        efectos: {
            "Fuego": 1,
            "Agua": 0.5,
            "Planta": 2,
        }
    },
    {
        tipo: "Planta",
        nombre: "Mitsuki & Aya",
        vida: 20,
        daño: 10,
        efectos: {
            "Planta": 1,
            "Fuego": 0.5,
            "Agua": 2,
        }
    },
    {
        tipo: "Agua",
        nombre: "Baili",
        vida: 20,
        daño: 10,
        efectos: {
            "Agua": 1,
            "Fuego": 2,
            "Planta": 0.5,
        }
    }
]

const eleccion = document.querySelectorAll(".Eleccion")
