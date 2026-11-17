import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { novedadesData, type Novedad } from '../data/NovedadesData';

interface NovedadesContextType {
  novedades: Novedad[];
  agregarNovedad: (novedad: Omit<Novedad, 'id'>) => void;
  editarNovedad: (id: number, novedadActualizada: Omit<Novedad, 'id'>) => void;
  eliminarNovedad: (id: number) => void;
}

const NovedadesContext = createContext<NovedadesContextType | undefined>(undefined);

export function NovedadesProvider({ children }: { children: ReactNode }) {
  const [novedades, setNovedades] = useState<Novedad[]>(() => {
    const guardados = localStorage.getItem('novedades_vet');
    const datosParseados = guardados ? JSON.parse(guardados) : [];
    if (datosParseados.length > 0) {
      return datosParseados;
    }
    return novedadesData;
  });

  useEffect(() => {
    localStorage.setItem('novedades_vet', JSON.stringify(novedades));
  }, [novedades]);

  const agregarNovedad = (nueva: Omit<Novedad, 'id'>) => {
    setNovedades([...novedades, { ...nueva, id: Date.now() }]);
  };

  const editarNovedad = (id: number, actualizada: Omit<Novedad, 'id'>) => {
    setNovedades(novedades.map((n) => n.id === id ? { ...actualizada, id } : n));
  };

  const eliminarNovedad = (id: number) => {
    if (window.confirm('¿Eliminar esta novedad?')) {
      setNovedades(novedades.filter((n) => n.id !== id));
    }
  };

  return (
    <NovedadesContext.Provider value={{ novedades, agregarNovedad, editarNovedad, eliminarNovedad }}>
      {children}
    </NovedadesContext.Provider>
  );
}

export function useNovedades() {
  const context = useContext(NovedadesContext);
  if (!context) throw new Error('useNovedades debe usarse dentro de NovedadesProvider');
  return context;
}