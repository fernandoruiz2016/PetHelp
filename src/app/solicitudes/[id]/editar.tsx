import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { SolicitudForm } from "@/presentation/components/solicitudes/SolicitudForm";
import { useSolicitudes } from "@/presentation/context/SolicitudesContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function EditarSolicitudRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscar, actualizar } = useSolicitudes();
  const { theme } = useTheme();
  const solicitud = buscar(id);

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
        <AppHeader titulo="Editar cita" isHome={false} />

        {solicitud ? (
          <ScrollView keyboardShouldPersistTaps="handled">
            <View className="flex-col gap-4 px-8 pb-8">
              <View
                className="rounded-[30px] px-6 py-6 mt-7 shadow-lg shadow-black/50 elevation-8"
                style={{ backgroundColor: theme.background }}
              >
                <SolicitudForm
                  initialValues={solicitud}
                  solicitudId={id}
                  submitLabel="Actualizar"
                  onSubmit={(datos) => {
                    actualizar(id, datos);
                    Alert.alert(
                      "Registro actualizado",
                      "Los cambios se han guardado",
                    );
                    router.back();
                  }}
                />
              </View>
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-xl" style={{ color: theme.text }}>
              No se encontró la cita.
            </Text>
          </View>
        )}
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
