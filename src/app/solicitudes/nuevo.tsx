import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { SolicitudForm } from "@/presentation/components/solicitudes/SolicitudForm";
import { useSolicitudes } from "@/presentation/context/SolicitudesContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { router } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
export default function SolicitudesRoute() {
  const { theme } = useTheme();
  const { crear } = useSolicitudes();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <ScreenLayout
        style={{ justifyContent: "flex-start", padding: 0 }}
        areaSegura="sinSuperior"
      >
        <AppHeader titulo="Nueva cita" isHome={false} />

        <ScrollView keyboardShouldPersistTaps="handled">
          <View className="flex-col gap-4 px-8 pb-8 mt-6">
            <View
              className="pt-5 pb-5 px-6 py-6 rounded-[30] shadow-lg shadow-black/50 elevation-8"
              style={{ backgroundColor: theme.background }}
            >
              <SolicitudForm
                submitLabel="Realizar Solicitud"
                onSubmit={(datos) => {
                  // El formulario valida; esta pantalla decide guardar y navegar.
                  crear(datos);
                  Alert.alert("Registro creado", "La solicitud se ha guardado");
                  router.back();
                }}
              />
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
