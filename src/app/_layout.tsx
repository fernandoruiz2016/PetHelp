import { AuthProvider, useAuth } from "@/presentation/context/AuthContext";
import { ThemeProvider, useTheme } from "@/presentation/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

function AppStack() {
  const { colorScheme } = useTheme();
  const { sesion } = useAuth();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={sesion.estado === "sinSesion"}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack.Protected>
        <Stack.Protected guard={sesion.estado === "lista" && sesion.usuario.rol === "admin"}>
          <Stack.Screen name="(admin)" />
        </Stack.Protected>
        <Stack.Protected guard={sesion.estado === "lista" && sesion.usuario.rol === "cliente"}>
          <Stack.Screen name="cliente" />
        </Stack.Protected>
        <Stack.Protected guard={sesion.estado === "perfilPendiente"}>
          <Stack.Screen name="completar-perfil" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppStack />
      </AuthProvider>
    </ThemeProvider>
  );
}
