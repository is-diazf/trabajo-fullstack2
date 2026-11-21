import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSesion } from './SesionContexto';
import { productosData, type Producto } from '../data/ProductosData';

export interface ProductoEnCarrito extends Producto {
  cantidad: number;
}

export interface Compra {
  id: string;
  fecha: string;
  productos: ProductoEnCarrito[];
  total: number;
}

interface CarritoContextType {
  productos: Producto[];
  carrito: ProductoEnCarrito[];
  historial: Compra[];
  totalUnidades: number;
  totalCarrito: number;
  agregarAlCarrito: (producto: Producto) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  eliminarDelCarrito: (productoId: number) => void;
  vaciarCarrito: () => void;
  finalizarCompra: () => boolean;
}

const CLAVE_CARRITOS = 'carritos_vet';
const CLAVE_HISTORIAL = 'historial_compras_vet';
const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function esProductoEnCarrito(valor: unknown): valor is ProductoEnCarrito {
  if (!esRegistro(valor)) return false;
  return (
    typeof valor.id === 'number' &&
    typeof valor.nombre === 'string' &&
    typeof valor.descripcion === 'string' &&
    typeof valor.categoria === 'string' &&
    typeof valor.precio === 'number' &&
    typeof valor.imagen === 'string' &&
    typeof valor.cantidad === 'number' &&
    Number.isInteger(valor.cantidad) &&
    valor.cantidad > 0
  );
}

function leerMapa<T>(clave: string, validar: (valor: unknown) => valor is T): Record<string, T> {
  const guardado = localStorage.getItem(clave);
  if (!guardado) return {};

  const datos: unknown = JSON.parse(guardado);
  if (!esRegistro(datos)) {
    throw new Error(`Los datos guardados en "${clave}" no tienen un formato válido.`);
  }

  const resultado: Record<string, T> = {};
  for (const [idUsuario, valor] of Object.entries(datos)) {
    if (!validar(valor)) {
      throw new Error(`Los datos guardados en "${clave}" no tienen un formato válido.`);
    }
    resultado[idUsuario] = valor;
  }
  return resultado;
}

function esListaDeProductos(valor: unknown): valor is ProductoEnCarrito[] {
  return Array.isArray(valor) && valor.every(esProductoEnCarrito);
}

function esHistorial(valor: unknown): valor is Compra[] {
  return (
    Array.isArray(valor) &&
    valor.every(
      (compra) =>
        esRegistro(compra) &&
        typeof compra.id === 'string' &&
        typeof compra.fecha === 'string' &&
        typeof compra.total === 'number' &&
        esListaDeProductos(compra.productos),
    )
  );
}

export function CarritoProvider({ children }: { children: ReactNode }) {
  const { usuario } = useSesion();
  const [carritos, setCarritos] = useState<Record<string, ProductoEnCarrito[]>>(
    () => leerMapa(CLAVE_CARRITOS, esListaDeProductos),
  );
  const [historiales, setHistoriales] = useState<Record<string, Compra[]>>(
    () => leerMapa(CLAVE_HISTORIAL, esHistorial),
  );

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITOS, JSON.stringify(carritos));
  }, [carritos]);

  useEffect(() => {
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historiales));
  }, [historiales]);

  const carrito = usuario ? carritos[usuario.id] ?? [] : [];
  const historial = usuario ? historiales[usuario.id] ?? [] : [];

  const agregarAlCarrito = (producto: Producto) => {
    if (!usuario) return;
    setCarritos((actuales) => {
      const carritoActual = actuales[usuario.id] ?? [];
      const existente = carritoActual.find((item) => item.id === producto.id);
      return {
        ...actuales,
        [usuario.id]: existente
          ? carritoActual.map((item) =>
              item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
            )
          : [...carritoActual, { ...producto, cantidad: 1 }],
      };
    });
  };

  const cambiarCantidad = (productoId: number, cantidad: number) => {
    if (!usuario || !Number.isInteger(cantidad) || cantidad < 1) return;
    setCarritos((actuales) => ({
      ...actuales,
      [usuario.id]: (actuales[usuario.id] ?? []).map((item) =>
        item.id === productoId ? { ...item, cantidad } : item,
      ),
    }));
  };

  const eliminarDelCarrito = (productoId: number) => {
    if (!usuario) return;
    setCarritos((actuales) => ({
      ...actuales,
      [usuario.id]: (actuales[usuario.id] ?? []).filter((item) => item.id !== productoId),
    }));
  };

  const vaciarCarrito = () => {
    if (!usuario) return;
    setCarritos((actuales) => ({ ...actuales, [usuario.id]: [] }));
  };

  const finalizarCompra = () => {
    if (!usuario || carrito.length === 0) return false;
    const compra: Compra = {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      productos: carrito.map((item) => ({ ...item })),
      total: carrito.reduce((total, item) => total + item.precio * item.cantidad, 0),
    };
    setHistoriales((actuales) => ({
      ...actuales,
      [usuario.id]: [compra, ...(actuales[usuario.id] ?? [])],
    }));
    vaciarCarrito();
    return true;
  };

  return (
    <CarritoContext.Provider
      value={{
        productos: productosData,
        carrito,
        historial,
        totalUnidades: carrito.reduce((total, item) => total + item.cantidad, 0),
        totalCarrito: carrito.reduce((total, item) => total + item.precio * item.cantidad, 0),
        agregarAlCarrito,
        cambiarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        finalizarCompra,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  return context;
}
