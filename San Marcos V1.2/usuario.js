const CLAVE_USUARIOS = "usuarios";
const CLAVE_SELECCIONADOS = "serviciosSeleccionados";

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

function obtenerSeleccionados() {
    const data = localStorage.getItem(CLAVE_SELECCIONADOS);
    return data ? JSON.parse(data) : [];
}

// ============================================
// RENDER PRINCIPAL
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    const sesion = obtenerSesion();
    const usuarios = obtenerUsuarios();
    const perfil = sesion ? usuarios.find((usuario) => usuario.id === sesion.id) : null;
    const datos = document.getElementById("contenido-usuario");

    if (!perfil) {
        datos.innerHTML = `
            <div class="container mt-4">
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    No se encontró la información del usuario. <a href="login.html" class="alert-link">Inicia sesión</a>.
                </div>
            </div>
        `;
        return;
    }

    const iniciales = (perfil.nombre.charAt(0) + (perfil.apellidos?.charAt(0) || "")).toUpperCase();

    datos.innerHTML = `
        <main class="container mt-4 mb-5">

            <!-- BIENVENIDA -->
            <div class="bienvenida d-flex align-items-center gap-4 flex-wrap">
                <div class="avatar-grande">${iniciales}</div>
                <div class="flex-grow-1">
                    <h1>¡Hola, ${perfil.nombre}! 👋</h1>
                    <p class="mb-0" style="opacity: 0.9;">
                        <i class="bi bi-envelope me-1"></i> ${perfil.correo}
                        &nbsp;·&nbsp;
                        <i class="bi bi-geo-alt me-1"></i> ${perfil.comuna}, ${perfil.region}
                    </p>
                </div>
            </div>

            <!-- TARJETAS RESUMEN -->
            <div class="row g-4 mb-4">
                <div class="col-md-3 col-sm-6">
                    <div class="card-dashboard text-center">
                        <div class="icono"><i class="bi bi-heart"></i></div>
                        <h5 id="stat-interes">0</h5>
                        <p>Servicios de interés</p>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="card-dashboard text-center">
                        <div class="icono"><i class="bi bi-calendar-check"></i></div>
                        <h5>0</h5>
                        <p>Citas agendadas</p>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="card-dashboard text-center">
                        <div class="icono"><i class="bi bi-paw"></i></div>
                        <h5>0</h5>
                        <p>Mascotas registradas</p>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="card-dashboard text-center">
                        <div class="icono"><i class="bi bi-award"></i></div>
                        <h5>Nuevo</h5>
                        <p>Nivel de cliente</p>
                    </div>
                </div>
            </div>

            <!-- NAVEGACIÓN POR PESTAÑAS -->
            <ul class="nav nav-perfil mb-4 flex-wrap">
                <li class="nav-item">
                    <a class="nav-link active" href="#" onclick="mostrarSeccion('perfil'); return false;">
                        <i class="bi bi-person-circle me-1"></i> Mi perfil
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="mostrarSeccion('interes'); return false;">
                        <i class="bi bi-bookmark-heart me-1"></i> Lista de interés
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="mostrarSeccion('novedades'); return false;">
                        <i class="bi bi-newspaper me-1"></i> Novedades
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="mostrarSeccion('actividad'); return false;">
                        <i class="bi bi-clock-history me-1"></i> Actividad
                    </a>
                </li>
            </ul>

            <!-- ===== SECCIÓN PERFIL ===== -->
            <section id="seccion-perfil" class="seccion-perfil active">
                <div class="card-dashboard" style="border-left-color: #198754;">
                    <h4 class="mb-4" style="color: #0d4d2a;">
                        <i class="bi bi-pencil-square me-2"></i>Editar mis datos
                    </h4>
                    <form id="formulario-perfil" class="mx-auto" style="max-width: 600px;">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="nombre" value="${perfil.nombre}" maxlength="50" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" class="form-control" id="apellidos" value="${perfil.apellidos || ''}" maxlength="100" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="correo" class="form-label">Correo</label>
                                <input type="email" class="form-control" id="correo" value="${perfil.correo}" maxlength="100" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="run" class="form-label">RUN</label>
                                <input type="text" class="form-control" id="run" value="${perfil.run}" pattern="[0-9]{7,8}[0-9kK]" maxlength="9" title="Ingrese el RUN sin puntos ni guion" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="fechaNacimiento" class="form-label">Fecha de nacimiento</label>
                                <input type="date" class="form-control" id="fechaNacimiento" value="${perfil.fechaNacimiento || ''}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="direccion" class="form-label">Dirección</label>
                                <input type="text" class="form-control" id="direccion" value="${perfil.direccion}" maxlength="300" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="region" class="form-label">Región</label>
                                <select class="form-select" id="region" required>
                                    <option value="" disabled>Seleccione una región</option>
                                    ${regiones.map((region) => `<option value="${region.nombre}" ${region.nombre === perfil.region ? "selected" : ""}>${region.nombre}</option>`).join("")}
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="comuna" class="form-label">Comuna</label>
                                <select class="form-select" id="comuna" required></select>
                            </div>
                        </div>
                        <div class="d-flex gap-2 flex-wrap">
                            <button type="submit" class="btn btn-success flex-grow-1">
                                <i class="bi bi-save me-1"></i> Guardar cambios
                            </button>
                            <button type="button" id="cerrar-sesion" class="btn btn-outline-danger">
                                <i class="bi bi-box-arrow-right me-1"></i> Cerrar sesión
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <!-- ===== SECCIÓN LISTA DE INTERÉS ===== -->
            <section id="seccion-interes" class="seccion-perfil">
                <div class="card-dashboard">
                    <h4 class="mb-4" style="color: #0d4d2a;">
                        <i class="bi bi-bookmark-heart me-2"></i>Servicios que te interesan
                    </h4>
                    <div id="lista-interes-contenido"></div>
                    <div class="text-center mt-3">
                        <a href="catalogo.html" class="btn btn-success">
                            <i class="bi bi-plus-circle me-1"></i> Explorar más servicios
                        </a>
                    </div>
                </div>
            </section>

            <!-- ===== SECCIÓN NOVEDADES ===== -->
            <section id="seccion-novedades" class="seccion-perfil">
                <div class="card-dashboard">
                    <h4 class="mb-4" style="color: #0d4d2a;">
                        <i class="bi bi-newspaper me-2"></i>Últimas novedades
                    </h4>
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="card-novedad">
                                <img src="contenido/perro.jpg" alt="Consejos perros">
                                <div class="card-body">
                                    <h6>5 Consejos para cuidar a tu perro en verano</h6>
                                    <p>El verano trae altas temperaturas que pueden afectar a tu mascota.</p>
                                    <a href="contenido.html" class="btn btn-sm btn-outline-success">Leer más →</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card-novedad">
                                <img src="contenido/gato.jpg" alt="Alimentación gatos">
                                <div class="card-body">
                                    <h6>Alimentación saludable para gatos adultos</h6>
                                    <p>Una buena alimentación es clave para la salud de tu felino.</p>
                                    <a href="contenido.html" class="btn btn-sm btn-outline-success">Leer más →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ===== SECCIÓN ACTIVIDAD ===== -->
            <section id="seccion-actividad" class="seccion-perfil">
                <div class="card-dashboard">
                    <h4 class="mb-4" style="color: #0d4d2a;">
                        <i class="bi bi-clock-history me-2"></i>Mi actividad reciente
                    </h4>
                    <div id="actividad-contenido"></div>
                </div>
            </section>

        </main>
    `;

    // Inicializar todo
    cargarComunas(perfil.region, perfil.comuna);
    document.getElementById("region").addEventListener("change", (event) => cargarComunas(event.target.value));
    document.getElementById("formulario-perfil").addEventListener("submit", guardarCambios);
    document.getElementById("cerrar-sesion").addEventListener("click", cerrarSesion);

    renderizarListaInteres();
    renderizarActividad(perfil);
    actualizarStats();
});

