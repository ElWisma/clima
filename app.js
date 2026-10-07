// app.js
// app.js

// 1. Guardar la URL generada en Open-Meteo en una constante
// SOLUCIÓN: Se agregó "&current_weather=true" al final de la URL
const urlAPI = 'https://api.open-meteo.com/v1/forecast?latitude=18.0383&longitude=-98.4429&hourly=temperature_2m,relative_humidity_2m,rain,weather_code,pressure_msl,visibility,apparent_temperature,precipitation_probability,precipitation&current_weather=true';

// 2. Crear una función asíncrona para obtener los datos
async function obtenerClima() {
    try {
        // Realizar la petición a la red
        const respuesta = await fetch(urlAPI);
        
        // Verificar si hubo un error en la conexión
        if (!respuesta.ok) {
            throw new Error('No se pudo conectar con el servidor de Open-Meteo');
        }

        // Convertir el texto recibido a formato JSON
        const datosJSON = await respuesta.json();
        
        // Extraer el objeto específico del clima actual. (Ahora sí existe en el JSON)
        const climaActual = datosJSON.current_weather;

        // 3. Modificar el DOM (HTML) con los datos extraídos
        const elementoTemperatura = document.getElementById('temperatura');
        const elementoViento = document.getElementById('viento');

        elementoTemperatura.textContent = `Temperatura actual: ${climaActual.temperature} °C`;
        elementoViento.textContent = `Velocidad del viento: ${climaActual.windspeed} km/h`;

    } catch (error) {
        // Manejo de errores (ej. sin conexión a internet)
        console.error('Detalle del error:', error);
        document.getElementById('temperatura').textContent = 'Error al cargar los datos del clima.';
        document.getElementById('viento').textContent = '';
    }
}

// 4. Ejecutar la función para que se active al abrir la página
obtenerClima();
