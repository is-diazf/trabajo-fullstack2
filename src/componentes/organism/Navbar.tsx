import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useSesion } from '../../context/SesionContexto';
import { useServicios } from '../../context/ServiciosContexto';

function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [agendaAbierta, setAgendaAbierta] = useState(false);
    const [solicitudLista, setSolicitudLista] = useState(false);
    const cerrarMenu = () => setMenuAbierto(false);
    const { usuario, cerrarSesion, esAdmin } = useSesion();
    const { servicios } = useServicios();
    const navegar = useNavigate();

    useEffect(() => {
        if (!agendaAbierta) return;

        const overflowOriginal = document.body.style.overflow;
        const manejarTecla = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setAgendaAbierta(false);
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', manejarTecla);
        return () => {
            document.body.style.overflow = overflowOriginal;
            document.removeEventListener('keydown', manejarTecla);
        };
    }, [agendaAbierta]);

    const abrirAgenda = () => {
        cerrarMenu();
        setSolicitudLista(false);
        setAgendaAbierta(true);
    };

    const manejarSolicitud = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSolicitudLista(true);
    };

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

                    <div className="site-nav-actions">
                        {usuario ? (
                            <>
                                <button className="btn btn-sm btn-outline-light rounded-pill px-3" type="button" onClick={abrirAgenda}>
                                    Agendar hora
                                </button>
                            {esAdmin && (
                                    <Link to="/admin/servicios" className="btn btn-sm btn-warning fw-bold px-3 rounded-pill" onClick={cerrarMenu}>
                                        Administración
                                    </Link>
                            )}
                                <Link to="/usuario" className="btn btn-sm btn-light text-success fw-bold px-3 rounded-pill site-login" onClick={cerrarMenu}>
                                    Mi cuenta
                                </Link>
                                <button type="button" className="btn btn-sm btn-outline-light" onClick={manejarCierreSesion}>
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-sm btn-light text-success fw-bold px-3 rounded-pill site-login" onClick={cerrarMenu}>
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                    
                </div>
            </div>
            {agendaAbierta && createPortal(
                <div
                    className="modal d-block"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setAgendaAbierta(false);
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <section className="modal-content" role="dialog" aria-modal="true" aria-labelledby="agenda-titulo">
                            <div className="modal-header">
                                <h2 className="modal-title fs-5" id="agenda-titulo">Agendar una hora</h2>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Cerrar"
                                    onClick={() => setAgendaAbierta(false)}
                                />
                            </div>
                            {solicitudLista ? (
                                <div className="modal-body">
                                    <p className="mb-0" role="status">
                                        Formulario completado. Para confirmar disponibilidad, comunícate con la veterinaria por teléfono.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={manejarSolicitud}>
                                    <div className="modal-body">
                                        <p>Completa tus datos y la hora que prefieres. La reserva debe confirmarse con la veterinaria.</p>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="agenda-nombre">Tu nombre</label>
                                            <input className="form-control" id="agenda-nombre" name="nombre" autoComplete="name" required maxLength={100} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="agenda-correo">Correo electrónico</label>
                                            <input className="form-control" id="agenda-correo" name="correo" type="email" autoComplete="email" required maxLength={100} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="agenda-mascota">Nombre de tu mascota</label>
                                            <input className="form-control" id="agenda-mascota" name="mascota" required maxLength={100} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="agenda-servicio">Servicio</label>
                                            <select className="form-select" id="agenda-servicio" name="servicio" required defaultValue="">
                                                <option value="" disabled>Selecciona un servicio</option>
                                                {servicios.map((servicio) => (
                                                    <option key={servicio.id} value={servicio.titulo}>{servicio.titulo}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-12 col-sm-6">
                                                <label className="form-label" htmlFor="agenda-fecha">Fecha</label>
                                                <input
                                                    className="form-control"
                                                    id="agenda-fecha"
                                                    name="fecha"
                                                    type="date"
                                                    min={new Date().toLocaleDateString('en-CA')}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <label className="form-label" htmlFor="agenda-hora">Hora</label>
                                                <input className="form-control" id="agenda-hora" name="hora" type="time" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setAgendaAbierta(false)}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-success">Solicitar hora</button>
                                    </div>
                                </form>
                            )}
                        </section>
                    </div>
                </div>,
                document.body,
            )}
            {agendaAbierta && createPortal(
                <div className="modal-backdrop show" onClick={() => setAgendaAbierta(false)} />,
                document.body,
            )}
        </nav>
    )
}

export default Navbar