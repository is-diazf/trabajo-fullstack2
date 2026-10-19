// Servicios.tsx
import CardServicio from "../componentes/moleculas/CardServicio";

interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

const serviciosData: Servicio[] = [
  {
    id: 1,
    titulo: "Esterilización de mascotas",
    descripcion: "Servicio de esterilización para mascotas, incluye anestesia y recuperación",
    precio: 30000,
    imagen: "/img/esterilizacion.jpeg"
  },
  {
    id: 2,
    titulo: "Perruquería",
    descripcion: "Peluquería de mascotas, corte y baño",
    precio: 25000,
    imagen: "/img/perruqueria.jpg"
  }
];

function Servicios() {
  return (
    <div className="container py-5"> 
      <h1 className="mb-4 fw-bold text-success text-center">Servicios</h1>
      
      <div className="row justify-content-center g-4">
        
        {serviciosData.map((servicio) => (
          /* 
             col-12: en celulares ocupa todo el ancho
             col-md-6: en tablets ocupa la mitad (2 por fila)
             col-lg-5: en pantallas grandes ocupa un poco menos de la mitad 
          */
          <div className="col-12 col-md-6 col-lg-5" key={servicio.id}>
            <CardServicio
              id={servicio.id}
              titulo={servicio.titulo}
              descripcion={servicio.descripcion}
              precio={servicio.precio}
              imagen={servicio.imagen}
            />
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default Servicios;