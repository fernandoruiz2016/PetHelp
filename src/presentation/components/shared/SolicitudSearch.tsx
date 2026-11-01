import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Keyboard, Pressable, TextInput, View } from "react-native";

interface SolicitudSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SolicitudSearch({ value, onChangeText }: SolicitudSearchProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="px-4 pb-2 pt-4">
      <View
        className="h-12 flex-row items-center gap-2 rounded-2xl border px-3"
        style={{
          backgroundColor: theme.input,
          borderColor: isFocused ? theme.primary : theme.inputBorder,
        }}
      >
        <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
        <TextInput
          className="min-w-0 flex-1 text-base"
          style={{ color: theme.text }}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={Keyboard.dismiss}
          placeholder="Buscar mascota, cliente o código"
          placeholderTextColor={theme.placeholder}
          accessibilityLabel="Buscar citas por mascota, cliente o código"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Pressable
            className="h-10 w-10 items-center justify-center"
            onPress={() => onChangeText("")}
            accessibilityRole="button"
            accessibilityLabel="Limpiar búsqueda"
            hitSlop={4}
          >
            <Ionicons
              name="close-circle"
              size={21}
              color={theme.textSecondary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
