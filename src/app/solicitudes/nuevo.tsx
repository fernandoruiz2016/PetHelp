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
    Text,
    View
} from "react-native";
export default function SolicitudesRoute() {
    const { theme } = useTheme();
    const { crear } = useSolicitudes();
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
                            Nueva Cita
                        </Text>

                        <SolicitudForm
                            submitLabel="Realizar solicitud"
                            onSubmit={(datos) => {
                                // El formulario valida; esta pantalla decide guardar y navegar.
                                crear(datos);
                                Alert.alert('Registro creado', 'La solicitud se ha guardado');
                                router.back();
                            }} />
                    </View>
                </ScrollView>

            </ScreenLayout>
        </KeyboardAvoidingView>
    );
}
