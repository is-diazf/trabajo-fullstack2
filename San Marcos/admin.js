
let servicioEditando = null;
let usuarioEditando = null;
let elementoAEliminar = null;
let tipoElementoAEliminar = null;

// Inicializar modales
const modalServicio = new bootstrap.Modal(document.getElementById('modalServicio'));
const modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'));
const modalConfirmar = new bootstrap.Modal(document.getElementById('modalConfirmar'));


function mostrarSeccion(seccion) {

    document.querySelectorAll('.admin-content').forEach(el => {
        el.classList.remove('active');
    });

    const target = document.getElementById(`seccion-${seccion}`);
    if (target) {
        target.classList.add('active');
    }

    document.querySelectorAll('.admin-sidebar .nav-link').forEach(el => {
        el.classList.remove('active');
    });
    
    document.querySelectorAll('.admin-sidebar .nav-link').forEach(el => {
        if (el.textContent.trim().toLowerCase().includes(seccion) || 
            (seccion === 'dashboard' && el.textContent.includes('Dashboard'))) {
            el.classList.add('active');
        }
    });

    if (seccion === 'servicios') {
        cargarServicios();
    } else if (seccion === 'usuarios') {
        cargarUsuarios();
    } else if (seccion === 'dashboard') {
        actualizarDashboard();
    }
}


function actualizarDashboard() {
    const servicios = obtenerServiciosAdmin();
    const usuarios = obtenerUsuariosAdmin();
    
    document.getElementById('total-servicios').textContent = servicios.length;
    document.getElementById('total-usuarios').textContent = usuarios.length;
    document.getElementById('total-administradores').textContent = 
        usuarios.filter(u => u.rol === 'admin').length;
}


function obtenerServiciosAdmin() {
    const data = localStorage.getItem('serviciosAdmin');
    return data ? JSON.parse(data) : [];
}

function guardarServiciosAdmin(lista) {
    localStorage.setItem('serviciosAdmin', JSON.stringify(lista));
}

