import { BottomNavigation } from "@/presentation/components/shared/BottomNavigation";
import { useTheme } from "@/presentation/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { router, Tabs } from "expo-router";

export default function MainTabsLayout() {
  const { theme } = useTheme();
  const gradient = theme.gradient;

  return (
    <LinearGradient
      colors={gradient.colors}
      locations={gradient.locations}
      start={gradient.start}
      end={gradient.end}
      style={{ flex: 1 }}
    >
      <Tabs
        initialRouteName="home"
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: "transparent" },
        }}
        tabBar={({ state }) => {
          const activeRoute = state.routes[state.index];
          const selectedTab = activeRoute.name === "home" ? "home" : "citas";

          return (
            <BottomNavigation
              selectedTab={selectedTab}
              onHomePress={() => router.navigate("/home")}
              onCreatePress={() => router.push("/solicitudes/nuevo")}
              onCitasPress={() =>
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
          );
        }}
      >
        <Tabs.Screen name="home" options={{ title: "Inicio" }} />
        <Tabs.Screen name="solicitudes/index" options={{ title: "Citas" }} />
      </Tabs>
    </LinearGradient>
  );
}
