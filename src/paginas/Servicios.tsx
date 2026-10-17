import CardServicio from "../componentes/moleculas/CardServicio"

function Servicios() {
return(
        <div>
            <h1>Servicios</h1>

            <div className="d-flex gap-3" 
            style={{objectFit: 'cover',
             objectPosition: 'center 40%',
             marginTop: '20px',
             padding: '20px',
             justifyContent: 'center',
             flexWrap: 'wrap',
             width: '100%',
            }}> {/*Clase de Bootstrap que permite que las cards se vean horizontalmente */}
                <CardServicio
                    id={1}
                    titulo="Esterilización de mascotas"
                    descripcion="Servicio de esterilización para mascotas, incluye anestesia y recuperación"
                    precio={30000}
                    imagen="/img/esterilizacion.jpeg"
                    />

                <CardServicio
                    id={2}
                    titulo="Perruquería"
                    descripcion="Peluquería de mascotas, corte y baño"
                    precio={25000}
                    imagen="/img/perruqueria.jpg"
                    />

            </div>
    </div>
    )
}
export default Servicios