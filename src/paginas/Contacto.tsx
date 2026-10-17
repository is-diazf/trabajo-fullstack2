import FormularioContacto from '../componentes/organismo/FormularioContacto';

function Contacto() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Uso de clases responsivas como indica la PPT */}
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="text-center mb-4 text-success fw-bold">¿Tienes una consulta?</h2>
          <FormularioContacto />
        </div>
      </div>
    </div>
  );
}
export default Contacto;