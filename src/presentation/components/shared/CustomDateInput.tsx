import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
    value: string;
    onChange: (fecha: string) => void;
    error?: string;
}

export default function CustomDateInput({
    value,
    onChange,
    error,
}: Props) {
    const [mostrar, setMostrar] = useState(false);
    const { theme } = useTheme();

    const fecha = value ? new Date(value) : new Date();

    return (
        <View className="mb-4">
            <Text className="text-dark-text font-semibold mb-2 ml-1">
                Fecha de la cita
            </Text>

            <TouchableOpacity
                onPress={() => setMostrar(true)}
                activeOpacity={0.7}
                className="flex-row items-center border-2 rounded-2xl px-4 h-14"
                style={{
                    borderColor: error
                        ? theme.error
                        : mostrar
                            ? theme.primary
                            : theme.inputBorder,
                    backgroundColor: error ? theme.form : theme.input,
                }}
            >
                <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={mostrar ? theme.primary : theme.inputBorder}
                    style={{ marginRight: 12 }}
                />

                <Text
                    className="flex-1"
                    style={{ color: value ? theme.text : theme.placeholder }}
                >
                    {value ? fecha.toLocaleDateString() : "Seleccionar fecha"}
                </Text>

                <Ionicons
                    name="chevron-down"
                    size={20}
                    color={theme.textMuted}
                />
            </TouchableOpacity>

            {error && (
                <Text
                    className="text-sm mt-2 ml-2 font-medium"
                    style={{ color: theme.error }}
                >
                    {error}
                </Text>
            )}

            {mostrar && (
                <DateTimePicker
                    value={fecha}
                    mode="date"
                    minimumDate={new Date()}
                    onValueChange={(_, seleccionada) => {
                        if (seleccionada) {
                            onChange(seleccionada.toISOString());
                        }
                        setMostrar(false);
                    }}
                    onDismiss={() => setMostrar(false)}
                />
            )}
        </View>
    );
}