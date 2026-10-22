import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usuariosData, type DatosUsuario, type Usuario, type UsuarioAdministrable } from '../data/UsuarioData';

type Resultado = { correcto: true; esAdmin?: boolean } | { correcto: false; mensaje: string };

interface SesionContextType {
  usuario: DatosUsuario | null;
  esAdmin: boolean;
  usuarios: UsuarioAdministrable[];
  registrarUsuario: (nombre: string, correo: string, contrasena: string) => Resultado;
  iniciarSesion: (correo: string, contrasena: string) => Resultado;
  cerrarSesion: () => void;
  actualizarUsuario: (nombre: string, correo: string) => Resultado;
  eliminarCuenta: () => Resultado;
  crearUsuarioAdmin: (nombre: string, correo: string, contrasena: string, admin: boolean) => Resultado;
  actualizarUsuarioAdmin: (
    id: string,
    nombre: string,
    correo: string,
    admin: boolean,
    contrasena?: string,
  ) => Resultado;
  eliminarUsuarioAdmin: (id: string) => Resultado;
}

const CLAVE_USUARIOS = 'usuarios_vet';
const CLAVE_SESION = 'sesion_vet';
const SesionContext = createContext<SesionContextType | undefined>(undefined);

function leerUsuarios(): Usuario[] {
  const guardados = localStorage.getItem(CLAVE_USUARIOS);
  if (!guardados) return usuariosData;

  const usuarios: unknown = JSON.parse(guardados);
  if (!Array.isArray(usuarios)) {
    throw new Error('Los datos de usuarios guardados no tienen un formato válido.');
  }

  const usuariosValidos = usuarios.map((usuario): Usuario => {
    if (
      typeof usuario !== 'object' ||
      usuario === null ||
      !('id' in usuario) ||
      typeof usuario.id !== 'string' ||
      !('nombre' in usuario) ||
      typeof usuario.nombre !== 'string' ||
      !('correo' in usuario) ||
      typeof usuario.correo !== 'string' ||
      !('contrasena' in usuario) ||
      typeof usuario.contrasena !== 'string' ||
      ('admin' in usuario && typeof usuario.admin !== 'boolean')
    ) {
      throw new Error('Los datos de usuarios guardados no tienen un formato válido.');
    }
    return { ...usuario, admin: 'admin' in usuario ? usuario.admin : false };
  });

  const adminInicial = usuariosData.find((usuario) => usuario.admin);
  if (adminInicial && !usuariosValidos.some((usuario) => usuario.correo === adminInicial.correo)) {
    usuariosValidos.push(adminInicial);
  }
  return usuariosValidos;
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>(leerUsuarios);
  const [idSesion, setIdSesion] = useState<string | null>(() => localStorage.getItem(CLAVE_SESION));
  const usuarioActual = usuarios.find((usuario) => usuario.id === idSesion);

  useEffect(() => {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    if (idSesion) {
      localStorage.setItem(CLAVE_SESION, idSesion);
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  }, [idSesion]);

  const registrarUsuario: SesionContextType['registrarUsuario'] = (nombre, correo, contrasena) => {
    const correoNormalizado = correo.trim().toLowerCase();
    if (usuarios.some((usuario) => usuario.correo === correoNormalizado)) {
      return { correcto: false, mensaje: 'Ya existe una cuenta con ese correo.' };
    }

    const nuevoUsuario: Usuario = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      correo: correoNormalizado,
      contrasena,
      admin: false,
    };
    setUsuarios((actuales) => [...actuales, nuevoUsuario]);
    setIdSesion(nuevoUsuario.id);
    return { correcto: true };
  };

  const iniciarSesion: SesionContextType['iniciarSesion'] = (correo, contrasena) => {
    const usuario = usuarios.find(
      (candidato) =>
        candidato.correo === correo.trim().toLowerCase() &&
        candidato.contrasena === contrasena,
    );
    if (!usuario) {
      return { correcto: false, mensaje: 'Correo o contraseña incorrectos.' };
    }

    setIdSesion(usuario.id);
    return { correcto: true, esAdmin: usuario.admin };
  };

  const cerrarSesion = () => setIdSesion(null);

  const actualizarUsuario: SesionContextType['actualizarUsuario'] = (nombre, correo) => {
    if (!usuarioActual) return { correcto: false, mensaje: 'No hay una sesión iniciada.' };

    const correoNormalizado = correo.trim().toLowerCase();
    if (
      usuarios.some(
        (usuario) => usuario.id !== usuarioActual.id && usuario.correo === correoNormalizado,
      )
    ) {
      return { correcto: false, mensaje: 'Ese correo ya está asociado a otra cuenta.' };
    }

    setUsuarios((actuales) =>
      actuales.map((usuario) =>
        usuario.id === usuarioActual.id
          ? { ...usuario, nombre: nombre.trim(), correo: correoNormalizado }
          : usuario,
      ),
    );
    return { correcto: true };
  };

  const eliminarCuenta: SesionContextType['eliminarCuenta'] = () => {
    if (!usuarioActual) return { correcto: false, mensaje: 'No hay una sesión iniciada.' };
    if (usuarioActual.admin && usuarios.filter((usuario) => usuario.admin).length === 1) {
      return { correcto: false, mensaje: 'No puedes eliminar la única cuenta administradora.' };
    }
    setUsuarios((actuales) => actuales.filter((usuario) => usuario.id !== usuarioActual.id));
    setIdSesion(null);
    return { correcto: true };
  };

  const crearUsuarioAdmin: SesionContextType['crearUsuarioAdmin'] = (
    nombre,
    correo,
    contrasena,
    admin,
  ) => {
    if (!usuarioActual?.admin) return { correcto: false, mensaje: 'Se requiere una cuenta administradora.' };
    const correoNormalizado = correo.trim().toLowerCase();
    if (usuarios.some((usuario) => usuario.correo === correoNormalizado)) {
      return { correcto: false, mensaje: 'Ya existe una cuenta con ese correo.' };
    }
    setUsuarios((actuales) => [
      ...actuales,
      {
        id: crypto.randomUUID(),
        nombre: nombre.trim(),
        correo: correoNormalizado,
        contrasena,
        admin,
      },
    ]);
    return { correcto: true };
  };

  const actualizarUsuarioAdmin: SesionContextType['actualizarUsuarioAdmin'] = (
    id,
    nombre,
    correo,
    admin,
    contrasena,
  ) => {
    if (!usuarioActual?.admin) return { correcto: false, mensaje: 'Se requiere una cuenta administradora.' };
    const usuarioEditado = usuarios.find((usuario) => usuario.id === id);
    if (!usuarioEditado) return { correcto: false, mensaje: 'No se encontró la cuenta seleccionada.' };
    const correoNormalizado = correo.trim().toLowerCase();
    if (
      usuarios.some(
        (usuario) => usuario.id !== id && usuario.correo === correoNormalizado,
      )
    ) {
      return { correcto: false, mensaje: 'Ese correo ya está asociado a otra cuenta.' };
    }
    if (
      usuarioEditado.admin &&
      !admin &&
      usuarios.filter((usuario) => usuario.admin).length === 1
    ) {
      return { correcto: false, mensaje: 'Debe quedar al menos una cuenta administradora.' };
    }

    setUsuarios((actuales) =>
      actuales.map((usuario) =>
        usuario.id === id
          ? {
              ...usuario,
              nombre: nombre.trim(),
              correo: correoNormalizado,
              admin,
              ...(contrasena ? { contrasena } : {}),
            }
          : usuario,
      ),
    );
    return { correcto: true };
  };

  const eliminarUsuarioAdmin: SesionContextType['eliminarUsuarioAdmin'] = (id) => {
    if (!usuarioActual?.admin) return { correcto: false, mensaje: 'Se requiere una cuenta administradora.' };
    if (id === usuarioActual.id) {
      return { correcto: false, mensaje: 'No puedes eliminar tu propia cuenta desde esta pantalla.' };
    }
    const usuarioEliminado = usuarios.find((usuario) => usuario.id === id);
    if (!usuarioEliminado) return { correcto: false, mensaje: 'No se encontró la cuenta seleccionada.' };
    if (
      usuarioEliminado.admin &&
      usuarios.filter((usuario) => usuario.admin).length === 1
    ) {
      return { correcto: false, mensaje: 'Debe quedar al menos una cuenta administradora.' };
    }
    setUsuarios((actuales) => actuales.filter((usuario) => usuario.id !== id));
    return { correcto: true };
  };

  return (
    <SesionContext.Provider
      value={{
        usuario: usuarioActual
          ? { nombre: usuarioActual.nombre, correo: usuarioActual.correo, admin: usuarioActual.admin }
          : null,
        esAdmin: usuarioActual?.admin ?? false,
        usuarios: usuarios.map((usuario) => ({
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          admin: usuario.admin,
        })),
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
        actualizarUsuario,
        eliminarCuenta,
        crearUsuarioAdmin,
        actualizarUsuarioAdmin,
        eliminarUsuarioAdmin,
      }}
    >
      {children}
    </SesionContext.Provider>
  );
}

// Context hooks are intentionally exported alongside their provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useSesion() {
  const context = useContext(SesionContext);
  if (!context) throw new Error('useSesion debe usarse dentro de un SesionProvider');
  return context;
}