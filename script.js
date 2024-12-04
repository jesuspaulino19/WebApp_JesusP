const palabras = ["aura", "windows", "linux", "mac", "android", "computadora", "sql", "navidad", "semaforo", "luz", "carro", "itla", "seguridad", "frio", "chill", "celular", "bachata", "zapato", "casa", "pizza", "javascript", "html", "css", "frontend", "backend", "dinero", "australia", "europa", "dominicano", "pollitos"];
const palabraSeleccionada = palabras[Math.floor(Math.random() * palabras.length)];
let intentos = 0;
const maxIntentos = 6;
let palabraOculta = Array(palabraSeleccionada.length).fill("_");
const letrasErradas = [];

const canvas = document.getElementById("ahorcadoCanvas");
const ctx = canvas.getContext("2d");

const dibujarBase = () => {
    ctx.beginPath();
    ctx.moveTo(50, 380);
    ctx.lineTo(150, 380);
    ctx.moveTo(100, 380);
    ctx.lineTo(100, 50);
    ctx.lineTo(160, 50);
    ctx.lineTo(160, 80);
    ctx.stroke();
};

const dibujarMuñeco = () => {
    switch (intentos) {
        case 1: // Cabeza
            ctx.beginPath();
            ctx.arc(160, 100, 20, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 2: // Cuerpo
            ctx.beginPath();
            ctx.moveTo(160, 120);
            ctx.lineTo(160, 200);
            ctx.stroke();
            break;
        case 3: // Brazo izquierdo
            ctx.beginPath();
            ctx.moveTo(160, 140);
            ctx.lineTo(130, 180);
            ctx.stroke();
            break;
        case 4: // Brazo derecho
            ctx.beginPath();
            ctx.moveTo(160, 140);
            ctx.lineTo(190, 180);
            ctx.stroke();
            break;
        case 5: // Pierna izquierda
            ctx.beginPath();
            ctx.moveTo(160, 200);
            ctx.lineTo(130, 250);
            ctx.stroke();
            break;
        case 6: // Pierna derecha
            ctx.beginPath();
            ctx.moveTo(160, 200);
            ctx.lineTo(190, 250);
            ctx.stroke();
            break;
    }
};

const actualizarPantalla = () => {
    const palabraElement = document.getElementById("palabra");
    palabraElement.innerText = palabraOculta.join(" ");

    // Estilos adicionales para mas hacerlo dinámico
    palabraElement.style.fontSize = "2rem"; // Tamaño grande
    palabraElement.style.fontWeight = "bold"; // Negrita
    palabraElement.style.color = "#333"; // Color del texto
    palabraElement.style.textAlign = "center"; // Centrado
    palabraElement.style.position = "relative"; 
    palabraElement.style.top = "-210px"; // Mueve hacia arriba
    palabraElement.style.left = "30%";
    palabraElement.style.justifycontent = "center"; /* Centra horizontalmente las letras */

    document.getElementById("mensaje").innerText = letrasErradas.length
        ? `Letras erradas: ${letrasErradas.join(", ")}`
        : "";
};

document.getElementById("probarLetra").addEventListener("click", () => {
    const letra = document.getElementById("letra").value.toLowerCase();
    document.getElementById("letra").value = "";

    if (!letra || letra.length !== 1) return alert("Introduce una letra válida.");
    if (palabraSeleccionada.includes(letra)) {
        palabraSeleccionada.split("").forEach((char, i) => {
            if (char === letra) palabraOculta[i] = letra;
        });
    } else {
        if (!letrasErradas.includes(letra)) {
            letrasErradas.push(letra);
            intentos++;
            dibujarMuñeco();
        }
    }

    actualizarPantalla();

    if (palabraOculta.join("") === palabraSeleccionada) {
        document.getElementById("mensaje").innerText = "¡Ganaste!";
        document.getElementById("probarLetra").disabled = true;
        document.getElementById("reiniciar").style.display = "block";
    } else if (intentos === maxIntentos) {
        document.getElementById("mensaje").innerText = `¡Perdiste! La palabra era: ${palabraSeleccionada}`;
        document.getElementById("probarLetra").disabled = true;
        document.getElementById("reiniciar").style.display = "block";
    }
});

document.getElementById("reiniciar").addEventListener("click", () => {
    location.reload();
});

// Inicializa el canvas
dibujarBase();
actualizarPantalla();
