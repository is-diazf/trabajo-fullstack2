import Boton from '../atomos/boton';

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
      <img src={imagen} className="card-img-top" alt={titulo} style={{ height: '200px', objectFit: 'cover' }} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold text-success">{titulo}</h5>
        <p className="card-text text-muted small flex-grow-1">{descripcion}</p>
        <p className="fw-bold fs-5">${precio.toLocaleString()}</p>
        <Boton texto="Ver detalle" clase="btn btn-outline-success w-100" id={String(id)} />
      </div>
    </div>
  );
}
export default CardServicio;