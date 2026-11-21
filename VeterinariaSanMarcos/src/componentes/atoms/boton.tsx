interface Props {
  texto: string;
  clase: string;
  id?: string;
}

function Boton({ texto, clase = "btn btn-success", id }: Props) {
  return (
    <button type="button" className={clase} id={id}>
      {texto}
    </button>
  );
}

export default Boton;