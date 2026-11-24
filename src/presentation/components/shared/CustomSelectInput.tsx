import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

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
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const CustomSelectInput = ({
  label,
  value,
  options,
  onValueChange,
  error,
  searchable = false,
  searchPlaceholder = "Buscar…",
}: CustomSelectInputProps) => {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const { theme } = useTheme();
  const selectedOption = options.find((option) => option.value === value);

  const opcionesFiltradas = useMemo(() => {
    if (!searchable) return options;
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(termino),
    );
  }, [busqueda, options, searchable]);

  const cerrar = () => {
    setOpen(false);
    setBusqueda("");
  };

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

      {open && !searchable && (
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
                  cerrar();
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

      {searchable && (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={cerrar}
        >
          <View
            className="flex-1 justify-center px-6 py-12"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <View
              className="max-h-[75%] overflow-hidden rounded-3xl border p-4 shadow-lg"
              style={{
                backgroundColor: theme.form,
                borderColor: theme.border,
              }}
            >
              <View className="mb-3 flex-row items-center justify-between">
                <Text
                  className="flex-1 text-lg font-bold"
                  style={{ color: theme.text }}
                  numberOfLines={1}
                >
                  {label}
                </Text>
                <Pressable
                  onPress={cerrar}
                  className="h-9 w-9 items-center justify-center rounded-full"
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar selector"
                >
                  <Ionicons name="close" size={22} color={theme.text} />
                </Pressable>
              </View>

              <View
                className="mb-3 h-12 flex-row items-center rounded-xl border px-3"
                style={{
                  backgroundColor: theme.input,
                  borderColor: theme.inputBorder,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={18}
                  color={theme.textMuted}
                />
                <TextInput
                  className="ml-2 flex-1 text-[15px]"
                  style={{ color: theme.text }}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={theme.placeholder}
                  value={busqueda}
                  onChangeText={setBusqueda}
                  autoCorrect={false}
                />
                {busqueda.length > 0 && (
                  <Pressable
                    onPress={() => setBusqueda("")}
                    accessibilityRole="button"
                    accessibilityLabel="Limpiar búsqueda"
                  >
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={theme.textMuted}
                    />
                  </Pressable>
                )}
              </View>

              <FlatList
                data={opcionesFiltradas}
                keyExtractor={(item) => item.value}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => {
                  const selected = item.value === value;
                  return (
                    <Pressable
                      className="min-h-12 flex-row items-center justify-between px-3 py-3"
                      style={{
                        backgroundColor: selected
                          ? theme.primarySoft
                          : theme.form,
                        borderBottomWidth:
                          index < opcionesFiltradas.length - 1 ? 1 : 0,
                        borderBottomColor: theme.inputBorder,
                      }}
                      onPress={() => {
                        onValueChange(item.value);
                        cerrar();
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text
                        className="flex-1 text-[15px]"
                        style={{ color: selected ? theme.primary : theme.text }}
                      >
                        {item.label}
                      </Text>
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={theme.primary}
                        />
                      )}
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <Text
                    className="py-6 text-center text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    No se encontraron resultados.
                  </Text>
                }
              />
            </View>
          </View>
        </Modal>
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
