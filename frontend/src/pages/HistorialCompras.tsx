import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContexto';

function HistorialCompras() {
  const { historial } = useCarrito();
  const formatoPrecio = (precio: number) => `$${precio.toLocaleString('es-CL')}`;

  return (
    <main className="container py-5">
      <header className="mb-4">
        <p className="eyebrow">Mi cuenta</p>
        <h1>Historial de compras</h1>
      </header>

      {historial.length === 0 ? (
        <section className="text-center py-5">
          <h2 className="h4">Aún no tienes compras</h2>
          <p className="text-muted">Cuando realices una compra, aparecerá aquí.</p>
          <Link className="btn btn-success" to="/productos">Explorar productos</Link>
        </section>
      ) : (
        <div className="d-flex flex-column gap-3">
          {historial.map((compra) => (
            <article className="card shadow-sm" key={compra.id}>
              <div className="card-header d-flex flex-wrap justify-content-between gap-2">
                <span>
                  Compra del{' '}
                  {new Intl.DateTimeFormat('es-CL', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(compra.fecha))}
                </span>
                <span className="fw-semibold">Total: {formatoPrecio(compra.total)}</span>
              </div>
              <ul className="list-group list-group-flush">
                {compra.productos.map((item) => (
                  <li className="list-group-item d-flex justify-content-between" key={item.id}>
                    <span>{item.nombre} × {item.cantidad}</span>
                    <span>{formatoPrecio(item.precio * item.cantidad)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default HistorialCompras;
