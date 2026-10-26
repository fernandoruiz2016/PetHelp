import { HomeHeader } from "@/presentation/components/home/HomeHeader";
import { HomeModuleCard } from "@/presentation/components/home/HomeModuleCard";
import { HomeSumary } from "@/presentation/components/home/HomeSummary";
import { HomeWaiting } from "@/presentation/components/home/HomeWaiting";
import { HomeWelcome } from "@/presentation/components/home/HomeWelcome";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useSolicitudes } from "@/presentation/hooks/useSolicitudes";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

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
    <ScreenLayout style={{ padding: 0 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        <HomeHeader onPress={() => router.replace("/login")} />

        {cargando ? (
          <HomeWaiting />
        ) : (
          <View className="w-full">
            <HomeWelcome mensaje={mensaje} />

            <HomeSumary
              totalHoy={totalHoy}
              solicitudesPendientes={solicitudesPendientes}
              solicitudesEnAtencion={solicitudesEnAtencion}
              solicitudesFinalizadas={solicitudesFinalizadas}
            />

            <View className="w-full gap-3">
              <HomeModuleCard
                title="Ver Solicitudes"
                iconName="document-text-outline"
                onPress={() => router.push("/solicitudes")}
              />

              <HomeModuleCard
                title="Realizar una solicitud"
                iconName="add-circle-outline"
                onPress={() => router.push("/solicitudes")}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
