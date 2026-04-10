function crearElementoTipo(tipoId) {
  const tipo = TIPOS[tipoId];
  const span = document.createElement("span");

  span.className = "hoverText";
  // Guardamos un texto personalizado en un atributo data-* para que CSS
  // lo pueda leer y mostrar como tooltip al hacer hover.
  // Equivalente a data-hover-text si lo escribes como atributo en el tag HTML directamente.
  span.dataset.hoverText = tipo.nombre;
  // aria-label le da un nombre descriptivo al emoji para lectores de pantalla (accesibilidad para personas con discapacidades).
  span.setAttribute("aria-label", tipo.nombre);
  span.textContent = tipo.emoji;

  return span;
}

function crearAtributoPersonaje(etiqueta, valor, icono) {
  const atributo = document.createElement("div");
  const etiquetaSpan = document.createElement("span");
  const valorSpan = document.createElement("span");

  atributo.className = "personaje__atributo";

  etiquetaSpan.className = "personaje__etiqueta";
  etiquetaSpan.textContent = etiqueta;

  valorSpan.className = "personaje__valor";

  if (typeof valor === "string") {
    valorSpan.textContent = valor;
  } else {
    valorSpan.append(valor);
  }

  atributo.append(etiquetaSpan);
  atributo.append(valorSpan);

  if (icono) {
    const iconoSpan = document.createElement("span");

    iconoSpan.className = "personaje__icono";
    // aria-hidden hace que este icono decorativo no se lea dos veces
    // en tecnologías de asistencia.
    iconoSpan.setAttribute("aria-hidden", "true");
    iconoSpan.textContent = icono;

    atributo.append(iconoSpan);
  }

  return atributo;
}

function crearFilaStats(tipoId, personaje) {
  const fila = document.createElement("tr");
  const celdaTipo = document.createElement("td");
  const celdaResistencia = document.createElement("td");

  celdaTipo.append(crearElementoTipo(tipoId));
  celdaResistencia.textContent = personaje.resistencias[tipoId];

  fila.append(celdaTipo);
  fila.append(celdaResistencia);

  return fila;
}

function crearTablaStats(personaje) {
  const tabla = document.createElement("table");
  const encabezado = document.createElement("thead");
  const filaEncabezado = document.createElement("tr");
  const cuerpo = document.createElement("tbody");
  const encabezados = ["Elemento", "Resistencia"];

  tabla.className = "personaje__stats";

  encabezados.forEach(function (texto) {
    const th = document.createElement("th");

    th.textContent = texto;
    filaEncabezado.append(th);
  });

  encabezado.append(filaEncabezado);
  tabla.append(encabezado);

  cuerpo.append(crearFilaStats('agua', personaje));
  cuerpo.append(crearFilaStats('fuego', personaje));
  cuerpo.append(crearFilaStats('planta', personaje));

  tabla.append(cuerpo);

  return tabla;
}

function esAtaqueDeCuracion(ataque) {
  return ataque.tipo === "curacion";
}

function obtenerEmojiAccion(ataque) {
  return TIPOS[ataque.tipo].emoji;
}

function obtenerTextoPoder(ataque) {
  if (esAtaqueDeCuracion(ataque)) {
    return "Cura " + ataque.poderBase;
  }

  return "Poder " + ataque.poderBase;
}

function crearTextoBotonAccion(ataque) {
  return obtenerEmojiAccion(ataque) + " " + ataque.nombre + " | " + obtenerTextoPoder(ataque);
}

function configurarEstadoBotonAccion(boton, config) {
  if (config.accionesDeshabilitadas) {
    boton.disabled = true;
  }
}

function vincularClickBotonAccion(boton, personaje, ataque, config) {
  if (!config.onAccionClick || config.accionesDeshabilitadas) {
    return;
  }

  boton.addEventListener("click", function () {
    config.onAccionClick(personaje, ataque);
  });
}

function crearItemAccion(personaje, ataque, config) {
  const item = document.createElement("li");
  const boton = document.createElement("button");

  boton.type = "button";
  boton.className = "personaje__accion";
  boton.textContent = crearTextoBotonAccion(ataque);
  configurarEstadoBotonAccion(boton, config);
  vincularClickBotonAccion(boton, personaje, ataque, config);

  item.append(boton);
  return item;
}

function crearListaAcciones(personaje, config) {
  const listaAcciones = document.createElement("ul");

  listaAcciones.className = "personaje__acciones";

  personaje.ataques.forEach(function (ataque) {
    listaAcciones.append(crearItemAccion(personaje, ataque, config));
  });

  return listaAcciones;
}

function crearNombrePersonaje(personaje) {
  const nombre = document.createElement("h3");
  nombre.className = "personaje__nombre";
  nombre.textContent = personaje.nombre;
  return nombre;
}

function crearImagenPersonaje(personaje) {
  const imagen = document.createElement("img");
  imagen.className = "personaje__imagen";
  imagen.src = "imagenes/" + personaje.imagen;
  imagen.alt = "Personaje de tipo " + personaje.tipo + " llamado " + personaje.nombre;
  return imagen;
}

function crearDatosPersonaje(personaje) {
  const datos = document.createElement("div");
  const tipoPrincipal = crearElementoTipo(personaje.tipo);
  datos.className = "personaje__datos";
  datos.append(crearAtributoPersonaje("HP", String(personaje.hp), "❤"));
  datos.append(crearAtributoPersonaje("Tipo", tipoPrincipal));
  return datos;
}

function agregarAccionesSiCorresponde(item, personaje, config) {
  if (!config.mostrarAcciones) {
    return;
  }

  item.append(crearListaAcciones(personaje, config));
}

function habilitarSeleccionSiCorresponde(item, personaje, config) {
  if (!config.seleccionable) {
    return;
  }

  item.classList.add("personaje--seleccionable");
  item.addEventListener("click", function () {
    config.onSeleccionar(personaje.id);
  });
}

function resaltarPersonajeSeleccionado(item, personaje, config) {
  if (config.personajeSeleccionadoId === personaje.id) {
    item.classList.add("personaje--seleccionado");
  }
}

function crearTarjetaPersonaje(personaje, opciones) {
  const config = opciones || {};
  const item = document.createElement("li");

  item.className = "personaje";
  item.append(crearNombrePersonaje(personaje));
  item.append(crearImagenPersonaje(personaje));
  item.append(crearDatosPersonaje(personaje));
  item.append(crearTablaStats(personaje));
  agregarAccionesSiCorresponde(item, personaje, config);
  habilitarSeleccionSiCorresponde(item, personaje, config);
  resaltarPersonajeSeleccionado(item, personaje, config);

  return item;
}

function renderizarPersonajes(listaDePersonajes, configuracion) {
  const config = configuracion || {};
  const lista = document.getElementById(config.idLista);

  // Limpiamos la lista antes de volver a dibujarla.
  lista.innerHTML = "";

  listaDePersonajes.forEach(function (personaje) {
    lista.append(crearTarjetaPersonaje(personaje, config));
  });
}
