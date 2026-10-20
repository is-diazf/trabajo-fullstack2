import { Route, Routes } from 'react-router-dom';
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

function App() {

  return (
    <>
      <Navbar />
 
      <Routes>
        

        <Route path="/" element={<Inicio />} />

        <Route path="/novedades" element={<Novedades />} />

        <Route path="/servicios" element={<Servicios />} />
        <Route path="/servicios/:id" element={<ServicioDetalle />} />
        <Route path="/admin/servicios" element={<AdminServicios />} />
        
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