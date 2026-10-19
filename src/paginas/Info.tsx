import { Link } from 'react-router-dom';

function Info() {
    return (
        <main className="about-page">
            <section className="about-heading">
                <p className="eyebrow">Quiénes somos</p>
                <h1>Cuidado veterinario con trato cercano.</h1>
                <p>
                    En Veterinaria San Marcos trabajamos para que cada mascota reciba una atención respetuosa, clara y pensada para su bienestar.
                </p>
            </section>

            <section className="about-details">
                <div className="about-image" role="img" aria-label="Animales de compañía" />
                <div className="about-copy">
                    <h2>Una relación de confianza, visita a visita.</h2>
                    <p>
                        Creemos que cuidar bien también significa escuchar. Por eso acompañamos a las familias con orientación comprensible y recomendaciones adecuadas a las necesidades de cada paciente.
                    </p>
                    <p>
                        Nuestro compromiso es contribuir a una vida más saludable para las mascotas y a una experiencia tranquila para quienes las cuidan.
                    </p>
                    <Link className="btn btn-success" to="/contacto">Conversemos</Link>
                </div>
            </section>
        </main>
    );
}

export default Info;