// src/paginas/AdminNovedades.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNovedades } from "../context/NovedadesContexto";

function AdminNovedades() {
  const { novedades, agregarNovedad, editarNovedad, eliminarNovedad } = useNovedades();
  const [editandoId, setEditandoId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    titulo: "",
    resumen: "",
    detalle: "",
    imagen: "/img/esterilizacion.jpeg",
  });

  const manejarCambio = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, 
    });
  };

  const manejarEnvio = (e: any) => {
    e.preventDefault();
    if (editandoId === null) {
      agregarNovedad(formData); 
    } else {
      editarNovedad(editandoId, formData); 
    }
    limpiarFormulario(); 
  };

  const prepararEdicion = (novedad: any) => {
    setEditandoId(novedad.id);
    setFormData({
      titulo: novedad.titulo,
      resumen: novedad.resumen,
      detalle: novedad.detalle,
      imagen: novedad.imagen,
    });
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setFormData({ titulo: "", resumen: "", detalle: "", imagen: "/img/esterilizacion.jpeg" });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-success">Administrar Novedades</h1>
        <Link to="/novedades" className="btn btn-outline-secondary">
          ← Ver página pública
        </Link>
      </div>

      <div className="row g-4">
        {/* FORMULARIO */}
        <div className="col-12 col-md-5">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h4 className="card-title fw-bold mb-3">
                {editandoId === null ? "Crear Nueva Novedad" : "Editando Novedad"}
              </h4>
              
              <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Título</label>
                  <input type="text" className="form-control" name="titulo" value={formData.titulo} onChange={manejarCambio} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Resumen corto</label>
                  <textarea className="form-control" name="resumen" rows={2} value={formData.resumen} onChange={manejarCambio} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Detalle completo</label>
                  <textarea className="form-control" name="detalle" rows={4} value={formData.detalle} onChange={manejarCambio} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Ruta de la Imagen</label>
                  <input type="text" className="form-control" name="imagen" value={formData.imagen} onChange={manejarCambio} required />
                  <small className="text-muted">Ejemplo: /img/esterilizacion.jpeg</small>
                </div>
                
                <button type="submit" className="btn btn-success w-100 fw-bold">
                  {editandoId === null ? "Guardar Novedad" : "Guardar Cambios"}
                </button>
                
                {editandoId !== null && (
                  <button type="button" className="btn btn-secondary w-100 mt-2" onClick={limpiarFormulario}>
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="col-12 col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="card-title fw-bold mb-3">Listado</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Título</th>
                      <th>Resumen</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {novedades.map((novedad) => (
                      <tr key={novedad.id}>
                        <td className="fw-bold" style={{maxWidth: '120px'}}>{novedad.titulo}</td>
                        <td className="text-muted small" style={{maxWidth: '180px'}}>{novedad.resumen}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => prepararEdicion(novedad)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarNovedad(novedad.id)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminNovedades;