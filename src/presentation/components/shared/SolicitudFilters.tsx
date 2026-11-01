import { TipoServicio } from "@/domain/enums/TipoServicio";
import type {
  EstadoSolicitud,
  PrioridadSolicitud,
} from "@/domain/models/Solicitud";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, Text, View } from "react-native";

export type FiltrosSolicitud = {
  estado: EstadoSolicitud | "TODAS";
  fecha: "TODAS" | "HOY";
  servicio: TipoServicio | "TODOS";
  prioridad: PrioridadSolicitud | "TODAS";
};

export const filtrosIniciales: FiltrosSolicitud = {
  estado: "TODAS",
  fecha: "TODAS",
  servicio: "TODOS",
  prioridad: "TODAS",
};

const estadosAdicionales: {
  valor: FiltrosSolicitud["estado"];
  etiqueta: string;
}[] = [
  { valor: "TODAS", etiqueta: "Cualquiera" },
  { valor: "EN_ATENCION", etiqueta: "En atención" },
  { valor: "FINALIZADO", etiqueta: "Finalizadas" },
  { valor: "CANCELADA", etiqueta: "Canceladas" },
];

const servicios: { valor: FiltrosSolicitud["servicio"]; etiqueta: string }[] = [
  { valor: "TODOS", etiqueta: "Todos" },
  { valor: TipoServicio.CONSULTA, etiqueta: "Consulta" },
  { valor: TipoServicio.VACUNACION, etiqueta: "Vacunación" },
  { valor: TipoServicio.EMERGENCIA, etiqueta: "Emergencia" },
  { valor: TipoServicio.GROOMING, etiqueta: "Grooming" },
];

const prioridades: {
  valor: FiltrosSolicitud["prioridad"];
  etiqueta: string;
}[] = [
  { valor: "TODAS", etiqueta: "Todas" },
  { valor: "NORMAL", etiqueta: "Normal" },
  { valor: "ALTA", etiqueta: "Alta" },
  { valor: "URGENTE", etiqueta: "Urgente" },
];

interface FilterOptionProps {
  etiqueta: string;
  grupo: string;
  seleccionado: boolean;
  onPress: () => void;
}

function FilterOption({
  etiqueta,
  grupo,
  seleccionado,
  onPress,
}: FilterOptionProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${grupo}: ${etiqueta}`}
      accessibilityState={{ selected: seleccionado }}
    >
      <View
        style={{
          minHeight: 44,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 22,
          paddingHorizontal: 14,
          backgroundColor: seleccionado
            ? theme.filterSelectedBackground
            : theme.filterBackground,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: seleccionado ? "700" : "600",
            color: seleccionado ? theme.filterSelectedText : theme.filterText,
          }}
        >
          {etiqueta}
        </Text>
      </View>
    </Pressable>
  );
}

interface SolicitudFiltersProps {
  value: FiltrosSolicitud;
  onChange: (value: FiltrosSolicitud) => void;
  total: number;
}

export function SolicitudFilters({
  value,
  onChange,
  total,
}: SolicitudFiltersProps) {
  const { theme } = useTheme();
  const [mostrarMas, setMostrarMas] = useState(false);
  const filtrosAdicionales =
    Number(value.estado !== "TODAS" && value.estado !== "PENDIENTE") +
    Number(value.servicio !== "TODOS") +
    Number(value.prioridad !== "TODAS");
  const hayFiltros =
    value.estado !== "TODAS" ||
    value.fecha !== "TODAS" ||
    filtrosAdicionales > 0;

  return (
    <View className="gap-2 pb-2 pt-1">
      <View
        className="flex-row flex-wrap items-center gap-2 px-4"
        style={{ justifyContent: "center" }}
      >
        <FilterOption
          etiqueta="Todos"
          grupo="Filtros"
          seleccionado={!hayFiltros}
          onPress={() => {
            onChange(filtrosIniciales);
            setMostrarMas(false);
          }}
        />
        <FilterOption
          etiqueta="Hoy"
          grupo="Fecha"
          seleccionado={value.fecha === "HOY"}
          onPress={() =>
            onChange({
              ...value,
              fecha: value.fecha === "HOY" ? "TODAS" : "HOY",
            })
          }
        />
        <FilterOption
          etiqueta="Pendientes"
          grupo="Estado"
          seleccionado={value.estado === "PENDIENTE"}
          onPress={() =>
            onChange({
              ...value,
              estado: value.estado === "PENDIENTE" ? "TODAS" : "PENDIENTE",
            })
          }
        />
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            setMostrarMas((actual) => !actual);
          }}
          accessibilityRole="button"
          accessibilityLabel={`Más filtros${filtrosAdicionales ? `, ${filtrosAdicionales} activos` : ""}`}
          accessibilityState={{
            expanded: mostrarMas,
            selected: mostrarMas || filtrosAdicionales > 0,
          }}
        >
          <View
            style={{
              minHeight: 44,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              borderRadius: 22,
              paddingHorizontal: 14,
              backgroundColor:
                mostrarMas || filtrosAdicionales > 0
                  ? theme.filterSelectedBackground
                  : theme.filterBackground,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight:
                  mostrarMas || filtrosAdicionales > 0 ? "700" : "600",
                color:
                  mostrarMas || filtrosAdicionales > 0
                    ? theme.filterSelectedText
                    : theme.filterText,
              }}
            >
              Más filtros
            </Text>
            <Ionicons
              name={mostrarMas ? "chevron-up" : "chevron-down"}
              size={15}
              color={
                mostrarMas || filtrosAdicionales > 0
                  ? theme.filterSelectedText
                  : theme.filterText
              }
            />
          </View>
        </Pressable>
      </View>

      {mostrarMas && (
        <ScrollView
          className="mx-4 rounded-2xl"
          style={{ maxHeight: 260, backgroundColor: theme.filterPanel }}
          contentContainerStyle={{ gap: 12, padding: 12 }}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled
        >
          <View className="gap-2">
            <Text className="font-semibold" style={{ color: theme.text }}>
              Estado
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {estadosAdicionales.map(({ valor, etiqueta }) => (
                <FilterOption
                  key={valor}
                  etiqueta={etiqueta}
                  grupo="Estado"
                  seleccionado={value.estado === valor}
                  onPress={() => onChange({ ...value, estado: valor })}
                />
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text className="font-semibold" style={{ color: theme.text }}>
              Servicio
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {servicios.map(({ valor, etiqueta }) => (
                <FilterOption
                  key={valor}
                  etiqueta={etiqueta}
                  grupo="Servicio"
                  seleccionado={value.servicio === valor}
                  onPress={() => onChange({ ...value, servicio: valor })}
                />
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text className="font-semibold" style={{ color: theme.text }}>
              Prioridad
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {prioridades.map(({ valor, etiqueta }) => (
                <FilterOption
                  key={valor}
                  etiqueta={etiqueta}
                  grupo="Prioridad"
                  seleccionado={value.prioridad === valor}
                  onPress={() => onChange({ ...value, prioridad: valor })}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      <View className="min-h-7 justify-center px-4">
        <Text className="text-sm" style={{ color: theme.textSecondary }}>
          {total} {total === 1 ? "cita" : "citas"}
        </Text>
      </View>
    </View>
  );
}
