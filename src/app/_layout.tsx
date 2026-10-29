import { SolicitudProvider } from "@/presentation/context/SolicitudesContext";
import { ThemeProvider, useTheme } from "@/presentation/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

function AppStack() {
  const { colorScheme } = useTheme();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="solicitudes/index" />
        <Stack.Screen name="solicitudes/nuevo" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SolicitudProvider>
        <AppStack/>
      </SolicitudProvider>
    </ThemeProvider>
  );
}
