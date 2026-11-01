import { useTheme } from "@/presentation/context/ThemeContext";
import { router } from "expo-router";
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
    <View className="w-full gap-4">
      <View className="flex-row gap-3">
        <HomeSumaryCard
          title="Citas de hoy"
          onPress={() =>
            router.push({ pathname: "/solicitudes", params: { filtro: "hoy" } })
          }
          value={String(totalHoy)}
          icon="document-text-outline"
          color={theme.primary}
          backgroundColor={theme.primarySoft}
        />
        <HomeSumaryCard
          title="Pendientes "
          onPress={() =>
            router.push({
              pathname: "/solicitudes",
              params: { filtro: "pendientes" },
            })
          }
          value={String(solicitudesPendientes)}
          icon="calendar"
          color={theme.accent}
          backgroundColor={theme.accentSoft}
        />
      </View>

      <View className="flex-row gap-3">
        <HomeSumaryCard
          title="En Atención"
          onPress={() =>
            router.push({
              pathname: "/solicitudes",
              params: { filtro: "en_atencion" },
            })
          }
          value={String(solicitudesEnAtencion)}
          icon="hourglass"
          color={theme.primary}
          backgroundColor={theme.form}
        />
        <HomeSumaryCard
          title="Finalizadas"
          onPress={() =>
            router.push({
              pathname: "/solicitudes",
              params: { filtro: "finalizadas" },
            })
          }
          value={String(solicitudesFinalizadas)}
          icon="checkmark"
          color={theme.success}
          backgroundColor={theme.form}
        />
      </View>
    </View>
  );
};
