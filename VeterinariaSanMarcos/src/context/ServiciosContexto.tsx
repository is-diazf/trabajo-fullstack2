// src/context/ServiciosContexto.tsx
import { createContext, useState, useEffect, useContext, useCallback, type ReactNode } from 'react';
import {
  actualizarServicio,
  borrarServicio,
  crearServicio,
  listarServicios,
  mensajeErrorVeterinaria,
  type DatosServicio,
  type Servicio,
} from '../servicios/veterinaria';

export type { Servicio };

export type Resultado = { correcto: true } | { correcto: false; mensaje: string };

interface ServiciosContextType {
  servicios: Servicio[];
  cargando: boolean;
  error: string;
  recargar: () => void;
  agregarServicio: (servicio: DatosServicio) => Promise<Resultado>;
  editarServicio: (id: number, servicioActualizado: DatosServicio) => Promise<Resultado>;
  eliminarServicio: (id: number) => Promise<Resultado>;
}

const ServiciosContext = createContext<ServiciosContextType | undefined>(undefined);

export function ServiciosProvider({ children }: { children: ReactNode }) {
  // Los servicios viven en Veterinaria-Service; aquí solo se guarda la última lista recibida.
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    listarServicios()
      .then((lista) => {
        if (!activo) return;
        setServicios(lista);
        setError('');
      })
      .catch((causa: unknown) => {
        if (activo) setError(mensajeErrorVeterinaria(causa));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [version]);

  const recargar = useCallback(() => {
    setCargando(true);
    setVersion((v) => v + 1);
  }, []);

  const agregarServicio = async (nuevoServicio: DatosServicio): Promise<Resultado> => {
    try {
      const creado = await crearServicio(nuevoServicio);
      setServicios((actuales) => [...actuales, creado]);
      return { correcto: true };
    } catch (causa) {
      return { correcto: false, mensaje: mensajeErrorVeterinaria(causa) };
    }
  };

  const editarServicio = async (id: number, servicioActualizado: DatosServicio): Promise<Resultado> => {
    try {
      const actualizado = await actualizarServicio(id, servicioActualizado);
      setServicios((actuales) => actuales.map((s) => (s.id === id ? actualizado : s)));
      return { correcto: true };
    } catch (causa) {
      return { correcto: false, mensaje: mensajeErrorVeterinaria(causa) };
    }
  };

  const eliminarServicio = async (id: number): Promise<Resultado> => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return { correcto: true };
    try {
      await borrarServicio(id);
      setServicios((actuales) => actuales.filter((s) => s.id !== id));
      return { correcto: true };
    } catch (causa) {
      return { correcto: false, mensaje: mensajeErrorVeterinaria(causa) };
    }
  };

  return (
    <ServiciosContext.Provider
      value={{ servicios, cargando, error, recargar, agregarServicio, editarServicio, eliminarServicio }}
    >
      {children}
    </ServiciosContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useServicios() {
  const context = useContext(ServiciosContext);
  if (!context) throw new Error('useServicios debe usarse dentro de un ServiciosProvider');
  return context;
}
