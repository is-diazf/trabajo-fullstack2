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