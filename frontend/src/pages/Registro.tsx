
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from '../componentes/molecules/CampoFormulario';
import { useSesion } from '../context/SesionContexto';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const { registrarUsuario } = useSesion();
  const navegar = useNavigate();

  const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim() || !contrasena) {
      setError('Completa todos los campos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError('Ingresa un correo válido.');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (contrasena !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const resultado = registrarUsuario(nombre, correo, contrasena);
    if (!resultado.correcto) {
      setError(resultado.mensaje);
      return;
    }
    navegar('/usuario');
  };

  return (
    <main className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <section className="card shadow-sm p-4">
            <h1 className="h2 mb-4">Crear cuenta</h1>
            <form onSubmit={manejarEnvio} noValidate>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <CampoFormulario etiqueta="Nombre" tipo="text" nombre="nombre" valor={nombre} alCambiar={setNombre} />
              <CampoFormulario etiqueta="Correo electrónico" tipo="email" nombre="correo" valor={correo} alCambiar={setCorreo} />
              <CampoFormulario etiqueta="Contraseña" tipo="password" nombre="contrasena" valor={contrasena} alCambiar={setContrasena} />
              <CampoFormulario etiqueta="Confirmar contraseña" tipo="password" nombre="confirmacion" valor={confirmacion} alCambiar={setConfirmacion} />
              <button type="submit" className="btn btn-success">Crear cuenta</button>
              <p className="mt-3 mb-0">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
export default Registro;