import { EspecieMascota, Solicitud } from "@/domain/models/Solicitud";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
interface SolicitudItemProps {
  solicitud: Solicitud;
  onVerDetalles: (id: string) => void;
}
const avatares: Record<EspecieMascota, ImageSourcePropType> = {
  PERRO: require("../../../../assets/images/mascotas/perro.png"),
  GATO: require("../../../../assets/images/mascotas/gato.png"),
  OTRO: require("../../../../assets/images/mascotas/otro.png"),
};
export function SolicitudItem({
  solicitud,
  onVerDetalles,
}: SolicitudItemProps) {
  const { theme } = useTheme();

  const [anio, mes, dia] = solicitud.fechaCita
    .slice(0, 10)
    .split("-")
    .map(Number);

  const fecha = new Intl.DateTimeFormat("es", {
    dateStyle: "full",
  }).format(new Date(anio, mes - 1, dia));

  return (
    <View
      className="flex-row items-center rounded-3xl border p-4 shadow-lg shadow-black/50 elevation-8 "
      style={{
        backgroundColor: theme.form,
        borderColor: theme.border,
      }}
    >
      <Image
        source={avatares[solicitud.especieMascota]}
        className="h-12 w-12 rounded-full border-2"
        style={{ borderColor: theme.accent }}
      />

      <View className="ml-3 flex-1 gap-2">
        <View className="flex-row items-center justify-between gap-2">
          <Text
            className="flex-1 text-lg font-bold"
            style={{ color: theme.text }}
            numberOfLines={1}
          >
            {solicitud.mascotaNombre}
          </Text>

          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: theme.accentSoft }}
          >
            <Text className="text-xs font-bold" style={{ color: theme.text }}>
              {solicitud.tipoServicio}
            </Text>
          </View>
        </View>

        <Text
          className="text-sm"
          style={{ color: theme.textSecondary }}
          numberOfLines={2}
        >
          {solicitud.descripcion}
        </Text>

        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row items-center gap-1">
            <Ionicons
              name="calendar-outline"
              size={16}
              color={theme.textSecondary}
            />
            <Text
              className="flex-1 text-xs"
              style={{ color: theme.textSecondary }}
              numberOfLines={1}
            >
              {fecha}
            </Text>
          </View>

          <TouchableOpacity
            className="rounded-full px-3 py-2"
            style={{ backgroundColor: theme.primarySoft }}
            onPress={() => onVerDetalles(solicitud.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text className="text-xs font-bold" style={{ color: theme.text }}>
              Más detalles
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
