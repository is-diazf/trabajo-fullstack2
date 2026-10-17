import { useState } from 'react';

function FormularioContacto() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      alert('Completa todos los campos');
      return;
    }

    alert('Mensaje enviado correctamente');
  };

  return (
    <form onSubmit={manejarEnvio} className="p-4 border rounded shadow-sm bg-light" noValidate>
      <div className="mb-3">
        <label className="form-label fw-semibold">Nombre</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Correo electrónico</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Mensaje</label>
        <textarea
          className="form-control"
          rows={4}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-success w-100">
        Enviar
      </button>
    </form>
  );
}

export default FormularioContacto;
