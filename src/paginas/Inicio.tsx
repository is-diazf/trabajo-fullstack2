import { Link } from 'react-router-dom';

function Inicio() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">Veterinaria San Marcos</p>
          <h1>Cuidamos de quienes hacen tu vida mejor.</h1>
          <p className="home-intro">
            Atención veterinaria cercana y responsable para acompañar a tu mascota en cada etapa.
          </p>
          <div className="home-actions">
            <Link className="btn btn-success btn-lg" to="/servicios">Conoce nuestros servicios</Link>
            <Link className="text-link" to="/contacto">Hablemos de tu mascota <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="home-image" role="img" aria-label="Ilustración de animales de compañía" />
      </section>

      <section className="home-welcome">
        <div>
          <p className="eyebrow">Un equipo que te acompaña</p>
          <h2>Salud, confianza y cariño en cada visita.</h2>
        </div>
        <p>
          Desde un control preventivo hasta una consulta, escuchamos tus inquietudes y buscamos el mejor cuidado para cada paciente.
        </p>
        <Link className="text-link" to="/info">Conoce quiénes somos <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}

export default Inicio;
