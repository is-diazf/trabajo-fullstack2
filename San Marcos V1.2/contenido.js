function mostrarDetalle(id) {
    // Ocultar todas las publicaciones
    document.getElementById('seccion-publicaciones').style.display = 'none';

    // Ocultar todos los detalles
    document.querySelectorAll('.detalle-publicacion').forEach(el => {
        el.classList.remove('active');
    });

    // Mostrar el detalle correspondiente
    const detalle = document.getElementById(`detalle-${id}`);
    if (detalle) {
        detalle.classList.add('active');
        // Scroll suave hacia el detalle
        detalle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function cerrarDetalle() {
    // Ocultar todos los detalles
    document.querySelectorAll('.detalle-publicacion').forEach(el => {
        el.classList.remove('active');
    });

    // Mostrar nuevamente las publicaciones
    document.getElementById('seccion-publicaciones').style.display = 'block';

    // Scroll hacia las publicaciones
    document.getElementById('seccion-publicaciones').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
