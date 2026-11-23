import type { DatosPerfil } from "@/domain/models/Usuario";
import { CustomTextInput } from "@/presentation/components/shared/CustomTextInput";
import type { ErroresPerfil } from "@/presentation/utils/perfilForm";

interface CamposPerfilProps {
  perfil: DatosPerfil;
  errores: ErroresPerfil;
  onChange: (campo: keyof DatosPerfil, valor: string) => void;
}

export function CamposPerfil({ perfil, errores, onChange }: CamposPerfilProps) {
  return (
    <>
      <CustomTextInput
        label="Nombres"
        iconName="person-circle-outline"
        placeholder="Ej. Juan Carlos"
        value={perfil.nombre}
        onChangeText={(valor) => onChange("nombre", valor)}
        autoCapitalize="words"
        maxLength={100}
        error={errores.nombre}
      />
      <CustomTextInput
        label="Apellidos"
        iconName="person-outline"
        placeholder="Ej. Pérez García"
        value={perfil.apellidos}
        onChangeText={(valor) => onChange("apellidos", valor)}
        autoCapitalize="words"
        maxLength={100}
        error={errores.apellidos}
      />
      <CustomTextInput
        label="Teléfono"
        iconName="call-outline"
        placeholder="Número de teléfono"
        value={perfil.telefono}
        onChangeText={(valor) => onChange("telefono", valor)}
        keyboardType="phone-pad"
        autoComplete="tel"
        maxLength={30}
        error={errores.telefono}
      />
    </>
  );
}
