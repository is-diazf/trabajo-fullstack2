type Props = {
  texto: string;
  tipo?: "button" | "submit";
  clase?: string;
  onClick?: () => void;
};

function Boton({ texto, tipo = "button", clase = "btn btn-success", onClick }: Props) {
  return (
    <button type={tipo} className={clase} onClick={onClick}>
      {texto}
    </button>
  );
}
export default Boton;