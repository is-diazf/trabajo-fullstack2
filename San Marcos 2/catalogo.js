// ============================================
// 1. ARRAY DE SERVICIOS (CATÁLOGO)
// ============================================

const servicios = [
    {
        id: 1,
        nombre: "Consulta General",
        categoria: "Atención médica",
        precio: 25000,
        descripcion: "Revisión completa de salud para tu mascota. Incluye examen físico y diagnóstico.",
        descripcionAmpliada: "Nuestra consulta general es el servicio más completo para mantener a tu mascota saludable. El veterinario realiza un examen físico detallado, revisa signos vitales, evalúa el peso, temperatura, frecuencia cardíaca y respiratoria. Se incluye diagnóstico preliminar y un plan de tratamiento personalizado. Ideal para chequeos rutinarios o cuando notes algún cambio en el comportamiento de tu mascota.",
        imagen: "https://via.placeholder.com/400x200/198754/ffffff?text=🐕+Consulta",
        duracion: "45 min",
        incluye: "Examen físico, diagnóstico, plan de tratamiento"
    },
    {
        id: 2,
        nombre: "Vacunación",
        categoria: "Prevención",
        precio: 18000,
        descripcion: "Protege a tu mascota con nuestro plan de vacunación completo y seguro.",
        descripcionAmpliada: "Ofrecemos un programa completo de vacunación para perros y gatos. Incluye vacunas obligatorias como la antirrábica, parvovirus, distemper, hepatitis y leptospirosis para perros; y rinotraqueitis, calicivirus y panleucopenia para gatos. Nuestro equipo te asesorará sobre el calendario de vacunación adecuado según la edad y estilo de vida de tu mascota.",
        imagen: "https://via.placeholder.com/400x200/0d6efd/ffffff?text=💉+Vacunación",
        duracion: "20 min",
        incluye: "Vacunas, cartilla de vacunación, asesoría personalizada"
    },
    {
        id: 3,
        nombre: "Cirugía Menor",
        categoria: "Procedimientos",
        precio: 85000,
        descripcion: "Procedimientos quirúrgicos de baja complejidad con los más altos estándares.",
        descripcionAmpliada: "Realizamos cirugías menores como esterilizaciones, castraciones, extracción de dientes, remoción de tumores benignos y suturas. Contamos con quirófano equipado, monitoreo constante durante el procedimiento y cuidados postoperatorios. La seguridad y bienestar de tu mascota es nuestra prioridad en todo momento.",
        imagen: "https://via.placeholder.com/400x200/dc3545/ffffff?text=⚕️+Cirugía",
        duracion: "60-90 min",
        incluye: "Procedimiento, anestesia, medicamentos postoperatorios"
    },
    {
        id: 4,
        nombre: "Desparasitación",
        categoria: "Prevención",
        precio: 12000,
        descripcion: "Elimina parásitos internos y externos de manera efectiva y segura.",
        descripcionAmpliada: "Ofrecemos tratamientos de desparasitación interna y externa para todo tipo de mascotas. Utilizamos productos de última generación que eliminan eficazmente lombrices, garrapatas, pulgas y ácaros. El tratamiento se adapta según el peso, edad y tipo de mascota. Incluye asesoría sobre prevención futura y cuidados posteriores.",
        imagen: "https://via.placeholder.com/400x200/ffc107/000000?text=🧪+Desparasitación",
        duracion: "15 min",
        incluye: "Medicación desparasitante, asesoría preventiva"
    },
    {
        id: 5,
        nombre: "Control de Peso",
        categoria: "Nutrición",
        precio: 15000,
        descripcion: "Plan nutricional personalizado para mantener el peso ideal de tu mascota.",
        descripcionAmpliada: "Nuestro programa de control de peso incluye evaluación del estado corporal, medición de peso y composición, y diseño de un plan alimenticio personalizado. Te acompañamos en el proceso con seguimiento periódico y ajustes según los avances. Ideal para mascotas con sobrepeso, obesidad o que necesitan mantener un peso saludable.",
        imagen: "https://via.placeholder.com/400x200/20c997/ffffff?text=⚖️+Control+Peso",
        duracion: "30 min",
        incluye: "Evaluación, plan nutricional, seguimiento"
    },
    {
        id: 6,
        nombre: "Emergencia 24/7",
        categoria: "Urgencias",
        precio: 45000,
        descripcion: "Atención de urgencia disponible las 24 horas, los 7 días de la semana.",
        descripcionAmpliada: "Contamos con servicio de emergencia las 24 horas. Atendemos casos graves como intoxicaciones, accidentes, dificultades respiratorias, convulsiones, hemorragias y cualquier situación que ponga en riesgo la vida de tu mascota. Nuestro equipo está preparado para actuar rápidamente y brindar la atención necesaria en momentos críticos.",
        imagen: "https://via.placeholder.com/400x200/dc3545/ffffff?text=🚨+Emergencia",
        duracion: "Variable",
        incluye: "Atención inmediata, monitoreo, tratamiento de urgencia"
    },
    {
        id: 7,
        nombre: "Odontología Veterinaria",
        categoria: "Atención médica",
        precio: 35000,
        descripcion: "Cuidado dental completo para la salud bucal de tu mascota.",
        descripcionAmpliada: "Ofrecemos servicios de odontología veterinaria que incluyen limpieza dental, extracciones, tratamiento de enfermedades periodontales y cuidado preventivo. La salud dental es fundamental para el bienestar general de tu mascota, ya que problemas bucales pueden afectar otros órganos. Realizamos procedimientos bajo anestesia segura y con monitoreo constante.",
        imagen: "https://via.placeholder.com/400x200/0d6efd/ffffff?text=🦷+Odontología",
        duracion: "45-60 min",
        incluye: "Limpieza dental, extracciones, tratamiento periodontal"
    },
    {
        id: 8,
        nombre: "Exámenes de Laboratorio",
        categoria: "Atención médica",
        precio: 28000,
        descripcion: "Diagnóstico preciso con nuestros exámenes de laboratorio completos.",
        descripcionAmpliada: "Contamos con laboratorio propio para realizar exámenes de sangre, orina, heces y análisis bioquímicos. Nuestros equipos modernos permiten obtener resultados rápidos y precisos para un diagnóstico certero. Ofrecemos perfiles completos, hemogramas, bioquímicas sanguíneas, pruebas hormonales y detección de enfermedades infecciosas.",
        imagen: "https://via.placeholder.com/400x200/6f42c1/ffffff?text=🔬+Laboratorio",
        duracion: "24-48 hrs",
        incluye: "Análisis clínicos, resultados, interpretación"
    }
];

