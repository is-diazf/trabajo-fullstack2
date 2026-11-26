import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

// 1. IMPORTAMOS TODOS LOS PROVEEDORES
import { ServiciosProvider } from './context/ServiciosContexto.tsx' 
import { SesionProvider } from './context/SesionContexto.tsx'
import { NovedadesProvider } from './context/NovedadesContexto.tsx'
import { CarritoProvider } from './context/CarritoContexto.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider> 
        <ServiciosProvider>
          <NovedadesProvider>
            <CarritoProvider>
              <App />
            </CarritoProvider>
          </NovedadesProvider>
        </ServiciosProvider>
      </SesionProvider>
    </BrowserRouter>  
  </StrictMode>
)