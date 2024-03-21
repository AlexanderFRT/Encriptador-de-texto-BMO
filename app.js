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
    let encryptedText = '';

    // Itera sobre cada carácter del texto ingresado
    for (let char of inputText) {
        // Si el carácter está en el mapa de vocales, lo reemplaza; de lo contrario, lo deja igual
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
    // Obtiene el texto encriptado desde el campo de entrada y elimina los espacios en blanco al principio y al final
    let encryptedText = userInput.value.trim();
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

// Función para copiar el texto
function copyText() {
    // Seleccionar el texto dentro del elemento userText
    const textToCopy = userText.textContent;
    // Intentar copiar el texto al portapapeles
    navigator.clipboard.writeText(textToCopy)
}

// Función para ocultar elementos no deseados y mostrar el botón de copiar
function hideElementsAndDisplayCopyButton() {
    // Oculta los elementos de salida y muestra el botón de copiar en la interfaz
    document.querySelector('.output-beemo').style.display = 'none';
    document.querySelector('.output-text-1').style.display = 'none';
    document.querySelector('.output-text-2').style.display = 'none';
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
    }, 1500);
}

/*
Debe funcionar solo con letras minúsculas
No deben ser utilizadas letras con acentos ni caracteres especiales */