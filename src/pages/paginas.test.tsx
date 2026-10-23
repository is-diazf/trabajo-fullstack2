import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { SesionProvider } from '../context/SesionContexto';
import { ServiciosProvider } from '../context/ServiciosContexto';
import { NovedadesProvider } from '../context/NovedadesContexto';

afterEach(cleanup);
beforeEach(() => localStorage.clear());

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
  it('muestra las novedades iniciales aunque el navegador guardara una lista vacía', () => {
    localStorage.setItem('novedades_vet', '[]');
    renderApp('/novedades');

    expect(screen.getByRole('heading', { name: 'Novedades' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Nueva campaña de vacunación' })).toBeTruthy();
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

  it('abre y cierra el formulario de agenda desde el navbar', () => {
    renderApp();

    expect(screen.queryByRole('button', { name: 'Agendar hora' })).toBeNull();
    iniciarSesionComoAdmin();
    fireEvent.click(screen.getByRole('button', { name: 'Agendar hora' }));
    expect(screen.getByRole('dialog', { name: 'Agendar una hora' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('valida y confirma el formulario de agenda', () => {
    renderApp();

    iniciarSesionComoAdmin();
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

  function iniciarSesionComoAdmin() {
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar sesión' }));
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'admin.admin@admin.admin' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'increibleclavesupersegura' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
  }

  it('muestra los errores de validación del formulario de contacto', () => {
    renderApp('/contacto');

    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect(screen.getByText('Ingresa tu nombre.')).toBeTruthy();
    expect(screen.getByText('Ingresa tu correo electrónico.')).toBeTruthy();
    expect(screen.getByText('Escribe tu mensaje.')).toBeTruthy();
  });

  it('mantiene los campos controlados y confirma un envío válido', () => {
    renderApp('/contacto');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Necesito una consulta.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect((screen.getByLabelText('Nombre') as HTMLInputElement).value).toBe('Ana Pérez');
    expect(screen.getByRole('status').textContent).toMatch(/tu consulta está lista/i);
  });

  it('permite registrarse, ver y actualizar los datos de la cuenta', () => {
    renderApp('/registro');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto1' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'secreto1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(screen.getByRole('heading', { name: 'Mi cuenta' })).toBeTruthy();
    expect((screen.getByLabelText('Nombre') as HTMLInputElement).value).toBe('Ana Pérez');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Díaz' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(screen.getByRole('status').textContent).toMatch(/actualizaron correctamente/i);
    const usuarios = JSON.parse(localStorage.getItem('usuarios_vet') ?? '[]');
    expect(usuarios.find((usuario: { correo: string }) => usuario.correo === 'ana@example.com').nombre).toBe('Ana Díaz');
  });

  it('permite cerrar sesión e iniciar sesión con la cuenta registrada', () => {
    renderApp('/registro');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto1' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'secreto1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Cerrar sesión' })[0]);
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar sesión' }));

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(screen.getByRole('heading', { name: 'Mi cuenta' })).toBeTruthy();
  });

  it('redirige al administrador a su panel y permite gestionar cuentas', () => {
    renderApp('/login');

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: 'admin.admin@admin.admin' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'increibleclavesupersegura' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(screen.getByRole('heading', { name: /panel de administración: servicios/i })).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Administrar usuarios' }));
    expect(screen.getByRole('heading', { name: /panel de administración: usuarios/i })).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Cliente Nuevo' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'cliente@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    const filaCuenta = screen.getByRole('row', { name: /cliente nuevo cliente@example.com usuario/i });
    expect(filaCuenta).toBeTruthy();
    const cuentaCreada = JSON.parse(localStorage.getItem('usuarios_vet') ?? '[]')
      .find((usuario: { correo: string }) => usuario.correo === 'cliente@example.com');
    expect(cuentaCreada.admin).toBe(false);

    fireEvent.click(within(filaCuenta).getByRole('button', { name: 'Editar' }));
    fireEvent.click(screen.getByLabelText('Conceder permisos de administrador'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    const cuentaActualizada = JSON.parse(localStorage.getItem('usuarios_vet') ?? '[]')
      .find((usuario: { correo: string }) => usuario.correo === 'cliente@example.com');
    expect(cuentaActualizada.admin).toBe(true);
  });

  it('no permite entrar al panel administrativo sin iniciar sesión', () => {
    renderApp('/admin/servicios');

    expect(screen.getByRole('heading', { name: 'Login' })).toBeTruthy();
  });
    // ==========================================
  // PRUEBAS DE ISRAEL (PERSONA 2)
  // ==========================================

  it('11. debe mostrar el listado de servicios y permitir filtrarlos', () => {
    renderApp('/servicios');

    // Verificamos que los servicios iniciales estén
    expect(screen.getByRole('heading', { name: 'Esterilización de mascotas' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Perruquería' })).toBeTruthy();

    // Usamos el buscador
    const buscador = screen.getByPlaceholderText(/Buscar servicio/i);
    fireEvent.change(buscador, { target: { value: 'baño' } });

    // La perruquería se queda, la esterilización desaparece
    expect(screen.getByRole('heading', { name: 'Perruquería' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Esterilización de mascotas' })).toBeNull();
  });

  it('12. debe mostrar el detalle de un servicio específico', () => {
    renderApp('/servicios/1');

    expect(screen.getByRole('heading', { name: 'Esterilización de mascotas' })).toBeTruthy();
    expect(screen.getByText(/incluye anestesia y recuperación/i)).toBeTruthy();
    expect(screen.getByText(/30.000/)).toBeTruthy(); // Verifica el precio
  });

  it('13. debe mostrar el detalle de una novedad específica', () => {
    renderApp('/novedades/1');

    expect(screen.getByRole('heading', { name: 'Nueva campaña de vacunación' })).toBeTruthy();
    expect(screen.getByText(/Durante todo el mes de mayo/i)).toBeTruthy();
  });

  it('14. el admin puede crear un nuevo servicio desde el panel', () => {
    // 1. Iniciamos sesión como admin
    renderApp('/login');
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'admin.admin@admin.admin' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'increibleclavesupersegura' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    // 2. Llenamos el formulario de crear servicio
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Nuevo Servicio Test' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción de prueba' } });
    fireEvent.change(screen.getByLabelText('Precio ($)'), { target: { value: '15000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Servicio' }));

    // 3. Verificamos que aparezca en la tabla
    expect(screen.getByRole('cell', { name: 'Nuevo Servicio Test' })).toBeTruthy();
  });

  it('15. el admin puede editar y eliminar una novedad', () => {
    // 1. Iniciamos sesión como admin y vamos a novedades
    renderApp('/login');
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'admin.admin@admin.admin' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'increibleclavesupersegura' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    
    // Navegamos a la gestión de novedades (asumiendo que el link está ahí)
    fireEvent.click(screen.getByRole('link', { name: 'Administrar novedades' })); 

    // 2. Probamos EDITAR
    const filaNovedad = screen.getByRole('row', { name: /Nueva campaña de vacunación/i });
    fireEvent.click(within(filaNovedad).getByRole('button', { name: 'Editar' }));
    
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Título Editado' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(screen.getByRole('cell', { name: 'Título Editado' })).toBeTruthy();

    // 3. Probamos ELIMINAR
    // Mockeamos el window.confirm para que devuelva true automáticamente
    window.confirm = () => true;
    const filaEditada = screen.getByRole('row', { name: /Título Editado/i });
    fireEvent.click(within(filaEditada).getByRole('button', { name: 'Eliminar' }));

    // Verificamos que ya no esté en la tabla
    expect(screen.queryByRole('cell', { name: 'Título Editado' })).toBeNull();
  });
});
