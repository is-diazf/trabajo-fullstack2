//se agrega la validacion, no es necesaria pero se hace
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../molecules/CampoFormulario";
import { useSesion } from "../../context/SesionContexto";

function FormularioLogin() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const { iniciarSesion } = useSesion();
    const navegar = useNavigate();

    const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resultado = iniciarSesion(correo, contrasena);
        if (!resultado.correcto) {
            setError(resultado.mensaje);
            return;
        }
        navegar("/usuario");
    }

    return(
        <form onSubmit={manejarEnvio} noValidate>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <CampoFormulario
                etiqueta="Correo Electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                alCambiar={setCorreo}
            />
            
            <CampoFormulario
                etiqueta="Contraseña"
                tipo="password"
                nombre="contraseña"
                valor={contrasena}
                alCambiar={setContrasena}
            />

            <button type="submit" className="btn btn-primary">
                Iniciar sesión
            </button>
            <p className="mt-3 mb-0">
                ¿Aún no tienes una cuenta? <Link to="/registro">Regístrate</Link>
            </p>
        </form>    
    );
}
export default FormularioLogin;