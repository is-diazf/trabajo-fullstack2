
export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  contrasena: string;
  admin: boolean;
}

export type DatosUsuario = Omit<Usuario, 'id' | 'contrasena'>;
export type UsuarioAdministrable = Omit<Usuario, 'contrasena'>;

export const usuariosData: Usuario[] = [
  { 
    id: '1',
    nombre: 'Administrador', 
    correo: 'admin.admin@admin.admin', 
    contrasena: 'increibleclavesupersegura',
    admin: true
  },
  {
    id: '2',
    nombre: 'María García', 
    correo: 'maria.garcia@example.com', 
    contrasena: 'password2',
    admin: false
  }
  
];
