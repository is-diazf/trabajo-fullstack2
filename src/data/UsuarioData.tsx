
export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  contrasena: string;
}

export type DatosUsuario = Omit<Usuario, 'id' | 'contrasena'>;

export const usuariosData: Usuario[] = [];
