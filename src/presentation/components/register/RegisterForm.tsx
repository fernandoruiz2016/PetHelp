import { CamposPerfil } from "@/presentation/components/profile/CamposPerfil";
import { CustomTextInput } from "@/presentation/components/shared/CustomTextInput";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useRegisterForm } from "@/presentation/hooks/useRegisterForm";
import { Text, TouchableOpacity, View } from "react-native";

interface RegisterFormProps {
  onShowLogin: () => void;
}

export function RegisterForm({ onShowLogin }: RegisterFormProps) {
  const {
    perfil,
    actualizarPerfil,
    email,
    setEmail,
    password,
    setPassword,
    confirmar,
    setConfirmar,
    errors,
    errorOperacion,
    ocupado,
    handleRegistro,
  } = useRegisterForm();
  const { theme } = useTheme();

  return (
    <View>
      <CamposPerfil perfil={perfil} errores={errors} onChange={actualizarPerfil} />

      <CustomTextInput
        label="Correo Electrónico"
        iconName="mail-outline"
        placeholder="correo@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email}
      />

      <CustomTextInput
        label="Crear Contraseña"
        iconName="lock-closed-outline"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        autoComplete="new-password"
        isPassword={true}
        error={errors.password}
      />

      <CustomTextInput
        label="Confirmar Contraseña"
        iconName="lock-closed-outline"
        placeholder="••••••••"
        value={confirmar}
        onChangeText={setConfirmar}
        isPassword={true}
        error={errors.confirmar}
      />

      {errorOperacion && (
        <Text accessibilityRole="alert" className="mb-3" style={{ color: theme.error }}>
          {errorOperacion}
        </Text>
      )}
      <PrimaryButton
        title={ocupado ? "Creando cuenta…" : "Completar registro"}
        onPress={handleRegistro}
        disabled={ocupado}
      />

      <TouchableOpacity className="mt-8 p-2" onPress={onShowLogin} disabled={ocupado}>
        <Text className="text-center text-base" style={{ color: theme.text }}>
          ¿Ya estás registrado?{" "}
          <Text className=" font-bold" style={{ color: theme.primary }}>
            Inicia Sesión
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
