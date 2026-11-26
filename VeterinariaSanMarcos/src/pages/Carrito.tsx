import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContexto';

function Carrito() {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);
  const {
    productos,
    carrito,
    totalCarrito,
    totalUnidades,
    cambiarCantidad,
    eliminarDelCarrito,
    finalizarCompra,
  } = useCarrito();
  const formatoPrecio = (precio: number) => `$${precio.toLocaleString('es-CL')}`;
  const stockDe = (productoId: number) => productos.find((producto) => producto.id === productoId)?.stock;

  const comprar = async () => {
    setMensaje('');
    setError('');
    setProcesando(true);
    const resultado = await finalizarCompra();
    setProcesando(false);
    if (resultado.correcto) {
      setMensaje('Compra registrada en tu historial. Este demo no procesa pagos.');
    } else {
      setError(resultado.mensaje);
    }
  };

  return (
    <main className="container py-5">
      <header className="mb-4">
        <p className="eyebrow">Tu pedido</p>
        <h1>Mi carrito</h1>
      </header>

      {mensaje && <p className="alert alert-success" role="status">{mensaje}</p>}
      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      {carrito.length === 0 ? (
        <section className="text-center py-5">
          <h2 className="h4">Tu carrito está vacío</h2>
          <p className="text-muted">Explora la tienda y agrega productos para continuar.</p>
          <Link className="btn btn-success" to="/productos">Ir a productos</Link>
        </section>
      ) : (
        <>
          <div className="row g-4">
            <section className="col-12 col-lg-8" aria-label="Productos en el carrito">
              <ul className="list-group">
                {carrito.map((item) => (
                  <li className="list-group-item p-3" key={item.id}>
                    <div className="row align-items-center g-3">
                      <div className="col-3 col-md-2">
                        <img
                          className="img-fluid rounded"
                          src={item.imagen}
                          alt=""
                          style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="col-9 col-md-4">
                        <h2 className="h6 mb-1">{item.nombre}</h2>
                        <p className="small text-muted mb-0">{formatoPrecio(item.precio)} c/u</p>
                      </div>
                      <div className="col-7 col-md-3">
                        <label className="visually-hidden" htmlFor={`cantidad-${item.id}`}>
                          Cantidad de {item.nombre}
                        </label>
                        <input
                          id={`cantidad-${item.id}`}
                          className="form-control"
                          type="number"
                          min="1"
                          max={stockDe(item.id)}
                          step="1"
                          value={item.cantidad}
                          onChange={(event) => cambiarCantidad(item.id, Number(event.target.value))}
                        />
                      </div>
                      <div className="col-5 col-md-3 text-end">
                        <p className="fw-bold mb-1">{formatoPrecio(item.precio * item.cantidad)}</p>
                        <button
                          type="button"
                          className="btn btn-link btn-sm text-danger p-0"
                          onClick={() => eliminarDelCarrito(item.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="col-12 col-lg-4">
              <section className="card p-4 shadow-sm">
                <h2 className="h5">Resumen del pedido</h2>
                <div className="d-flex justify-content-between">
                  <span>Productos ({totalUnidades})</span>
                  <span>{formatoPrecio(totalCarrito)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Total</span>
                  <span>{formatoPrecio(totalCarrito)}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={() => void comprar()}
                  disabled={procesando}
                  aria-label="Finalizar compra"
                >
                  {procesando ? 'Procesando...' : 'Finalizar compra'}
                </button>
                <p className="small text-muted mt-3 mb-0">
                  Compra de demostración: no se procesa ningún pago.
                </p>
              </section>
            </aside>
          </div>
          <p className="mt-4"><Link to="/productos">Seguir comprando</Link></p>
        </>
      )}
    </main>
  );
}

export default Carrito;
