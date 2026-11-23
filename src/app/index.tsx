import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useAuth } from "@/presentation/context/AuthContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useCerrarSesion } from "@/presentation/hooks/useCerrarSesion";
import { Redirect } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

export default function IndexRoute() {
  const { sesion, reintentar } = useAuth();
  const { salir, ocupado } = useCerrarSesion();
  const { theme } = useTheme();

  if (sesion.estado === "sinSesion") return <Redirect href="/login" />;
  if (sesion.estado === "lista") {
    return <Redirect href={sesion.usuario.rol === "admin" ? "/home" : "/cliente"} />;
  }
  if (sesion.estado === "perfilPendiente") return <Redirect href="/completar-perfil" />;

  return (
    <ScreenLayout style={{ justifyContent: "center" }}>
      <View className="gap-3 p-4">
        {sesion.estado === "cargando" ? (
          <>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text className="text-center" style={{ color: theme.text }}>
              Verificando sesión…
            </Text>
          </>
        ) : (
          <>
            <Text className="text-center text-xl font-bold" style={{ color: theme.text }}>
              No se pudo verificar la sesión
            </Text>
            <Text className="text-center" style={{ color: theme.text }}>
              {sesion.estado === "sinConfig"
                ? "El servicio de acceso no está configurado en esta instalación."
                : "Comprueba tu conexión e intenta de nuevo."}
            </Text>
            {sesion.estado === "error" && (
              <>
                <PrimaryButton title="Reintentar" onPress={reintentar} disabled={ocupado} />
                <PrimaryButton title="Cerrar sesión" onPress={salir} disabled={ocupado} />
              </>
            )}
          </>
        )}
      </View>
    </ScreenLayout>
  );
}