// ============================================
// NAVEGACIÓN POR SECCIONES
// ============================================
function mostrarSeccion(seccion) {
    document.querySelectorAll('.seccion-perfil').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-perfil .nav-link').forEach(el => el.classList.remove('active'));

    document.getElementById(`seccion-${seccion}`).classList.add('active');

    document.querySelectorAll('.nav-perfil .nav-link').forEach(el => {
        if (el.getAttribute('onclick')?.includes(`'${seccion}'`)) {
            el.classList.add('active');
        }
    });
}

// ============================================
// LISTA DE INTERÉS
// ============================================
function renderizarListaInteres() {
    const seleccionados = obtenerSeleccionados();
    const contenedor = document.getElementById('lista-interes-contenido');

    if (seleccionados.length === 0) {
        contenedor.innerHTML = `
            <div class="lista-vacia">
                <i class="bi bi-bookmark" style="font-size: 3rem;"></i>
                <p class="mt-2 mb-1"><strong>No tienes servicios guardados</strong></p>
                <small>Explora el catálogo y agrega los servicios que te interesen.</small>
            </div>
        `;
        return;
    }

    let html = '';
    let total = 0;

    seleccionados.forEach(servicio => {
        total += servicio.precio || 0;
        html += `
            <div class="item-interes">
                <div class="info">
                    <img src="${servicio.imagen}" alt="${servicio.nombre}">
                    <div>
                        <strong>${servicio.nombre}</strong>
                        <small class="text-muted d-block">${servicio.categoria || ''} · ${servicio.duracion || ''}</small>
                        <span class="precio">$${servicio.precio.toLocaleString()}</span>
                    </div>
                </div>
                <button class="btn-quitar" title="Quitar de la lista" onclick="quitarDeLista(${servicio.id})">
                    <i class="bi bi-x-circle-fill"></i>
                </button>
            </div>
        `;
    });

    html += `
        <div class="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
            <strong>Total estimado:</strong>
            <span class="precio" style="font-size: 1.3rem;">$${total.toLocaleString()}</span>
        </div>
    `;

    contenedor.innerHTML = html;
}

