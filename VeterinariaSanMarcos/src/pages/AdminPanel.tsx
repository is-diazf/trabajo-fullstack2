import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSesion } from "../context/SesionContexto";
import {
  listarHistoriales,
  listarMensajesContacto,
  mensajeErrorServicio,
  type HistorialMedico,
  type MensajeContacto,
} from "../servicios/panelAdmin";
import { listarCompras, type CompraRegistrada } from "../servicios/tienda";

type Pestana = 'compras' | 'mensajes' | 'historiales';

interface EstadoCarga<T> {
  datos: T[];
  cargando: boolean;
  error: string;
}

// Carga una lista desde un microservicio y permite recargarla.
function useLista<T>(cargar: () => Promise<T[]>, servicio: string) {
  const [estado, setEstado] = useState<EstadoCarga<T>>({ datos: [], cargando: true, error: '' });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    cargar()
      .then((datos) => {
        if (activo) setEstado({ datos, cargando: false, error: '' });
      })
      .catch((error: unknown) => {
        if (activo) setEstado({ datos: [], cargando: false, error: mensajeErrorServicio(error, servicio) });
      });
    return () => {
      activo = false;
    };
  }, [cargar, servicio, version]);

  const recargar = useCallback(() => {
    setEstado((actual) => ({ ...actual, cargando: true }));
    setVersion((v) => v + 1);
  }, []);

  return { ...estado, recargar };
}

function EstadoLista({ cargando, error, vacio, textoVacio, onReintentar }: {
  cargando: boolean;
  error: string;
  vacio: boolean;
  textoVacio: string;
  onReintentar: () => void;
}) {
  if (cargando) {
    return <p className="text-muted text-center my-4" role="status">Cargando...</p>;
  }
  if (error) {
    return (
      <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2 mb-0" role="alert">
        <span>{error}</span>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={onReintentar}>Reintentar</button>
      </div>
    );
  }
  if (vacio) {
    return <p className="text-muted text-center my-4">{textoVacio}</p>;
  }
  return null;
}

const formatoFecha = (valor: string) => {
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime())
    ? valor
    : new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(fecha);
};

function AdminPanel() {

  const [pestanaActiva, setPestanaActiva] = useState<Pestana>('mensajes');
  const { usuarios } = useSesion();

  const mensajes = useLista<MensajeContacto>(listarMensajesContacto, 'el servicio de contacto');
  const historiales = useLista<HistorialMedico>(listarHistoriales, 'el servicio de veterinaria');
  const compras = useLista<CompraRegistrada>(listarCompras, 'la tienda');

  const formatoPrecio = (precio: number) => `$${precio.toLocaleString('es-CL')}`;

  const nombreDueno = (usuarioId: number | null) => {
    if (usuarioId === null) return '—';
    return usuarios.find((usuario) => usuario.id === usuarioId)?.nombre ?? `Usuario #${usuarioId}`;
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold text-success mb-4">Panel de Administración General</h1>


      <div className="mb-4 d-flex flex-wrap gap-2">
        <Link to="/admin/servicios" className="btn btn-outline-dark">Gestionar Servicios</Link>
        <Link to="/admin/novedades" className="btn btn-outline-dark">Gestionar Novedades</Link>
        <Link to="/admin/usuarios" className="btn btn-outline-dark">Gestionar Usuarios</Link>
      </div>


      <div className="mb-4 d-flex flex-wrap gap-2">
        <button
          type="button"
          className={`btn ${pestanaActiva === 'mensajes' ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => setPestanaActiva('mensajes')}
        >
          ✉️ Mensajes de Contacto{!mensajes.cargando && !mensajes.error ? ` (${mensajes.datos.length})` : ''}
        </button>
        <button
          type="button"
          className={`btn ${pestanaActiva === 'historiales' ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => setPestanaActiva('historiales')}
        >
          🩺 Historiales Médicos
        </button>
        <button
          type="button"
          className={`btn ${pestanaActiva === 'compras' ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => setPestanaActiva('compras')}
        >
          🛒 Compras de Usuarios
        </button>
      </div>


      <div className="card shadow-sm border-0">
        <div className="card-body">

          {/* VISTA: MENSAJES DE CONTACTO (Micro-Contacto) */}
          {pestanaActiva === 'mensajes' && (
            <>
              <EstadoLista
                cargando={mensajes.cargando}
                error={mensajes.error}
                vacio={mensajes.datos.length === 0}
                textoVacio="Aún no hay mensajes de contacto."
                onReintentar={mensajes.recargar}
              />
              {!mensajes.cargando && !mensajes.error && mensajes.datos.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Fecha</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Mensaje</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...mensajes.datos]
                        .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion))
                        .map(m => (
                          <tr key={m.id}>
                            <td className="text-nowrap">{formatoFecha(m.fechaCreacion)}</td>
                            <td>{m.nombreCompleto}</td>
                            <td><a href={`mailto:${m.correo}`}>{m.correo}</a></td>
                            <td style={{ whiteSpace: 'pre-wrap' }}>{m.mensaje}</td>
                            <td>
                              <span className={`badge ${m.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                {m.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* VISTA: HISTORIALES MÉDICOS (Veterinaria-Service) */}
          {pestanaActiva === 'historiales' && (
            <>
              <EstadoLista
                cargando={historiales.cargando}
                error={historiales.error}
                vacio={historiales.datos.length === 0}
                textoVacio="Aún no hay historiales médicos registrados."
                onReintentar={historiales.recargar}
              />
              {!historiales.cargando && !historiales.error && historiales.datos.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Mascota</th>
                        <th>Dueño</th>
                        <th>Fecha</th>
                        <th>Motivo</th>
                        <th>Veterinario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historiales.datos.map(h => (
                        <tr key={h.id}>
                          <td className="fw-bold">{h.mascota ?? '—'}</td>
                          <td>{nombreDueno(h.usuarioId)}</td>
                          <td>{h.fecha ?? '—'}</td>
                          <td>{h.motivo ?? '—'}</td>
                          <td>{h.veterinario ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* VISTA: COMPRAS (shop-service) */}
          {pestanaActiva === 'compras' && (
            <>
              <EstadoLista
                cargando={compras.cargando}
                error={compras.error}
                vacio={compras.datos.length === 0}
                textoVacio="Aún no hay compras registradas."
                onReintentar={compras.recargar}
              />
              {!compras.cargando && !compras.error && compras.datos.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compras.datos.map(c => (
                        <tr key={c.id}>
                          <td>#{c.id}</td>
                          <td>{nombreDueno(c.usuarioId)}</td>
                          <td>
                            {c.items.map(item => `${item.nombreProducto} × ${item.cantidad}`).join(', ')}
                          </td>
                          <td className="fw-semibold">{formatoPrecio(c.total)}</td>
                          <td className="text-nowrap">{formatoFecha(c.creadaEn)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
export default AdminPanel;
