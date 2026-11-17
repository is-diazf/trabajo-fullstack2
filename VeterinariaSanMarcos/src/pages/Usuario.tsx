
import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CampoFormulario from '../componentes/molecules/CampoFormulario';
import { useSesion } from '../context/SesionContexto';

function Usuario() {
  const { usuario, actualizarUsuario, eliminarCuenta, cerrarSesion } = useSesion();
  const navegar = useNavigate();
  const [nombre, setNombre] = useState(usuario?.nombre ?? '');
  const [correo, setCorreo] = useState(usuario?.correo ?? '');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  if (!usuario) return <Navigate to="/login" replace />;

  const manejarActualizacion = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim()) {
      setError('El nombre y el correo son obligatorios.');
      setMensaje('');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError('Ingresa un correo válido.');
      setMensaje('');
      return;
    }
    const resultado = actualizarUsuario(nombre, correo);
    if (!resultado.correcto) {
      setError(resultado.mensaje);
      setMensaje('');
      return;
    }
    setError('');
    setMensaje('Tus datos se actualizaron correctamente.');
  };

  const manejarEliminacion = () => {
    if (!window.confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
    const resultado = eliminarCuenta();
    if (!resultado.correcto) {
      setError(resultado.mensaje);
      return;
    }
    navegar('/');
  };

  return (
    <main className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <section className="card shadow-sm p-4">
            <h1 className="h2 mb-3">Mi cuenta</h1>
            <p>Gestiona los datos asociados a tu cuenta.</p>
            <form onSubmit={manejarActualizacion} noValidate>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
              <CampoFormulario etiqueta="Nombre" tipo="text" nombre="nombre" valor={nombre} alCambiar={setNombre} />
              <CampoFormulario etiqueta="Correo electrónico" tipo="email" nombre="correo" valor={correo} alCambiar={setCorreo} />
              <button type="submit" className="btn btn-success me-2">Guardar cambios</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => { cerrarSesion(); navegar('/'); }}>Cerrar sesión</button>
            </form>
            <hr />
            <button type="button" className="btn btn-outline-danger align-self-start" onClick={manejarEliminacion}>
              Eliminar mi cuenta
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
export default Usuario;