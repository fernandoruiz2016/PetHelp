import { veterinarioRepository } from "@/infraestructure/repositories/veterinarioRepository";
import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { VeterinarioItem } from "@/presentation/components/veterinarios/VeterinarioItem";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useVeterinarioApi } from "@/presentation/hooks/useVeterinarioApi";
import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function VeterinariosScreen() {
    const { theme } = useTheme();
    const {
        veterinarios,
        loading,
        error,
        loadVeterinarios,
    } = useVeterinarioApi(veterinarioRepository);

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

                {loading && veterinarios.length === 0 ? (
                    <View className="flex-1 items-center justify-center p-6">
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text
                            className="mt-4 text-center text-base font-semibold"
                            style={{ color: theme.textSecondary }}
                        >
                            Cargando veterinarios...
                        </Text>
                    </View>
                ) : error && veterinarios.length === 0 ? (
                    <View className="flex-1 items-center justify-center p-6">
                        <View
                            className="w-full items-center rounded-3xl border p-6 shadow-lg shadow-black/30 elevation-8"
                            style={{
                                backgroundColor: theme.form,
                                borderColor: theme.border,
                            }}
                        >
                            <Ionicons
                                name="alert-circle-outline"
                                size={48}
                                color={theme.error}
                            />
                            <Text
                                className="mt-3 text-center text-lg font-bold"
                                style={{ color: theme.text }}
                            >
                                No se pudo cargar la información
                            </Text>
                            <Text
                                className="mt-1 text-center text-sm"
                                style={{ color: theme.textSecondary }}
                            >
                                {error}
                            </Text>
                            <TouchableOpacity
                                className="mt-5 rounded-xl px-6 py-3"
                                style={{ backgroundColor: theme.primary }}
                                onPress={loadVeterinarios}
                                accessibilityRole="button"
                            >
                                <Text
                                    className="font-bold text-base"
                                    style={{ color: theme.onPrimary }}
                                >
                                    Reintentar
                                </Text>
                            </TouchableOpacity>
                        </View>
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
                                refreshing={loading}
                                onRefresh={loadVeterinarios}
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
                                </Text>
                            </View>
                        }
                    />
                )}
            </ScreenLayout>
        </KeyboardAvoidingView>
    );
}

