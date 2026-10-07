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
    const botonRegistro = document.getElementById("boton-registro");
    const sesion = obtenerSesion();

    if (!botonSesion) {
        return;
    }

    if (sesion) {
        botonSesion.textContent = "Ver mi perfil";
        botonSesion.href = "usuario.html";
        botonSesion.classList.remove("disabled");
        botonSesion.removeAttribute("aria-disabled");

        if (botonRegistro) {
            botonRegistro.classList.add("disabled");
            botonRegistro.textContent = "Registrarse";
            botonRegistro.removeAttribute("href");
            botonRegistro.setAttribute("aria-disabled", "true");
            botonRegistro.setAttribute("tabindex", "-1");
        }
    } else {
        botonSesion.textContent = "Iniciar sesión";
        botonSesion.href = "login.html";
        botonSesion.classList.remove("disabled");
        botonSesion.removeAttribute("aria-disabled");

        if (botonRegistro) {
            botonRegistro.classList.remove("disabled");
            botonRegistro.textContent = "Registrarse";
            botonRegistro.href = "registro.html";
            botonRegistro.removeAttribute("aria-disabled");
            botonRegistro.removeAttribute("tabindex");
        }
    }
}

document.addEventListener("DOMContentLoaded", actualizarBotonSesion);