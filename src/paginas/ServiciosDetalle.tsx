// src/paginas/ServicioDetalle.tsx
import { useParams, Link } from "react-router-dom";
import serviciosData from "../data/ServiciosData";

function ServicioDetalle() {

  const { id } = useParams();
  
  const servicio = serviciosData.find((s) => s.id === Number(id));

  if (!servicio) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">Servicio no encontrado</h2>
        <Link to="/servicios" className="btn btn-primary mt-3">Volver a Servicios</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="card shadow">
            <img 
              src={servicio.imagen} 
              alt={servicio.titulo} 
              className="card-img-top" 
              style={{ height: '350px', objectFit: 'cover' }} 
            />
            <div className="card-body p-4">
              <h1 className="fw-bold text-success">{servicio.titulo}</h1>
              <p className="fs-5 text-muted mt-3">{servicio.descripcion}</p>
              
              <h3 className="fw-bold text-dark mt-4">
                Precio: ${servicio.precio.toLocaleString('es-CL')}
              </h3>
              
              <hr className="my-4" />
              
              <Link to="/servicios" className="btn btn-outline-secondary">
                Volver a los servicios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicioDetalle;