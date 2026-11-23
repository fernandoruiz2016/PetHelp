import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { SolicitudDetalle } from "@/presentation/components/solicitudes/SolicitudDetalle";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useCitasCliente } from "@/presentation/hooks/useCitasCliente";
import { useConsultaCitasCliente } from "@/presentation/hooks/useConsultaCitasCliente";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function DetalleCitaClienteRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const citaId = Number(id);
  const { theme } = useTheme();
  const citas = useCitasCliente();
  const consultar = useCallback(async () => {
    if (!citas || !Number.isSafeInteger(citaId) || citaId < 1) return null;
    return citas.buscar(citaId);
  }, [citaId, citas]);
  const { lectura, reintentar } = useConsultaCitasCliente(citas ? consultar : undefined);

  return (
    <ScreenLayout style={{ padding: 0, justifyContent: "flex-start" }} areaSegura="sinSuperior">
      <AppHeader titulo="Detalle de la cita" isHome={false} />
      {lectura.estado === "lista" && lectura.datos ? (
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <SolicitudDetalle solicitud={lectura.datos} modo="cliente" />
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center gap-3 px-6">
          {lectura.estado === "cargando" ? (
            <ActivityIndicator accessibilityLabel="Cargando cita" color={theme.primary} />
          ) : (
            <>
              <Text className="text-center" style={{ color: theme.text }}>
                {lectura.estado === "error" ? "No se pudo cargar la cita." : "No se encontró la cita."}
              </Text>
              {lectura.estado === "error" && <PrimaryButton title="Reintentar" onPress={reintentar} />}
            </>
          )}
        </View>
      )}
    </ScreenLayout>
  );
}
