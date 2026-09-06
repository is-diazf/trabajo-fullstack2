function mostrarDetalle(id) {
    // Ocultar todas las publicaciones
    document.getElementById('seccion-publicaciones').style.display = 'none';

    // Ocultar todos los detalles
    document.querySelectorAll('.detalle-publicacion').forEach(el => {
        el.classList.remove('active');
    });

    // Mostrar el detalle correspondiente
    const detalle = document.getElementById(`detalle-${id}`);
    if (detalle) {
        detalle.classList.add('active');
        // Scroll suave hacia el detalle
        detalle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function cerrarDetalle() {
    // Ocultar todos los detalles
    document.querySelectorAll('.detalle-publicacion').forEach(el => {
        el.classList.remove('active');
    });

    // Mostrar nuevamente las publicaciones
    document.getElementById('seccion-publicaciones').style.display = 'block';

    // Scroll hacia las publicaciones
    document.getElementById('seccion-publicaciones').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formularioConsulta');

    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que se recargue la página

        // Limpiar errores previos
        limpiarErrores();

        // Obtener valores
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        let esValido = true;

        // Validar nombre (no vacío)
        if (nombre === '') {
            mostrarError('nombre', 'error-nombre');
            esValido = false;
        }

        // Validar correo (formato email)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo === '' || !emailRegex.test(correo)) {
            mostrarError('correo', 'error-correo');
            esValido = false;
        }

        // Validar mensaje (mínimo 10 caracteres)
        if (mensaje.length < 10) {
            mostrarError('mensaje', 'error-mensaje');
            esValido = false;
        }

        // Si todo es válido
        if (esValido) {
            // Mostrar alerta de éxito
            const alerta = document.getElementById('alertaExito');
            alerta.classList.add('visible');

            // Limpiar campos
            document.getElementById('nombre').value = '';
            document.getElementById('correo').value = '';
            document.getElementById('mensaje').value = '';

            // Ocultar alerta después de 5 segundos
            setTimeout(() => {
                alerta.classList.remove('visible');
            }, 5000);
        }
    });
});


function mostrarError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.add('input-error');
    error.classList.add('visible');
}

function limpiarErrores() {
    // Quitar clase de error de todos los inputs
    document.querySelectorAll('.form-control').forEach(el => {
        el.classList.remove('input-error');
    });

    // Ocultar todos los mensajes de error
    document.querySelectorAll('.mensaje-error').forEach(el => {
        el.classList.remove('visible');
    });

    // Ocultar alerta de éxito si está visible
    const alerta = document.getElementById('alertaExito');
    alerta.classList.remove('visible');
}