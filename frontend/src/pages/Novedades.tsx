import { Link } from "react-router-dom";
import { useNovedades } from "../context/NovedadesContexto";

function Novedades() {
  const { novedades } = useNovedades();

  return (
    <div className="container py-5">
      <h1 className="mb-4 fw-bold text-success text-center">Novedades</h1>
      <div className="row justify-content-center g-4">
        {novedades.map((novedad) => (
          <div className="col-12 col-md-6 col-lg-5" key={novedad.id}>
            <div className="card h-100 shadow-sm border-0">
              <img 
                src={novedad.imagen} 
                className="card-img-top" 
                alt={novedad.titulo} 
                style={{ height: '200px', objectFit: 'cover' }} 
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-success">{novedad.titulo}</h5>
                <p className="card-text text-muted flex-grow-1">{novedad.resumen}</p>
                <Link to={`/novedades/${novedad.id}`} className="btn btn-outline-success w-100 mt-auto">
                  Leer más
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Novedades;