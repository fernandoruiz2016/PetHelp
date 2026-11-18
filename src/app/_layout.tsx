import { inicializarBaseDatos } from "@/infraestructure/database/database";
import { SolicitudProvider } from "@/presentation/context/SolicitudesContext";
import { ThemeProvider, useTheme } from "@/presentation/context/ThemeContext";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
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
        <Stack.Screen name="(main)" />
        <Stack.Screen name="solicitudes/nuevo" />
        <Stack.Screen name="solicitudes/[id]" />
        <Stack.Screen name="solicitudes/[id]/editar" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="vethelp.db" onInit={inicializarBaseDatos}>
      <ThemeProvider>
        <SolicitudProvider>
          <AppStack />
        </SolicitudProvider>
      </ThemeProvider>
    </SQLiteProvider>
  );
}
