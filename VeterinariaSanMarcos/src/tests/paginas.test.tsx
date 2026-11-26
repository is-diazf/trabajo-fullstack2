import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { SesionProvider } from '../context/SesionContexto';
import { ServiciosProvider } from '../context/ServiciosContexto';
import { NovedadesProvider } from '../context/NovedadesContexto';

const backend = vi.hoisted(() => {
  type UsuarioFalso = { id: number; nombre: string; correo: string; contrasena: string; admin: boolean };
  type Cuerpo = Record<string, unknown>;

  const estado = { usuarios: [] as UsuarioFalso[], siguienteId: 1 };

  const reiniciar = () => {
    estado.usuarios = [
      { id: 1, nombre: 'Administrador', correo: 'admin.admin@admin.admin', contrasena: 'increibleclavesupersegura', admin: true },
      { id: 2, nombre: 'María García', correo: 'maria.garcia@example.com', contrasena: 'contrasena123', admin: false },
    ];
    estado.siguienteId = 3;
  };

  const fallar = (status: number, error: string) =>
    Promise.reject({ isAxiosError: true, response: { status, data: { error } } });
  const publico = ({ id, nombre, correo, admin }: UsuarioFalso) => ({ id, nombre, correo, admin });
  const sesion = (usuario: UsuarioFalso) => ({ data: { token: `token-${usuario.id}`, usuario: publico(usuario) } });
  const usuarioDelToken = () =>
    estado.usuarios.find((usuario) => `token-${usuario.id}` === localStorage.getItem('token_vet'));
  const correoEnUso = (correo: unknown, idExcluido?: number) =>
    estado.usuarios.some((usuario) => usuario.correo === String(correo).trim().toLowerCase() && usuario.id !== idExcluido);
  const idDeRuta = (url: string) => Number(url.split('/').pop());

  const api = {
    interceptors: { response: { use: () => 0, eject: () => undefined } },

    get: async (url: string) => {
      const actual = usuarioDelToken();
      if (!actual) return fallar(401, 'No autorizado.');
      if (url === '/auth/perfil') return { data: publico(actual) };
      if (url === '/usuarios' && actual.admin) return { data: estado.usuarios.map(publico) };
      return fallar(403, 'Acceso denegado.');
    },

    post: async (url: string, cuerpo: Cuerpo) => {
      if (url === '/auth/login') {
        const usuario = estado.usuarios.find(
          (candidato) => candidato.correo === String(cuerpo.correo).trim().toLowerCase() && candidato.contrasena === cuerpo.contrasena,
        );
        return usuario ? sesion(usuario) : fallar(401, 'Correo o contraseña incorrectos.');
      }
      if (url === '/auth/registro' || url === '/usuarios') {
        if (correoEnUso(cuerpo.correo)) return fallar(409, 'Ya existe una cuenta con ese correo.');
        const nuevo: UsuarioFalso = {
          id: estado.siguienteId++,
          nombre: String(cuerpo.nombre).trim(),
          correo: String(cuerpo.correo).trim().toLowerCase(),
          contrasena: String(cuerpo.contrasena),
          admin: url === '/usuarios' && cuerpo.admin === true,
        };
        estado.usuarios.push(nuevo);
        return url === '/usuarios' ? { data: publico(nuevo) } : sesion(nuevo);
      }
      return fallar(404, 'No encontrado.');
    },

    put: async (url: string, cuerpo: Cuerpo) => {
      const actual = usuarioDelToken();
      if (!actual) return fallar(401, 'No autorizado.');
      const id = url === '/auth/perfil' ? actual.id : idDeRuta(url);
      const usuario = estado.usuarios.find((candidato) => candidato.id === id);
      if (!usuario) return fallar(404, 'No se encontró la cuenta seleccionada.');
      if (correoEnUso(cuerpo.correo, id)) return fallar(409, 'Ese correo ya está asociado a otra cuenta.');
      usuario.nombre = String(cuerpo.nombre).trim();
      usuario.correo = String(cuerpo.correo).trim().toLowerCase();
      if (url === '/auth/perfil') return sesion(usuario);
      usuario.admin = cuerpo.admin === true;
      if (cuerpo.contrasena) usuario.contrasena = String(cuerpo.contrasena);
      return { data: publico(usuario) };
    },

    delete: async (url: string) => {
      const actual = usuarioDelToken();
      if (!actual) return fallar(401, 'No autorizado.');
      const id = url === '/auth/perfil' ? actual.id : idDeRuta(url);
      estado.usuarios = estado.usuarios.filter((usuario) => usuario.id !== id);
      return { data: undefined };
    },
  };

  return { estado, reiniciar, api };
});

