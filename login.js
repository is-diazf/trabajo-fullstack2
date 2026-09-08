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


    const usuarios = obtenerUsuarios();
    const usuarioEncontrado = usuarios.find((usuario) =>
        usuario.correo.toLowerCase() === correo.toLowerCase() &&
        usuario.contraseña === contraseña &&
        usuario.rol.toLowerCase() === tipoUsuario
    );

    if(usuarioEncontrado){
        localStorage.setItem("usuarioSesion", JSON.stringify({
            id: usuarioEncontrado.id,
            correo: usuarioEncontrado.correo,
            rol: usuarioEncontrado.rol
        }));
        window.location.href = usuarioEncontrado.rol.toLowerCase() === "admin" ? "admin.html" : "index.html";
    }else{
        alert("El tipo de usuario no coincide con las credenciales ingresadas");
    }
}

function obtenerUsuarios(){
    const usuariosGuardados = localStorage.getItem("usuarios");
    const usuariosIniciales = [
        { id: 1, nombre: "María", apellidos: "González", correo: "admin@demo.cl", contraseña: "Admin123!", rol: "Admin" },
        { id: 2, nombre: "Juan", apellidos: "Pérez", correo: "user@demo.cl", contraseña: "User123!", rol: "usuario" }
    ];

    if(!usuariosGuardados){
        localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
        return usuariosIniciales;
    }

    try{
        const usuarios = JSON.parse(usuariosGuardados);

        if(!Array.isArray(usuarios)){
            throw new Error("La lista de usuarios no es válida");
        }

        const contraseñasDemo = {
            "admin@demo.cl": "Admin123!",
            "user@demo.cl": "User123!"
        };
        let usuariosActualizados = false;

        usuarios.forEach((usuario) => {
            const correo = usuario.correo ? usuario.correo.toLowerCase() : "";

            if(!usuario.contraseña && contraseñasDemo[correo]){
                usuario.contraseña = contraseñasDemo[correo];
                usuariosActualizados = true;
            }
        });

        if(usuariosActualizados){
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }

        return usuarios;
    }catch(error){
        localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
        return usuariosIniciales;
    }
}

document.querySelector("form").addEventListener("submit", ingresar);