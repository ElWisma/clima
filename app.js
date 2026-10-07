const urlAPI = 'https://api.open-meteo.com/v1/forecast?latitude=18.0383&longitude=-98.4429&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto';

const elementoTemperatura = document.getElementById('temperatura');
const elementoViento = document.getElementById('viento');
const elementoDescripcion = document.getElementById('descripcion-clima');
const elementoIcono = document.getElementById('icono-clima');
const elementoEstado = document.getElementById('estado-clima');
const elementoActualizado = document.getElementById('actualizado');
const botonActualizar = document.getElementById('actualizar');

const condicionesClima = {
    0: { descripcion: 'Despejado', icono: '☀️' },
    1: { descripcion: 'Mayormente despejado', icono: '🌤️' },
    2: { descripcion: 'Parcialmente nublado', icono: '⛅' },
    3: { descripcion: 'Nublado', icono: '☁️' },
    45: { descripcion: 'Niebla', icono: '🌫️' },
    48: { descripcion: 'Niebla con escarcha', icono: '🌫️' },
    51: { descripcion: 'Llovizna ligera', icono: '🌦️' },
    53: { descripcion: 'Llovizna moderada', icono: '🌦️' },
    55: { descripcion: 'Llovizna intensa', icono: '🌧️' },
    56: { descripcion: 'Llovizna helada ligera', icono: '🌧️' },
    57: { descripcion: 'Llovizna helada intensa', icono: '🌧️' },
    61: { descripcion: 'Lluvia ligera', icono: '🌦️' },
    63: { descripcion: 'Lluvia moderada', icono: '🌧️' },
    65: { descripcion: 'Lluvia intensa', icono: '🌧️' },
    66: { descripcion: 'Lluvia helada ligera', icono: '🌧️' },
    67: { descripcion: 'Lluvia helada intensa', icono: '🌧️' },
    71: { descripcion: 'Nevada ligera', icono: '🌨️' },
    73: { descripcion: 'Nevada moderada', icono: '🌨️' },
    75: { descripcion: 'Nevada intensa', icono: '❄️' },
    77: { descripcion: 'Granos de nieve', icono: '🌨️' },
    80: { descripcion: 'Chubascos ligeros', icono: '🌦️' },
    81: { descripcion: 'Chubascos moderados', icono: '🌧️' },
    82: { descripcion: 'Chubascos violentos', icono: '⛈️' },
    85: { descripcion: 'Chubascos de nieve ligeros', icono: '🌨️' },
    86: { descripcion: 'Chubascos de nieve intensos', icono: '❄️' },
    95: { descripcion: 'Tormenta', icono: '⛈️' },
    96: { descripcion: 'Tormenta con granizo ligero', icono: '⛈️' },
    99: { descripcion: 'Tormenta con granizo intenso', icono: '⛈️' }
};

async function obtenerClima() {
    botonActualizar.disabled = true;
    botonActualizar.innerHTML = '<span aria-hidden="true">↻</span> Actualizando…';
    elementoEstado.classList.remove('error');
    elementoDescripcion.textContent = 'Consultando el clima…';
    elementoIcono.textContent = '…';

    try {
        const respuesta = await fetch(urlAPI);
        if (!respuesta.ok) {
            throw new Error(`Open-Meteo respondió con estado ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        const climaActual = datos.current;
        if (
            !climaActual ||
            !Number.isFinite(climaActual.temperature_2m) ||
            !Number.isFinite(climaActual.wind_speed_10m) ||
            !Number.isFinite(climaActual.weather_code)
        ) {
            throw new Error('La respuesta del servicio no contiene datos de clima válidos');
        }

        const condicion = condicionesClima[climaActual.weather_code] || {
            descripcion: 'Condición meteorológica actual',
            icono: '🌡️'
        };

        elementoTemperatura.textContent = `${Math.round(climaActual.temperature_2m)} °C`;
        elementoViento.textContent = `${Math.round(climaActual.wind_speed_10m)} km/h`;
        elementoDescripcion.textContent = condicion.descripcion;
        elementoIcono.textContent = condicion.icono;
        elementoActualizado.textContent = datos.current.time
            ? `Actualizado: ${datos.current.time.replace('T', ' ')}`
            : '';
    } catch (error) {
        console.error('No se pudo obtener el clima:', error);
        elementoEstado.classList.add('error');
        elementoIcono.textContent = '!';
        elementoDescripcion.textContent = 'No se pudo cargar el clima. Inténtalo de nuevo.';
        elementoActualizado.textContent = '';
    } finally {
        botonActualizar.disabled = false;
        botonActualizar.innerHTML = '<span aria-hidden="true">↻</span> Actualizar';
    }
}

botonActualizar.addEventListener('click', obtenerClima);
obtenerClima();
