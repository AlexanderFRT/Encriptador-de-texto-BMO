// Función para establecer la URL de la imagen de fondo y recargarla desde el principio cuando se carga la página
window.onload = function() {
    // Seleccionar el elemento HTML con el ID "background"
    var background = document.getElementById("background");
    // Definir la URL de la imagen de fondo
    var imageUrl = "gif/stardew_valley_dynamic_wallpaper_by_bratzoid_slowed.gif";

    // Pre-carga la imagen de fondo
    var image = new Image();
    image.onload = function() {
        // Una vez que la imagen se carga correctamente, establecerla como imagen de fondo
        background.style.backgroundImage = "url('" + imageUrl + "')";
    };
    image.src = imageUrl;

    // Función para recargar la imagen de fondo desde el principio al recargar la página
    var reloadImage = function() {
        background.style.backgroundImage = "none"; // Eliminar la imagen de fondo actual
        setTimeout(function() {
            background.style.backgroundImage = "url('" + imageUrl + "')"; // Establecer de nuevo la imagen de fondo
        }, 100); // Agregar un pequeño retraso para asegurar que la imagen se elimine correctamente antes de volver a cargarla
    };

    // Llamar a la función reloadImage al cargar la página
    reloadImage();
}

// Usamos un mapa para definir tantas variables como sea necesario, ya que tiene un tiempo de respuesta mejor y la variable const, en lugar de let, ya que estos valores son inmutables.
const vowelMap = new Map([
    ['e', 'enter'],
    ['i', 'imes'],
    ['a', 'ai'],
    ['o', 'ober'],
    ['u', 'ufat']
]);

// Creamos un mapa invertido intercambiando las claves y valores del mapa de vocales original
const invertedVowelMap = new Map([...vowelMap.entries()].map(([k, v]) => [v, k]));

// Obtenemos referencias a los elementos relevantes en el documento HTML
const userInput = document.getElementById('input-text');
const encryptMessage = document.getElementById('encrypt-button');
const decryptMessage = document.getElementById('decrypt-button');
const copyMessage = document.getElementById('copy-button');
const userText = document.querySelector('.user-input');

// Agregamos event listeners para los botones relevantes
encryptMessage.addEventListener('click', encryptText);
decryptMessage.addEventListener('click', decryptText);
copyMessage.addEventListener('click', copyText);

// Función para encriptar el texto ingresado por el usuario
function encryptText() {
    // Obtiene el texto ingresado y elimina los espacios en blanco al principio y al final
    let inputText = userInput.value.trim();

    // Verifica si el área de texto de entrada está vacía
    if (isTextAreaEmpty()) {
        // Si no hay texto, muestra un nuevo mensaje y la imagen original
        return;
    }

    // Verifica si la entrada es válida
    if (!isValidInput(inputText)) {
        // Muestra el modal para entrada inválida
        showModal();
        return;
    }

    // Si el texto es válido, procede con la encriptación
    let encryptedText = '';
    for (let char of inputText) {
        encryptedText += vowelMap.has(char) ? vowelMap.get(char) : char;
    }

    // Actualiza el contenido del elemento de texto en la interfaz con el texto encriptado
    userText.textContent = encryptedText;
    // Muestra el elemento de texto en la interfaz
    userText.style.display = "block";
    // Oculta otros elementos y muestra el botón de copiar en la interfaz
    hideElementsAndDisplayCopyButton();
    // Limpia el área de entrada
    cleanTextArea();
}

// Función para desencriptar el texto ingresado por el usuario
function decryptText() {
    let encryptedText = userInput.value.trim();

    if (isTextAreaEmpty()) {
        return;
    }

    if (!encryptedText) {
        document.querySelector('.output-beemo').style.display = 'block';
        document.querySelector('.output-text-3').style.display = 'block';  
        return;
    }

    if (!isValidInput(encryptedText)) {
        showModal();
        return;
    }

    let decryptedText = '';
    let decrypted = false; // Bandera para indicar si se realizó alguna desencriptación durante el proceso

    // Itera sobre cada caracter del texto encriptado
    for (let i = 0; i < encryptedText.length; i++) {
        // Itera sobre cada par de valores (clave, valor) en el mapa de vocales invertido
        for (let [encrypted, original] of invertedVowelMap) {
            // Comprueba si el substring actual del texto encriptado coincide con alguna clave del mapa
            if (encryptedText.substr(i, encrypted.length) === encrypted) {
                // Si coincide, agrega el valor correspondiente al texto desencriptado
                decryptedText += original;
                // Salta al siguiente conjunto de caracteres encriptados en la siguiente iteración
                i += encrypted.length - 1;
                // Establece la bandera de desencriptación en verdadero
                decrypted = true;
                // Sale del bucle interno
                break;
            }
        }
        // Si no se realizó ninguna desencriptación en esta iteración
        if (!decrypted) {
            // Agrega el caracter actual del texto encriptado al texto desencriptado sin modificar
            decryptedText += encryptedText[i];
        }
        // Reinicia la bandera de desencriptación para la próxima iteración
        decrypted = false;
    }

    userText.textContent = decryptedText;
    userText.style.display = "block";
    hideElementsAndDisplayCopyButton();
    cleanTextArea();
}

