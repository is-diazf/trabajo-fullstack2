import axios from 'axios';
import { CLAVE_TOKEN } from './api';

const IMAGEN_POR_DEFECTO = '/img/animalesFondo.png';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagen: string;
  stock: number;
}

export interface ItemCompra {
  productoId: number;
  cantidad: number;
}

export interface CompraRegistrada {
  id: number;
  usuarioId: number;
  creadaEn: string;
  total: number;
  items: {
    productoId: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
  }[];
}

interface ProductoApi {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  categoria: string | null;
  imagen: string | null;
}

const tienda = axios.create({
  baseURL: import.meta.env.VITE_SHOP_API_URL ?? 'http://localhost:8083/api',
});

// La tienda valida el mismo JWT que entrega Micro-Usuario.
tienda.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function aProducto(producto: ProductoApi): Producto {
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion ?? '',
    categoria: producto.categoria ?? 'General',
    precio: Number(producto.precio),
    imagen: producto.imagen || IMAGEN_POR_DEFECTO,
    stock: producto.stock,
  };
}

export async function listarProductos(): Promise<Producto[]> {
  const respuesta = await tienda.get<ProductoApi[]>('/productos');
  return respuesta.data.map(aProducto);
}

function aCompra(compra: CompraRegistrada): CompraRegistrada {
  return {
    ...compra,
    total: Number(compra.total),
    items: compra.items.map((item) => ({ ...item, precioUnitario: Number(item.precioUnitario) })),
  };
}

/** Registra la compra a nombre del usuario del token. */
export async function registrarCompra(items: ItemCompra[]): Promise<CompraRegistrada> {
  const respuesta = await tienda.post<CompraRegistrada>('/compras', { items });
  return aCompra(respuesta.data);
}

/** Compras de un usuario (el propio usuario o un admin). */
export async function listarComprasDeUsuario(usuarioId: number): Promise<CompraRegistrada[]> {
  const respuesta = await tienda.get<CompraRegistrada[]>(`/compras/usuario/${usuarioId}`);
  return respuesta.data.map(aCompra);
}

/** Todas las compras (solo admin). */
export async function listarCompras(): Promise<CompraRegistrada[]> {
  const respuesta = await tienda.get<CompraRegistrada[]>('/compras');
  return respuesta.data.map(aCompra);
}

export function mensajeErrorTienda(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'No se pudo conectar con la tienda. Inténtalo más tarde.';
    const datos: unknown = error.response.data;
    if (datos && typeof datos === 'object' && 'message' in datos && typeof datos.message === 'string') {
      return datos.message;
    }
  }
  return 'Ocurrió un error inesperado en la tienda. Inténtalo nuevamente.';
}

export default tienda;
