import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSesion } from '../context/SesionContexto';
import type { UsuarioAdministrable } from '../data/UsuarioData';

function AdminUsuarios() {
  const {
    usuario: usuarioActual,
    usuarios,
    crearUsuarioAdmin,
    actualizarUsuarioAdmin,
    eliminarUsuarioAdmin,
  } = useSesion();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const idUsuarioActual = usuarios.find((cuenta) => cuenta.correo === usuarioActual?.correo)?.id;

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setCorreo('');
    setContrasena('');
    setAdmin(false);
    setError('');
  };

  const editarUsuario = (usuario: UsuarioAdministrable) => {
    setEditandoId(usuario.id);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setContrasena('');
    setAdmin(usuario.admin);
    setError('');
    setMensaje('');
  };

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setError('');
    setMensaje('');

    if (!nombre.trim() || !correo.trim()) {
      setError('El nombre y el correo son obligatorios.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError('Ingresa un correo válido.');
      return;
    }
    if (editandoId === null && contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (contrasena && contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const resultado = editandoId === null
      ? crearUsuarioAdmin(nombre, correo, contrasena, admin)
      : actualizarUsuarioAdmin(editandoId, nombre, correo, admin, contrasena);

    if (!resultado.correcto) {
      setError(resultado.mensaje);
      return;
    }
    setMensaje(editandoId === null ? 'La cuenta se creó correctamente.' : 'La cuenta se actualizó correctamente.');
    limpiarFormulario();
  };

  const manejarEliminacion = (usuario: UsuarioAdministrable) => {
    if (!window.confirm(`¿Seguro que quieres eliminar la cuenta de ${usuario.nombre}?`)) return;
    const resultado = eliminarUsuarioAdmin(usuario.id);
    if (!resultado.correcto) {
      setError(resultado.mensaje);
      setMensaje('');
      return;
    }
    setError('');
    setMensaje('La cuenta se eliminó correctamente.');
    if (editandoId === usuario.id) limpiarFormulario();
  };

  return (
    <main className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 className="fw-bold text-success mb-0">Panel de Administración: Usuarios</h1>
        <div className="d-flex gap-2">
          <Link to="/admin/servicios" className="btn btn-outline-success">Administrar servicios</Link>
          <Link to="/usuario" className="btn btn-outline-secondary">Mi cuenta</Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <section className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h2 className="h4 fw-bold mb-3">{editandoId === null ? 'Crear cuenta' : 'Editar cuenta'}</h2>
              <form onSubmit={manejarEnvio} noValidate>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="nombre-usuario">Nombre</label>
                  <input id="nombre-usuario" className="form-control" value={nombre} onChange={(evento) => setNombre(evento.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="correo-usuario">Correo electrónico</label>
                  <input id="correo-usuario" type="email" className="form-control" value={correo} onChange={(evento) => setCorreo(evento.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" htmlFor="contrasena-usuario">
                    {editandoId === null ? 'Contraseña' : 'Nueva contraseña (opcional)'}
                  </label>
                  <input
                    id="contrasena-usuario"
                    type="password"
                    className="form-control"
                    value={contrasena}
                    onChange={(evento) => setContrasena(evento.target.value)}
                    minLength={6}
                    required={editandoId === null}
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-check mb-3">
                  <input id="usuario-admin" type="checkbox" className="form-check-input" checked={admin} onChange={(evento) => setAdmin(evento.target.checked)} />
                  <label className="form-check-label" htmlFor="usuario-admin">Conceder permisos de administrador</label>
                </div>
                <button type="submit" className="btn btn-success w-100">
                  {editandoId === null ? 'Crear cuenta' : 'Guardar cambios'}
                </button>
                {editandoId !== null && (
                  <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={limpiarFormulario}>
                    Cancelar edición
                  </button>
                )}
              </form>
            </div>
          </section>
        </div>

        <div className="col-12 col-lg-8">
          <section className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="h4 fw-bold mb-3">Cuentas registradas</h2>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td className="fw-bold">
                          {usuario.nombre}
                          {usuario.id === idUsuarioActual && <span className="visually-hidden"> (tu cuenta)</span>}
                        </td>
                        <td>{usuario.correo}</td>
                        <td><span className={`badge ${usuario.admin ? 'text-bg-warning' : 'text-bg-secondary'}`}>{usuario.admin ? 'Administrador' : 'Usuario'}</span></td>
                        <td className="text-end text-nowrap">
                          <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => editarUsuario(usuario)}>
                            Editar
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-danger" disabled={usuario.id === idUsuarioActual} onClick={() => manejarEliminacion(usuario)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminUsuarios;
