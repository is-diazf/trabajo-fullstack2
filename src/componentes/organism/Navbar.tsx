import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSesion } from '../../context/SesionContexto';

function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const cerrarMenu = () => setMenuAbierto(false);
    const { usuario, cerrarSesion } = useSesion();
    const navegar = useNavigate();

    const manejarCierreSesion = () => {
        cerrarSesion();
        cerrarMenu();
        navegar('/');
    };

    return (
        <nav className="site-navbar">
            <div className="site-navbar-inner">
                <Link className="site-brand" to="/" onClick={cerrarMenu}>Veterinaria <span>San Marcos</span></Link>
                <button
                    className="nav-toggle"
                    type="button"
                    aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={menuAbierto}
                    aria-controls="navegacion-principal"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    <span />
                    <span />
                    <span />
                </button>
                <div id="navegacion-principal" className={`site-nav-content${menuAbierto ? ' is-open' : ''}`}>
                    <div className="site-nav-links">
                        <Link className="site-nav-link" to="/" onClick={cerrarMenu}>Inicio</Link>
                        <Link className="site-nav-link" to="/novedades" onClick={cerrarMenu}>Novedades</Link>
                        <Link className="site-nav-link" to="/servicios" onClick={cerrarMenu}>Servicios</Link>
                        <Link className="site-nav-link" to="/info" onClick={cerrarMenu}>Quiénes somos</Link>
                        <Link className="site-nav-link" to="/contacto" onClick={cerrarMenu}>Contacto</Link>
                    </div>

                    {usuario ? (
                        <>
                            <Link to="/usuario" className="btn btn-sm btn-light text-success fw-bold ms-3 px-3 rounded-pill site-login" onClick={cerrarMenu}>
                                Mi cuenta
                            </Link>
                            <button type="button" className="btn btn-sm btn-outline-light ms-2" onClick={manejarCierreSesion}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-sm btn-light text-success fw-bold ms-3 px-3 rounded-pill site-login" onClick={cerrarMenu}>
                            Iniciar sesión
                        </Link>
                    )}
                    
                </div>
            </div>
        </nav>
    )
}

export default Navbar