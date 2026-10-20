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
  // 1. Estado: intenta leer del localStorage, si no hay, usa los datos iniciales
  const [servicios, setServicios] = useState<Servicio[]>(() => {
    const guardados = localStorage.getItem('servicios_vet');
    return guardados ? JSON.parse(guardados) : datosIniciales;
  });

  // 2. Efecto: cada vez que el arreglo cambie, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('servicios_vet', JSON.stringify(servicios));
  }, [servicios]);

  // 3. Funciones CRUD
  const agregarServicio = (nuevoServicio: Omit<Servicio, 'id'>) => {
    // Generamos un ID único basado en la fecha actual
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

// Hook personalizado para usar el contexto más fácil
export function useServicios() {
  const context = useContext(ServiciosContext);
  if (!context) throw new Error('useServicios debe usarse dentro de un ServiciosProvider');
  return context;
}