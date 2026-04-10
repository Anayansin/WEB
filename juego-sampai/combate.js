function actualizarBarraVida(rol, valor) {
  const vida = document.getElementById("vida-" + rol);
  const porcentaje = Math.max(0, Math.min(100, valor));

  vida.value = porcentaje;
  vida.textContent = porcentaje + "%";
}

function agregarLineaRegistro(texto) {
  const listaRegistro = document.getElementById("lista-registro");
  const item = document.createElement("li");

  item.textContent = texto;
  listaRegistro.append(item);
}

function limpiarRegistroCombate() {
  const listaRegistro = document.getElementById("lista-registro");
  listaRegistro.innerHTML = "";
}

function esAtaqueDeCuracion(ataque) {
  return ataque.tipo === "curacion";
}

function calcularDanioRecibido(ataque, defensor) {
  if (esAtaqueDeCuracion(ataque) || ataque.poderBase <= 0) {
    return 0;
  }

  const resistencia = defensor.resistencias[ataque.tipo] || 1;
  return Math.round(ataque.poderBase * resistencia);
}

function calcularCuracion(ataque) {
  if (!esAtaqueDeCuracion(ataque)) {
    return 0;
  }

  return Math.max(0, ataque.poderBase);
}

function elegirAtaqueAleatorio(personaje) {
  const indice = Math.floor(Math.random() * personaje.ataques.length);
  return personaje.ataques[indice];
}

function bloquearAccionesJugador() {
  const botones = document.querySelectorAll("#lista-combate-jugador .personaje__accion");
  botones.forEach(function (boton) {
    boton.disabled = true;
  });
}

function mostrarBotonVolverSeleccion() {
  document.getElementById("btn-volver-seleccion").hidden = false;
}

function cerrarCombateConMensaje(mensaje) {
  agregarLineaRegistro(mensaje);
  bloquearAccionesJugador();
  mostrarBotonVolverSeleccion();
  return true;
}

function finalizarPorVictoriaJugador() {
  contadorVictorias += 1;
  actualizarMarcador();
  return cerrarCombateConMensaje("Combate | Resultado | Victoria jugador");
}

function finalizarPorDerrotaJugador() {
  contadorDerrotas += 1;
  actualizarMarcador();
  return cerrarCombateConMensaje("Combate | Resultado | Victoria oponente");
}

function finalizarCombateSiCorresponde() {
  if (combateActual.vidaJugador <= 0 && combateActual.vidaOponente <= 0) {
    return cerrarCombateConMensaje("Combate | Resultado | Empate");
  }

  if (combateActual.vidaOponente <= 0) {
    return finalizarPorVictoriaJugador();
  }

  if (combateActual.vidaJugador <= 0) {
    return finalizarPorDerrotaJugador();
  }

  return false;
}

function turnoNoDisponible() {
  if (!combateActual) {
    return true;
  }

  return combateActual.vidaJugador <= 0 || combateActual.vidaOponente <= 0;
}

function crearMensajeAccion(nombreAtacante, ataque, danio, curacion) {
  if (esAtaqueDeCuracion(ataque)) {
    return nombreAtacante + " | " + ataque.nombre + " | Cura " + curacion;
  }

  return nombreAtacante + " | " + ataque.nombre + " | Dano " + danio;
}

function registrarAccionEnCombate(nombreAtacante, ataque, danio, curacion) {
  const mensaje = crearMensajeAccion(nombreAtacante, ataque, danio, curacion);
  agregarLineaRegistro(mensaje);
}

function resolverAccion(ataque, atacante, defensor, vidaAtacante, vidaDefensor) {
  const danio = calcularDanioRecibido(ataque, defensor);
  const curacion = calcularCuracion(ataque);

  return {
    danio: danio,
    curacion: curacion,
    nuevaVidaAtacante: Math.min(100, vidaAtacante + curacion),
    nuevaVidaDefensor: Math.max(0, vidaDefensor - danio),
    nombreAtacante: atacante.nombre,
  };
}

function ejecutarAccionJugador(ataqueJugador) {
  const resultado = resolverAccion(
    ataqueJugador,
    combateActual.jugador,
    combateActual.oponente,
    combateActual.vidaJugador,
    combateActual.vidaOponente
  );

  combateActual.vidaJugador = resultado.nuevaVidaAtacante;
  combateActual.vidaOponente = resultado.nuevaVidaDefensor;
  registrarAccionEnCombate(resultado.nombreAtacante, ataqueJugador, resultado.danio, resultado.curacion);
}

function ejecutarAccionOponente() {
  const ataqueOponente = elegirAtaqueAleatorio(combateActual.oponente);
  const resultado = resolverAccion(
    ataqueOponente,
    combateActual.oponente,
    combateActual.jugador,
    combateActual.vidaOponente,
    combateActual.vidaJugador
  );

  combateActual.vidaOponente = resultado.nuevaVidaAtacante;
  combateActual.vidaJugador = resultado.nuevaVidaDefensor;
  registrarAccionEnCombate(resultado.nombreAtacante, ataqueOponente, resultado.danio, resultado.curacion);
}

function actualizarVidasCombate() {
  actualizarBarraVida("jugador", combateActual.vidaJugador);
  actualizarBarraVida("oponente", combateActual.vidaOponente);
}

function ejecutarTurno(ataqueJugador) {
  if (turnoNoDisponible()) {
    return;
  }

  ejecutarAccionJugador(ataqueJugador);
  if (!finalizarCombateSiCorresponde()) {
    ejecutarAccionOponente();
    finalizarCombateSiCorresponde();
  }

  actualizarVidasCombate();
}

function renderizarParticipanteEnCombate(personaje, rol, accionesDeshabilitadas) {
  const vida = document.getElementById("vida-" + rol);

  vida.max = 100;
  vida.value = 100;
  vida.textContent = "100%";

  renderizarPersonajes([personaje], {
    idLista: "lista-combate-" + rol,
    mostrarAcciones: true,
    accionesDeshabilitadas: accionesDeshabilitadas,
    onAccionClick: function (_, ataque) {
      if (rol === "jugador") {
        ejecutarTurno(ataque);
      }
    },
  });
}
