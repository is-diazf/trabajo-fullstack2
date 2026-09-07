const CLAVE_SESION = "usuarioSesion";

function obtenerSesion() {
    const sesionGuardada = localStorage.getItem(CLAVE_SESION);

    if (!sesionGuardada) {
        return null;
    }

    try {
        return JSON.parse(sesionGuardada);
    } catch (error) {
        localStorage.removeItem(CLAVE_SESION);
        return null;
    }
}

function actualizarBotonSesion() {
    const botonSesion = document.getElementById("boton-sesion");
    const sesion = obtenerSesion();

    if (!botonSesion) {
        return;
    }

    if (sesion) {
        botonSesion.textContent = "Ver mi perfil";
        botonSesion.href = "usuario.html";
        botonSesion.classList.remove("disabled");
        botonSesion.removeAttribute("aria-disabled");
    } else {
        botonSesion.textContent = "Iniciar sesión";
        botonSesion.href = "login.html";
    }
}

document.addEventListener("DOMContentLoaded", actualizarBotonSesion);