function showBubbleText() {
    const bubbleText = document.getElementById('bubble-text');
    bubbleText.style.display = 'block'; // Muestra la burbuja de texto

    // Esconde la burbuja de texto luego de un retraso
    setTimeout(function() {
        bubbleText.style.display = 'none';
    }, 4000); // 4000 milisegundos = 4 segundos
}

// Función para copiar el texto
function copyText() {
    // Seleccionar el texto dentro del elemento userText
    const textToCopy = userText.textContent;
    // Intenta copiar el texto al portapapeles
    navigator.clipboard.writeText(textToCopy)
    .then(function() {
        // Si el proceso es exitoso, muestra una burbuja de texto
        showBubbleText();
    })
    // Adicionalmente transfiere el valor directamente a la caja del textArea
    const inputText = document.querySelector('#input-text');
    inputText.value = textToCopy;
}

// Función para ocultar elementos no deseados y mostrar el botón de copiar
function hideElementsAndDisplayCopyButton() {
    // Oculta los elementos de salida y muestra el botón de copiar en la interfaz
    document.querySelector('.output-beemo').style.display = 'none';
    document.querySelector('.output-text-1').style.display = 'none';
    document.querySelector('.output-text-2').style.display = 'none';
    document.querySelector('.output-text-3').style.display = 'none';
    document.querySelector('#copy-button').style.display = 'block';
}

// Función para limpiar el área de entrada
function cleanTextArea() {
    const inputText = document.querySelector('#input-text');
    // Muestra un mensaje mientras se limpia el área de entrada
    inputText.value = 'Limpiando caja...'; // Muestra el mensaje mientras se limpia el área de entrada
    // Agrega una clase de desvanecimiento para una animación suave
    inputText.classList.add('fade-out');
    // Espera un tiempo antes de limpiar el valor de entrada después de que la animación de desvanecimiento se complete
    setTimeout(() => {
        inputText.value = ''; // Limpia el valor de entrada después de que la animación de desvanecimiento se complete
        inputText.classList.remove('fade-out'); // Elimina la clase de desvanecimiento después de que la animación de desvanecimiento se complete
    }, 1000);
}

let clickCount = 0;

// Función para verificar si el área de texto está vacía
function isTextAreaEmpty() {
    const inputText = document.getElementById('input-text');

    // Verifica si el área de texto de entrada está vacía
    if (inputText.value.trim() === '') {
        // Incrementa el contador de clicks solo si el área de texto está vacía
        clickCount++;

        // Verifica si el contador de clicks ha alcanzado 2
        if (clickCount === 2) {
            // Realiza acciones para un área de texto vacía después de dos clicks
            document.querySelector('.user-input').textContent = '';
            document.querySelector('.output-beemo').style.display = 'block';
            document.querySelector('.output-text-3').style.display = 'block';   
            document.querySelector('.output-text-1').style.display = 'none';
            document.querySelector('.output-text-2').style.display = 'none';
            document.querySelector('#copy-button').style.display = 'none';
            
            // Reinicia el contador de clicks.
            clickCount = 0;

            // Retorna true si el área de texto está vacía después de dos clicks
            return true;
        }
        
        // Retorna true si el área de texto está vacía, incluso si el contador de clicks no ha llegado a dos clicks
        return true;
    }

    // Retorna false si el área de texto no está vacía
    return false;
}

// Función auxiliar para validar la entrada
function isValidInput(text) {
    // Verifica si el texto contiene caracteres con acentos
    let containsAccents = /[áéíóúÁÉÍÓÚ]/.test(text);
    // Verifica si el texto contiene caracteres inválidos
    let containsInvalidCharacters = /[A-Z0-9!@#$%^&*()_+]/.test(text);

    // Retorna 'true' si el texto no contiene acentos ni caracteres inválidos, de lo contrario retorna 'false'
    return !containsAccents && !containsInvalidCharacters;
}

// Función para mostrar el modal
function showModal() {
    // Obtiene una referencia al elemento modal por su ID
    const modal = document.getElementById('myModal');
    // Cambia el estilo de visualización del modal para hacerlo visible
    modal.style.display = 'block';
}

// Función para ocultar el modal
function hideModal() {
    // Obtiene una referencia al elemento modal por su ID
    const modal = document.getElementById('myModal');
    // Cambia el estilo de visualización del modal para ocultarlo
    modal.style.display = 'none';
}

// Agrega un event listener para detectar clics en cualquier parte de la ventana
window.addEventListener('click', function(event) {
    // Obtiene una referencia al elemento modal por su ID
    const modal = document.getElementById('myModal');
    // Verifica si el elemento clickeado es el modal mismo
    if (event.target == modal) {
        // Si es así, oculta el modal llamando a la función hideModal
        hideModal();
    }
});