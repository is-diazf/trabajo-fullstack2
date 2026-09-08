document.addEventListener('DOMContentLoaded', function() {
    let formulario = document.getElementById('formularioConsulta');

    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que se recargue la página

        // Limpiar errores previos
        limpiarErrores();

        // Obtener valores
        let nombre = document.getElementById('nombre').value.trim();
        let correo = document.getElementById('correo').value.trim();
        let mensaje = document.getElementById('mensaje').value.trim();

        let esValido = true;

        // Validar nombre (no vacío)
        if (nombre === '' || nombre.length > 100) {
            mostrarError('nombre', 'error-nombre');
            esValido = false;
        }

        // Validar correo (formato email)
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo === '' || !emailRegex.test(correo) || correo.length > 100) 
            {mostrarError('correo', 'error-correo');
            esValido = false;
}

        // Validar mensaje (mínimo 10 caracteres)
        if (mensaje.length < 10 || mensaje.length > 500) {
            mostrarError('mensaje', 'error-mensaje');
            esValido = false;
        }

        // Si todo es válido
        if (esValido) {
            // Mostrar alerta de éxito
            let alerta = document.getElementById('alertaExito');
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
    let input = document.getElementById(inputId);
    let error = document.getElementById(errorId);

    input.classList.add('input-error');
    error.classList.add('visible');
}

function limpiarErrores() {
    document.querySelectorAll('.form-control').forEach(el => {
        el.classList.remove('input-error');
    });

    document.querySelectorAll('.mensaje-error').forEach(el => {
        el.classList.remove('visible');
    });

    let alerta = document.getElementById('alertaExito');
    alerta.classList.remove('visible');
}