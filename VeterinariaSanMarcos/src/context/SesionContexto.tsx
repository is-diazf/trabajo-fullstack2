import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';
import api, { CLAVE_TOKEN, obtenerMensajeError } from '../servicios/api';
import type { DatosUsuario, UsuarioAdministrable } from '../data/UsuarioData';

type Resultado = { correcto: true; esAdmin?: boolean } | { correcto: false; mensaje: string };

type RespuestaSesion = { token: string; usuario: DatosUsuario };

interface SesionContextType {
  usuario: DatosUsuario | null;
  esAdmin: boolean;
  cargando: boolean;
  usuarios: UsuarioAdministrable[];
  registrarUsuario: (nombre: string, correo: string, contrasena: string) => Promise<Resultado>;
  iniciarSesion: (correo: string, contrasena: string) => Promise<Resultado>;
  cerrarSesion: () => void;
  actualizarUsuario: (nombre: string, correo: string) => Promise<Resultado>;
  eliminarCuenta: () => Promise<Resultado>;
  crearUsuarioAdmin: (nombre: string, correo: string, contrasena: string, admin: boolean) => Promise<Resultado>;
  actualizarUsuarioAdmin: (
    id: number,
    nombre: string,
    correo: string,
    admin: boolean,
    contrasena?: string,
  ) => Promise<Resultado>;
  eliminarUsuarioAdmin: (id: number) => Promise<Resultado>;
}

const SesionContext = createContext<SesionContextType | undefined>(undefined);

async function intentar(accion: () => Promise<Resultado>): Promise<Resultado> {
  try {
    return await accion();
  } catch (error) {
    return { correcto: false, mensaje: obtenerMensajeError(error) };
  }
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<DatosUsuario | null>(null);
  const [cargando, setCargando] = useState(() => localStorage.getItem(CLAVE_TOKEN) !== null);
  const [usuariosCargados, setUsuariosCargados] = useState<UsuarioAdministrable[]>([]);
  const esAdmin = usuario?.admin ?? false;

  useEffect(() => {
    const interceptor = api.interceptors.response.use(undefined, (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401 && localStorage.getItem(CLAVE_TOKEN)) {
        localStorage.removeItem(CLAVE_TOKEN);
        setUsuario(null);
      }
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(CLAVE_TOKEN)) return;
    api.get<DatosUsuario>('/auth/perfil')
      .then((respuesta) => setUsuario(respuesta.data))
      .catch(() => localStorage.removeItem(CLAVE_TOKEN))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    if (!esAdmin) return;
    api.get<UsuarioAdministrable[]>('/usuarios')
      .then((respuesta) => setUsuariosCargados(respuesta.data))
      .catch(() => setUsuariosCargados([]));
  }, [esAdmin]);

  const guardarSesion = (datos: RespuestaSesion) => {
    localStorage.setItem(CLAVE_TOKEN, datos.token);
    setUsuario(datos.usuario);
  };

  const registrarUsuario: SesionContextType['registrarUsuario'] = (nombre, correo, contrasena) =>
    intentar(async () => {
      const respuesta = await api.post<RespuestaSesion>('/auth/registro', { nombre, correo, contrasena });
      guardarSesion(respuesta.data);
      return { correcto: true };
    });

  const iniciarSesion: SesionContextType['iniciarSesion'] = (correo, contrasena) =>
    intentar(async () => {
      const respuesta = await api.post<RespuestaSesion>('/auth/login', { correo, contrasena });
      guardarSesion(respuesta.data);
      return { correcto: true, esAdmin: respuesta.data.usuario.admin };
    });

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_TOKEN);
    setUsuario(null);
    setUsuariosCargados([]);
  };

  const actualizarUsuario: SesionContextType['actualizarUsuario'] = (nombre, correo) =>
    intentar(async () => {
      const respuesta = await api.put<RespuestaSesion>('/auth/perfil', { nombre, correo });
      guardarSesion(respuesta.data);
      return { correcto: true };
    });

  const eliminarCuenta: SesionContextType['eliminarCuenta'] = () =>
    intentar(async () => {
      await api.delete('/auth/perfil');
      cerrarSesion();
      return { correcto: true };
    });

  const crearUsuarioAdmin: SesionContextType['crearUsuarioAdmin'] = (nombre, correo, contrasena, admin) =>
    intentar(async () => {
      const respuesta = await api.post<UsuarioAdministrable>('/usuarios', { nombre, correo, contrasena, admin });
      setUsuariosCargados((actuales) => [...actuales, respuesta.data]);
      return { correcto: true };
    });

  const actualizarUsuarioAdmin: SesionContextType['actualizarUsuarioAdmin'] = (
    id,
    nombre,
    correo,
    admin,
    contrasena,
  ) =>
    intentar(async () => {
      const respuesta = await api.put<UsuarioAdministrable>(`/usuarios/${id}`, {
        nombre,
        correo,
        admin,
        contrasena: contrasena || null,
      });
      setUsuariosCargados((actuales) =>
        actuales.map((cuenta) => (cuenta.id === id ? respuesta.data : cuenta)),
      );
      if (usuario?.id === id) setUsuario(respuesta.data);
      return { correcto: true };
    });

  const eliminarUsuarioAdmin: SesionContextType['eliminarUsuarioAdmin'] = (id) =>
    intentar(async () => {
      await api.delete(`/usuarios/${id}`);
      setUsuariosCargados((actuales) => actuales.filter((cuenta) => cuenta.id !== id));
      return { correcto: true };
    });

  return (
    <SesionContext.Provider
      value={{
        usuario,
        esAdmin,
        cargando,
        usuarios: esAdmin ? usuariosCargados : [],
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
