type Props = {
    tipo: string;
    nombre: string;
    valor: string; //Valor actual del campo
    alCambiar: (valor: string) => void; //Funcion para actualizar el valor
    placeholder?: string;
};
function Input({ tipo, nombre, valor, alCambiar, placeholder }: Props){
    return(
        <input
            id={nombre}
            type= {tipo}
            name={nombre}
            className="form-control"
            placeholder={placeholder}

            // Muestra el valor guardado
            value={valor}

            //Detectar cuando el usuario escribe
            onChange={(e) => alCambiar(e.target.value)}
            />
);  
}

export default Input