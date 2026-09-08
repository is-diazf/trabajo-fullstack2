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

const selectorRegion = document.getElementById("region");
const selectorComuna = document.getElementById("comuna");

regiones.forEach((region) => {
    selectorRegion.insertAdjacentHTML("beforeend", `<option value="${region.nombre}">${region.nombre}</option>`);
});

selectorRegion.addEventListener("change", () => {
    const regionSeleccionada = regiones.find((region) => region.nombre === selectorRegion.value);
    selectorComuna.disabled = !regionSeleccionada;
    selectorComuna.innerHTML = `<option value="" selected disabled>Seleccione una comuna</option>`;

    if (regionSeleccionada) {
        regionSeleccionada.comunas.forEach((comuna) => {
            selectorComuna.insertAdjacentHTML("beforeend", `<option value="${comuna}">${comuna}</option>`);
        });
    }
});

function obtenerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch (error) {
        return [];
    }
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

function registrarUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const contraseña = document.getElementById("contraseña").value;
    const confirmacion = document.getElementById("confirmar-contraseña").value;
    const run = document.getElementById("run").value.trim();
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const region = selectorRegion.value;
    const comuna = selectorComuna.value;
    const direccion = document.getElementById("direccion").value.trim();
    const usuarios = obtenerUsuarios();

    if (nombre.length === 0 || nombre.length > 50 || apellidos.length === 0 || apellidos.length > 100) {
        alert("Ingrese un nombre y apellidos válidos");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || correo.length > 100) {
        alert("Ingrese un correo válido de máximo 100 caracteres");
        return;
    }

    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,10}$/.test(contraseña)) {
        alert("La contraseña debe tener entre 8 y 10 caracteres, una mayúscula, un número y un símbolo especial");
        return;
    }

    if (contraseña !== confirmacion) {
        alert("Las contraseñas no coinciden");
        return;
    }

    if (!runEsValido(run)) {
        alert("El RUN debe escribirse sin puntos ni guion y tener un dígito verificador válido");
        return;
    }

    if (usuarios.some((usuario) => usuario.correo.toLowerCase() === correo)) {
        alert("Ya existe un usuario registrado con ese correo");
        return;
    }

    if (usuarios.some((usuario) => usuario.run && usuario.run.toUpperCase() === run.toUpperCase())) {
        alert("Ya existe un usuario registrado con ese RUN");
        return;
    }

    if (!fechaNacimiento || !region || !comuna || !direccion) {
        alert("Complete todos los campos del formulario");
        return;
    }

    const nuevoUsuario = {
        id: usuarios.length ? Math.max(...usuarios.map((usuario) => usuario.id)) + 1 : 1,
        nombre,
        apellidos,
        correo,
        contraseña,
        run,
        fechaNacimiento,
        region,
        comuna,
        direccion,
        rol: "usuario"
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    alert("Usuario creado correctamente. Ahora puedes iniciar sesión.");
    window.location.href = "login.html";
}

document.getElementById("formulario-registro").addEventListener("submit", registrarUsuario);
