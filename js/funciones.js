var contadorPaso = 0;
var j = 0;
/*True es para las blancas y false para las negras*/
var tokens = "",
  i = 0,
  turno = true;
var texto = "";
var columna = "";
var renglon = "";
var posicion = "";
var jaque = "";
function reglas() {
  alert(`Notación de piezas:

    Rey: K
    Reina: Q
    Torre: R
    Alfil: B
    Caballo: N
    Peón: no se indica ninguna letra (por ejemplo, e4)
    Notación de columnas:
    
    Las columnas se indican con letras de la "a" a la "h". La columna más a la izquierda es la "a" y la columna más a la derecha es la "h".
    Notación de filas:
    
    Las filas se indican con números del 1 al 8. El lado de las blancas está en las filas 1 y 2, mientras que el lado de las negras está en las filas 7 y 8.
    Notación de movimientos:
    
    Se utiliza la notación abreviada de la pieza seguida de la casilla a la que se mueve. Por ejemplo, Re4 significa que el Rey se mueve a la casilla e4.
    Capturas:
    
    Cuando una pieza captura a otra, se utiliza "x" para indicar la captura. Por ejemplo, Bxe4 significa que el Alfil captura en la casilla e4.
    Enroque:
    
    El enroque corto se indica con O-O y el enroque largo se indica con O-O-O.
    Peones:
    
    Cuando un peón avanza sin capturar, solo se indica la casilla de destino. Por ejemplo, e4 significa que el peón se mueve a e4.
    Promoción de peones:
    
    Cuando un peón alcanza la octava fila, se promociona a otra pieza (generalmente una reina). La promoción se indica agregando la letra de la pieza deseada después del movimiento del peón. Por ejemplo, e8=Q significa que el peón en e8 se promociona a una reina.
    Jaque:
    
    Se indica con el símbolo "+" al final del movimiento. Por ejemplo, Nf7+ significa que el Caballo ha dado jaque.
    Jaque mate:
    
    Se indica con el símbolo "#" al final del movimiento. Por ejemplo, Qh8# significa que la Reina ha dado jaque mate.`);
}
function removernumero() {
  // var texto = document.getElementById("textarea1").value;
  //document.getElementById("textarea2").innerHTML = texto.replace(/\d+\.\s*/g, '');
  texto = document.getElementById("textarea1").value.replace(/\d+\.\s*/g, "");
}
function getTokens() {
  tokens = texto.split(/\s+/);

  //var salida = "";
  //for (let i = 0; i < tokens.length; i++) {
  //salida += tokens[i] + "\n"

  //}
  //document.getElementById("out").innerHTML = salida;
}



function obtenerNombreImagenPieza(token, turno) {
  var pieza = "";
  var color = turno ? 'B' : 'N';
  var file = "";

  if (!tieneMayusculas(token)) {
    pieza = "Peon";
    file = String.fromCharCode(97 + convertirLetraNumero(token.charAt(0)));
  } else {
    var primeraLetra = token.charAt(0);
    switch (primeraLetra) {
      case 'N':
        pieza = "Caballo";
        break;
      case 'B':
        pieza = "Alfil";
        break;
      case 'R':
        pieza = "Torre";
        break;
      case 'Q':
        pieza = "Reina";
        break;
      case 'K':
        pieza = "Rey";
        break;
      case 'O':
        return "Enroque"; // Puedes agregar lógica especial para el enroque
    }
  }

  return `${pieza}${color}-${file}`; // Esto devolverá, por ejemplo, "ReinaN" o "CaballoB".
}

function actualizarTablero(columna, renglon, imagen) {
  var tabla = document.getElementById("Tablero");
  // Se ajusta para que el renglón 8 sea la primera fila del tablero, no el encabezado
  var cell = tabla.rows[9 - renglon].cells[convertirLetraNumero(columna)];
  cell.appendChild(document.createElement("img")).src = `./img/${imagen.split("-")[0]}.png`;
  cell.style.backgroundImage = '';
}
function limpiarTablero() {
  var tabla = document.getElementById("Tablero");
  for (let fila = 1; fila <= 8; fila++) {
    for (let columna = 1; columna <= 8; columna++) {
      let cell = tabla.rows[fila].cells[columna];
      cell.style.backgroundImage = '';
    }
  }
}

function pasos() {
  var token = tokens[i];
  var piezaImagen = obtenerNombreImagenPieza(token, turno);
  var movimientos = token.match(/[a-h][1-8]/g);

  if (movimientos) {
    var origen, destino;
    // If the token contains two positions (like "e2e4"), it's a move
    if (movimientos.length === 2) {
      origen = movimientos[0];
      destino = movimientos[1];
    } else {
      // If there's only one position, it means the move is a "pawn to e4" type move.
      // In this case, we need to calculate the origin based on the color of the piece
      destino = movimientos[0];
      origen = calculatePawnOrigin(destino, turno);
    }
    // Clear the origin cell
   
    // Set the destination cell
    actualizarTablero(destino.charAt(0), parseInt(destino.charAt(1)), piezaImagen);

    document.getElementById("turno").innerHTML = `Movimiento: ${i + 1} Turno ${turno ? "blancas" : "negras"} ${token}`;
    
    i++;
    turno = !turno;
  }
}

