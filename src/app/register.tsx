import { LoginHeader } from "@/presentation/components/login/LoginHeader";
import { CustomTextInput } from "@/presentation/components/shared/CustomTextInput";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useRegisterForm } from "@/presentation/hooks/useRegisterForm";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegistroRoute() {
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
  } = useRegisterForm();

  const { theme } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScreenLayout style={{ justifyContent: "center" }}>
        <ScrollView contentContainerClassName="flex-grow">
          <View className="flex-1 px-2 pt-4 pb-12">
            <View className="rounded-3xl p-4 elevation-10 ">
              <LoginHeader />
              <View
                className="pt-5 pb-5 px-6 py-6 rounded-[30] shadow-lg shadow-black/50 elevation-8"
                style={{ backgroundColor: theme.background }}
              >
                <CustomTextInput
                  label="Nombre Completo"
                  placeholder="Ej. Juan Pérez"
                  value={nombre}
                  onChangeText={setNombre}
                  autoCapitalize="words"
                  error={errors.nombre}
                />

                <CustomTextInput
                  label="Nombre de Usuario"
                  placeholder="Ej. username"
                  value={user}
                  onChangeText={setUser}
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.user}
                />

                <CustomTextInput
                  label="Teléfono"
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
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                <CustomTextInput
                  label="Crear Contraseña"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  isPassword={true}
                  error={errors.password}
                />

                <CustomTextInput
                  label="Confirmar Contraseña"
                  placeholder="••••••••"
                  value={confirmar}
                  onChangeText={setConfirmar}
                  isPassword={true}
                  error={errors.confirmar}
                />

                <PrimaryButton
                  title="Completar Registro"
                  onPress={handleRegistro}
                />

                <TouchableOpacity
                  className="mt-8 p-2"
                  onPress={() => router.back()}
                >
                  <Text className="text-center text-dark-text text-base">
                    ¿Ya estás registrado?{" "}
                    <Text
                      className=" font-bold"
                      style={{ color: theme.primary }}
                    >
                      Inicia Sesión
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
