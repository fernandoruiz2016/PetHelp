import type {
  EstadoSolicitud,
  PrioridadSolicitud,
} from "@/domain/models/Solicitud";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Text, View } from "react-native";

type ChipProps = {
  label: string;
  backgroundColor: string;
  textColor: string;
};

function Chip({ label, backgroundColor, textColor }: ChipProps) {
  return (
    <View
      className="self-start rounded-full px-2.5 py-1"
      style={{ backgroundColor }}
    >
      <Text className="text-xs font-semibold" style={{ color: textColor }}>
        {label}
      </Text>
    </View>
  );
}

export function EstadoChip({ estado }: { estado: EstadoSolicitud }) {
  const { theme, colorScheme } = useTheme();
  const estilos: Record<EstadoSolicitud, ChipProps> = {
    PENDIENTE: {
      label: "Pendiente",
      backgroundColor: theme.accentSoft,
      textColor: theme.text,
    },
    EN_ATENCION: {
      label: "En atención",
      backgroundColor: theme.primarySoft,
      textColor: theme.text,
    },
    FINALIZADO: {
      label: "Finalizada",
      backgroundColor: theme.success,
      textColor: colorScheme === "dark" ? theme.onPrimary : theme.onPrimary,
    },
    CANCELADA: {
      label: "Cancelada",
      backgroundColor: theme.border,
      textColor: theme.text,
    },
  };

  return <Chip {...estilos[estado]} />;
}

export function PrioridadChip({
  prioridad,
}: {
  prioridad: PrioridadSolicitud;
}) {
  const { theme } = useTheme();
  const estilos: Record<PrioridadSolicitud, ChipProps> = {
    NORMAL: {
      label: "Normal",
      backgroundColor: theme.border,
      textColor: theme.text,
    },
    ALTA: {
      label: "Alta",
      backgroundColor: theme.accentSoft,
      textColor: theme.text,
    },
    URGENTE: {
      label: "Urgente",
      backgroundColor: theme.error,
      textColor: theme.onPrimary,
    },
  };

  return <Chip {...estilos[prioridad]} />;
}
