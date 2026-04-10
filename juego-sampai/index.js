let idJugadorSeleccionado = "";
let idOponenteSeleccionado = "";
let combateActual = null;
let contadorVictorias = 0;
let contadorDerrotas = 0;

function buscarPersonajePorId(idPersonaje) {
  return personajes.find(function (personaje) {
    return personaje.id === idPersonaje;
  });
}

function renderizarListaSeleccion(idLista, idSeleccionado, onSeleccionar) {
  renderizarPersonajes(personajes, {
    idLista: idLista,
    seleccionable: true,
    mostrarAcciones: true,
    accionesDeshabilitadas: true,
    personajeSeleccionadoId: idSeleccionado,
    onSeleccionar: onSeleccionar,
  });
}

function renderizarListasSeleccion() {
  renderizarListaSeleccion("lista-jugador", idJugadorSeleccionado, function (idPersonaje) {
    idJugadorSeleccionado = idPersonaje;
    renderizarListasSeleccion();
  });

  renderizarListaSeleccion("lista-contrincante", idOponenteSeleccionado, function (idPersonaje) {
    idOponenteSeleccionado = idPersonaje;
    renderizarListasSeleccion();
  });
}

function actualizarMarcador() {
  document.getElementById("contador-victorias").textContent = contadorVictorias;
  document.getElementById("contador-derrotas").textContent = contadorDerrotas;
}

function mostrarSeleccionEnCombate() {
  const jugador = buscarPersonajePorId(idJugadorSeleccionado);
  const oponente = buscarPersonajePorId(idOponenteSeleccionado);

  if (!jugador || !oponente) {
    alert("Primero selecciona tu personaje y tu contrincante.");
    return;
  }

  combateActual = {
    jugador: jugador,
    oponente: oponente,
    vidaJugador: 100,
    vidaOponente: 100,
  };

  limpiarRegistroCombate();
  renderizarParticipanteEnCombate(jugador, "jugador", false);
  renderizarParticipanteEnCombate(oponente, "oponente", true);
  actualizarBarraVida("jugador", combateActual.vidaJugador);
  actualizarBarraVida("oponente", combateActual.vidaOponente);

  document.getElementById("btn-volver-seleccion").hidden = true;
  document.getElementById("seleccion-personaje").style.display = "none";
  document.getElementById("combate").hidden = false;
}

function volverASeleccion() {
  combateActual = null;
  document.getElementById("combate").hidden = true;
  document.getElementById("seleccion-personaje").style.removeProperty("display");
}

// Esperamos a que el HTML exista por completo antes de buscar elementos por id.
window.addEventListener("DOMContentLoaded", function () {
  renderizarListasSeleccion();
  actualizarMarcador();

  document
    .getElementById("btn-confirmar-seleccion")
    .addEventListener("click", mostrarSeleccionEnCombate);

  document.getElementById("btn-volver-seleccion").addEventListener("click", volverASeleccion);
});