// ============================================
// 2. VARIABLES GLOBALES
// ============================================

let detalleVisible = false;
let categoriaActual = 'todos';

// ============================================
// 3. FUNCIONES DEL CATÁLOGO
// ============================================

function renderizarCatalogo(categoria = 'todos') {
    const contenedor = document.getElementById('contenedor-servicios');
    contenedor.innerHTML = '';

    // Filtrar servicios por categoría
    let serviciosFiltrados = servicios;
    if (categoria !== 'todos') {
        serviciosFiltrados = servicios.filter(s => s.categoria === categoria);
    }

    if (serviciosFiltrados.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <span style="font-size: 3rem;">🔍</span>
                <h4 class="mt-3">No hay servicios en esta categoría</h4>
                <p class="text-muted">Prueba con otra categoría o revisa todas las opciones</p>
            </div>
        `;
        return;
    }

    serviciosFiltrados.forEach(servicio => {
        const seleccionados = obtenerSeleccionados();
        const estaSeleccionado = seleccionados.some(s => s.id === servicio.id);

        const card = document.createElement('div');
        card.className = 'col-md-6 col-xl-4';
        card.innerHTML = `
            <div class="card-servicio">
                <img src="${servicio.imagen}" class="imagen-servicio" alt="${servicio.nombre}" />
                <div class="card-body">
                    <span class="categoria-badge">${servicio.categoria}</span>
                    <h5 class="card-title fw-bold mt-2">${servicio.nombre}</h5>
                    <p class="card-text text-muted small">${servicio.descripcion}</p>
                    <p class="precio-servicio">$${servicio.precio.toLocaleString()}</p>
                    <p class="text-muted small mb-2">⏱️ ${servicio.duracion}</p>
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn-detalle" onclick="verDetalle(${servicio.id})">
                            Ver detalle
                        </button>
                        <button class="btn-seleccionar ${estaSeleccionado ? 'seleccionado' : ''}" 
                                onclick="toggleSeleccion(${servicio.id})">
                            ${estaSeleccionado ? '✓ Quitar' : '+ Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// ============================================
// 4. FILTRO POR CATEGORÍA
// ============================================

function filtrarPorCategoria(categoria) {
    categoriaActual = categoria;
    
    // Actualizar botones activos
    document.querySelectorAll('.filtro-categoria').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.categoria === categoria) {
            btn.classList.add('active');
        }
    });

    renderizarCatalogo(categoria);
}

// ============================================
// 5. VISTA DE DETALLE
// ============================================

