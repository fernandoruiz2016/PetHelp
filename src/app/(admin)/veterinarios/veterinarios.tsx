import { HomeModuleCard } from "@/presentation/components/home/HomeModuleCard";
import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { VeterinarioItem } from "@/presentation/components/veterinarios/VeterinarioItem";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useVeterinarios } from "@/presentation/context/VeterinariosContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    Text,
    View,
} from "react-native";

export default function VeterinariosScreen() {
    const { theme } = useTheme();
    const { veterinarios, cargando, recargar } = useVeterinarios();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <ScreenLayout
                style={{ justifyContent: "flex-start", padding: 0 }}
                areaSegura="sinSuperior"
                conFondo={true}
            >
                <AppHeader titulo="Veterinarios" isHome={false} />
                <View className="px-4 pt-4 pb-2">
                    <HomeModuleCard
                        title="Nuevo veterinario"
                        iconName="add-circle-outline"
                        onPress={() => router.push("/veterinarios/formulario")}
                    />
                </View>

                {cargando && veterinarios.length === 0 ? (
                    <View className="flex-1 items-center justify-center p-6">
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text
                            className="mt-4 text-center text-base font-semibold"
                            style={{ color: theme.textSecondary }}
                        >
                            Cargando veterinarios...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        className="flex-1 pt-4"
                        keyboardShouldPersistTaps="handled"
                        data={veterinarios}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <VeterinarioItem
                                veterinario={item}
                                onPress={(veterinario) =>
                                    router.push({
                                        pathname: "/veterinarios/formulario",
                                        params: { id: veterinario.id },
                                    })
                                }
                            />
                        )}
                        ItemSeparatorComponent={() => <View className="h-3" />}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingTop: 8,
                            paddingBottom: 24,
                            flexGrow: 1,
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={cargando}
                                onRefresh={() => {
                                    void recargar();
                                }}
                                colors={[theme.primary]}
                                tintColor={theme.primary}
                            />
                        }
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-16 px-4">
                                <Ionicons
                                    name="people-outline"
                                    size={52}
                                    color={theme.textMuted}
                                />
                                <Text
                                    className="mt-3 text-center text-base font-medium"
                                    style={{ color: theme.textSecondary }}
                                >
                                    Aún no hay veterinarios registrados.
                                </Text>
                            </View>
                        }
                    />
                )}
            </ScreenLayout>
        </KeyboardAvoidingView>
    );
}
