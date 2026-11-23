import { CustomTextInput } from "@/presentation/components/shared/CustomTextInput";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useLoginForm } from "@/presentation/hooks/useLoginForm";
import { Text, TouchableOpacity, View } from "react-native";

interface LoginFormProps {
  onShowRegister: () => void;
}

export function LoginForm({ onShowRegister }: LoginFormProps) {
  const { email, setEmail, password, setPassword, errors, handleLogin } =
    useLoginForm();
  const { theme } = useTheme();

  return (
    <View>
      <CustomTextInput
        label="Correo electrónico"
        iconName="mail-outline"
        placeholder="correo@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email}
      />

      <CustomTextInput
        label="Contraseña"
        iconName="lock-closed-outline"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        isPassword={true}
        error={errors.password}
      />

      <PrimaryButton title="Ingresar" onPress={handleLogin} />

      <TouchableOpacity className="mt-6 p-2" onPress={onShowRegister}>
        <Text className="text-center text-base" style={{ color: theme.text }}>
          ¿No tienes cuenta?{" "}
          <Text className=" font-bold" style={{ color: theme.primary }}>
            Regístrate aquí
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
