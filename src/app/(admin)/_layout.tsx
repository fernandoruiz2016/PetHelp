import { inicializarBaseDatos, NOMBRE_BASE_DATOS } from "@/infraestructure/database/database";
import { SolicitudProvider } from "@/presentation/context/SolicitudesContext";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function AdminLayout() {
  return (
    <SQLiteProvider databaseName={NOMBRE_BASE_DATOS} onInit={inicializarBaseDatos}>
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
