import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSesion } from './SesionContexto';
import {
  listarComprasDeUsuario,
  listarProductos,
  mensajeErrorTienda,
  registrarCompra,
  type CompraRegistrada,
  type Producto,
} from '../servicios/tienda';

export type { Producto };

export interface ProductoEnCarrito extends Omit<Producto, 'stock'> {
  cantidad: number;
}

export type ResultadoCompra = { correcto: true } | { correcto: false; mensaje: string };

export interface Compra {
  id: string;
  fecha: string;
  productos: ProductoEnCarrito[];
  total: number;
}

interface CarritoContextType {
  productos: Producto[];
  cargandoProductos: boolean;
  errorProductos: string;
  recargarProductos: () => Promise<void>;
  carrito: ProductoEnCarrito[];
  historial: Compra[];
  totalUnidades: number;
  totalCarrito: number;
  agregarAlCarrito: (producto: Producto) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  eliminarDelCarrito: (productoId: number) => void;
  vaciarCarrito: () => void;
  finalizarCompra: () => Promise<ResultadoCompra>;
}

const CLAVE_CARRITOS = 'carritos_vet';
const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

function aItemDeCarrito(producto: Producto, cantidad: number): ProductoEnCarrito {
  const { id, nombre, descripcion, categoria, precio, imagen } = producto;
  return { id, nombre, descripcion, categoria, precio, imagen, cantidad };
}

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

// Las compras vienen de la tienda; categoría e imagen se completan con el catálogo actual.
function aCompra(registrada: CompraRegistrada, productos: Producto[]): Compra {
  return {
    id: String(registrada.id),
    fecha: registrada.creadaEn,
    total: registrada.total,
    productos: registrada.items.map((item) => {
      const producto = productos.find((candidato) => candidato.id === item.productoId);
      return {
        id: item.productoId,
        nombre: item.nombreProducto,
        descripcion: producto?.descripcion ?? '',
        categoria: producto?.categoria ?? 'General',
        imagen: producto?.imagen ?? '',
        precio: item.precioUnitario,
        cantidad: item.cantidad,
      };
    }),
  };
}

export function CarritoProvider({ children }: { children: ReactNode }) {
  const { usuario } = useSesion();
  const [carritos, setCarritos] = useState<Record<string, ProductoEnCarrito[]>>(
    () => leerMapa(CLAVE_CARRITOS, esListaDeProductos),
  );
  // Compras registradas en la tienda, por id de usuario.
  const [compras, setCompras] = useState<Record<string, CompraRegistrada[]>>({});

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITOS, JSON.stringify(carritos));
  }, [carritos]);

  const usuarioId = usuario?.id;
  useEffect(() => {
    if (usuarioId === undefined) return;
    let activo = true;
    listarComprasDeUsuario(usuarioId)
      .then((lista) => {
        if (activo) setCompras((actuales) => ({ ...actuales, [usuarioId]: lista }));
      })
      .catch(() => {
        // Sin conexión con la tienda el historial queda vacío; el carrito sigue funcionando.
      });
    return () => {
      activo = false;
    };
  }, [usuarioId]);

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState('');

  const recargarProductos = useCallback(async () => {
    setCargandoProductos(true);
    try {
      setProductos(await listarProductos());
      setErrorProductos('');
    } catch (error) {
      setErrorProductos(mensajeErrorTienda(error));
    } finally {
      setCargandoProductos(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    listarProductos()
      .then((lista) => {
        if (!activo) return;
        setProductos(lista);
        setErrorProductos('');
      })
      .catch((error: unknown) => {
        if (activo) setErrorProductos(mensajeErrorTienda(error));
      })
      .finally(() => {
        if (activo) setCargandoProductos(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  const buscarProducto = (productoId: number) => productos.find((producto) => producto.id === productoId);

  // Los datos del catálogo (precio, nombre, imagen) mandan sobre lo guardado en el navegador.
  const carrito = (usuario ? carritos[usuario.id] ?? [] : []).map((item) => {
    const producto = buscarProducto(item.id);
    return producto ? aItemDeCarrito(producto, item.cantidad) : item;
  });
  const historial = (usuario ? compras[usuario.id] ?? [] : []).map((compra) => aCompra(compra, productos));

  const limitarAlStock = (productoId: number, cantidad: number) => {
    const producto = buscarProducto(productoId);
    return producto ? Math.min(cantidad, producto.stock) : cantidad;
  };

  const agregarAlCarrito = (producto: Producto) => {
    if (!usuario || producto.stock < 1) return;
    setCarritos((actuales) => {
      const carritoActual = actuales[usuario.id] ?? [];
      const existente = carritoActual.find((item) => item.id === producto.id);
      return {
        ...actuales,
        [usuario.id]: existente
          ? carritoActual.map((item) =>
              item.id === producto.id
                ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
                : item,
            )
          : [...carritoActual, aItemDeCarrito(producto, 1)],
      };
    });
  };

  const cambiarCantidad = (productoId: number, cantidad: number) => {
    if (!usuario || !Number.isInteger(cantidad) || cantidad < 1) return;
    const permitida = limitarAlStock(productoId, cantidad);
    if (permitida < 1) return;
    setCarritos((actuales) => ({
      ...actuales,
      [usuario.id]: (actuales[usuario.id] ?? []).map((item) =>
        item.id === productoId ? { ...item, cantidad: permitida } : item,
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

  const finalizarCompra = async (): Promise<ResultadoCompra> => {
    if (!usuario) return { correcto: false, mensaje: 'Inicia sesión para comprar.' };
    if (carrito.length === 0) return { correcto: false, mensaje: 'Tu carrito está vacío.' };

    try {
      const registrada = await registrarCompra(
        carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
      );
      setCompras((actuales) => ({
        ...actuales,
        [usuario.id]: [registrada, ...(actuales[usuario.id] ?? [])],
      }));
      vaciarCarrito();
      void recargarProductos();
      return { correcto: true };
    } catch (error) {
      void recargarProductos();
      return { correcto: false, mensaje: mensajeErrorTienda(error) };
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        productos,
        cargandoProductos,
        errorProductos,
        recargarProductos,
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