function verDetalle(id) {
    const servicio = servicios.find(s => s.id === id);
    if (!servicio) return;

    const detalleContainer = document.getElementById('detalle-servicio');
    const estaSeleccionado = obtenerSeleccionados().some(s => s.id === servicio.id);

    detalleContainer.innerHTML = `
        <button class="btn-volver mb-3" onclick="cerrarDetalle()">← Volver al catálogo</button>
        <div class="row">
            <div class="col-md-6">
                <img src="${servicio.imagen}" class="detalle-imagen" alt="${servicio.nombre}" />
            </div>
            <div class="col-md-6">
                <span class="categoria-badge">${servicio.categoria}</span>
                <h2 class="fw-bold mt-2" style="color: #0d4d2a;">${servicio.nombre}</h2>
                <p class="precio-servicio">$${servicio.precio.toLocaleString()}</p>
                <p><strong>⏱️ Duración:</strong> ${servicio.duracion}</p>
                <p><strong>📋 Incluye:</strong> ${servicio.incluye}</p>
                <hr />
                <p style="font-size: 1.05rem; line-height: 1.8;">${servicio.descripcionAmpliada}</p>
                <div class="mt-4">
                    <button class="btn-detalle" onclick="toggleSeleccion(${servicio.id})" style="font-size: 1rem; padding: 10px 30px;">
                        ${estaSeleccionado ? '✓ Quitar de lista' : '+ Agregar a lista'}
                    </button>
                </div>
            </div>
        </div>
    `;

    detalleContainer.classList.add('active');
    detalleVisible = true;
    detalleContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cerrarDetalle() {
    const detalleContainer = document.getElementById('detalle-servicio');
    detalleContainer.classList.remove('active');
    detalleVisible = false;
    document.getElementById('contenedor-servicios').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// 6. SISTEMA DE SELECCIÓN (LOCALSTORAGE)
// ============================================

function obtenerSeleccionados() {
    const data = localStorage.getItem('serviciosSeleccionados');
    return data ? JSON.parse(data) : [];
}

function guardarSeleccionados(lista) {
    localStorage.setItem('serviciosSeleccionados', JSON.stringify(lista));
    actualizarListaYContador();
}

function toggleSeleccion(id) {
    let seleccionados = obtenerSeleccionados();
    const index = seleccionados.findIndex(s => s.id === id);

    if (index !== -1) {
        seleccionados.splice(index, 1);
    } else {
        const servicio = servicios.find(s => s.id === id);
        if (servicio) {
            seleccionados.push({
                id: servicio.id,
                nombre: servicio.nombre,
                precio: servicio.precio,
                imagen: servicio.imagen,
                categoria: servicio.categoria,
                duracion: servicio.duracion
            });
        }
    }

    guardarSeleccionados(seleccionados);

    // Actualizar detalle si está visible
    if (detalleVisible) {
        const detalleContainer = document.getElementById('detalle-servicio');
        if (detalleContainer.classList.contains('active')) {
            const btnVolver = detalleContainer.querySelector('.btn-volver');
            if (btnVolver) {
                const onclick = btnVolver.getAttribute('onclick');
                const idMatch = onclick ? onclick.match(/\d+/) : null;
                if (idMatch) {
                    verDetalle(parseInt(idMatch[0]));
                }
            }
        }
    }

    renderizarCatalogo(categoriaActual);
}

// ============================================
// 7. ACTUALIZAR LISTA Y CONTADOR
// ============================================

function actualizarListaYContador() {
    const seleccionados = obtenerSeleccionados();
    const contenedor = document.getElementById('lista-seleccion-contenido');
    const contador = document.getElementById('contador-lista');
    const resumen = document.getElementById('resumen-lista');
    const textoResumen = document.getElementById('texto-resumen');

    contador.textContent = seleccionados.length;

    if (seleccionados.length === 0) {
        contenedor.innerHTML = `
            <div class="lista-vacia">
                <span style="font-size: 2rem;">📭</span>
                <p class="mt-2">No hay servicios seleccionados</p>
                <small class="text-muted">Explora el catálogo y agrega los que te interesen</small>
            </div>
        `;
        resumen.style.display = 'none';
        return;
    }

    let html = '';
    let total = 0;

    seleccionados.forEach((servicio) => {
        total += servicio.precio || 0;
        html += `
            <div class="item-seleccionado">
                <div class="info-item">
                    <img src="${servicio.imagen}" alt="${servicio.nombre}" />
                    <div>
                        <strong>${servicio.nombre}</strong>
                        <span class="text-muted small d-block">$${servicio.precio.toLocaleString()}</span>
                    </div>
                </div>
                <button class="btn-eliminar" onclick="toggleSeleccion(${servicio.id})">✕</button>
            </div>
        `;
    });

    contenedor.innerHTML = html;
    resumen.style.display = 'block';
    textoResumen.innerHTML = `
        <div class="d-flex justify-content-between">
            <span><strong>${seleccionados.length}</strong> servicios seleccionados</span>
            <span class="fw-bold" style="color: #198754;">Total: $${total.toLocaleString()}</span>
        </div>
        <div class="mt-2">
            <span class="badge bg-success">${seleccionados.length} items</span>
        </div>
    `;
}

// ============================================
// 8. INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    renderizarCatalogo('todos');
    actualizarListaYContador();

    const seleccionados = obtenerSeleccionados();
    if (seleccionados.length > 0) {
        document.getElementById('resumen-lista').style.display = 'block';
    }
});