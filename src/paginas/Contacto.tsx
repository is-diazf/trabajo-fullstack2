import FormularioContacto from '../componentes/organismo/FormularioContacto';

function Contacto() {
  return (
    <main className="contact-page">
      <section className="contact-intro">
        <p className="eyebrow">Estamos para ayudarte</p>
        <h1>Cuéntanos cómo podemos cuidar mejor de tu mascota.</h1>
        <p>Déjanos tu consulta y nos pondremos en contacto contigo.</p>
      </section>
      <div className="contact-layout">
        <aside className="contact-details">
          <h2>Veterinaria San Marcos</h2>
          <p>Atención cercana para ti y tu compañero.</p>
          <dl>
            <div><dt>Dirección</dt><dd>Calle Falsa 123, Ciudad, País</dd></div>
            <div><dt>Teléfono</dt><dd><a href="tel:+56912345678">+56 9 1234 5678</a></dd></div>
            <div><dt>Correo</dt><dd><a href="mailto:info@veterinariasanmarcos.cl">info@veterinariasanmarcos.cl</a></dd></div>
          </dl>
        </aside>
        <section className="contact-form-column" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title">Envíanos tu consulta</h2>
          <FormularioContacto />
        </section>
      </div>
    </main>
  );
}
export default Contacto;