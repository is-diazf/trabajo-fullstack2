import axios from 'axios';
import { CLAVE_TOKEN } from './api';

/** Cliente de Veterinaria-Service: servicios, novedades e historiales médicos. */
export const veterinariaApi = axios.create({
  baseURL: import.meta.env.VITE_VETERINARIA_API_URL ?? 'http://localhost:8084/api',
});

// Valida el JWT de Micro-Usuario: leer es público, modificar requiere ser admin.
veterinariaApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export interface Novedad {
  id: number;
  titulo: string;
  resumen: string;
  detalle: string;
  imagen: string;
}

export type DatosServicio = Omit<Servicio, 'id'>;
export type DatosNovedad = Omit<Novedad, 'id'>;

export async function listarServicios(): Promise<Servicio[]> {
  return (await veterinariaApi.get<Servicio[]>('/servicios')).data;
}

export async function crearServicio(datos: DatosServicio): Promise<Servicio> {
  return (await veterinariaApi.post<Servicio>('/servicios', datos)).data;
}

export async function actualizarServicio(id: number, datos: DatosServicio): Promise<Servicio> {
  return (await veterinariaApi.put<Servicio>(`/servicios/${id}`, datos)).data;
}

export async function borrarServicio(id: number): Promise<void> {
  await veterinariaApi.delete(`/servicios/${id}`);
}

export async function listarNovedades(): Promise<Novedad[]> {
  return (await veterinariaApi.get<Novedad[]>('/novedades')).data;
}

export async function crearNovedad(datos: DatosNovedad): Promise<Novedad> {
  return (await veterinariaApi.post<Novedad>('/novedades', datos)).data;
}

export async function actualizarNovedad(id: number, datos: DatosNovedad): Promise<Novedad> {
  return (await veterinariaApi.put<Novedad>(`/novedades/${id}`, datos)).data;
}

export async function borrarNovedad(id: number): Promise<void> {
  await veterinariaApi.delete(`/novedades/${id}`);
}

export function mensajeErrorVeterinaria(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'No se pudo conectar con el servicio de veterinaria. Inténtalo más tarde.';
    if (error.response.status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    if (error.response.status === 403) return 'Necesitas una cuenta de administrador para hacer esto.';
  }
  return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}
