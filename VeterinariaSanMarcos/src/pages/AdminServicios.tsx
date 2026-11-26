// src/paginas/AdminServicios.tsx
import { useState } from "react";
import { useServicios, type Servicio } from "../context/ServiciosContexto";
import { Link } from "react-router-dom";

function AdminServicios() {

    const { servicios, cargando, error: errorCarga, agregarServicio, editarServicio, eliminarServicio } = useServicios();

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: 0,
    imagen: "/img/perruqueria.jpg", // Imagen por defecto
  });

  // Manejador de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "precio" ? Number(value) : value, // Convertimos el precio a número
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setGuardando(true);
    // CREAR o EDITAR en Veterinaria-Service
    const resultado = editandoId === null
      ? await agregarServicio(formData)
      : await editarServicio(editandoId, formData);
    setGuardando(false);
    if (resultado.correcto) {
      limpiarFormulario();
    } else {
      setError(resultado.mensaje);
    }
  };

  const handleEliminar = async (id: number) => {
    setError("");
    const resultado = await eliminarServicio(id);
    if (!resultado.correcto) setError(resultado.mensaje);
  };

  // Cargar datos en el formulario para editar
  const handleEditarClick = (servicio: Servicio) => {
    setEditandoId(servicio.id);
    setFormData({
      titulo: servicio.titulo,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      imagen: servicio.imagen,
    });
  };

  // Limpiar el formulario
  const limpiarFormulario = () => {
    setEditandoId(null);
    setFormData({ titulo: "", descripcion: "", precio: 0, imagen: "/img/perruqueria.jpg" });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-success mb-0">Panel de Administración: Servicios</h1>
        <div className="d-flex gap-2">
          <Link to="/admin" className="btn btn-outline-success">Panel general</Link>
          <Link to="/admin/usuarios" className="btn btn-outline-success">Administrar usuarios</Link>
          <Link to="/admin/novedades" className="btn btn-outline-success">Administrar novedades</Link>
          <Link to="/servicios" className="btn btn-outline-secondary">Ir a la vista pública</Link>
        </div>
      </div>

      {(error || errorCarga) && (
        <p className="alert alert-danger" role="alert">{error || errorCarga}</p>
      )}

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h4 className="card-title fw-bold mb-3">
                {editandoId === null ? "Crear Nuevo Servicio" : "Editar Servicio"}
              </h4>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="servicio-titulo">Título</label>
                  <input id="servicio-titulo" type="text" className="form-control" name="titulo" value={formData.titulo} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="servicio-descripcion">Descripción</label>
                  <textarea id="servicio-descripcion" className="form-control" name="descripcion" rows={3} value={formData.descripcion} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="servicio-precio">Precio ($)</label>
                  <input id="servicio-precio" type="number" min="0" className="form-control" name="precio" value={formData.precio} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="servicio-imagen">URL de la Imagen</label>
                  <input id="servicio-imagen" type="text" className="form-control" name="imagen" value={formData.imagen} onChange={handleChange} required />
                </div>
                
                <button type="submit" className="btn btn-success w-100 fw-bold" disabled={guardando}>
                  {guardando ? "Guardando..." : editandoId === null ? "Guardar Servicio" : "Actualizar Servicio"}
                </button>
                
                {editandoId !== null && (
                  <button type="button" className="btn btn-secondary w-100 mt-2" onClick={limpiarFormulario}>
                    Cancelar Edición
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="card-title fw-bold mb-3">Listado de Servicios</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Precio</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargando && servicios.length === 0 && (
                      <tr><td colSpan={4} className="text-center text-muted">Cargando servicios...</td></tr>
                    )}
                    {servicios.map((servicio) => (
                      <tr key={servicio.id}>
                        <td>{servicio.id.toString().slice(-4)}</td> {/* Mostramos los últimos 4 dígitos del ID */}
                        <td className="fw-bold">{servicio.titulo}</td>
                        <td>${servicio.precio.toLocaleString()}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditarClick(servicio)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => void handleEliminar(servicio.id)}>
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

export default AdminServicios;