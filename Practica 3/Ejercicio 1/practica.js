let F = 0, C = 0, matriz = [];

document.addEventListener("DOMContentLoaded", () => {
  const inputArchivo = document.getElementById("archivo-input");
  const cont1 = document.getElementById("matriz-container");
  const cont2 = document.getElementById("matriz-container2");

  inputArchivo.addEventListener("change", () => {
    const archivo = inputArchivo.files[0];
    if (!archivo) return;

    leerArchivo(archivo, contenido => {
      procesarContenido(contenido);
      mostrarMatriz(cont1);
      detectarYMostrarMinas(cont2);
      /*const texto = generarTextoMinas();
      descargarArchivo(texto, "minas.out");*/
    });
  });
});

function leerArchivo(archivo, callback) {
  const lector = new FileReader();
  lector.onload = e => callback(e.target.result.trim());
  lector.readAsText(archivo);
}

function procesarContenido(texto) {
  const lineas = texto.split(/\r?\n/);
  [F, C] = lineas[0].split(' ').map(Number);
  matriz = lineas.slice(1, F+1).map(line => line.trim().split(' ').map(Number));
}

function mostrarMatriz(contenedor) {
  contenedor.innerHTML = '';
  const tabla = document.createElement('table');
  const hr = document.createElement('tr');
  hr.appendChild(document.createElement('th'));
  for (let j = 1; j <= C; j++) {
    const th = document.createElement('th'); th.textContent = j;
    hr.appendChild(th);
  }
  tabla.appendChild(hr);
  for (let i = 0; i < F; i++) {
    const tr = document.createElement('tr');
    const th = document.createElement('th'); th.textContent = i+1;
    tr.appendChild(th);
    for (let j = 0; j < C; j++) {
      const td = document.createElement('td');
      td.textContent = matriz[i][j];
      tr.appendChild(td);
    }
    tabla.appendChild(tr);
  }
  contenedor.appendChild(tabla);
}

function detectarYMostrarMinas(contenedor) {
  contenedor.innerHTML = '';
  const tabla = document.createElement('table');
  const hr = document.createElement('tr');
  hr.appendChild(document.createElement('th'));
  for (let j = 1; j <= C; j++) {
    const th = document.createElement('th'); th.textContent = j;
    hr.appendChild(th);
  }
  tabla.appendChild(hr);

  for (let i = 0; i < F; i++) {
    const tr = document.createElement('tr');
    const th = document.createElement('th'); th.textContent = i+1;
    tr.appendChild(th);
    for (let j = 0; j < C; j++) {
      const td = document.createElement('td');
      const vecinos = obtenerVecinos(i, j);
      const prom = vecinos.length
        ? vecinos.reduce((a,b)=>a+b,0)/vecinos.length
        : 0;
      if (matriz[i][j] + prom > 40.0) {
        td.textContent = '💣';
        td.style.backgroundColor = 'red';
        td.style.color = 'white';
        td.style.fontWeight = 'bold';
      } else {
        td.textContent = '';
      }
      tr.appendChild(td);
    }
    tabla.appendChild(tr);
  }
  contenedor.appendChild(tabla);
}

function obtenerVecinos(i, j) {
  const v = [];
  for (let dx=-1; dx<=1; dx++) for (let dy=-1; dy<=1; dy++) {
    if (dx===0 && dy===0) continue;
    const ni = i+dx, nj = j+dy;
    if (ni>=0 && ni<F && nj>=0 && nj<C) v.push(matriz[ni][nj]);
  }
  return v;
}

function generarTextoMinas() {
  const cols = Array.from({length:C},(_,j)=>j+1).join(' ');
  const lineas = [" " + cols];
  for (let i=0; i<F; i++) {
    let fila = (i+1).toString();
    for (let j=0; j<C; j++) {
      const vecinos = obtenerVecinos(i,j);
      const prom = vecinos.length
        ? vecinos.reduce((a,b)=>a+b,0)/vecinos.length
        : 0;
      fila += " " + ((matriz[i][j] + prom > 40.0) ? "*" : " ");
    }
    lineas.push(fila);
  }
  lineas.push(" " + cols);
  return lineas.join("\n");
}

/*function descargarArchivo(texto, filename) {
  const blob = new Blob([texto], {type: "text/plain"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}*/
