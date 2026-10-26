// src/paginas/AdminServicios.tsx
import { useState } from "react";
import { useServicios } from "../context/ServiciosContexto";
import { Link } from "react-router-dom";
import type { Servicio } from "../data/ServiciosData";

function AdminServicios() {

    const { servicios, agregarServicio, editarServicio, eliminarServicio } = useServicios();

  const [editandoId, setEditandoId] = useState<number | null>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editandoId === null) {
      // CREAR
      agregarServicio(formData);
    } else {
      // EDITAR
      editarServicio(editandoId, formData);
    }
    limpiarFormulario();
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
          <Link to="/admin/usuarios" className="btn btn-outline-success">Administrar usuarios</Link>
          <Link to="/servicios" className="btn btn-outline-secondary">Ir a la vista pública</Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h4 className="card-title fw-bold mb-3">
                {editandoId === null ? "Crear Nuevo Servicio" : "Editar Servicio"}
              </h4>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Título</label>
                  <input type="text" className="form-control" name="titulo" value={formData.titulo} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Descripción</label>
                  <textarea className="form-control" name="descripcion" rows={3} value={formData.descripcion} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Precio ($)</label>
                  <input type="number" min="0" className="form-control" name="precio" value={formData.precio} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">URL de la Imagen</label>
                  <input type="text" className="form-control" name="imagen" value={formData.imagen} onChange={handleChange} required />
                </div>
                
                <button type="submit" className="btn btn-success w-100 fw-bold">
                  {editandoId === null ? "Guardar Servicio" : "Actualizar Servicio"}
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
                    {servicios.map((servicio) => (
                      <tr key={servicio.id}>
                        <td>{servicio.id.toString().slice(-4)}</td> {/* Mostramos los últimos 4 dígitos del ID */}
                        <td className="fw-bold">{servicio.titulo}</td>
                        <td>${servicio.precio.toLocaleString()}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditarClick(servicio)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarServicio(servicio.id)}>
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