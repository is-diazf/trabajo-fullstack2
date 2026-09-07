const CLAVE_USUARIOS = "usuarios";

const regiones = [
    { nombre: "Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
    { nombre: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica"] },
    { nombre: "Antofagasta", comunas: ["Antofagasta", "Calama", "Tocopilla", "Mejillones"] },
    { nombre: "Atacama", comunas: ["Copiapó", "Caldera", "Vallenar", "Chañaral"] },
    { nombre: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel"] },
    { nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"] },
    { nombre: "Metropolitana", comunas: ["Santiago", "Puente Alto", "Maipú", "Las Condes"] },
    { nombre: "O'Higgins", comunas: ["Rancagua", "Machalí", "San Fernando", "Pichilemu"] },
    { nombre: "Maule", comunas: ["Talca", "Curicó", "Linares", "Constitución"] },
    { nombre: "Ñuble", comunas: ["Chillán", "San Carlos", "Bulnes", "Yungay"] },
    { nombre: "Biobío", comunas: ["Concepción", "Los Ángeles", "Talcahuano", "Coronel"] },
    { nombre: "La Araucanía", comunas: ["Temuco", "Angol", "Villarrica", "Pucón"] },
    { nombre: "Los Ríos", comunas: ["Valdivia", "La Unión", "Río Bueno", "Panguipulli"] },
    { nombre: "Los Lagos", comunas: ["Puerto Montt", "Osorno", "Castro", "Ancud"] },
    { nombre: "Aysén", comunas: ["Coyhaique", "Aysén", "Chile Chico", "Cochrane"] },
    { nombre: "Magallanes", comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"] }
];

const usuariosIniciales = [
    
    {
        id: 1,
        nombre: "María",
        apellidos: "González",
        correo: "admin@demo.cl",
        run: "876543214",
        fechaNacimiento: "1985-05-15",
        region: "Valparaíso",
        comuna: "Viña del Mar",
        direccion: "Avenida Siempre Viva 456",
        rol: "Admin"
    },
    {
        id: 2,
        nombre: "Juan",
        apellidos: "Pérez",
        correo: "user@demo.cl",
        run: "123456785",
        fechaNacimiento: "1990-01-01",
        region: "Metropolitana",
        comuna: "Santiago",
        direccion: "Calle Falsa 123",
        rol: "usuario"
    }
];

function obtenerUsuarios() {
    const usuariosGuardados = localStorage.getItem(CLAVE_USUARIOS);

    if (!usuariosGuardados) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosIniciales));
        return usuariosIniciales;
    }

    try {
        return JSON.parse(usuariosGuardados);
    } catch (error) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosIniciales));
        return usuariosIniciales;
    }
}

const sesion = obtenerSesion();
const usuarios = obtenerUsuarios();
const perfil = sesion ? usuarios.find((usuario) => usuario.id === sesion.id) : null;
const datos = document.getElementById("contenido-usuario");

