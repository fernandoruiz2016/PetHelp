import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { SolicitudDetalle } from "@/presentation/components/solicitudes/SolicitudDetalle";
import { useSolicitudes } from "@/presentation/context/SolicitudesContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function SolicitudDetalleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscar, eliminar } = useSolicitudes();
  const { theme } = useTheme();
  const solicitud = buscar(id);

  const borrarSolicitud = () => {
    eliminar(id);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/solicitudes");
    }
  };

  const confirmarEliminacion = () => {
    const mensaje = `¿Eliminar la cita de ${solicitud?.mascotaNombre}? Esta acción no se puede deshacer.`;

    if (Platform.OS === "web") {
      if (globalThis.confirm(mensaje)) borrarSolicitud();
      return;
    }

    Alert.alert("Eliminar cita", mensaje, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: borrarSolicitud },
    ]);
  };

  return (
    <ScreenLayout style={{ padding: 0 }} areaSegura="sinSuperior">
      <AppHeader titulo="Detalles de la cita" isHome={false} />
      {solicitud ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingTop: 20,
            paddingBottom: 24,
          }}
        >
          <SolicitudDetalle solicitud={solicitud} />

          <View className="mt-6 shrink-0 gap-3">
            <Pressable
              className="h-14 flex-row items-center justify-center gap-3 rounded-xl"
              style={{ backgroundColor: theme.primary }}
              onPress={() =>
                router.push({
                  pathname: "/solicitudes/[id]/editar",
                  params: { id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Editar cita"
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={theme.onPrimary}
              />
              <Text
                className="text-base font-bold"
                style={{ color: theme.onPrimary }}
              >
                Editar cita
              </Text>
            </Pressable>
            <Pressable
              className="h-14 flex-row items-center justify-center gap-3 rounded-xl border"
              style={{ backgroundColor: theme.form, borderColor: theme.error }}
              onPress={confirmarEliminacion}
              accessibilityRole="button"
              accessibilityLabel="Eliminar cita"
            >
              <Ionicons name="trash-outline" size={22} color={theme.error} />
              <Text
                className="text-base font-bold"
                style={{ color: theme.error }}
              >
                Eliminar cita
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-xl" style={{ color: theme.text }}>
            No se encontró la cita.
          </Text>
        </View>
      )}
    </ScreenLayout>
  );
}
