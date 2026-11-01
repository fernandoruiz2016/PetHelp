import type { Solicitud } from "@/domain/models/Solicitud";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];

const servicios: Record<
  Solicitud["tipoServicio"],
  { label: string; icon: IconName }
> = {
  CONSULTA: { label: "Consulta", icon: "medkit-outline" },
  VACUNACION: { label: "Vacunación", icon: "shield-checkmark-outline" },
  GROOMING: { label: "Grooming", icon: "cut-outline" },
  EMERGENCIA: { label: "Emergencia", icon: "alert-circle-outline" },
};

export function ServicioLabel({
  servicio,
}: {
  servicio: Solicitud["tipoServicio"];
}) {
  const { theme } = useTheme();
  const { label, icon } = servicios[servicio];

  return (
    <View className="min-w-0 flex-row items-center gap-1.5">
      <Ionicons name={icon} size={16} color={theme.primary} />
      <Text
        className="shrink text-base font-medium"
        style={{ color: theme.text }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}
