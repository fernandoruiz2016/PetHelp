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
    nombre,
    setNombre,
    user,
    setUser,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmar,
    setConfirmar,
    errors,
    handleRegistro,
  } = useRegisterForm(onShowLogin);
  const { theme } = useTheme();

  return (
    <View>
      <CustomTextInput
        label="Nombre Completo"
        iconName="person-circle-outline"
        placeholder="Ej. Juan Pérez"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
        error={errors.nombre}
      />

      <CustomTextInput
        label="Nombre de Usuario"
        iconName="person-outline"
        placeholder="Ej. username"
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.user}
      />

      <CustomTextInput
        label="Teléfono"
        iconName="call-outline"
        placeholder="Número de teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.phone}
      />

      <CustomTextInput
        label="Correo Electrónico"
        iconName="mail-outline"
        placeholder="correo@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <CustomTextInput
        label="Crear Contraseña"
        iconName="lock-closed-outline"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
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

      <PrimaryButton title="Completar Registro" onPress={handleRegistro} />

      <TouchableOpacity className="mt-8 p-2" onPress={onShowLogin}>
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
