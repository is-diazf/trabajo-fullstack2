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

function RutaAdministrador({ children }: { children: ReactNode }) {
  const { usuario, esAdmin } = useSesion();
  if (!usuario) return <Navigate to="/login" replace />;
  if (!esAdmin) return <Navigate to="/usuario" replace />;
  return children;
}

function App() {

  return (
    <>
      <Navbar />
 
      <Routes>
        

        <Route path="/" element={<Inicio />} />

        <Route path="/novedades" element={<Novedades />} />
        <Route path="/novedades/:id" element={<NovedadDetalle />} />
        <Route path="/admin/novedades" element={<AdminNovedades />} />

        <Route path="/servicios" element={<Servicios />} />
        <Route path="/servicios/:id" element={<ServicioDetalle />} />
        <Route path="/admin/servicios" element={<RutaAdministrador><AdminServicios /></RutaAdministrador>} />
        <Route path="/admin/usuarios" element={<RutaAdministrador><AdminUsuarios /></RutaAdministrador>} />
        
        <Route path="/contacto" element={<Contacto />} />

        <Route path="/info"
         element={<Info />} />

        <Route path="/login"
         element={<Login />} />

        <Route path="/registro" element={<Registro />} />
        <Route path="/usuario" element={<Usuario />} />

      </Routes>
      
      <Footer />
    </>
  );
};

export default App;