import { TipoServicio } from "@/domain/enums/TipoServicio";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface SolicitudFormProps {
  clienteNombre: string;
  telefono: string;
  mascotaNombre: string;
  tipoServicio: TipoServicio;
  descripcion: string;
  fechaCita: string;
  editando: boolean;

  onClienteNombreChange: (valor: string) => void;
  onTelefonoChange: (valor: string) => void;
  onMascotaNombreChange: (valor: string) => void;
  onTipoServicioChange: (valor: string) => void;
  onDescriptionChange: (valor: string) => void;
  onFechaCitaChange: (valor: string) => void;
  onGuardar: () => void;
  onCancelar: () => void;
}

export function SolicitudForm(props: SolicitudFormProps) {
  return (
    <View>
      <TextInput
        placeholder="Escriba su nombre"
        value={props.clienteNombre}
        onChangeText={props.onClienteNombreChange}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={props.onGuardar}>
        <Text>{props.editando ? "Actualizar producto" : "Crear producto"}</Text>
        {props.editando && (
          <TouchableOpacity onPress={props.onCancelar}>
            <Text>Cancelando edición</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
}
