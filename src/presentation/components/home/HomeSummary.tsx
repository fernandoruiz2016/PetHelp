import { useTheme } from "@/presentation/context/ThemeContext";
import { abrirCitasAdmin } from "@/presentation/navigation/agenda";
import { View } from "react-native";
import { HomeSumaryCard } from "./HomeSummaryCard";

interface HomeSummaryProps {
  totalHoy: number;
  solicitudesPendientes: number;
  solicitudesEnAtencion: number;
  solicitudesFinalizadas: number;
}

export const HomeSummary = ({
  totalHoy,
  solicitudesPendientes,
  solicitudesEnAtencion,
  solicitudesFinalizadas,
}: HomeSummaryProps) => {
  const { theme } = useTheme();

  return (
    <View className="w-full gap-4">
      <View className="flex-row gap-3">
        <HomeSumaryCard
          title="Citas de hoy"
          onPress={() => abrirCitasAdmin("hoy")}
          value={String(totalHoy)}
          icon="document-text-outline"
          color={theme.primary}
          backgroundColor={theme.primarySoft}
        />
        <HomeSumaryCard
          title="Pendientes"
          onPress={() => abrirCitasAdmin("pendientes")}
          value={String(solicitudesPendientes)}
          icon="calendar"
          color={theme.accent}
          backgroundColor={theme.accentSoft}
        />
      </View>

      <View className="flex-row gap-3">
        <HomeSumaryCard
          title="En Atención"
          onPress={() => abrirCitasAdmin("en_atencion")}
          value={String(solicitudesEnAtencion)}
          icon="hourglass"
          color={theme.primary}
          backgroundColor={theme.form}
        />
        <HomeSumaryCard
          title="Finalizadas"
          onPress={() => abrirCitasAdmin("finalizadas")}
          value={String(solicitudesFinalizadas)}
          icon="checkmark"
          color={theme.success}
          backgroundColor={theme.form}
        />
      </View>
    </View>
  );
};
