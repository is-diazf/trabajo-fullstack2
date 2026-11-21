import Input from '../atoms/Input';

type Props = {
  etiqueta: string;
  tipo: string;
  nombre: string;
  valor: string;
  alCambiar: (valor: string) => void;
  placeholder?: string;
};

function CampoFormulario({ etiqueta, tipo, nombre, valor, alCambiar, placeholder }: Props) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold" htmlFor={nombre}>{etiqueta}</label>
      <Input tipo={tipo} nombre={nombre} valor={valor} alCambiar={alCambiar} placeholder={placeholder} />
    </div>
  );
}
export default CampoFormulario;