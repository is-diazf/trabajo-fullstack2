import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { SesionProvider } from '../context/SesionContexto';
import { ServiciosProvider } from '../context/ServiciosContexto';

afterEach(cleanup);
beforeEach(() => localStorage.clear());

function renderApp(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ServiciosProvider>
        <SesionProvider>
          <App />
        </SesionProvider>
      </ServiciosProvider>
    </MemoryRouter>,
  );
}

describe('páginas públicas', () => {
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
});
