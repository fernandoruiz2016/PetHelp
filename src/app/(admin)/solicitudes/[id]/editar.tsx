import { veterinarioRepository } from "@/infraestructure/repositories/veterinarioRepository";
import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { CustomSelectInput } from "@/presentation/components/shared/CustomSelectInput";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { SolicitudForm } from "@/presentation/components/solicitudes/SolicitudForm";
import { useSolicitudes } from "@/presentation/context/SolicitudesContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useVeterinarioApi } from "@/presentation/hooks/useVeterinarioApi";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function EditarSolicitudRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscar, actualizar, solicitudes } = useSolicitudes();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const solicitud = buscar(Number(id));
  const [asignacion, setAsignacion] = useState<number | null>();
  const { veterinarios, loading, error, loadVeterinarios } =
    useVeterinarioApi(veterinarioRepository);

  const veterinarioActual = solicitud?.veterinarioId;
  const veterinarioSeleccionado =
    asignacion === undefined ? veterinarioActual : asignacion;
  const opcionesVeterinarios = [{ value: "", label: "Sin asignar" }];
  for (const veterinario of veterinarios) {
    if (veterinario.activo !== false || veterinario.id === veterinarioActual) {
      opcionesVeterinarios.push({
        value: String(veterinario.id),
        label: `${veterinario.firstName} ${veterinario.lastName}`.trim(),
      });
    }
  }
  if (
    veterinarioActual !== undefined &&
    !opcionesVeterinarios.some(({ value }) => value === String(veterinarioActual))
  ) {
    opcionesVeterinarios.push({
      value: String(veterinarioActual),
      label: `Veterinario #${veterinarioActual}`,
    });
  }

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
                  citas={solicitudes}
                  initialValues={solicitud}
                  solicitudId={solicitud.id}
                  submitLabel="Actualizar"
                  onSubmit={async (datos) => {
                    await actualizar(solicitud.id, datos, asignacion);
                    if (!navigation.isFocused()) return;

                    if (router.canGoBack()) router.back();
                    else router.replace("/solicitudes");
                    Alert.alert("Cita actualizada", "Los cambios se han guardado.");
                  }}
                >
                  <CustomSelectInput
                    label="Veterinario asignado"
                    value={veterinarioSeleccionado?.toString() ?? ""}
                    options={opcionesVeterinarios}
                    onValueChange={(value) =>
                      setAsignacion(value === "" ? null : Number(value))
                    }
                  />
                  {loading && (
                    <Text className="mb-3" style={{ color: theme.textSecondary }}>
                      Cargando veterinarios…
                    </Text>
                  )}
                  {error && (
                    <Pressable
                      className="mb-3 py-2"
                      accessibilityRole="button"
                      onPress={loadVeterinarios}
                    >
                      <Text style={{ color: theme.primary }}>
                        No se pudo cargar la lista. Reintentar
                      </Text>
                    </Pressable>
                  )}
                </SolicitudForm>
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
