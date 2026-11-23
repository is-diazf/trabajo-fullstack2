import axios from 'axios';
import { CLAVE_TOKEN } from './api';
import { veterinariaApi } from './veterinaria';

const contactoApi = axios.create({
  baseURL: import.meta.env.VITE_CONTACTO_API_URL ?? 'http://localhost:8082/api',
});

// Micro-Contacto valida el JWT de Micro-Usuario (solo un admin puede leer los mensajes).
contactoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface MensajeContacto {
  id: number;
  nombreCompleto: string;
  correo: string;
  mensaje: string;
  estado: string;
  fechaCreacion: string;
}

export interface HistorialMedico {
  id: number;
  usuarioId: number | null;
  mascota: string | null;
  fecha: string | null;
  motivo: string | null;
  veterinario: string | null;
  estado: string | null;
}

export async function listarMensajesContacto(): Promise<MensajeContacto[]> {
  const respuesta = await contactoApi.get<MensajeContacto[]>('/contactos');
  return respuesta.data;
}

export async function listarHistoriales(): Promise<HistorialMedico[]> {
  const respuesta = await veterinariaApi.get<HistorialMedico[]>('/historiales');
  return respuesta.data;
}

export function mensajeErrorServicio(error: unknown, servicio: string): string {
  if (axios.isAxiosError(error) && !error.response) {
    return `No se pudo conectar con ${servicio}. Verifica que esté encendido.`;
  }
  return `Ocurrió un error al cargar los datos de ${servicio}.`;
}
