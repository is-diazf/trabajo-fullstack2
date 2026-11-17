// src/data/serviciosData.tsx  (¡Ojo aquí, ahora es .tsx!)
export interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export const serviciosData: Servicio[] = [
  {
    id: 1,
    titulo: "Esterilización de mascotas",
    descripcion: "Servicio de esterilización para mascotas, incluye anestesia y recuperación",
    precio: 30000,
    imagen: "/img/esterilizacion.jpeg" 
  },
  {
    id: 2,
    titulo: "Perruquería",
    descripcion: "Peluquería de mascotas, corte y baño",
    precio: 25000,
    imagen: "/img/perruqueria.jpg" 
  }
];

export default serviciosData;