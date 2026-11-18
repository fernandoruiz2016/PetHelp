import type { Veterinario } from "@/domain/models/Veterinario";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

interface VeterinarioItemProps {
  veterinario: Veterinario;
  onPress?: (veterinario: Veterinario) => void;
}

export function VeterinarioItem({
  veterinario,
  onPress,
}: VeterinarioItemProps) {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

  const nombreCompleto = `${veterinario.firstName} ${veterinario.lastName}`.trim();

  return (
    <Pressable
      onPress={() => onPress?.(veterinario)}
      accessibilityRole="button"
      accessibilityLabel={`Veterinario Dr. ${nombreCompleto}, Teléfono: ${veterinario.phone}, Correo: ${veterinario.email}`}
    >
      <View
        className="flex-row items-center rounded-3xl border p-4 shadow-lg shadow-black/50 elevation-8"
        style={{
          backgroundColor: theme.form,
          borderColor: theme.border,
        }}
      >

        <View className="relative">
          {veterinario.image && !imageError ? (
            <Image
              source={{ uri: veterinario.image }}
              className="h-16 w-16 rounded-full border-2"
              style={{ borderColor: theme.accent }}
              resizeMode="cover"
              onError={() => setImageError(true)}
              accessible={false}
            />
          ) : (
            <View
              className="h-16 w-16 items-center justify-center rounded-full border-2"
              style={{
                backgroundColor: theme.primarySoft,
                borderColor: theme.accent,
              }}
            >
              <Ionicons name="person" size={28} color={theme.title} />
            </View>
          )}

          <View
            className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full border"
            style={{
              backgroundColor: theme.primary,
              borderColor: theme.form,
            }}
          >
            <Ionicons name="medkit" size={13} color={theme.onPrimary} />
          </View>
        </View>

        {/* Información del Veterinario */}
        <View className="ml-3 min-w-0 flex-1 gap-2">
          <View className="flex-row items-center gap-2">
            <Text
              className="min-w-0 flex-1 text-xl font-bold"
              style={{ color: theme.text }}
              numberOfLines={1}
            >
              {nombreCompleto}
            </Text>
            <Text
              className="text-right text-xs"
              style={{ color: theme.textMuted }}
            >
              ID: #{veterinario.id}
            </Text>
          </View>

          <View className="gap-2 pr-8">
            
            <View className="flex-col gap-1">
              {veterinario.phone ? (
                <View className="flex-row items-center gap-1.5">
                  <Ionicons
                    name="call-outline"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <Text
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={1}
                  >
                    {veterinario.phone}
                  </Text>
                </View>
              ) : null}

              {veterinario.email ? (
                <View className="flex-row items-center gap-1.5">
                  <Ionicons
                    name="mail-outline"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <Text
                    className="min-w-0 flex-1 text-sm"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {veterinario.email}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

