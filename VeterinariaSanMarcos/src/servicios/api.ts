import axios from 'axios';

export const CLAVE_TOKEN = 'token_vet';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Inténtalo más tarde.';
    }
    const datos: unknown = error.response.data;
    if (datos && typeof datos === 'object') {
      if ('error' in datos && typeof datos.error === 'string') return datos.error;
      const primerMensaje = Object.values(datos).find((valor) => typeof valor === 'string');
      if (primerMensaje) return primerMensaje;
    }
  }
  return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}

export default api;
