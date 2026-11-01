import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectInputProps {
  label: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  error?: string;
}

export const CustomSelectInput = ({
  label,
  value,
  options,
  onValueChange,
  error,
}: CustomSelectInputProps) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View className="mb-4">
      <Text className="mb-2 ml-1 font-semibold" style={{ color: theme.text }}>
        {label}
      </Text>

      <Pressable
        className="h-14 flex-row items-center justify-between rounded-2xl border-2 px-4"
        style={{
          borderColor: error
            ? theme.error
            : open
              ? theme.primary
              : theme.inputBorder,
          backgroundColor: theme.input,
        }}
        onPress={() => {
          Keyboard.dismiss();
          setOpen((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedOption?.label ?? "Sin seleccionar"}`}
        accessibilityState={{ expanded: open }}
      >
        <Text
          className="flex-1 text-[15px]"
          style={{ color: selectedOption ? theme.text : theme.placeholder }}
          numberOfLines={1}
        >
          {selectedOption?.label ?? "Seleccionar una opción"}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.textMuted}
        />
      </Pressable>

      {open && (
        <View
          className="mt-2 overflow-hidden rounded-2xl border-2"
          style={{
            borderColor: theme.inputBorder,
            backgroundColor: theme.form,
          }}
        >
          {options.map((option, index) => {
            const selected = option.value === value;

            return (
              <Pressable
                key={option.value}
                className="min-h-12 flex-row items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: selected ? theme.primarySoft : theme.form,
                  borderBottomWidth: index < options.length - 1 ? 1 : 0,
                  borderBottomColor: theme.inputBorder,
                }}
                onPress={() => {
                  onValueChange(option.value);
                  setOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text
                  className="flex-1 text-[15px]"
                  style={{ color: selected ? theme.primary : theme.text }}
                >
                  {option.label}
                </Text>
                {selected && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      {error && (
        <Text
          className="ml-2 mt-2 text-sm font-medium"
          style={{ color: theme.error }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