function cargarServicios() {
    const servicios = obtenerServiciosAdmin();
    const tbody = document.getElementById('tabla-servicios');
    
    if (servicios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">No hay servicios registrados</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = servicios.map(servicio => `
        <tr>
            <td>${servicio.id}</td>
            <td>
                <img src="${servicio.imagen || 'https://via.placeholder.com/40'}" 
                     style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;" />
            </td>
            <td>${servicio.nombre}</td>
            <td><span class="badge bg-secondary">${servicio.categoria}</span></td>
            <td>$${servicio.precio?.toLocaleString() || 0}</td>
            <td>
                <button class="btn-accion ver" onclick="verServicio(${servicio.id})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn-accion editar" onclick="editarServicio(${servicio.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-accion eliminar" onclick="confirmarEliminar('servicio', ${servicio.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function abrirModalServicio(servicio = null) {
    servicioEditando = servicio;
    
    if (servicio) {
        document.getElementById('modalServicioTitle').innerHTML = 
            '<i class="bi bi-pencil me-2"></i>Editar Servicio';
        document.getElementById('servicioId').value = servicio.id;
        document.getElementById('s_nombre').value = servicio.nombre || '';
        document.getElementById('s_categoria').value = servicio.categoria || '';
        document.getElementById('s_precio').value = servicio.precio || '';
        document.getElementById('s_duracion').value = servicio.duracion || '';
        document.getElementById('s_descripcion').value = servicio.descripcion || '';
        document.getElementById('s_descripcionAmpliada').value = servicio.descripcionAmpliada || '';
        document.getElementById('s_imagen').value = servicio.imagen || '';
        document.getElementById('s_incluye').value = servicio.incluye || '';
    } else {
        document.getElementById('modalServicioTitle').innerHTML = 
            '<i class="bi bi-box-seam me-2"></i>Nuevo Servicio';
        document.getElementById('formServicio').reset();
        document.getElementById('servicioId').value = '';
    }
    
    document.querySelectorAll('#formServicio .text-danger').forEach(el => el.style.display = 'none');
    
    modalServicio.show();
}

function editarServicio(id) {
    const servicios = obtenerServiciosAdmin();
    const servicio = servicios.find(s => s.id === id);
    if (servicio) {
        abrirModalServicio(servicio);
    }
}

function verServicio(id) {
    const servicios = obtenerServiciosAdmin();
    const servicio = servicios.find(s => s.id === id);
    if (servicio) {
        // Mostrar en una alerta o redirigir al detalle
        alert(`📋 ${servicio.nombre}\n\nCategoría: ${servicio.categoria}\nPrecio: $${servicio.precio}\nDuración: ${servicio.duracion}\n\nDescripción: ${servicio.descripcion}\n\n${servicio.descripcionAmpliada || ''}`);
    }
}

function guardarServicio() {
    let valido = true;
    
    const nombre = document.getElementById('s_nombre').value.trim();
    const categoria = document.getElementById('s_categoria').value;
    const precio = document.getElementById('s_precio').value.trim();
    const descripcion = document.getElementById('s_descripcion').value.trim();
    
    if (!nombre) {
        document.getElementById('s_error_nombre').style.display = 'block';
        valido = false;
    } else {
        document.getElementById('s_error_nombre').style.display = 'none';
    }
    
    if (!categoria) {
        document.getElementById('s_error_categoria').style.display = 'block';
        valido = false;
    } else {
        document.getElementById('s_error_categoria').style.display = 'none';
    }
    
    if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
        document.getElementById('s_error_precio').style.display = 'block';
        valido = false;
    } else {
        document.getElementById('s_error_precio').style.display = 'none';
    }
    
    if (!descripcion || descripcion.length < 5) {
        document.getElementById('s_error_descripcion').style.display = 'block';
        valido = false;
    } else {
        document.getElementById('s_error_descripcion').style.display = 'none';
    }
    
    if (!valido) return;
    
    // Obtener datos
    const servicio = {
        id: parseInt(document.getElementById('servicioId').value) || Date.now(),
        nombre: nombre,
        categoria: categoria,
        precio: parseFloat(precio),
        duracion: document.getElementById('s_duracion').value.trim() || '30 min',
        descripcion: descripcion,
        descripcionAmpliada: document.getElementById('s_descripcionAmpliada').value.trim() || descripcion,
        imagen: document.getElementById('s_imagen').value.trim() || 'https://via.placeholder.com/400x200/198754/ffffff?text=🐾',
        incluye: document.getElementById('s_incluye').value.trim() || 'Información no disponible'
    };
    
    // Guardar
    let servicios = obtenerServiciosAdmin();
    const index = servicios.findIndex(s => s.id === servicio.id);
    
    if (index !== -1) {
        servicios[index] = servicio;
        mostrarAlerta('servicio', '✅ Servicio actualizado correctamente', 'success');
    } else {
        servicios.push(servicio);
        mostrarAlerta('servicio', '✅ Servicio creado correctamente', 'success');
    }
    
    guardarServiciosAdmin(servicios);
    modalServicio.hide();
    cargarServicios();
    actualizarDashboard();
}

function obtenerUsuariosAdmin() {
    const data = localStorage.getItem('usuariosAdmin');
    return data ? JSON.parse(data) : [];
}

function guardarUsuariosAdmin(lista) {
    localStorage.setItem('usuariosAdmin', JSON.stringify(lista));
}

