import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface SyncStatusBannerProps {
  conectado: boolean;
  sincronizando?: boolean;
  pendientes: number;
  onSincronizar?: () => void;
}

export function SyncStatusBanner({
  conectado,
  sincronizando = false,
  pendientes,
  onSincronizar,
}: SyncStatusBannerProps) {
  const { theme } = useTheme();

  if (conectado && !sincronizando && pendientes === 0) return null;

  const mensaje = !conectado
    ? pendientes > 0
      ? `Sin conexión · ${pendientes} pendiente${pendientes === 1 ? "" : "s"} de sincronizar`
      : "Sin conexión · Los cambios se guardarán localmente"
    : sincronizando
      ? "Sincronizando con Firebase…"
      : `${pendientes} pendiente${pendientes === 1 ? "" : "s"} de sincronizar`;

  return (
    <View className="px-4 pt-2">
      <View
        className="flex-row items-center gap-2 rounded-2xl border px-3 py-2"
        style={{
          backgroundColor: theme.form,
          borderColor: !conectado ? theme.accent : theme.border,
        }}
      >
        {sincronizando ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <Ionicons
            name={!conectado ? "cloud-offline-outline" : "cloud-upload-outline"}
            size={18}
            color={!conectado ? theme.accent : theme.primary}
          />
        )}
        <Text
          className="min-w-0 flex-1 text-xs font-medium"
          style={{ color: theme.textSecondary }}
        >
          {mensaje}
        </Text>
        {conectado && !sincronizando && pendientes > 0 && onSincronizar && (
          <Pressable
            onPress={onSincronizar}
            accessibilityRole="button"
            className="rounded-lg px-2.5 py-1"
            style={{ backgroundColor: theme.primarySoft }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: theme.primary }}
            >
              Sincronizar
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
