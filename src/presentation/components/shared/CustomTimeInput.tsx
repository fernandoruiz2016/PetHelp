import { HORAS_CITA } from "@/domain/services/horariosCita";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";

interface CustomTimeInputProps {
  value: string;
  onChange: (fecha: string) => void;
  horaSeleccionada: boolean;
  horasOcupadas: number[];
  disabled?: boolean;
  error?: string;
}

export default function CustomTimeInput({
  value,
  onChange,
  horaSeleccionada,
  horasOcupadas,
  disabled = false,
  error,
}: CustomTimeInputProps) {
  const { theme } = useTheme();

  const fechaBase = value ? new Date(value) : new Date();
  const ahora = Date.now();

  const horaActualSeleccionada =
    horaSeleccionada && value ? new Date(value).getHours() : -1;

  const seleccionarHora = (hora: number) => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setHours(hora, 0, 0, 0);
    onChange(nuevaFecha.toISOString());
  };

  return (
    <View className="mb-4">
      <Text className="font-semibold mb-2 ml-1" style={{ color: theme.text }}>
        Hora de la cita
      </Text>

      {!value ? (
        <Text className="ml-1 text-sm" style={{ color: theme.textMuted }}>
          Selecciona una fecha para ver los horarios disponibles.
        </Text>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {HORAS_CITA.map((hora) => {
            const seleccionada = horaActualSeleccionada === hora;
            const horaProgramada = new Date(fechaBase).setHours(hora, 0, 0, 0);
            const ocupada = disabled || (!seleccionada && (horasOcupadas.includes(hora) || horaProgramada <= ahora));

            const etiqueta = new Date(2000, 0, 1, hora).toLocaleTimeString(
              "es-PE",
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              },
            );

            return (
              <TouchableOpacity
                key={hora}
                disabled={ocupada}
                accessibilityState={{ selected: seleccionada, disabled: ocupada }}
                onPress={() => seleccionarHora(hora)}
                activeOpacity={0.7}
                className="items-center justify-center rounded-xl border-2 px-3 py-3"
                style={{
                  width: "31%",
                  borderColor: ocupada
                    ? theme.inputBorder
                    : seleccionada
                      ? theme.primary
                      : theme.inputBorder,
                  backgroundColor: ocupada
                    ? theme.background
                    : seleccionada
                      ? theme.primary
                      : theme.input,
                  opacity: ocupada ? 0.5 : 1,
                }}
              >
                <Text
                  className={seleccionada ? "font-semibold text-sm" : "text-sm"}
                  style={{
                    color: ocupada
                      ? theme.textMuted
                      : seleccionada
                        ? theme.onPrimary
                        : theme.text,
                  }}
                >
                  {etiqueta}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      {error && (
        <Text
          className="text-sm mt-2 ml-2 font-medium"
          style={{ color: theme.error }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
