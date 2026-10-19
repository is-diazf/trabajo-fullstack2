import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

afterEach(cleanup);

function renderApp(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
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
});
