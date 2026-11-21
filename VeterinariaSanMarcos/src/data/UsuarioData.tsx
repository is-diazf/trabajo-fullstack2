export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  admin: boolean;
}

export type DatosUsuario = Usuario;
export type UsuarioAdministrable = Usuario;
