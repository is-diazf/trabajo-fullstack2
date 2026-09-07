function ingresar(event){
    event.preventDefault();
    let tipoUsuario = document.getElementById("tipo-usuario").value;
    let correo = document.getElementById("correo").value;
    let contraseña = document.getElementById("contraseña").value;

    if(tipoUsuario === "" || correo === "" || contraseña === ""){
        event.preventDefault();
        alert("Debe completar todos los campos");
        return;
    }

    let formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!formatoCorreo.test(correo)){
        event.preventDefault();
        alert("El correo ingresado no es válido");
        return;

    }

    let contraseñaSegura = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{4,10}$/;
    if (!contraseñaSegura.test(contraseña)) {
        event.preventDefault();
        alert("La contraseña debe tener entre 4 y 10 caracteres, una mayúscula, un número y un símbolo especial");
        return;
    }


    if(tipoUsuario === "admin" && correo === "admin@demo.cl" && contraseña === "Admin123!"){
        localStorage.setItem("usuarioSesion", JSON.stringify({ id: 1, correo: correo, rol: "admin" }));
        window.location.href = "admin.html";
    }else if(tipoUsuario === "usuario" && correo === "user@demo.cl" && contraseña === "User123!"){
        localStorage.setItem("usuarioSesion", JSON.stringify({ id: 2, correo: correo, rol: "usuario" }));
        window.location.href = "index.html";
    }else{
        alert("El tipo de usuario no coincide con las credenciales ingresadas");
    }
}


document.querySelector("form").addEventListener("submit", ingresar);