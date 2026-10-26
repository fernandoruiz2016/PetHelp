import { useTheme } from "@/presentation/context/ThemeContext";
import { View } from "react-native";
import { HomeSumaryCard } from "./HomeSummaryCard";

interface HomeSummaryProps {
  totalHoy: number;
  solicitudesPendientes: number;
  solicitudesEnAtencion: number;
  solicitudesFinalizadas: number;
}

export const HomeSumary = ({
  totalHoy,
  solicitudesPendientes,
  solicitudesEnAtencion,
  solicitudesFinalizadas,
}: HomeSummaryProps) => {
  const { theme } = useTheme();

  return (
    <View className="mb-8 w-full gap-3">
      <View className="flex-row gap-3">
        <HomeSumaryCard
          title="Solicitudes de hoy"
          value={String(totalHoy)}
          icon="document-text-outline"
          color={theme.primary}
          backgroundColor={theme.primarySoft}
        />
        <HomeSumaryCard
          title="Pendientes"
          value={String(solicitudesPendientes)}
          icon="calendar"
          color={theme.accent}
          backgroundColor={theme.accentSoft}
        />
      </View>

      <View className="flex-row gap-3">
        <HomeSumaryCard
          title="En Atención"
          value={String(solicitudesEnAtencion)}
          icon="hourglass"
          color={theme.primary}
          backgroundColor={theme.form}
        />
        <HomeSumaryCard
          title="Finalizadas"
          value={String(solicitudesFinalizadas)}
          icon="checkmark"
          color={theme.success}
          backgroundColor={theme.form}
        />
      </View>
    </View>
  );
};
