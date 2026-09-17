document.addEventListener('DOMContentLoaded', function () {
    let formulario = document.getElementById('formularioConsulta');

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        limpiarErrores();

        let nombre = document.getElementById('nombre').value.trim();
        let correo = document.getElementById('correo').value.trim();
        let mensaje = document.getElementById('mensaje').value.trim();

        let esValido = true;

        if (nombre === '' || nombre.length > 100) {
            mostrarError('nombre', 'error-nombre');
            esValido = false;
        }

        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo === '' || !emailRegex.test(correo) || correo.length > 100) {
            mostrarError('correo', 'error-correo');
            esValido = false;
        }

        if (mensaje.length < 10 || mensaje.length > 500) {
            mostrarError('mensaje', 'error-mensaje');
            esValido = false;
        }

        if (esValido) {
            let alerta = document.getElementById('alertaExito');
            alerta.classList.add('visible');

            document.getElementById('nombre').value = '';
            document.getElementById('correo').value = '';
            document.getElementById('mensaje').value = '';

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