function cargarUsuarios() {
    const usuarios = obtenerUsuariosAdmin();
    const tbody = document.getElementById('tabla-usuarios');
    
    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    <i class="bi bi-people" style="font-size: 2rem;"></i>
                    <p class="mt-2">No hay usuarios registrados</p>
                </td>
            </tr>
        `;
        return;
    }

    const rolLabels = {
        admin: '<span class="badge-role admin">Administrador</span>',
        veterinario: '<span class="badge-role veterinario">Veterinario</span>',
        usuario: '<span class="badge-role user">Usuario</span>'
    };

    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${rolLabels[usuario.rol] || usuario.rol}</td>
            <td>
                <button class="btn-accion editar" onclick="editarUsuario(${usuario.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-accion eliminar" onclick="confirmarEliminar('usuario', ${usuario.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function abrirModalUsuario(usuario = null) {
    usuarioEditando = usuario;
    
    if (usuario) {
        document.getElementById('modalUsuarioTitle').innerHTML = 
            '<i class="bi bi-pencil me-2"></i>Editar Usuario';
        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById('u_nombre').value = usuario.nombre || '';
        document.getElementById('u_email').value = usuario.email || '';
        document.getElementById('u_password').value = usuario.password || '';
        document.getElementById('u_rol').value = usuario.rol || '';
        document.getElementById('u_password').placeholder = 'Dejar en blanco para mantener';
        document.getElementById('u_password').required = false;
    } else {
        document.getElementById('modalUsuarioTitle').innerHTML = 
            '<i class="bi bi-person-plus me-2"></i>Nuevo Usuario';
        document.getElementById('formUsuario').reset();
        document.getElementById('usuarioId').value = '';
        document.getElementById('u_password').required = true;
        document.getElementById('u_password').placeholder = 'Mínimo 6 caracteres';
    }
    
    document.querySelectorAll('#formUsuario .text-danger').forEach(el => el.style.display = 'none');
    modalUsuario.show();
}

function editarUsuario(id) {
    const usuarios = obtenerUsuariosAdmin();
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        abrirModalUsuario(usuario);
    }
}

function guardarUsuario() {
    let valido = true;
    
    const nombre = document.getElementById('u_nombre').value.trim();
    const email = document.getElementById('u_email').value.trim();
    const password = document.getElementById('u_password').value.trim();
    const rol = document.getElementById('u_rol').value;
    const esEdicion = document.getElementById('usuarioId').value !== '';
    
    if (!nombre) {
        document.getElementById('u_error_nombre').style.display = 'block';
        valido = false;
    } else {
        document.getElementById('u_error_nombre').style.display = 'none';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById('u_error_email').style.display = 'block';
        valido = false;
    } else {
        document.getElementById('u_error_email').style.display = 'none';
    }
    
    if (!esEdicion && (!password || password.length < 6)) {
        document.getElementById('u_error_password').style.display = 'block';
        valido = false;
    } else if (esEdicion && password && password.length < 6) {
        document.getElementById('u_error_password').style.display = 'block';
        valido = false;
    } else {
        document.getElementById('u_error_password').style.display = 'none';
    }
    
    if (!rol) {
        document.getElementById('u_error_rol').style.display = 'block';
        valido = false;
    } else {
        document.getElementById('u_error_rol').style.display = 'none';
    }
    
    if (!valido) return;
    
    const usuario = {
        id: parseInt(document.getElementById('usuarioId').value) || Date.now(),
        nombre: nombre,
        email: email,
        password: password || '******',
        rol: rol
    };
    
    let usuarios = obtenerUsuariosAdmin();
    const index = usuarios.findIndex(u => u.id === usuario.id);
    
    if (index !== -1) {
        if (!password) {
            usuario.password = usuarios[index].password;
        }
        usuarios[index] = usuario;
        mostrarAlerta('usuario', '✅ Usuario actualizado correctamente', 'success');
    } else {
        usuarios.push(usuario);
        mostrarAlerta('usuario', '✅ Usuario creado correctamente', 'success');
    }
    
    guardarUsuariosAdmin(usuarios);
    modalUsuario.hide();
    cargarUsuarios();
    actualizarDashboard();
}

function confirmarEliminar(tipo, id) {
    tipoElementoAEliminar = tipo;
    elementoAEliminar = id;
    
    const mensaje = tipo === 'servicio' ? 'servicio' : 'usuario';
    document.getElementById('confirmar-mensaje').textContent = `ID: ${id}`;
    document.getElementById('confirmar-eliminar').onclick = eliminarElemento;
    modalConfirmar.show();
}

function eliminarElemento() {
    if (tipoElementoAEliminar === 'servicio') {
        let servicios = obtenerServiciosAdmin();
        servicios = servicios.filter(s => s.id !== elementoAEliminar);
        guardarServiciosAdmin(servicios);
        cargarServicios();
        mostrarAlerta('servicio', '🗑️ Servicio eliminado correctamente', 'danger');
    } else if (tipoElementoAEliminar === 'usuario') {
        let usuarios = obtenerUsuariosAdmin();
        usuarios = usuarios.filter(u => u.id !== elementoAEliminar);
        guardarUsuariosAdmin(usuarios);
        cargarUsuarios();
        mostrarAlerta('usuario', '🗑️ Usuario eliminado correctamente', 'danger');
    }
    
    modalConfirmar.hide();
    actualizarDashboard();
}

function mostrarAlerta(tipo, mensaje, clase) {
    const alertId = tipo === 'servicio' ? 'alert-servicio' : 'alert-usuario';
    const alerta = document.getElementById(alertId);
    alerta.textContent = mensaje;
    alerta.className = `alert alert-admin-${clase}`;
    alerta.style.display = 'block';
    
    setTimeout(() => {
        alerta.style.display = 'none';
    }, 4000);
}

function inicializarDatos() {
    // Servicios iniciales
    if (!localStorage.getItem('serviciosAdmin')) {
        const serviciosIniciales = [
            {
                id: 1,
                nombre: "Consulta General",
                categoria: "Atención médica",
                precio: 25000,
                descripcion: "Revisión completa de salud para tu mascota.",
                descripcionAmpliada: "Nuestra consulta general es el servicio más completo para mantener a tu mascota saludable.",
                imagen: "https://via.placeholder.com/400x200/198754/ffffff?text=🐕",
                duracion: "45 min",
                incluye: "Examen físico, diagnóstico, plan de tratamiento"
            },
            {
                id: 2,
                nombre: "Vacunación",
                categoria: "Prevención",
                precio: 18000,
                descripcion: "Protege a tu mascota con nuestro plan de vacunación.",
                descripcionAmpliada: "Ofrecemos un programa completo de vacunación para perros y gatos.",
                imagen: "https://via.placeholder.com/400x200/0d6efd/ffffff?text=💉",
                duracion: "20 min",
                incluye: "Vacunas, cartilla, asesoría"
            },
            {
                id: 3,
                nombre: "Cirugía Menor",
                categoria: "Procedimientos",
                precio: 85000,
                descripcion: "Procedimientos quirúrgicos de baja complejidad.",
                descripcionAmpliada: "Realizamos cirugías menores con los más altos estándares.",
                imagen: "https://via.placeholder.com/400x200/dc3545/ffffff?text=⚕️",
                duracion: "60-90 min",
                incluye: "Procedimiento, anestesia, medicamentos"
            }
        ];
        guardarServiciosAdmin(serviciosIniciales);
    }
    
    // Usuarios iniciales
    if (!localStorage.getItem('usuariosAdmin')) {
        const usuariosIniciales = [
            {
                id: 1,
                nombre: "Admin Principal",
                email: "admin@vet.com",
                password: "admin123",
                rol: "admin"
            },
            {
                id: 2,
                nombre: "Dr. Juan Pérez",
                email: "juan@vet.com",
                password: "vet123",
                rol: "veterinario"
            },
            {
                id: 3,
                nombre: "Cliente Demo",
                email: "cliente@email.com",
                password: "user123",
                rol: "usuario"
            }
        ];
        guardarUsuariosAdmin(usuariosIniciales);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    inicializarDatos();
    mostrarSeccion('dashboard');
});