function quitarDeLista(id) {
    let seleccionados = obtenerSeleccionados();
    seleccionados = seleccionados.filter(s => s.id !== id);
    localStorage.setItem(CLAVE_SELECCIONADOS, JSON.stringify(seleccionados));
    renderizarListaInteres();
    actualizarStats();
}

// ============================================
// ACTIVIDAD
// ============================================
function renderizarActividad(perfil) {
    const seleccionados = obtenerSeleccionados();
    const contenedor = document.getElementById('actividad-contenido');

    let html = '';

    // Actividad: cuenta creada
    html += `
        <div class="actividad-item">
            <div class="icono-actividad"><i class="bi bi-person-plus"></i></div>
            <div class="texto-actividad">
                <strong>Cuenta creada</strong>
                <div class="fecha">Bienvenido a Veterinaria San Marcos</div>
            </div>
        </div>
    `;

    // Actividad: últimos servicios guardados
    if (seleccionados.length > 0) {
        seleccionados.slice(-3).forEach(s => {
            html += `
                <div class="actividad-item">
                    <div class="icono-actividad"><i class="bi bi-bookmark-heart"></i></div>
                    <div class="texto-actividad">
                        <strong>Agregaste "${s.nombre}" a tu lista de interés</strong>
                        <div class="fecha">Servicio del catálogo</div>
                    </div>
                </div>
            `;
        });
    }

    // Actividad: última actualización de perfil
    html += `
        <div class="actividad-item">
            <div class="icono-actividad"><i class="bi bi-pencil"></i></div>
            <div class="texto-actividad">
                <strong>Perfil actualizado</strong>
                <div class="fecha">${perfil.comuna}, ${perfil.region}</div>
            </div>
        </div>
    `;

    contenedor.innerHTML = html;
}

// ============================================
// STATS
// ============================================
function actualizarStats() {
    const seleccionados = obtenerSeleccionados();
    const statInteres = document.getElementById('stat-interes');
    if (statInteres) statInteres.textContent = seleccionados.length;
}

// ============================================
// COMUNAS
// ============================================
function cargarComunas(region, comunaSeleccionada = "") {
    const selectorComuna = document.getElementById("comuna");
    const regionSeleccionada = regiones.find((item) => item.nombre === region);
    selectorComuna.innerHTML = `
        <option value="" disabled ${comunaSeleccionada ? "" : "selected"}>Seleccione una comuna</option>
        ${(regionSeleccionada ? regionSeleccionada.comunas : []).map((comuna) => `<option value="${comuna}" ${comuna === comunaSeleccionada ? "selected" : ""}>${comuna}</option>`).join("")}
    `;
}

// ============================================
// VALIDAR RUN
// ============================================
function runEsValido(run) {
    if (!/^\d{7,8}[0-9kK]$/.test(run)) return false;
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

// ============================================
// GUARDAR CAMBIOS
// ============================================
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

    const sesion = obtenerSesion();
    const usuarios = obtenerUsuarios();
    const perfil = usuarios.find((usuario) => usuario.id === sesion.id);

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

    // Actualizar avatar/nombre en pantalla sin recargar
    const iniciales = (nombre.charAt(0) + (apellidos?.charAt(0) || "")).toUpperCase();
    document.querySelector('.avatar-grande').textContent = iniciales;
    document.querySelector('.bienvenida h1').textContent = `¡Hola, ${nombre}! 👋`;
    document.querySelector('.bienvenida p').innerHTML = `
        <i class="bi bi-envelope me-1"></i> ${correo}
        &nbsp;·&nbsp;
        <i class="bi bi-geo-alt me-1"></i> ${perfil.comuna}, ${perfil.region}
    `;

    alert("✅ Los datos se actualizaron correctamente");
}

// ============================================
// CERRAR SESIÓN
// ============================================
function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        localStorage.removeItem("usuarioSesion");
        window.location.href = "login.html";
    }
}