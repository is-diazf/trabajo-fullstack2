// src/paginas/Servicios.tsx
import { useState } from "react";
import CardServicio from "../componentes/moleculas/CardServicio";
import { useServicios } from "../context/ServiciosContexto"; // Ojo aquí: Contexto con O

function Servicios() {
  const { servicios } = useServicios(); 
  const [busqueda, setBusqueda] = useState("");

  const serviciosFiltrados = servicios.filter((servicio) => {
    const termino = busqueda.toLowerCase();
    return (
      servicio.titulo.toLowerCase().includes(termino) ||
      servicio.descripcion.toLowerCase().includes(termino)
    );
  });

  return (
    <div className="container py-5"> 
      <h1 className="mb-4 fw-bold text-success text-center">Servicios</h1>
      
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-8 col-lg-6">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm"
            placeholder="Buscar servicio (ej. baño, esterilización)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="row justify-content-center g-4">
        {serviciosFiltrados.length > 0 ? (
          serviciosFiltrados.map((servicio) => (
            <div className="col-12 col-md-6 col-lg-5" key={servicio.id}>
              <CardServicio
                id={servicio.id}
                titulo={servicio.titulo}
                descripcion={servicio.descripcion}
                precio={servicio.precio}
                imagen={servicio.imagen}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-muted mt-5">
            <h4>No se encontraron servicios con "{busqueda}"</h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default Servicios;