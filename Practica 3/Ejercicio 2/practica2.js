class Adyacente {
  constructor(id_destino, costo, siguiente_adyacente = null) {
    this.id_destino = id_destino;
    this.costo = costo;
    this.siguiente_adyacente = siguiente_adyacente;
  }
}

class ListaAdyacencia {
  constructor() {
    this.cabeza = null;
  }

  agregarAdyacente(id_destino, costo) {
    const nuevoAdyacente = new Adyacente(id_destino, costo, this.cabeza);
    this.cabeza = nuevoAdyacente;
  }

  // Método para imprimir la lista de adyacencia
  imprimirLista() {
    let actual = this.cabeza;
    const resultados = [];
    while (actual !== null) {
      resultados.push({ id_destino: actual.id_destino, costo: actual.costo });
      actual = actual.siguiente_adyacente;
    }
    return resultados;
  }
}

class Grafo {
  constructor(numEstaciones) {
    this.numEstaciones = numEstaciones;
    this.listasAdyacencia = new Array(numEstaciones + 1).fill(null).map(() => new ListaAdyacencia());
  }

  agregarArista(origen, destino, costo) {
    this.listasAdyacencia[origen].agregarAdyacente(destino, costo);
  }

  imprimirGrafo() {
    const grafoInfo = {};
    for (let i = 1; i <= this.numEstaciones; i++) {
      grafoInfo[`Estación ${i}`] = this.listasAdyacencia[i].imprimirLista();
    }
    return grafoInfo;
  }

  // Método para encontrar la ruta óptima usando el algoritmo de Dijkstra
  encontrarRutaOptima(origen, destino) {
    const distancias = new Array(this.numEstaciones + 1).fill(Infinity);
    const anteriores = new Array(this.numEstaciones + 1).fill(null);
    const visitados = new Array(this.numEstaciones + 1).fill(false);

    distancias[origen] = 0;

    for (let i = 1; i <= this.numEstaciones; i++) {
      let u = -1;
      let minDistancia = Infinity;

      // Encontrar el nodo no visitado con la distancia más corta
      for (let j = 1; j <= this.numEstaciones; j++) {
        if (!visitados[j] && distancias[j] < minDistancia) {
          minDistancia = distancias[j];
          u = j;
        }
      }

      if (u === -1) break;
      visitados[u] = true;

      // Actualizar las distancias de los nodos adyacentes
      let actual = this.listasAdyacencia[u].cabeza;
      while (actual !== null) {
        const nuevoCosto = distancias[u] + actual.costo;
        if (nuevoCosto < distancias[actual.id_destino]) {
          distancias[actual.id_destino] = nuevoCosto;
          anteriores[actual.id_destino] = u;
        }
        actual = actual.siguiente_adyacente;
      }
    }

    // Reconstruir la ruta óptima
    const ruta = [];
    let actual = destino;
    while (actual !== null) {
      ruta.unshift(actual);
      actual = anteriores[actual];
    }

    // Verificar si hay una ruta válida
    if (ruta[0] !== origen) {
      return { ruta: [], costoTotal: 0, mensaje: `No hay ruta desde ${origen} hasta ${destino}` };
    }

    // Calcular el costo total
    let costoTotal = 0;
    for (let i = 0; i < ruta.length - 1; i++) {
      const origenRuta = ruta[i];
      const destinoRuta = ruta[i + 1];
      let actualLista = this.listasAdyacencia[origenRuta].cabeza;
      while (actualLista !== null) {
        if (actualLista.id_destino === destinoRuta) {
          costoTotal += actualLista.costo;
          break;
        }
        actualLista = actualLista.siguiente_adyacente;
      }
    }

    // Crear la ruta con los detalles
    const rutaDetallada = [];
    for (let i = 0; i < ruta.length - 1; i++) {
      const origenRuta = ruta[i];
      const destinoRuta = ruta[i + 1];
      let actualLista = this.listasAdyacencia[origenRuta].cabeza;
      let costoArista = 0;
      while (actualLista !== null) {
        if (actualLista.id_destino === destinoRuta) {
          costoArista = actualLista.costo;
          break;
        }
        actualLista = actualLista.siguiente_adyacente;
      }
      rutaDetallada.push({ origen: origenRuta, destino: destinoRuta, costo: costoArista });
    }

    return { ruta: rutaDetallada, costoTotal: costoTotal, mensaje: '' };
  }
}

let grafo;

function processFileContents(data) {
  const lines = data.trim().split('\n');
  const [numEstaciones, numRutas] = lines[0].split(' ').map(Number);
  grafo = new Grafo(numEstaciones);
  for (let i = 1; i <= numRutas; i++) {
    const [origen, destino, costo] = lines[i].split(' ').map(Number);
    grafo.agregarArista(origen, destino, costo);
  }
}

function mostrarRed() {
  if (!grafo) {
    alert('Primero carga un archivo.');
    return;
  }
  const grafoInfo = grafo.imprimirGrafo();
  let html = '<h3>Red de Estaciones</h3><table><tr><th>Estación</th><th>Conexiones Directas</th></tr>';
  for (const estacion in grafoInfo) {
    const conexiones = grafoInfo[estacion];
    let conexionesStr = '';
    for (const conexion of conexiones) {
      conexionesStr += `Estación ${conexion.id_destino} (Costo: ${conexion.costo})<br>`;
    }
    html += `<tr><td>${estacion}</td><td>${conexionesStr}</td></tr>`;
  }
  html += '</table>';
  document.getElementById('redContainer').innerHTML = html;
}

function calcularRutaOptima() {
  if (!grafo) {
    alert('Primero carga un archivo.');
    return;
  }
  const origen = parseInt(document.getElementById('origen').value);
  const destino = parseInt(document.getElementById('destino').value);

  if (isNaN(origen) || isNaN(destino)) {
    alert('Por favor, ingresa valores válidos para el origen y el destino.');
    return;
  }

  const resultado = grafo.encontrarRutaOptima(origen, destino);
  let html = '';
  if (resultado.mensaje) {
    html = `<p>${resultado.mensaje}</p>`;
  } else {
    html = '<h3>Ruta Óptima</h3><p>';
    for (const segment of resultado.ruta) {
      html += `Estación ${segment.origen} -> Estación ${segment.destino} (Costo: ${segment.costo})<br>`;
    }
    html += `</p><p>Costo total de la ruta: ${resultado.costoTotal}</p>`;
  }
  document.getElementById('rutaOptimaContainer').innerHTML = html;
}

document.getElementById('inputFile').addEventListener('change', function(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    processFileContents(contents);
  };
  reader.readAsText(file);
});