// This function calculates where the pawn came from based on its destination and color.
function calculatePawnOrigin(destino, isWhiteTurn) {
  var column = destino.charAt(0);
  var row = parseInt(destino.charAt(1));
  // Pawns move forward one space, unless it's their first move where they can move two.
  // You'll need to handle the case where pawns move two spaces on their first move separately.
  return `${column}${isWhiteTurn ? row - 1 : row + 1}`;
}

function iniciar() {
  limpiarTablero();
  // Establecer todas las piezas en sus posiciones iniciales
  var celdas = document.getElementById("Tablero");
  for (let fila = 1; fila <= 8; fila++) {
    for (let columna = 1; columna <= 8; columna++) {
      let cell = celdas.rows[fila].cells[columna];
      cell.style.backgroundImage = ''; // Limpiar primero todas las celdas
      cell.style.backgroundSize = "cover";
    }
  }
  // Poner las piezas blancas
  colocarPiezas('B', 8, ['Torre', 'Caballo', 'Alfil', 'Reina', 'Rey', 'Alfil', 'Caballo', 'Torre']);
  colocarPiezas('B', 7, ['Peon', 'Peon', 'Peon', 'Peon', 'Peon', 'Peon', 'Peon', 'Peon']);
  // Poner las piezas negras
  colocarPiezas('N', 1, ['Torre', 'Caballo', 'Alfil', 'Reina', 'Rey', 'Alfil', 'Caballo', 'Torre']);
  colocarPiezas('N', 2, ['Peon', 'Peon', 'Peon', 'Peon', 'Peon', 'Peon', 'Peon', 'Peon']);
}

function colocarPiezas(color, fila, piezas) {
  var tabla = document.getElementById("Tablero");
  piezas.forEach((pieza, index) => {
    // tabla.rows[fila].cells[index + 1].style.backgroundImage = `url(./img/${pieza}${color}.png)`;
    const file = String.fromCharCode(97 + index);
    const piece = tabla.rows[fila].cells[index + 1].appendChild(document.createElement("img"));
    piece.src = `./img/${pieza}${color}.png`;
    piece.setAttribute("id", `${pieza}${color}-${file}`);
  });
  //poner children image a cada una de las celdas de la fila 
}

function partidas() {
  var textarea = document.getElementById("texto");
  var valor = document.getElementById("Combo").value;

  switch (valor) {
    case "0":
      textarea.value = "";
      break;
    case "1":
      textarea.value = "Partida 1";
      break;
    case "2":
      textarea.value = "Partida 2";
      break;
    case "3":
      textarea.value = "Partida 3";
      break;
    default:
      break;
  }
}

function cargarPartida() {
  var archivo = document.getElementById("cargarBoton").files[0];
  var scanner = new FileReader();

  scanner.onload = function (e) {
    document.getElementById("texto").value = e.target.result;
    /*document.getElementById("texto").value = document.getElementById("cargarBoton").files;*/
  };
  scanner.readAsText(archivo);
  removernumero();
  getTokens();
}

function pasoApaso() {
  var celdas = document.getElementById("texto").value;
  var tabla = document.getElementById("Tablero");
  //var lineas = celdas.split("\n");
  //for (let i = 0; i < lineas.length; i++) {
  //alert(lineas[i]);
  var tokens = celdas.split(/\s+/);

  //alert(tokens[j]);
  //alert(tieneMayusculas(tokens[j]));

  //if (turno) {
  //j = 1;
  //} else {
  // j = 2;
  //}
  /*if (!tieneMayusculas(tokens[j])) {
    //alert("Si soy un Peon y me moví a "+tokens[j]);
    var posicion = tokens[j].split(/(\d+)/);
    //El usar alert no se recomienda porque no puedes hacer nada en la página, se recomienda usar el console.log
    console.log(
      "Columna " + convertirLetraNumero(posicion[0]) + " renglon " + posicion[1]
    );
    var columna = parseInt(convertirLetraNumero(posicion[0]));
    var renglon = parseInt(posicion[1]);
    if (turno) {
      tabla.rows[renglon + 1].cells[columna + 1].style =
        "background-image: url(./img/PeonB.png); background-size:cover;";
    } else {
      tabla.rows[renglon - 1].cells[columna + 1].style =
        "background-image: url(./img/PeonN.png); background-size:cover;";
    }
  }
  if (turno == false) {
    i++;
  }*/
  turno = !turno;
  document.getElementById("turno").innerHTML =
    "Turno de las " +
    (turno ? "blancas " : "negras ") +
    //renglon +
    " " +
    //columna +
    " " +
    tokens[j];
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  //}
  //}
  i++;
  j++;
}

function tieneMayusculas(cadena) {
  return /[A-Z]/.test(cadena);
}
function convertirLetraNumero(letra) {
  switch (letra) {
    case "a":
      return 1;
      break;

    case "b":
      return 2;
      break;

    case "c":
      return 3;
      break;

    case "d":
      return 4;
      break;

    case "e":
      return 5;
      break;

    case "f":
      return 6;
      break;

    case "g":
      return 7;
      break;

    case "h":
      return 8;
      break;
  }
}

/*async function test() {
  var salida = "";
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    salida += i + "<br>";
    document.getElementById("out").innerHTML = salida;
  }
}*/