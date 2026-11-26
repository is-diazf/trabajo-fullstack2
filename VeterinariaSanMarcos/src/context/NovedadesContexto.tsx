import { createContext, useState, useEffect, useContext, useCallback, type ReactNode } from 'react';
import {
  actualizarNovedad,
  borrarNovedad,
  crearNovedad,
  listarNovedades,
  mensajeErrorVeterinaria,
  type DatosNovedad,
  type Novedad,
} from '../servicios/veterinaria';
import type { Resultado } from './ServiciosContexto';

export type { Novedad };

interface NovedadesContextType {
  novedades: Novedad[];
  cargando: boolean;
  error: string;
  recargar: () => void;
  agregarNovedad: (novedad: DatosNovedad) => Promise<Resultado>;
  editarNovedad: (id: number, novedadActualizada: DatosNovedad) => Promise<Resultado>;
  eliminarNovedad: (id: number) => Promise<Resultado>;
}

const NovedadesContext = createContext<NovedadesContextType | undefined>(undefined);

export function NovedadesProvider({ children }: { children: ReactNode }) {
  // Las novedades viven en Veterinaria-Service; aquí solo se guarda la última lista recibida.
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    listarNovedades()
      .then((lista) => {
        if (!activo) return;
        setNovedades(lista);
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

  const agregarNovedad = async (nueva: DatosNovedad): Promise<Resultado> => {
    try {
      const creada = await crearNovedad(nueva);
      setNovedades((actuales) => [...actuales, creada]);
      return { correcto: true };
    } catch (causa) {
      return { correcto: false, mensaje: mensajeErrorVeterinaria(causa) };
    }
  };

  const editarNovedad = async (id: number, actualizada: DatosNovedad): Promise<Resultado> => {
    try {
      const guardada = await actualizarNovedad(id, actualizada);
      setNovedades((actuales) => actuales.map((n) => (n.id === id ? guardada : n)));
      return { correcto: true };
    } catch (causa) {
      return { correcto: false, mensaje: mensajeErrorVeterinaria(causa) };
    }
  };

  const eliminarNovedad = async (id: number): Promise<Resultado> => {
    if (!window.confirm('¿Eliminar esta novedad?')) return { correcto: true };
    try {
      await borrarNovedad(id);
      setNovedades((actuales) => actuales.filter((n) => n.id !== id));
      return { correcto: true };
    } catch (causa) {
      return { correcto: false, mensaje: mensajeErrorVeterinaria(causa) };
    }
  };

  return (
    <NovedadesContext.Provider
      value={{ novedades, cargando, error, recargar, agregarNovedad, editarNovedad, eliminarNovedad }}
    >
      {children}
    </NovedadesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNovedades() {
  const context = useContext(NovedadesContext);
  if (!context) throw new Error('useNovedades debe usarse dentro de NovedadesProvider');
  return context;
}
