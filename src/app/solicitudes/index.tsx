import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { SolicitudItem } from "@/presentation/components/solicitudes/SolicitudItem";
import { useSolicitudes } from "@/presentation/context/SolicitudesContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
export default function SolicitudesRoute() {
  const { theme } = useTheme();
  const { solicitudes } = useSolicitudes();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScreenLayout
        style={{ justifyContent: "center", padding: 0 }}
        areaSegura="sinSuperior"
      >
        <AppHeader nombre="Martín" isHome={false} />
        <Text
          className="font-extrabold text-3xl mt-4 m-auto"
          style={{ color: theme.primary }}
        >
          Gestionar Citas
        </Text>
        <FlatList
          className="flex-1"
          data={solicitudes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SolicitudItem
              solicitud={item}
              onVerDetalles={(id) => {
                console.log("Solicitud seleccionada:", id);
              }}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
          ListEmptyComponent={
            <Text
              className="text-center"
              style={{ color: theme.textSecondary }}
            >
              No hay solicitudes.
            </Text>
          }
        />
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
