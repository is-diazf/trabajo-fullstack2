function ingresar(event){
    event.preventDefault();
    let correo = document.getElementById("correo").value;
    let contraseña = document.getElementById("contraseña").value;

    if(correo=== ""||contraseña === ""){
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

    let contraseñaSegura = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!contraseñaSegura.test(contraseña)) {
        event.preventDefault();
        alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo especial");
        return;
    }


    if(correo === "admin@demo.cl" && contraseña === "Admin123!"){
        window.location.href = "admin.html";
    }else if(correo === "user@demo.cl" && contraseña === "User123!"){
        window.location.href = "usuario.html";
    }else{
        alert("Credenciales incorrectas");
    }
}


document.querySelector("form").addEventListener("submit", ingresar);