import { Link } from "react-router-dom";
function Navbar() {
    
    return (
        <nav className="navbar navbar-expand bg-success">
            <div className="container">
                <span className="navbar-brand text-white">
                    Veterinaria San Marcos
                </span>
                <div className="navbar-nav me-auto">
                    <Link className="nav-link text-white" to="/" style={{  }}>
                        Inicio
                    </Link>

                    <Link className="nav-link text-white" to="/novedades">
                        Novedades
                    </Link>

                    <Link className="nav-link text-white" to="/servicios">
                        Servicios
                    </Link>
                    
                    <Link className="nav-link text-white" to="/contacto">
                        Contacto
                    </Link>

                    <Link className="nav-link text-white" to="/info">
                        Quienes somos
                    </Link>
                </div>
                <div className="navbar-nav">
                    <Link className="nav-link text-white" to="/login">
                        Iniciar sesión
                    </Link>

                </div>

            </div>

        </nav>
    )
}

export default Navbar