vi.mock('../servicios/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../servicios/api')>()),
  default: backend.api,
}));

vi.mock('../servicios/tienda', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../servicios/tienda')>()),
  listarProductos: vi.fn().mockResolvedValue([
    { id: 1, nombre: 'Juguete interactivo', descripcion: 'Juguete resistente.', categoria: 'Juguetes', precio: 8990, imagen: '/img/juguetes_mascotas.jpg', stock: 5 },
  ]),
  registrarCompra: vi.fn(),
  listarComprasDeUsuario: vi.fn().mockResolvedValue([]),
  listarCompras: vi.fn().mockResolvedValue([
    { id: 15, usuarioId: 2, creadaEn: '2026-11-21T12:00:00Z', total: 17980, items: [{ productoId: 1, nombreProducto: 'Juguete interactivo', cantidad: 2, precioUnitario: 8990 }] },
  ]),
}));

vi.mock('../servicios/panelAdmin', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../servicios/panelAdmin')>()),
  listarMensajesContacto: vi.fn().mockResolvedValue([
    { id: 1, nombreCompleto: 'Ana', correo: 'ana@test.com', mensaje: 'Hola, quería consultar por el precio de la esterilización.', estado: 'PENDIENTE', fechaCreacion: '2026-11-20T10:15:00' },
  ]),
  listarHistoriales: vi.fn().mockResolvedValue([
    { id: 1, usuarioId: 2, mascota: 'Firulais', fecha: '2024-05-10', motivo: 'Vacuna', veterinario: 'Dra. Soto', estado: 'Cerrado' },
  ]),
}));

// Veterinaria-Service falso: servicios y novedades con estado, se reinicia en cada test.
const veterinaria = vi.hoisted(() => {
  type Servicio = { id: number; titulo: string; descripcion: string; precio: number; imagen: string };
  type Novedad = { id: number; titulo: string; resumen: string; detalle: string; imagen: string };

  const estado = { servicios: [] as Servicio[], novedades: [] as Novedad[], siguienteId: 100 };

  const reiniciar = () => {
    estado.servicios = [
      { id: 1, titulo: 'Esterilización de mascotas', descripcion: 'Servicio de esterilización para mascotas, incluye anestesia y recuperación', precio: 30000, imagen: '/img/esterilizacion.jpeg' },
      { id: 2, titulo: 'Perruquería', descripcion: 'Peluquería de mascotas, corte y baño', precio: 25000, imagen: '/img/perruqueria.jpg' },
    ];
    estado.novedades = [
      { id: 1, titulo: 'Nueva campaña de vacunación', resumen: 'Protege a tu mascota contra la rabia y otras enfermedades.', detalle: 'Durante todo el mes de mayo, tendremos un 20% de descuento en la vacuna antirrábica y la vacuna séxtuple.', imagen: '/img/esterilizacion.jpeg' },
      { id: 2, titulo: 'Horario extendido los sábados', resumen: 'Ahora atendemos hasta las 18:00 hrs los fines de semana.', detalle: 'Hemos extendido nuestro horario de atención los días sábados.', imagen: '/img/perruqueria.jpg' },
    ];
    estado.siguienteId = 100;
  };

  return {
    estado,
    reiniciar,
    listarServicios: async () => estado.servicios.map((s) => ({ ...s })),
    crearServicio: async (datos: Omit<Servicio, 'id'>) => {
      const creado = { ...datos, id: estado.siguienteId++ };
      estado.servicios.push(creado);
      return { ...creado };
    },
    actualizarServicio: async (id: number, datos: Omit<Servicio, 'id'>) => {
      const actualizado = { ...datos, id };
      estado.servicios = estado.servicios.map((s) => (s.id === id ? actualizado : s));
      return { ...actualizado };
    },
    borrarServicio: async (id: number) => {
      estado.servicios = estado.servicios.filter((s) => s.id !== id);
    },
    listarNovedades: async () => estado.novedades.map((n) => ({ ...n })),
    crearNovedad: async (datos: Omit<Novedad, 'id'>) => {
      const creada = { ...datos, id: estado.siguienteId++ };
      estado.novedades.push(creada);
      return { ...creada };
    },
    actualizarNovedad: async (id: number, datos: Omit<Novedad, 'id'>) => {
      const actualizada = { ...datos, id };
      estado.novedades = estado.novedades.map((n) => (n.id === id ? actualizada : n));
      return { ...actualizada };
    },
    borrarNovedad: async (id: number) => {
      estado.novedades = estado.novedades.filter((n) => n.id !== id);
    },
  };
});

