// src/paginas/HistorialMedico.tsx
import { Link } from "react-router-dom";

export default function HistorialMedico() {
  const historialFalso = [
    { id: 1, mascota: "Firulais", fecha: "2024-05-10", motivo: "Vacuna Antirrábica", veterinario: "Dr. Pérez", estado: "Completado" },
    { id: 2, mascota: "Michi", fecha: "2024-06-15", motivo: "Esterilización", veterinario: "Dra. Gómez", estado: "Completado" },
  ];

  return (
    <div className="container py-5">
      <h1 className="fw-bold text-success mb-4">Historial Médico de Mascotas</h1>
      
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Fecha</th>
                <th>Mascota</th>
                <th>Motivo</th>
                <th>Veterinario</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historialFalso.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.fecha}</td>
                  <td className="fw-bold">{registro.mascota}</td>
                  <td>{registro.motivo}</td>
                  <td>{registro.veterinario}</td>
                  <td>{registro.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4">
        <Link to="/usuario" className="btn btn-secondary">Volver a Mi Cuenta</Link>
      </div>
    </div>
  );
}