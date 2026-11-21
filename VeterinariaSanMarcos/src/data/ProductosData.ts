export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagen: string;
}

export const productosData: Producto[] = [
  {
    id: 1,
    nombre: 'Juguete interactivo',
    descripcion: 'Un juguete resistente para mantener a tu mascota activa y entretenida.',
    categoria: 'Juguetes',
    precio: 8990,
    imagen: '/img/juguetes_mascotas.jpg',
  },
  {
    id: 2,
    nombre: 'Cama para mascotas',
    descripcion: 'Un espacio cómodo y acogedor para que tu compañero descanse.',
    categoria: 'Accesorios',
    precio: 24990,
    imagen: '/img/animalesFondo.png',
  },
  {
    id: 3,
    nombre: 'Shampoo para mascotas',
    descripcion: 'Fórmula suave para acompañar el baño y cuidado del pelaje.',
    categoria: 'Cuidado',
    precio: 6990,
    imagen: '/img/perruqueria.jpg',
  },
  {
    id: 4,
    nombre: 'Kit de cuidado y bienestar',
    descripcion: 'Artículos seleccionados para consentir y cuidar a tu mascota.',
    categoria: 'Cuidado',
    precio: 12990,
    imagen: '/img/esterilizacion.jpeg',
  },
];
