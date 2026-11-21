import { useState } from 'react';

import type { SubmitEvent } from 'react';

type Errores = {
  nombre?: string;
  email?: string;
  mensaje?: string;
};

function FormularioContacto() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const validar = (): Errores => {
    const nuevosErrores: Errores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'Ingresa tu nombre.';
    } else if (nombre.length > 100) {
      nuevosErrores.nombre = 'El nombre no puede superar los 100 caracteres.';
    }

    if (!email.trim()) {
      nuevosErrores.email = 'Ingresa tu correo electrónico.';
    } else if (email.length > 100) {
      nuevosErrores.email = 'El correo no puede superar los 100 caracteres.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido.';
    }

    if (!mensaje.trim()) {
      nuevosErrores.mensaje = 'Escribe tu mensaje.';
    } else if (mensaje.length > 500) {
      nuevosErrores.mensaje = 'El mensaje no puede superar los 500 caracteres.';
    }

    return nuevosErrores;
  };

  const manejarEnvio = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    setEnviado(false);
    setErrorServidor('');

    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      const respuesta = await fetch('http://localhost:8082/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCompleto: nombre.trim(),
          correo: email.trim(),
          mensaje: mensaje.trim(),
        }),
      });

      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}`);
      }

      setEnviado(true);
      setNombre('');
      setEmail('');
      setMensaje('');
    } catch {
      setErrorServidor('No pudimos enviar tu consulta. Inténtalo nuevamente en unos minutos.');
    } finally {
      setEnviando(false);
    }
  };

  const actualizarCampo = (campo: keyof Errores, valor: string) => {
    const setters = { nombre: setNombre, email: setEmail, mensaje: setMensaje };
    setters[campo](valor);
    setEnviado(false);
    setErrorServidor('');
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
  };

  return (
    <form onSubmit={manejarEnvio} className="contact-form" noValidate>
      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="contacto-nombre">Nombre</label>
        <input
          id="contacto-nombre"
          name="nombre"
          type="text"
          className={`form-control${errores.nombre ? ' is-invalid' : ''}`}
          value={nombre}
          maxLength={100}
          autoComplete="name"
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? 'error-nombre' : 'ayuda-nombre'}
          onChange={(e) => actualizarCampo('nombre', e.target.value)}
        />
        <div id={errores.nombre ? 'error-nombre' : 'ayuda-nombre'} className={errores.nombre ? 'invalid-feedback' : 'form-text'}>
          {errores.nombre ?? `${nombre.length}/100 caracteres`}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="contacto-email">Correo electrónico</label>
        <input
          id="contacto-email"
          name="email"
          type="email"
          className={`form-control${errores.email ? ' is-invalid' : ''}`}
          value={email}
          maxLength={100}
          autoComplete="email"
          aria-invalid={Boolean(errores.email)}
          aria-describedby={errores.email ? 'error-email' : 'ayuda-email'}
          onChange={(e) => actualizarCampo('email', e.target.value)}
        />
        <div id={errores.email ? 'error-email' : 'ayuda-email'} className={errores.email ? 'invalid-feedback' : 'form-text'}>
          {errores.email ?? `${email.length}/100 caracteres`}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="contacto-mensaje">Mensaje</label>
        <textarea
          id="contacto-mensaje"
          name="mensaje"
          className={`form-control${errores.mensaje ? ' is-invalid' : ''}`}
          rows={5}
          value={mensaje}
          maxLength={500}
          aria-invalid={Boolean(errores.mensaje)}
          aria-describedby={errores.mensaje ? 'error-mensaje' : 'ayuda-mensaje'}
          onChange={(e) => actualizarCampo('mensaje', e.target.value)}
        />
        <div id={errores.mensaje ? 'error-mensaje' : 'ayuda-mensaje'} className={errores.mensaje ? 'invalid-feedback' : 'form-text'}>
          {errores.mensaje ?? `${mensaje.length}/500 caracteres`}
        </div>
      </div>

      <button type="submit" className="btn btn-success w-100" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar consulta'}
      </button>
      {enviado && <p className="form-success" role="status">Tu consulta fue enviada. Gracias por contactarnos.</p>}
      {errorServidor && <p className="text-danger mt-2" role="alert">{errorServidor}</p>}
    </form>
  );
}

export default FormularioContacto;
