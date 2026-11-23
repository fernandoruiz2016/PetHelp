import { useTheme } from "@/presentation/context/ThemeContext";
import { Drawer } from "expo-router/drawer";
import { useWindowDimensions } from "react-native";
import { ProfileDrawerContent } from "./ProfileDrawerContent";

export function ProfileDrawer({ pantallaInicio = "(tabs)" }: { pantallaInicio?: string }) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  return (
    <Drawer
      drawerContent={(props) => <ProfileDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: "left",
        drawerType: "front",
        drawerStyle: { width: Math.min(width * 0.85, 360), backgroundColor: theme.background },
        overlayColor: "rgba(0, 0, 0, 0.45)",
        overlayAccessibilityLabel: "Cerrar menú de perfil",
        sceneStyle: { backgroundColor: theme.background },
      }}
    >
      <Drawer.Screen name={pantallaInicio} options={{ title: "Inicio" }} />
    </Drawer>
  );
}
