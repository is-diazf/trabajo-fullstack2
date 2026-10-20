import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usuariosData, type DatosUsuario, type Usuario } from '../data/UsuarioData';

type Resultado = { correcto: true } | { correcto: false; mensaje: string };

interface SesionContextType {
  usuario: DatosUsuario | null;
  registrarUsuario: (nombre: string, correo: string, contrasena: string) => Resultado;
  iniciarSesion: (correo: string, contrasena: string) => Resultado;
  cerrarSesion: () => void;
  actualizarUsuario: (nombre: string, correo: string) => Resultado;
  eliminarCuenta: () => void;
}

const CLAVE_USUARIOS = 'usuarios_vet';
const CLAVE_SESION = 'sesion_vet';
const SesionContext = createContext<SesionContextType | undefined>(undefined);

function leerUsuarios(): Usuario[] {
  const guardados = localStorage.getItem(CLAVE_USUARIOS);
  if (!guardados) return usuariosData;

  const usuarios: unknown = JSON.parse(guardados);
  if (
    !Array.isArray(usuarios) ||
    !usuarios.every(
      (usuario): usuario is Usuario =>
        typeof usuario === 'object' &&
        usuario !== null &&
        'id' in usuario &&
        typeof usuario.id === 'string' &&
        'nombre' in usuario &&
        typeof usuario.nombre === 'string' &&
        'correo' in usuario &&
        typeof usuario.correo === 'string' &&
        'contrasena' in usuario &&
        typeof usuario.contrasena === 'string',
    )
  ) {
    throw new Error('Los datos de usuarios guardados no tienen un formato válido.');
  }
  return usuarios;
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
    return { correcto: true };
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

  const eliminarCuenta = () => {
    if (!usuarioActual) return;
    setUsuarios((actuales) => actuales.filter((usuario) => usuario.id !== usuarioActual.id));
    setIdSesion(null);
  };

  return (
    <SesionContext.Provider
      value={{
        usuario: usuarioActual
          ? { nombre: usuarioActual.nombre, correo: usuarioActual.correo }
          : null,
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
        actualizarUsuario,
        eliminarCuenta,
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