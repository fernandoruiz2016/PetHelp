import { HomeDate } from "@/presentation/components/home/HomeDate";
import { HomeModuleCard } from "@/presentation/components/home/HomeModuleCard";
import { HomeScreen } from "@/presentation/components/home/HomeScreen";
import { HomeSummary } from "@/presentation/components/home/HomeSummary";
import { HomeWelcome } from "@/presentation/components/home/HomeWelcome";
import { useAuth } from "@/presentation/context/AuthContext";
import { useSolicitudes } from "@/presentation/context/SolicitudesContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useFechaActual } from "@/presentation/hooks/useFechaActual";
import { abrirCitasAdmin } from "@/presentation/navigation/agenda";
import { nombreUsuario } from "@/presentation/utils/nombreUsuario";
import { router, useNavigation } from "expo-router";
import type { DrawerNavigationProp } from "expo-router/drawer";
import { Text, View } from "react-native";

function useAgendaHoy() {
  const { solicitudes } = useSolicitudes();
  const fechaActual = useFechaActual();
  const hoy = fechaActual.toDateString();
  const resumen = { totalHoy: 0, solicitudesPendientes: 0, solicitudesEnAtencion: 0, solicitudesFinalizadas: 0 };

  for (const solicitud of solicitudes) {
    if (new Date(solicitud.fechaCita).toDateString() !== hoy) continue;
    resumen.totalHoy++;
    if (solicitud.estado === "PENDIENTE") resumen.solicitudesPendientes++;
    if (solicitud.estado === "EN_ATENCION") resumen.solicitudesEnAtencion++;
    if (solicitud.estado === "FINALIZADO") resumen.solicitudesFinalizadas++;
  }

  return { fechaActual, resumen };
}

export default function HomeRoute() {
  const navigation = useNavigation<DrawerNavigationProp<{ "(tabs)": undefined }>>(
    "/(admin)/(main)",
  );
  const { sesion } = useAuth();
  const { theme } = useTheme();
  const { fechaActual, resumen } = useAgendaHoy();
  if (sesion.estado !== "lista" || sesion.usuario.rol !== "admin") return null;

  return (
    <HomeScreen
      nombre={nombreUsuario(sesion.usuario)}
      abrirPerfil={() => navigation.openDrawer()}
      areaSegura="sinVertical"
      conFondo={false}
    >
      <HomeWelcome mensaje="Cada paciente cuenta" descripcion="Aquí podrás administrar las citas" />
      <View
        className="mb-8 mt-5 w-full rounded-3xl border px-4 pb-7 pt-6 shadow-lg shadow-black/30 elevation-8"
        style={{ backgroundColor: theme.form, borderColor: theme.border }}
      >
        <Text
          className="text-center text-2xl font-extrabold"
          style={{ color: theme.title }}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          accessibilityRole="header"
        >
          Agenda de Hoy
        </Text>
        <HomeDate fechaActual={fechaActual} textColor={theme.textSecondary} />
        <HomeSummary {...resumen} />
      </View>

      <View className="flex-col items-center justify-center gap-3 px-12">
        <HomeModuleCard
          title="Todas las citas" iconName="document-text-outline" onPress={() => abrirCitasAdmin()}
        />
        <HomeModuleCard
          title="Nueva cita" iconName="add-circle-outline" onPress={() => router.push("/solicitudes/nuevo")}
        />
        <HomeModuleCard
          title="Veterinarios" iconName="people-outline" onPress={() => router.push("/veterinarios/veterinarios")}
        />
      </View>
    </HomeScreen>
  );
}
