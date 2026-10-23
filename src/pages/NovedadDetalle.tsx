import { useParams, Link } from "react-router-dom";
import { useNovedades } from "../context/NovedadesContexto";

function NovedadDetalle() {
  const { id } = useParams();
  const { novedades } = useNovedades();
  const novedad = novedades.find((n) => n.id === Number(id));

  if (!novedad) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">Novedad no encontrada</h2>
        <Link to="/novedades" className="btn btn-primary mt-3">Volver a Novedades</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="card shadow">
            <img src={novedad.imagen} alt={novedad.titulo} className="card-img-top" style={{ height: '350px', objectFit: 'cover' }} />
            <div className="card-body p-4">
              <h1 className="fw-bold text-success">{novedad.titulo}</h1>
              <p className="fs-5 text-muted mt-3">{novedad.resumen}</p>
              <hr />
              <p className="fs-6">{novedad.detalle}</p>
              <Link to="/novedades" className="btn btn-outline-secondary mt-4">← Volver al listado</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NovedadDetalle;