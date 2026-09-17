// Arreglo de productos de la veterinaria
let productos = [
    {
        id: 1,
        nombre: "Alimento Perro Adulto",
        precio: 25990,
        descripcion: "Alimento balanceado para perros adultos de todas las razas.",
        imagen: "carrusel/premium.jfif"
    },
    {
        id: 2,
        nombre: "Comida Húmeda Gato",
        precio: 1890,
        descripcion: "Sabor salmón y atún para felinos.",
        imagen: "carrusel/gatos.jfif"
    },
    {
        id: 3,
        nombre: "Juguete Hueso",
        precio: 5490,
        descripcion: "Goma resistente para entretener a tu mascota.",
        imagen: "carrusel/hueso.jfif"
    }
];

// Buscamos el div del HTML
let lista = document.getElementById("contenedor-productos");

// Recorremos el arreglo de productos
for (let i = 0; i < productos.length; i++) {
    lista.innerHTML += `
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${productos[i].imagen}" width="80">
            <h3>${productos[i].nombre}</h3>
            <p>Precio: $${productos[i].precio}</p>
            <button onClick="verDetalle(${productos[i].id})" class="btn btn-success">
                Ver detalle
            </button>
            <hr>
        </div>
    `;
}

// Función que recibe el id del producto seleccionado
function verDetalle(id) {
    let productoSeleccionado;

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            productoSeleccionado = productos[i];
        }
    }

    if (!productoSeleccionado) return;

    // Guardamos el producto seleccionado en LocalStorage
    localStorage.setItem("producto", JSON.stringify(productoSeleccionado));

    // Mostrar el detalle en un modal/alerta en lugar de redirigir a la misma página
    alert(`📦 ${productoSeleccionado.nombre}\n\n${productoSeleccionado.descripcion}\n\nPrecio: $${productoSeleccionado.precio.toLocaleString()}`);
}