//se agrega la validacion, no es necesaria pero se hace
import { useState } from "react";
import CampoFormulario from "./CampoFormulario";

function FormularioLogin() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");

    
    //Valida los datos al enviar el formulario
    const manejarEnvio = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault(); //evita recargar la pagina
    if (correo.trim() === "") {
        alert("Debe ingresar su correo");
        return;
    }
    //Comprueba que el correo tenga un formato valido
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("Ingrese un correo válido");
        return;
    }
    if (contrasena.trim() === "") {
        alert("Debe ingresar su mensaje");
        return;
    }
        alert("Formulario enviado correctamente");
    }

    return(
        <form onSubmit={manejarEnvio} noValidate>

            <CampoFormulario
                etiqueta="Correo Electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                alCambiar={setCorreo}
            />
            
            <CampoFormulario
                etiqueta="Contraseña"
                tipo="text"
                nombre="contraseña"
                valor={contrasena}
                alCambiar={setContrasena}
            />

            <button type="submit" className="btn btn-primary">
                Iniciar sesión
            </button>
 
 
        </form>    
    );
}
export default FormularioLogin;