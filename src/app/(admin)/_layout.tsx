import { inicializarBaseDatos } from "@/infraestructure/database/database";
import { SolicitudProvider } from "@/presentation/context/SolicitudesContext";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function AdminLayout() {
  return (
    <SQLiteProvider databaseName="vethelp.db" onInit={inicializarBaseDatos}>
      <SolicitudProvider>
        <Stack initialRouteName="(main)" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(main)" />
          <Stack.Screen name="solicitudes/nuevo" />
          <Stack.Screen name="solicitudes/[id]" />
          <Stack.Screen name="solicitudes/[id]/editar" />
          <Stack.Screen name="veterinarios/veterinarios" />
        </Stack>
      </SolicitudProvider>
    </SQLiteProvider>
  );
}
