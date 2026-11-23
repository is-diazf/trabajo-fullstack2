// src/paginas/AdminNovedades.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNovedades, type Novedad } from "../context/NovedadesContexto";

function AdminNovedades() {
  const { novedades, cargando, error: errorCarga, agregarNovedad, editarNovedad, eliminarNovedad } = useNovedades();
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    titulo: "",
    resumen: "",
    detalle: "",
    imagen: "/img/esterilizacion.jpeg",
  });

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setGuardando(true);
    const resultado = editandoId === null
      ? await agregarNovedad(formData)
      : await editarNovedad(editandoId, formData);
    setGuardando(false);
    if (resultado.correcto) {
      limpiarFormulario();
    } else {
      setError(resultado.mensaje);
    }
  };

  const manejarEliminar = async (id: number) => {
    setError("");
    const resultado = await eliminarNovedad(id);
    if (!resultado.correcto) setError(resultado.mensaje);
  };

  const prepararEdicion = (novedad: Novedad) => {
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

      {(error || errorCarga) && (
        <p className="alert alert-danger" role="alert">{error || errorCarga}</p>
      )}

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
                  <label className="form-label fw-bold" htmlFor="novedad-titulo">Título</label>
                  <input id="novedad-titulo" type="text" className="form-control" name="titulo" value={formData.titulo} onChange={manejarCambio} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="novedad-resumen">Resumen corto</label>
                  <textarea id="novedad-resumen" className="form-control" name="resumen" rows={2} value={formData.resumen} onChange={manejarCambio} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="novedad-detalle">Detalle completo</label>
                  <textarea id="novedad-detalle" className="form-control" name="detalle" rows={4} value={formData.detalle} onChange={manejarCambio} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="novedad-imagen">Ruta de la Imagen</label>
                  <input id="novedad-imagen" type="text" className="form-control" name="imagen" value={formData.imagen} onChange={manejarCambio} required />
                  <small className="text-muted">Ejemplo: /img/esterilizacion.jpeg</small>
                </div>
                
                <button type="submit" className="btn btn-success w-100 fw-bold" disabled={guardando}>
                  {guardando ? "Guardando..." : editandoId === null ? "Guardar Novedad" : "Guardar Cambios"}
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
                    {cargando && novedades.length === 0 && (
                      <tr><td colSpan={3} className="text-center text-muted">Cargando novedades...</td></tr>
                    )}
                    {novedades.map((novedad) => (
                      <tr key={novedad.id}>
                        <td className="fw-bold" style={{maxWidth: '120px'}}>{novedad.titulo}</td>
                        <td className="text-muted small" style={{maxWidth: '180px'}}>{novedad.resumen}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => prepararEdicion(novedad)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => void manejarEliminar(novedad.id)}>
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