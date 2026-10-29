import { HomeModuleCard } from "@/presentation/components/home/HomeModuleCard";
import { HomeSumary } from "@/presentation/components/home/HomeSummary";
import { HomeWaiting } from "@/presentation/components/home/HomeWaiting";
import { HomeWelcome } from "@/presentation/components/home/HomeWelcome";
import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useSolicitudes } from "@/presentation/hooks/useSolicitudes";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

export default function HomeRoute() {
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMensaje("Bienvenido");
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
      className="flex-1 bg-white"
    >
      <ScreenLayout
        style={{ justifyContent: "flex-start", padding: 0 }}
        areaSegura="sinSuperior"
      >
        {cargando ? (
          <HomeWaiting fullScreen />
        ) : (
          <>
            <AppHeader nombre="Martín" isHome={true} />
            <View className="mt-4 p-4">
              <HomeWelcome mensaje={mensaje} />

              <HomeSumary
                totalHoy={totalHoy}
                solicitudesPendientes={solicitudesPendientes}
                solicitudesEnAtencion={solicitudesEnAtencion}
                solicitudesFinalizadas={solicitudesFinalizadas}
              />

              <View className="w-full gap-3">
                <HomeModuleCard
                  title="Listado de Citas"
                  iconName="document-text-outline"
                  onPress={() => router.push("/solicitudes")}
                />

                <HomeModuleCard
                  title="Nueva Cita"
                  iconName="add-circle-outline"
                  onPress={() => router.push("/solicitudes/nuevo")}
                />
              </View>
            </View>

          </>
        )}

      </ScreenLayout>
    </KeyboardAvoidingView>


  );
}