// Cada función delega en `veterinaria` al llamarse, así un test puede reemplazar una.
vi.mock('../servicios/veterinaria', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../servicios/veterinaria')>()),
  listarServicios: () => veterinaria.listarServicios(),
  crearServicio: (...args: Parameters<typeof veterinaria.crearServicio>) => veterinaria.crearServicio(...args),
  actualizarServicio: (...args: Parameters<typeof veterinaria.actualizarServicio>) => veterinaria.actualizarServicio(...args),
  borrarServicio: (...args: Parameters<typeof veterinaria.borrarServicio>) => veterinaria.borrarServicio(...args),
  listarNovedades: () => veterinaria.listarNovedades(),
  crearNovedad: (...args: Parameters<typeof veterinaria.crearNovedad>) => veterinaria.crearNovedad(...args),
  actualizarNovedad: (...args: Parameters<typeof veterinaria.actualizarNovedad>) => veterinaria.actualizarNovedad(...args),
  borrarNovedad: (...args: Parameters<typeof veterinaria.borrarNovedad>) => veterinaria.borrarNovedad(...args),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
beforeEach(() => {
  localStorage.clear();
  backend.reiniciar();
  veterinaria.reiniciar();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 201 }));
});

function renderApp(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ServiciosProvider>
        <SesionProvider>
          <NovedadesProvider>
            <App />
          </NovedadesProvider>
        </SesionProvider>
      </ServiciosProvider>
    </MemoryRouter>,
  );
}

