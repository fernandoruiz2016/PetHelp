import { LoginHeader } from "@/presentation/components/login/LoginHeader";
import { CustomTextInput } from "@/presentation/components/shared/CustomTextInput";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useLoginForm } from "@/presentation/hooks/useLoginForm";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginRoute() {
  const { user, setUser, password, setPassword, errors, handleLogin } =
    useLoginForm();

  const { theme } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScreenLayout style={{ justifyContent: "center" }}>
        <ScrollView contentContainerClassName="flex-grow">
          <View className="flex-1 px-2 pt-4 pb-12">
            <View className=" rounded-3xl p-4 elevation-10 mt-10">
              <LoginHeader />
              <View
                className="pt-5 pb-5 px-6 py-6 rounded-[30] shadow-lg shadow-black/50 elevation-8"
                style={{ backgroundColor: theme.background }}
              >
                <CustomTextInput
                  label="Nombre de Usuario"
                  iconName="person-outline"
                  placeholder="usuario"
                  value={user}
                  onChangeText={setUser}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.user}
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

                <TouchableOpacity
                  className="mt-6 p-2"
                  onPress={() => router.push("/register")}
                >
                  <Text className="text-center text-dark-text text-base">
                    ¿No tienes cuenta?{" "}
                    <Text
                      className=" font-bold"
                      style={{ color: theme.primary }}
                    >
                      Regístrate aquí
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
