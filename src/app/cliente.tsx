import { LoginHeader } from "@/presentation/components/login/LoginHeader";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useAuth } from "@/presentation/context/AuthContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useCerrarSesion } from "@/presentation/hooks/useCerrarSesion";
import { ScrollView, Text, View } from "react-native";

export default function ClienteRoute() {
  const { sesion } = useAuth();
  const { salir, ocupado } = useCerrarSesion();
  const { theme } = useTheme();

  if (sesion.estado !== "lista" || sesion.usuario.rol !== "cliente") return null;
  const { nombre, apellidos, email } = sesion.usuario;

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <LoginHeader />
        <View
          className="gap-3 rounded-3xl border p-6"
          style={{ backgroundColor: theme.form, borderColor: theme.border }}
        >
          <Text accessibilityRole="header" className="text-2xl font-bold" style={{ color: theme.text }}>
            Hola, {nombre} {apellidos}
          </Text>
          <Text style={{ color: theme.textSecondary }}>{email}</Text>
          <PrimaryButton title="Cerrar sesión" onPress={salir} disabled={ocupado} />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
