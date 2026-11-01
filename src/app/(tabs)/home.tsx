import { HomeDate } from "@/presentation/components/home/HomeDate";
import { HomeModuleCard } from "@/presentation/components/home/HomeModuleCard";
import { HomeSumary } from "@/presentation/components/home/HomeSummary";
import { HomeWaiting } from "@/presentation/components/home/HomeWaiting";
import { HomeWelcome } from "@/presentation/components/home/HomeWelcome";
import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useFechaActual } from "@/presentation/hooks/useFechaActual";
import { useSolicitudes } from "@/presentation/hooks/useSolicitudes";
import { Fredoka_700Bold } from "@expo-google-fonts/fredoka";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function HomeRoute() {
  const { theme } = useTheme();
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [fuenteCargada, errorFuente] = useFonts({ Fredoka_700Bold });
  const fechaActual = useFechaActual();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMensaje("Cada paciente cuenta");
      setCargando(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const {
    totalHoy,
    solicitudesPendientes,
    solicitudesFinalizadas,
    solicitudesEnAtencion,
  } = useSolicitudes();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScreenLayout
        style={{ justifyContent: "flex-start", padding: 0 }}
        areaSegura="sinVertical"
        conFondo={false}
      >
        {cargando || (!fuenteCargada && !errorFuente) ? (
          <HomeWaiting fullScreen />
        ) : (
          <>
            <AppHeader nombre="Admin" isHome={true} />
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 16, paddingTop: 32 }}
            >
              <HomeWelcome mensaje={mensaje} />
              <View
                className="mb-8 mt-5 w-full rounded-3xl border px-4 pb-7 pt-6 shadow-lg shadow-black/30 elevation-8 "
                style={{
                  backgroundColor: theme.form,
                  borderColor: theme.border,
                }}
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
                <HomeDate
                  fechaActual={fechaActual}
                  textColor={theme.textSecondary}
                />

                <HomeSumary
                  totalHoy={totalHoy}
                  solicitudesPendientes={solicitudesPendientes}
                  solicitudesEnAtencion={solicitudesEnAtencion}
                  solicitudesFinalizadas={solicitudesFinalizadas}
                />
              </View>

              <View className="flex-col items-center justify-center gap-3 px-12">
                <HomeModuleCard
                  title="Todas las citas"
                  iconName="document-text-outline"
                  onPress={() =>
                    router.navigate({
                      pathname: "/solicitudes",
                      params: {
                        filtro: "",
                        estado: "",
                        fecha: "",
                        servicio: "",
                        prioridad: "",
                      },
                    })
                  }
                />

                <HomeModuleCard
                  title="Nueva Cita"
                  iconName="add-circle-outline"
                  onPress={() => router.push("/solicitudes/nuevo")}
                />
              </View>
            </ScrollView>
          </>
        )}
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
