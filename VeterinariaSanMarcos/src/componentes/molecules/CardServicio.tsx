// CardServicio.tsx
import { Link } from 'react-router-dom';
import Boton from '../atoms/boton';

interface CardServicioProps {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

function CardServicio({ id, titulo, descripcion, precio, imagen }: CardServicioProps) {
  return (
    <div className="card h-100 shadow-sm border-0">
      {/* objectFit: 'cover' hace que la imagen llene el espacio sin deformarse */}
      <img 
        src={imagen} 
        className="card-img-top" 
        alt={titulo} 
        style={{ height: '220px', objectFit: 'cover' }} 
      />
      
      {/* flex-column es la clave: apila el título, texto, precio y botón verticalmente */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold text-success">{titulo}</h5>
        
        {/* flex-grow-1 empuja el precio y el botón hacia abajo si un texto es más largo */}
        <p className="card-text text-muted flex-grow-1">{descripcion}</p>
        
        <p className="fw-bold fs-5 mb-3">${precio.toLocaleString("es-CL")}</p>
        
        {/* mt-auto asegura que el botón siempre esté pegado abajo en todas las tarjetas */}
        <Link to={`/servicios/${id}`} className="btn btn-success w-100 mt-auto">
          <Boton texto="Ver detalle" clase="btn btn-success w-100 mt-auto" id={String(id)} />
        </Link>
      </div>
    </div>
  );
}

export default CardServicio;