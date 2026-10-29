import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { SolicitudForm } from "@/presentation/components/solicitudes/SolicitudForm";
import { useSolicitudes } from "@/presentation/context/SolicitudesContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

export default function SolicitudesRoute() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { buscar, actualizar } = useSolicitudes();
    const solicitud = buscar(id);

    if (!solicitud) {
        return <View className="flex-1 items-center justify-center bg-slate-50 px-6"><Text className="text-5xl">🔎</Text><Text className="mt-4 text-xl font-bold text-slate-800">No se encontró la cita</Text></View>;
    }

    const { theme } = useTheme();
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
        >
            <ScreenLayout
                style={{ justifyContent: "flex-start", padding: 0 }}
                areaSegura="sinSuperior"
            >
                <AppHeader isHome={false} />

                <ScrollView>
                    <View className="flex-col gap-4 px-8 pb-8">
                        <Text
                            className="font-extrabold text-3xl mt-4 m-auto"
                            style={{ color: theme.primary }}
                        >
                            Editar Cita
                        </Text>

                        <View
                            className="pt-5 pb-5 px-6 py-6 rounded-[30] shadow-lg shadow-black/50 elevation-8"
                            style={{ backgroundColor: theme.background }}
                        >
                            <SolicitudForm
                                initialValues={solicitud}
                                submitLabel="Actualizar"
                                onSubmit={(datos) => {
                                    // El formulario valida; esta pantalla decide guardar y navegar.
                                    actualizar(id, datos);
                                    Alert.alert('Registro actualizado', 'Los cambios se han guardado');
                                    router.back();
                                }} />
                        </View>

                    </View>
                </ScrollView>

            </ScreenLayout>
        </KeyboardAvoidingView>
    );
}
