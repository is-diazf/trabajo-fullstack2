import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './componentes/organismo/Navbar';
import Inicio from './paginas/Inicio';
import Servicios from './paginas/Servicios';
import Contacto from './paginas/Contacto';
import Info from './paginas/Info';
import Login from './paginas/Login';
import Novedades from './paginas/Novedades';
import Footer from './componentes/organismo/Footer';

function App() {

  return (
    <>
{/* Imagen central de fondo visible en todo el proyecto */}
        <div 
          className="position-absolute w-75 h-100 top-50 start-50 translate-middle" 
          style={{
            backgroundImage: 'url("/img/animalesFondo.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            opacity: 0.25, // Opacidad baja para no interferir con el texto de las páginas
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />

      <Navbar />

      <Routes>
        

        <Route path="/" element={<Inicio />} />

        <Route path="/novedades" element={<Novedades />} />

        <Route path="/servicios" element={<Servicios />} />

        <Route path="/contacto" element={<Contacto />} />

        <Route path="/info"
         element={<Info />} />

        <Route path="/login"
         element={<Login />} />


      </Routes>
      
      <Footer />
    </>
  );
};

export default App;