describe('páginas públicas', () => {
  it('muestra las novedades que entrega el servicio de veterinaria', async () => {
    renderApp('/novedades');

    expect(screen.getByRole('heading', { name: 'Novedades' })).toBeTruthy();
    expect(await screen.findByRole('heading', { name: 'Nueva campaña de vacunación' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Horario extendido los sábados' })).toBeTruthy();
  });

  it('muestra Inicio con la navegación y el footer compartidos', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: /cuidamos de quienes hacen tu vida mejor/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Quiénes somos' })).toBeTruthy();
    expect(screen.getByText(/todos los derechos reservados/i)).toBeTruthy();
  });

  it('muestra la página Quiénes somos', () => {
    renderApp('/info');

    expect(screen.getByRole('heading', { name: /cuidado veterinario con trato cercano/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Conversemos' })).toBeTruthy();
  });

  it('permite navegar desde Inicio a Contacto', () => {
    renderApp();

    fireEvent.click(screen.getByRole('link', { name: /hablemos de tu mascota/i }));

    expect(screen.getByRole('heading', { name: /cuéntanos cómo podemos cuidar mejor/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Envíanos tu consulta' })).toBeTruthy();
  });

  it('abre y cierra el formulario de agenda desde el navbar', async () => {
    renderApp();

    expect(screen.queryByRole('button', { name: 'Agendar hora' })).toBeNull();
    await iniciarSesionComoUsuario();
    expect(screen.getByRole('link', { name: 'Mi cuenta' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Agendar hora' }));
    expect(screen.getByRole('dialog', { name: 'Agendar una hora' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('valida y confirma el formulario de agenda', async () => {
    renderApp();

    await iniciarSesionComoUsuario();
    fireEvent.click(screen.getByRole('button', { name: 'Agendar hora' }));
    fireEvent.change(screen.getByLabelText('Tu nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Nombre de tu mascota'), { target: { value: 'Luna' } });
    fireEvent.change(screen.getByLabelText('Servicio'), { target: { value: 'Perruquería' } });
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2027-01-15' } });
    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '10:30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar hora' }));

    expect(screen.getByRole('status').textContent).toMatch(/confirmar disponibilidad/i);
  });

  async function iniciarSesionComoAdmin() {
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar sesión' }));
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'admin.admin@admin.admin' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'increibleclavesupersegura' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    fireEvent.click(await screen.findByRole('link', { name: 'Administración' }));
    fireEvent.click(screen.getByRole('link', { name: 'Gestionar Servicios' }));
  }

  async function iniciarSesionComoUsuario() {
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar sesión' }));
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'maria.garcia@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'contrasena123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByRole('link', { name: 'Mi cuenta' });
  }

  it('muestra solo el acceso de administración a los administradores', async () => {
    renderApp();
    await iniciarSesionComoAdmin();

    expect(screen.getByRole('link', { name: 'Administración' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Agendar hora' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Mi cuenta' })).toBeNull();
  });

  it('muestra los errores de validación del formulario de contacto', () => {
    renderApp('/contacto');

    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect(screen.getByText('Ingresa tu nombre.')).toBeTruthy();
    expect(screen.getByText('Ingresa tu correo electrónico.')).toBeTruthy();
    expect(screen.getByText('Escribe tu mensaje.')).toBeTruthy();
  });

  it('mantiene los campos controlados y confirma un envío válido', async () => {
    renderApp('/contacto');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Necesito una consulta.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect((await screen.findByRole('status')).textContent).toMatch(/tu consulta fue enviada/i);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8082/api/contactos', expect.objectContaining({ method: 'POST' }));
  });

  it('permite registrarse, ver y actualizar los datos de la cuenta', async () => {
    renderApp('/registro');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto1' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'secreto1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('heading', { name: 'Mi cuenta' })).toBeTruthy();
    expect((screen.getByLabelText('Nombre') as HTMLInputElement).value).toBe('Ana Pérez');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Díaz' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect((await screen.findByRole('status')).textContent).toMatch(/actualizaron correctamente/i);
    expect(backend.estado.usuarios.find((usuario) => usuario.correo === 'ana@example.com')?.nombre).toBe('Ana Díaz');
  });

  it('permite cerrar sesión e iniciar sesión con la cuenta registrada', async () => {
    renderApp('/registro');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto1' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'secreto1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    fireEvent.click((await screen.findAllByRole('button', { name: 'Cerrar sesión' }))[0]);
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar sesión' }));

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(await screen.findByRole('heading', { name: /cuidamos de quienes hacen tu vida mejor/i })).toBeTruthy();
    expect(localStorage.getItem('token_vet')).not.toBeNull();
  });

  it('redirige al administrador a su panel y permite gestionar cuentas', async () => {
    renderApp('/login');

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'admin.admin@admin.admin' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'increibleclavesupersegura' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(await screen.findByRole('heading', { name: /cuidamos de quienes hacen tu vida mejor/i })).toBeTruthy();
    fireEvent.click(await screen.findByRole('link', { name: 'Administración' }));
    fireEvent.click(screen.getByRole('link', { name: 'Gestionar Servicios' }));
    expect(screen.getByRole('heading', { name: /panel de administración: servicios/i })).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Administrar usuarios' }));
    expect(screen.getByRole('heading', { name: /panel de administración: usuarios/i })).toBeTruthy();
    expect(await screen.findByRole('row', { name: /maría garcía/i })).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Cliente Nuevo' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'cliente@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    const filaCuenta = await screen.findByRole('row', { name: /cliente nuevo cliente@example.com usuario/i });
    expect(backend.estado.usuarios.find((usuario) => usuario.correo === 'cliente@example.com')?.admin).toBe(false);

    fireEvent.click(within(filaCuenta).getByRole('button', { name: 'Editar' }));
    fireEvent.click(screen.getByLabelText('Conceder permisos de administrador'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByRole('row', { name: /cliente nuevo cliente@example.com administrador/i })).toBeTruthy();
    expect(backend.estado.usuarios.find((usuario) => usuario.correo === 'cliente@example.com')?.admin).toBe(true);
  });

  it('no permite entrar al panel administrativo sin iniciar sesión', () => {
    renderApp('/admin/servicios');

    expect(screen.getByRole('heading', { name: 'Login' })).toBeTruthy();
  });
    // ==========================================
  // PRUEBAS DE ISRAEL (PERSONA 2)
  // ==========================================

  it('11. debe mostrar el listado de servicios y permitir filtrarlos', async () => {
    renderApp('/servicios');

    // Verificamos que los servicios iniciales estén (llegan desde la API)
    expect(await screen.findByRole('heading', { name: 'Esterilización de mascotas' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Perruquería' })).toBeTruthy();

    // Usamos el buscador
    const buscador = screen.getByPlaceholderText(/Buscar servicio/i);
    fireEvent.change(buscador, { target: { value: 'baño' } });

    // La perruquería se queda, la esterilización desaparece
    expect(screen.getByRole('heading', { name: 'Perruquería' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Esterilización de mascotas' })).toBeNull();
  });

  it('12. debe mostrar el detalle de un servicio específico', async () => {
    renderApp('/servicios/1');

    expect(await screen.findByRole('heading', { name: 'Esterilización de mascotas' })).toBeTruthy();
    expect(screen.getByText(/incluye anestesia y recuperación/i)).toBeTruthy();
    expect(screen.getByText(/30.000/)).toBeTruthy(); // Verifica el precio
  });

  it('13. debe mostrar el detalle de una novedad específica', async () => {
    renderApp('/novedades/1');

    expect(await screen.findByRole('heading', { name: 'Nueva campaña de vacunación' })).toBeTruthy();
    expect(screen.getByText(/Durante todo el mes de mayo/i)).toBeTruthy();
  });

  it('14. el admin puede crear un nuevo servicio desde el panel', async () => {
    // 1. Iniciamos sesión como admin (el login es asíncrono, esperamos el link)
    renderApp('/login');
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'admin.admin@admin.admin' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'increibleclavesupersegura' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    fireEvent.click(await screen.findByRole('link', { name: 'Administración' }));
    fireEvent.click(screen.getByRole('link', { name: 'Gestionar Servicios' }));

    // 2. Llenamos el formulario de crear servicio
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Nuevo Servicio Test' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción de prueba' } });
    fireEvent.change(screen.getByLabelText('Precio ($)'), { target: { value: '15000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Servicio' }));

    // 3. Verificamos que aparezca en la tabla y que se guardó en la API
    expect(await screen.findByRole('cell', { name: 'Nuevo Servicio Test' })).toBeTruthy();
    expect(veterinaria.estado.servicios.some((servicio) => servicio.titulo === 'Nuevo Servicio Test')).toBe(true);
  });

  it('15. el admin puede editar y eliminar una novedad', async () => {
    // 1. Iniciamos sesión como admin y vamos a novedades desde el panel
    renderApp('/login');
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'admin.admin@admin.admin' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'increibleclavesupersegura' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    fireEvent.click(await screen.findByRole('link', { name: 'Administración' }));
    fireEvent.click(screen.getByRole('link', { name: 'Gestionar Novedades' }));

    // 2. Probamos EDITAR
    const filaNovedad = await screen.findByRole('row', { name: /Nueva campaña de vacunación/i });
    fireEvent.click(within(filaNovedad).getByRole('button', { name: 'Editar' }));

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Título Editado' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(await screen.findByRole('cell', { name: 'Título Editado' })).toBeTruthy();

    // 3. Probamos ELIMINAR
    // Mockeamos el window.confirm para que devuelva true automáticamente
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const filaEditada = screen.getByRole('row', { name: /Título Editado/i });
    fireEvent.click(within(filaEditada).getByRole('button', { name: 'Eliminar' }));

    // Verificamos que ya no esté en la tabla ni en la API
    await waitFor(() => expect(screen.queryByRole('cell', { name: 'Título Editado' })).toBeNull());
    expect(veterinaria.estado.novedades.some((novedad) => novedad.id === 1)).toBe(false);
    confirmar.mockRestore();
  });

   /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  Felipito pruebas (persona 3) - pruebas de login, registro, permisos y gestión de servicios

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  it('16. rechaza el inicio de sesión con credenciales incorrectas', async () => {
    renderApp('/login');

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'desconocido@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'incorrecta' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect((await screen.findByRole('alert')).textContent).toBe('Correo o contraseña incorrectos.');
    expect(screen.getByRole('heading', { name: 'Login' })).toBeTruthy();
    expect(localStorage.getItem('token_vet')).toBeNull();
  });

  it('17. rechaza el registro cuando las contraseñas no coinciden', () => {
    renderApp('/registro');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto1' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'secreto2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(screen.getByRole('alert').textContent).toBe('Las contraseñas no coinciden.');
    expect(backend.estado.usuarios.some((usuario) => usuario.correo === 'ana@example.com')).toBe(false);
    expect(localStorage.getItem('token_vet')).toBeNull();
  });

  it('18. redirige a la cuenta a los usuarios sin permisos de administrador', async () => {
    localStorage.setItem('token_vet', 'token-2');
    renderApp('/admin/servicios');

    expect(await screen.findByRole('heading', { name: 'Mi cuenta' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /panel de administración: servicios/i })).toBeNull();
  });

  it('19. permite al administrador editar un servicio existente', async () => {
    renderApp();
    await iniciarSesionComoAdmin();

    const filaServicio = await screen.findByRole('row', { name: /Esterilización de mascotas/i });
    fireEvent.click(within(filaServicio).getByRole('button', { name: 'Editar' }));
    fireEvent.change(screen.getByDisplayValue('Esterilización de mascotas'), {
      target: { value: 'Esterilización actualizada' },
    });
    fireEvent.change(screen.getByDisplayValue('30000'), { target: { value: '35000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar Servicio' }));

    expect(await screen.findByRole('cell', { name: 'Esterilización actualizada' })).toBeTruthy();
    expect(veterinaria.estado.servicios.find((servicio) => servicio.id === 1)?.precio).toBe(35000);
  });

  it('20. permite al administrador eliminar un servicio después de confirmar', async () => {
    renderApp();
    await iniciarSesionComoAdmin();

    const filaServicio = await screen.findByRole('row', { name: /Perruquería/i });
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(within(filaServicio).getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => expect(screen.queryByRole('row', { name: /Perruquería/i })).toBeNull());
    expect(veterinaria.estado.servicios.some((servicio) => servicio.id === 2)).toBe(false);
    confirmar.mockRestore();
  });

  it('25. muestra el error de la API si el admin no puede guardar un servicio', async () => {
    const original = veterinaria.crearServicio;
    veterinaria.crearServicio = async () => {
      throw { isAxiosError: true, response: { status: 403, data: {} } };
    };
    try {
      localStorage.setItem('token_vet', 'token-1');
      renderApp('/admin/servicios');

      fireEvent.change(await screen.findByLabelText('Título'), { target: { value: 'No se guarda' } });
      fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'x' } });
      fireEvent.change(screen.getByLabelText('Precio ($)'), { target: { value: '1000' } });
      fireEvent.click(screen.getByRole('button', { name: 'Guardar Servicio' }));

      expect(await screen.findByRole('alert')).toBeTruthy();
      expect(screen.queryByRole('cell', { name: 'No se guarda' })).toBeNull();
    } finally {
      veterinaria.crearServicio = original;
    }
  });

  it('21. mantiene la sesión al recargar la página si hay un token guardado', async () => {
    localStorage.setItem('token_vet', 'token-1');
    renderApp('/admin/servicios');

    expect(await screen.findByRole('heading', { name: /panel de administración: servicios/i })).toBeTruthy();
  });

  it('22. cierra la sesión si el token guardado ya no es válido', async () => {
    localStorage.setItem('token_vet', 'token-invalido');
    renderApp('/usuario');

    expect(await screen.findByRole('heading', { name: 'Login' })).toBeTruthy();
    expect(localStorage.getItem('token_vet')).toBeNull();
  });

  it('23. el admin ve los mensajes de contacto y los historiales en el panel general', async () => {
    localStorage.setItem('token_vet', 'token-1');
    renderApp('/admin');

    expect(await screen.findByRole('heading', { name: /panel de administración general/i })).toBeTruthy();
    expect(await screen.findByRole('cell', { name: 'ana@test.com' })).toBeTruthy();
    expect(screen.getByText(/precio de la esterilización/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /historiales médicos/i }));
    expect(await screen.findByRole('cell', { name: 'Firulais' })).toBeTruthy();
    expect(await screen.findByRole('cell', { name: 'María García' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /compras de usuarios/i }));
    expect(await screen.findByRole('cell', { name: '#15' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: 'Juguete interactivo × 2' })).toBeTruthy();
  });

  it('24. no permite entrar al panel general sin ser administrador', async () => {
    localStorage.setItem('token_vet', 'token-2');
    renderApp('/admin');

    expect(await screen.findByRole('link', { name: 'Mi cuenta' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /panel de administración general/i })).toBeNull();
  });
});
