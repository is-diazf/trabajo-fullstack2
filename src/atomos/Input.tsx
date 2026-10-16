type Props = {
    tipo: string;
    nombre: string;
    valor: string; //Valor actual del campo
    alCambiar: (valor: string) => void; //Funcion para actualizar el valor
};
function Input({ tipo, nombre, valor, alCambiar}: Props){
    return(
        <input
            type= {tipo}
            name={nombre}
            className="form-control"


            // Muestra el valor guardado
            value={valor}

            //Detectar cuando el usuario escribe
            onChange={(e) => alCambiar(e.target.value)}
            />
);  
}

export default Input