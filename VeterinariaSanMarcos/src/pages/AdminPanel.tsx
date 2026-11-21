import { useState } from "react";
import { Link } from "react-router-dom";

function AdminPanel() {

  const [pestanaActiva, setPestanaActiva] = useState('compras');


  const comprasFalsas = [
    { id: 1001, usuario: "maria.garcia@example.com", total: 25000, fecha: "2024-07-01", estado: "Pagado" },
    { id: 1002, usuario: "juan.perez@example.com", total: 15000, fecha: "2024-07-02", estado: "Pendiente" },
  ];
  const mensajesFalsos = [
    { id: 1, nombre: "Ana", correo: "ana@test.com", mensaje: "Hola, quería consultar por el precio de la esterilización." },
    { id: 2, nombre: "Pedro", correo: "pedro@test.com", mensaje: "¿Tienen hora disponible para mañana?" },
  ];
  const historialesFalsos = [
    { id: 1, mascota: "Firulais", dueno: "María García", fecha: "2024-05-10", motivo: "Vacuna" },
    { id: 2, mascota: "Michi", dueno: "Juan Pérez", fecha: "2024-06-15", motivo: "Control" },
  ];

  return (
    <div className="container py-5">
      <h1 className="fw-bold text-success mb-4">Panel de Administración General</h1>
      

      <div className="mb-4 d-flex flex-wrap gap-2">
        <Link to="/admin/servicios" className="btn btn-outline-dark">Gestionar Servicios</Link>
        <Link to="/admin/novedades" className="btn btn-outline-dark">Gestionar Novedades</Link>
        <Link to="/admin/usuarios" className="btn btn-outline-dark">Gestionar Usuarios</Link>
      </div>


      <div className="mb-4">
        <button 
          className={`btn me-2 ${pestanaActiva === 'compras' ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => setPestanaActiva('compras')}
        >
          🛒 Compras de Usuarios
        </button>
        <button 
          className={`btn me-2 ${pestanaActiva === 'mensajes' ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => setPestanaActiva('mensajes')}
        >
          ✉️ Mensajes de Contacto
        </button>
        <button 
          className={`btn ${pestanaActiva === 'historiales' ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => setPestanaActiva('historiales')}
        >
          🩺 Historiales Médicos
        </button>
      </div>


      <div className="card shadow-sm border-0">
        <div className="card-body">
          
          {pestanaActiva === 'compras' && (
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {comprasFalsas.map(c => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>{c.usuario}</td>
                    <td>${c.total.toLocaleString()}</td>
                    <td>{c.fecha}</td>
                    <td><span className="badge bg-success">{c.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pestanaActiva === 'mensajes' && (
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {mensajesFalsos.map(m => (
                  <tr key={m.id}>
                    <td>{m.nombre}</td>
                    <td>{m.correo}</td>
                    <td>{m.mensaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* VISTA: HISTORIALES MÉDICOS */}
          {pestanaActiva === 'historiales' && (
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Mascota</th>
                  <th>Dueño</th>
                  <th>Fecha</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {historialesFalsos.map(h => (
                  <tr key={h.id}>
                    <td className="fw-bold">{h.mascota}</td>
                    <td>{h.dueno}</td>
                    <td>{h.fecha}</td>
                    <td>{h.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}
export default AdminPanel;