if (!perfil) {
    datos.innerHTML = `
        <div class="container mt-4">
            <p class="alert alert-warning">No se encontró la información del usuario.</p>
            <a class="btn btn-success" href="login.html">Iniciar sesión</a>
        </div>
    `;
} else {
    datos.innerHTML = `
        <main class="container mt-4 mb-5">
            <h1 class="text-center mb-4">Mi perfil</h1>
            <form id="formulario-perfil" class="mx-auto" style="max-width: 500px;">
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="nombre" value="${perfil.nombre}" maxlength="50" required>
                </div>
                <div class="mb-3">
                    <label for="apellidos" class="form-label">Apellidos</label>
                    <input type="text" class="form-control" id="apellidos" value="${perfil.apellidos}" maxlength="100" required>
                </div>
                <div class="mb-3">
                    <label for="correo" class="form-label">Correo</label>
                    <input type="email" class="form-control" id="correo" value="${perfil.correo}" maxlength="100" required>
                </div>
                <div class="mb-3">
                    <label for="run" class="form-label">RUN</label>
                    <input type="text" class="form-control" id="run" value="${perfil.run}" pattern="[0-9]{7,8}[0-9kK]" maxlength="9" title="Ingrese el RUN sin puntos ni guion, por ejemplo 123456785" required>
                </div>
                <div class="mb-3">
                    <label for="fechaNacimiento" class="form-label">Fecha de nacimiento</label>
                    <input type="date" class="form-control" id="fechaNacimiento" value="${perfil.fechaNacimiento}">
                </div>
                <div class="mb-3">
                    <label for="region" class="form-label">Región</label>
                    <select class="form-select" id="region" required>
                        <option value="" disabled>Seleccione una región</option>
                        ${regiones.map((region) => `<option value="${region.nombre}" ${region.nombre === perfil.region ? "selected" : ""}>${region.nombre}</option>`).join("")}
                    </select>
                </div>
                <div class="mb-3">
                    <label for="comuna" class="form-label">Comuna</label>
                    <select class="form-select" id="comuna" required></select>
                </div>
                <div class="mb-3">
                    <label for="direccion" class="form-label">Dirección</label>
                    <input type="text" class="form-control" id="direccion" value="${perfil.direccion}" maxlength="300" required>
                </div>
                <button type="submit" class="btn btn-success w-100">Guardar cambios</button>
            </form>
            <button id="cerrar-sesion" type="button" class="btn btn-outline-danger d-block mx-auto mt-3" style="max-width: 500px; width: 100%;">Cerrar sesión</button>
        </main>
    `;

    cargarComunas(perfil.region, perfil.comuna);
    document.getElementById("region").addEventListener("change", (event) => cargarComunas(event.target.value));
    document.getElementById("formulario-perfil").addEventListener("submit", guardarCambios);
    document.getElementById("cerrar-sesion").addEventListener("click", cerrarSesion);
}

function cargarComunas(region, comunaSeleccionada = "") {
    const selectorComuna = document.getElementById("comuna");
    const regionSeleccionada = regiones.find((item) => item.nombre === region);
    selectorComuna.innerHTML = `
        <option value="" disabled ${comunaSeleccionada ? "" : "selected"}>Seleccione una comuna</option>
        ${(regionSeleccionada ? regionSeleccionada.comunas : []).map((comuna) => `<option value="${comuna}" ${comuna === comunaSeleccionada ? "selected" : ""}>${comuna}</option>`).join("")}
    `;
}

function runEsValido(run) {
    if (!/^\d{7,8}[0-9kK]$/.test(run)) {
        return false;
    }

    const cuerpo = run.slice(0, -1);
    const digitoIngresado = run.slice(-1).toUpperCase();
    let suma = 0;
    let multiplicador = 2;

    for (let indice = cuerpo.length - 1; indice >= 0; indice--) {
        suma += Number(cuerpo[indice]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    const digitoCalculado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return digitoIngresado === digitoCalculado;
}

function guardarCambios(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const run = document.getElementById("run").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if (nombre.length === 0 || nombre.length > 50) {
        alert("El nombre es obligatorio y debe tener máximo 50 caracteres");
        return;
    }

    if (apellidos.length === 0 || apellidos.length > 100) {
        alert("Los apellidos son obligatorios y deben tener máximo 100 caracteres");
        return;
    }

    if (correo.length === 0 || correo.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("Ingrese un correo válido de máximo 100 caracteres");
        return;
    }

    if (!runEsValido(run)) {
        alert("El RUN debe escribirse sin puntos ni guion y tener un dígito verificador válido");
        return;
    }

    const regionSeleccionada = regiones.find((region) => region.nombre === document.getElementById("region").value);
    if (!regionSeleccionada || !regionSeleccionada.comunas.includes(document.getElementById("comuna").value)) {
        alert("Seleccione una región y comuna válidas");
        return;
    }

    if (direccion.length === 0 || direccion.length > 300) {
        alert("La dirección es obligatoria y debe tener máximo 300 caracteres");
        return;
    }

    perfil.nombre = nombre;
    perfil.apellidos = apellidos;
    perfil.correo = correo;
    perfil.run = run;
    perfil.fechaNacimiento = document.getElementById("fechaNacimiento").value;
    perfil.region = document.getElementById("region").value;
    perfil.comuna = document.getElementById("comuna").value;
    perfil.direccion = direccion;

    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    sesion.correo = perfil.correo;
    localStorage.setItem("usuarioSesion", JSON.stringify(sesion));
    alert("Los datos se actualizaron correctamente");
}

function cerrarSesion() {
    localStorage.removeItem("usuarioSesion");
    window.location.href = "login.html";
}
