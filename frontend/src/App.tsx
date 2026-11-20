import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import './App.css';
import Navbar from './componentes/organism/Navbar';
import Inicio from './pages/Inicio';
import Servicios from './pages/Servicios';
import Contacto from './pages/Contacto';
import Info from './pages/Info';
import Login from './pages/Login';
import Novedades from './pages/Novedades';
import Footer from './componentes/organism/Footer';
import ServicioDetalle from './pages/ServiciosDetalle';
import AdminServicios from './pages/AdminServicios';
import Registro from './pages/Registro';
import Usuario from './pages/Usuario';
import AdminUsuarios from './pages/AdminUsuarios';
import { useSesion } from './context/SesionContexto';
import NovedadDetalle from './pages/NovedadDetalle';
import AdminNovedades from './pages/AdminNovedades';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import HistorialCompras from './pages/HistorialCompras';
import HistorialMedico from './pages/HistorialMedico';
import AdminPanel from './pages/AdminPanel'; // Asegúrate de que se llame así

function RutaAdministrador({ children }: { children: ReactNode }) {
  const { usuario, esAdmin } = useSesion();
  if (!usuario) return <Navigate to="/login" replace />;
  if (!esAdmin) return <Navigate to="/usuario" replace />;
  return children;
}

function RutaConSesion({ children }: { children: ReactNode }) {
  const { usuario } = useSesion();
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        
        {/* Rutas Públicas */}
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/servicios/:id" element={<ServicioDetalle />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/novedades/:id" element={<NovedadDetalle />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/info" element={<Info />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas de Usuario (Requieren Sesión) */}
        <Route path="/usuario" element={<RutaConSesion><Usuario /></RutaConSesion>} />
        <Route path="/carrito" element={<RutaConSesion><Carrito /></RutaConSesion>} />
        <Route path="/historial-compras" element={<RutaConSesion><HistorialCompras /></RutaConSesion>} />
        <Route path="/historial-medico" element={<RutaConSesion><HistorialMedico /></RutaConSesion>} />

        {/* Rutas de Administración (Requieren ser Admin) */}
        <Route path="/admin/dashboard" element={<RutaAdministrador><AdminPanel /></RutaAdministrador>} />
        <Route path="/admin/servicios" element={<RutaAdministrador><AdminServicios /></RutaAdministrador>} />
        <Route path="/admin/novedades" element={<RutaAdministrador><AdminNovedades /></RutaAdministrador>} />
        <Route path="/admin/usuarios" element={<RutaAdministrador><AdminUsuarios /></RutaAdministrador>} />
      </Routes>
      <Footer />
    </>
  );
}
export default App;