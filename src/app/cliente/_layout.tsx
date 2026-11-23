import { inicializarBaseDatos, NOMBRE_BASE_DATOS } from "@/infraestructure/database/database";
import { useAuth } from "@/presentation/context/AuthContext";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export const unstable_settings = { anchor: "(main)" };

export default function ClienteLayout() {
  const { sesion } = useAuth();
  if (sesion.estado !== "lista" || sesion.usuario.rol !== "cliente") return null;

  return (
    <SQLiteProvider key={sesion.usuario.uid} databaseName={NOMBRE_BASE_DATOS} onInit={inicializarBaseDatos}>
      <Stack initialRouteName="(main)" screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
