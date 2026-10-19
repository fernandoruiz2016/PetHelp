import { SolicitudesProvider } from "@/presentation/context/SolicitudesContext";
import { ThemeProvider } from "@/presentation/context/ThemeContext";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SolicitudesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="home" />
          <Stack.Screen name="solicitudes" />
        </Stack>
      </SolicitudesProvider>
    </ThemeProvider>
  );
}
