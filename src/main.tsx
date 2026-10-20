import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
// 1. IMPORTAMOS EL PROVEEDOR
import { ServiciosProvider } from './context/ServiciosContexto.tsx' 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ServiciosProvider>
        <App />
      </ServiciosProvider>
    </BrowserRouter>
  </StrictMode>,
)