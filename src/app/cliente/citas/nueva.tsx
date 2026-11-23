import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { SolicitudForm } from "@/presentation/components/solicitudes/SolicitudForm";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useCitasCliente } from "@/presentation/hooks/useCitasCliente";
import { router, useNavigation } from "expo-router";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export default function ReservarCitaRoute() {
  const { theme } = useTheme();
  const citas = useCitasCliente();
  const navigation = useNavigation();
  if (!citas) return null;

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenLayout style={{ padding: 0, justifyContent: "flex-start" }} areaSegura="sinSuperior">
        <AppHeader titulo="Reservar cita" isHome={false} />
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24 }}>
          <View className="rounded-3xl border p-5" style={{ backgroundColor: theme.form, borderColor: theme.border }}>
            <SolicitudForm
              modo="cliente"
              initialValues={{ clienteNombre: citas.clienteNombre, telefono: citas.telefono }}
              consultarHorarios={citas.consultarHorarios}
              submitLabel="Reservar cita"
              onSubmit={async (datos) => {
                await citas.reservar(datos);
                if (!navigation.isFocused()) return;
                router.dismissTo("/cliente");
                Alert.alert("Cita reservada", "Puedes consultar su estado en Tus citas.");
              }}
            />
          </View>
        </ScrollView>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
