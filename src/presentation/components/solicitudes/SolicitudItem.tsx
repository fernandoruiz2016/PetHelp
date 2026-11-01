import type { Solicitud } from "@/domain/models/Solicitud";
import { MascotaAvatar } from "@/presentation/components/shared/MascotaAvatar";
import { ServicioLabel } from "@/presentation/components/shared/ServicioLabel";
import {
  EstadoChip,
  PrioridadChip,
} from "@/presentation/components/shared/SolicitudChips";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface SolicitudItemProps {
  solicitud: Solicitud;
  onVerDetalles: (id: string) => void;
}

export function SolicitudItem({
  solicitud,
  onVerDetalles,
}: SolicitudItemProps) {
  const { theme } = useTheme();
  const fechaCita = new Date(solicitud.fechaCita);
  const fecha = new Intl.DateTimeFormat("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(fechaCita);
  const hora = new Intl.DateTimeFormat("es-PE", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(fechaCita);

  return (
    <Pressable
      onPress={() => onVerDetalles(solicitud.id)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalles de la cita con código ${solicitud.codigo}, ${solicitud.mascotaNombre}`}
    >
      <View
        className="flex-row items-center rounded-3xl border p-4 shadow-lg shadow-black/50 elevation-8 "
        style={{
          backgroundColor:
            solicitud.estado === "FINALIZADO"
              ? theme.completedCardBackground
              : theme.form,
          borderColor: theme.border,
        }}
      >
        <MascotaAvatar especie={solicitud.especieMascota} />

        <View className="ml-3 min-w-0 flex-1 gap-2">
          <View className="flex-row items-center gap-2">
            <Text
              className="min-w-0 flex-1 text-xl font-bold"
              style={{ color: theme.text }}
              numberOfLines={1}
            >
              {solicitud.mascotaNombre}
            </Text>
            <Text
              className="text-right text-xs"
              style={{ color: theme.textMuted }}
            >
              Código: {solicitud.codigo}
            </Text>
          </View>

          <View className="gap-2 pr-8">
            <View className="min-w-0 flex-row flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <ServicioLabel servicio={solicitud.tipoServicio} />
            </View>

            <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={theme.textSecondary}
                />
                <Text
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {fecha.charAt(0).toUpperCase() + fecha.slice(1)}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={theme.textSecondary}
                />
                <Text
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {hora}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2">
              <EstadoChip estado={solicitud.estado} />
              <PrioridadChip prioridad={solicitud.prioridad} />
            </View>

            <Text
              className="min-w-0 text-sm"
              style={{ color: theme.textSecondary }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {solicitud.descripcion}
            </Text>
          </View>
          <View
            className="absolute inset-y-0 right-0 justify-center"
            pointerEvents="none"
          >
            <Ionicons name="chevron-forward" size={22} color={theme.primary} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
