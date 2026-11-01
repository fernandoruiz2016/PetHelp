import type { Solicitud } from "@/domain/models/Solicitud";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CustomTimeInputProps {
  value: string;
  onChange: (fecha: string) => void;
  horaSeleccionada: boolean;
  citas: Solicitud[];
  excluirSolicitudId?: string;
  error?: string;
}

const HORAS = Array.from({ length: 10 }, (_, i) => i + 8);

export default function CustomTimeInput({
  value,
  onChange,
  horaSeleccionada,
  citas,
  excluirSolicitudId,
  error,
}: CustomTimeInputProps) {
  const { theme } = useTheme();

  const fechaBase = value ? new Date(value) : new Date();

  const horasOcupadas = useMemo(() => {
    if (!value) return [];

    const ahora = new Date();

    const horasConCita = citas
      .filter(
        (cita) => cita.estado !== "CANCELADA" && cita.id !== excluirSolicitudId,
      )
      .filter((cita) => {
        const fecha = new Date(cita.fechaCita);
        return (
          fecha.getFullYear() === fechaBase.getFullYear() &&
          fecha.getMonth() === fechaBase.getMonth() &&
          fecha.getDate() === fechaBase.getDate()
        );
      })
      .map((cita) => new Date(cita.fechaCita).getHours());

    const horasPasadas =
      fechaBase.toDateString() === ahora.toDateString()
        ? Array.from({ length: ahora.getHours() - 7 }, (_, i) => i + 8)
        : [];

    return [...new Set([...horasConCita, ...horasPasadas])];
  }, [
    citas,
    excluirSolicitudId,
    value,
    fechaBase.getFullYear(),
    fechaBase.getMonth(),
    fechaBase.getDate(),
  ]);

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
          {HORAS.map((hora) => {
            const seleccionada = horaActualSeleccionada === hora;
            const ocupada = !seleccionada && horasOcupadas.includes(hora);

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
