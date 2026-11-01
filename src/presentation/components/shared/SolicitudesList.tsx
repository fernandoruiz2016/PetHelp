import type { Solicitud } from "@/domain/models/Solicitud";
import { useTheme } from "@/presentation/context/ThemeContext";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, Keyboard, Text, View } from "react-native";
import { SolicitudItem } from "../solicitudes/SolicitudItem";

interface SolicitudesListProps {
  solicitudes: Solicitud[];
  mensajeVacio?: string;
}

const ordenPrioridad: Record<Solicitud["prioridad"], number> = {
  URGENTE: 0,
  ALTA: 1,
  NORMAL: 2,
};

const ordenEstado: Record<Solicitud["estado"], number> = {
  EN_ATENCION: 0,
  PENDIENTE: 1,
  CANCELADA: 2,
  FINALIZADO: 3,
};

export function SolicitudesList({
  solicitudes,
  mensajeVacio = "No hay solicitudes.",
}: SolicitudesListProps) {
  const { theme } = useTheme();
  const solicitudesOrdenadas = useMemo(
    () =>
      [...solicitudes].sort((a, b) => {
        const diferenciaEstado = ordenEstado[a.estado] - ordenEstado[b.estado];
        return (
          diferenciaEstado ||
          ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]
        );
      }),
    [solicitudes],
  );

  return (
    <FlatList
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      data={solicitudesOrdenadas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SolicitudItem
          solicitud={item}
          onVerDetalles={() => {
            Keyboard.dismiss();
            router.push({
              pathname: "/solicitudes/[id]",
              params: { id: item.id },
            });
          }}
        />
      )}
      ItemSeparatorComponent={() => <View className="h-3" />}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
      ListEmptyComponent={
        <Text className="text-center" style={{ color: theme.textSecondary }}>
          {mensajeVacio}
        </Text>
      }
    />
  );
}
