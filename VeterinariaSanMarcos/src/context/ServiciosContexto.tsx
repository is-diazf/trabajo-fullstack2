// src/context/ServiciosContexto.tsx
import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { serviciosData as datosIniciales } from '../data/ServiciosData';

interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

interface ServiciosContextType {
  servicios: Servicio[];
  agregarServicio: (servicio: Omit<Servicio, 'id'>) => void;
  editarServicio: (id: number, servicioActualizado: Omit<Servicio, 'id'>) => void;
  eliminarServicio: (id: number) => void;
}

const ServiciosContext = createContext<ServiciosContextType | undefined>(undefined);

export function ServiciosProvider({ children }: { children: ReactNode }) {
  const [servicios, setServicios] = useState<Servicio[]>(() => {
    const guardados = localStorage.getItem('servicios_vet');
    const datosParseados = guardados ? JSON.parse(guardados) : [];
    
    if (datosParseados.length > 0) {
      return datosParseados;
    }
    return datosIniciales;
  });

  // 2. Efecto: cada vez que el arreglo cambie, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('servicios_vet', JSON.stringify(servicios));
  }, [servicios]);

  // 3. Funciones CRUD
  const agregarServicio = (nuevoServicio: Omit<Servicio, 'id'>) => {
    const nuevoId = Date.now(); 
    setServicios([...servicios, { ...nuevoServicio, id: nuevoId }]);
  };

  const editarServicio = (id: number, servicioActualizado: Omit<Servicio, 'id'>) => {
    setServicios(servicios.map((s) => 
      s.id === id ? { ...servicioActualizado, id } : s
    ));
  };

  const eliminarServicio = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
      setServicios(servicios.filter((s) => s.id !== id));
    }
  };

  return (
    <ServiciosContext.Provider value={{ servicios, agregarServicio, editarServicio, eliminarServicio }}>
      {children}
    </ServiciosContext.Provider>
  );
}

export function useServicios() {
  const context = useContext(ServiciosContext);
  if (!context) throw new Error('useServicios debe usarse dentro de un ServiciosProvider');
  return context;
}