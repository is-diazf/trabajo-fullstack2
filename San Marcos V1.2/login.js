function ingresar(event) {
    event.preventDefault();

    let tipoUsuario = document.getElementById("tipo-usuario").value;
    let correo = document.getElementById("correo").value.trim();
    let contraseña = document.getElementById("contraseña").value;

    if (tipoUsuario === "" || correo === "" || contraseña === "") {
        alert("Debe completar todos los campos");
        return;
    }

    let formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(correo)) {
        alert("El correo ingresado no es válido");
        return;
    }

    // Credenciales unificadas (coinciden con registro.js y usuario.js)
    if (tipoUsuario === "admin" && correo === "admin@demo.cl" && contraseña === "Admin123!") {
        localStorage.setItem("usuarioSesion", JSON.stringify({ id: 1, correo: correo, rol: "admin" }));
        window.location.href = "admin.html";
    } else if (tipoUsuario === "usuario" && correo === "user@demo.cl" && contraseña === "User123!") {
        localStorage.setItem("usuarioSesion", JSON.stringify({ id: 2, correo: correo, rol: "usuario" }));
        window.location.href = "usuario.html";
    } else {
        alert("Credenciales incorrectas. Verifique el tipo de usuario, correo y contraseña.");
    }
}

document.querySelector("form").addEventListener("submit", ingresar);