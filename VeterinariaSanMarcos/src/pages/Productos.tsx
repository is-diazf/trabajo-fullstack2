import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContexto';
import { useSesion } from '../context/SesionContexto';

function Productos() {
  const {
    productos,
    cargandoProductos,
    errorProductos,
    recargarProductos,
    carrito,
    agregarAlCarrito,
    totalUnidades,
  } = useCarrito();
  const { usuario } = useSesion();
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');

  const productosFiltrados = productos.filter((producto) => {
    const termino = busqueda.trim().toLocaleLowerCase();
    return (
      producto.nombre.toLocaleLowerCase().includes(termino) ||
      producto.descripcion.toLocaleLowerCase().includes(termino) ||
      producto.categoria.toLocaleLowerCase().includes(termino)
    );
  });

  const formatoPrecio = (precio: number) => `$${precio.toLocaleString('es-CL')}`;

  return (
    <main className="container py-5">
      <header className="text-center mb-5">
        <p className="eyebrow">Tienda para mascotas</p>
        <h1 className="mb-3">Productos para cuidar y consentir</h1>
        <p className="text-muted mb-4">Encuentra artículos seleccionados para el bienestar de tu compañero.</p>
        {usuario && (
          <Link className="btn btn-outline-success" to="/carrito">
            Ver carrito ({totalUnidades})
          </Link>
        )}
      </header>

      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-8 col-lg-6">
          <label className="visually-hidden" htmlFor="buscar-productos">Buscar productos</label>
          <input
            id="buscar-productos"
            className="form-control form-control-lg shadow-sm"
            type="search"
            placeholder="Buscar por producto o categoría..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>
      </div>

      {mensaje && <p className="alert alert-success text-center" role="status">{mensaje}</p>}

      {errorProductos && (
        <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
          <span>{errorProductos}</span>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => void recargarProductos()}>
            Reintentar
          </button>
        </div>
      )}

      <div className="row g-4">
        {cargandoProductos && productos.length === 0 ? (
          <div className="col-12 text-center text-muted" role="status">
            <div className="spinner-border text-success mb-2" aria-hidden="true" />
            <p>Cargando productos...</p>
          </div>
        ) : productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => {
            const enCarrito = carrito.find((item) => item.id === producto.id)?.cantidad ?? 0;
            const agotado = producto.stock < 1;
            const sinMasStock = !agotado && enCarrito >= producto.stock;
            return (
            <div className="col-12 col-sm-6 col-lg-3" key={producto.id}>
              <article className="card h-100 shadow-sm border-0">
                <img
                  src={producto.imagen}
                  className="card-img-top"
                  alt={producto.nombre}
                  style={{ height: '210px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <span className="small text-success fw-semibold mb-2">{producto.categoria}</span>
                  <h2 className="h5 card-title">{producto.nombre}</h2>
                  <p className="card-text text-muted flex-grow-1">{producto.descripcion}</p>
                  <p className="fw-bold fs-5 mb-1">{formatoPrecio(producto.precio)}</p>
                  <p className={`small mb-3 ${agotado ? 'text-danger' : 'text-muted'}`}>
                    {agotado ? 'Agotado' : `${producto.stock} disponibles`}
                  </p>
                  {usuario ? (
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      disabled={agotado || sinMasStock}
                      onClick={() => {
                        agregarAlCarrito(producto);
                        setMensaje(`${producto.nombre} agregado al carrito.`);
                      }}
                    >
                      {agotado ? 'Sin stock' : sinMasStock ? 'Máximo en el carrito' : 'Agregar al carrito'}
                    </button>
                  ) : (
                    <Link className="btn btn-outline-success w-100" to="/login">
                      Inicia sesión para comprar
                    </Link>
                  )}
                </div>
              </article>
            </div>
            );
          })
        ) : errorProductos ? null : (
          <div className="col-12 text-center text-muted">
            <p>
              {busqueda.trim()
                ? `No se encontraron productos para “${busqueda}”.`
                : 'Aún no hay productos disponibles.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Productos;
