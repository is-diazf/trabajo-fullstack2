export interface Novedad {
  id: number;
  titulo: string;
  resumen: string;
  detalle: string;
  imagen: string;
}

export const novedadesData: Novedad[] = [
  {
    id: 1,
    titulo: "Nueva campaña de vacunación",
    resumen: "Protege a tu mascota contra la rabia y otras enfermedades.",
    detalle: "Durante todo el mes de mayo, tendremos un 20% de descuento en la vacuna antirrábica y la vacuna séxtuple. ¡No dejes pasar esta oportunidad de cuidar a tu mejor amigo!",
    imagen: "/img/esterilizacion.jpeg"
  },
  {
    id: 2,
    titulo: "Horario extendido los sábados",
    resumen: "Ahora atendemos hasta las 18:00 hrs los fines de semana.",
    detalle: "Sabemos que la semana es agitada, por eso hemos extendido nuestro horario de atención los días sábados. Podrás traer a tu mascota a consulta o peluquería hasta las 18:00 hrs.",
    imagen: "/img/perruqueria.jpg"
  },
  {
    id: 3,
    titulo: "Llegaron los nuevos juguetes",
    resumen: "Visita nuestra tienda y encuentra lo mejor para tu mascota.",
    detalle: "Tenemos una nueva colección de juguetes interactivos y camas súper cómodas para perros y gatos. ¡Ven a conocerlos!",
    imagen: "/img/juguetes_mascotas.jpg"
  }
];