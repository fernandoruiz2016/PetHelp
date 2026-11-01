import type { Solicitud } from "@/domain/models/Solicitud";
import { MascotaAvatar } from "@/presentation/components/shared/MascotaAvatar";
import { ServicioLabel } from "@/presentation/components/shared/ServicioLabel";
import {
  EstadoChip,
  PrioridadChip,
} from "@/presentation/components/shared/SolicitudChips";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

interface SolicitudDetalleProps {
  solicitud: Solicitud;
}

type IconName = ComponentProps<typeof Ionicons>["name"];

const especies: Record<Solicitud["especieMascota"], string> = {
  PERRO: "Perro",
  GATO: "Gato",
  OTRO: "Otro",
};

function formatearFecha(fecha: Date, opciones: Intl.DateTimeFormatOptions) {
  return Number.isNaN(fecha.getTime())
    ? "Fecha no disponible"
    : new Intl.DateTimeFormat("es-PE", opciones).format(fecha);
}

function InfoRow({
  icono,
  etiqueta,
  valor,
}: {
  icono: IconName;
  etiqueta: string;
  valor: string;
}) {
  const { theme } = useTheme();

  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-3">
      <Ionicons name={icono} size={23} color={theme.textSecondary} />
      <View className="min-w-0 flex-1">
        <Text className="text-xs" style={{ color: theme.textSecondary }}>
          {etiqueta}
        </Text>
        <Text
          className="text-sm font-semibold"
          style={{ color: theme.text }}
          selectable
        >
          {valor}
        </Text>
      </View>
    </View>
  );
}

export function SolicitudDetalle({ solicitud }: SolicitudDetalleProps) {
  const { theme } = useTheme();
  const fechaCita = new Date(solicitud.fechaCita);
  const fechaRegistro = new Date(solicitud.fechaRegistro);

  return (
    <View style={{ flexGrow: 1, flexShrink: 0 }}>
      <View
        className="rounded-3xl border p-4 shadow-lg shadow-black/10 elevation-6"
        style={{
          flexGrow: 1,
          backgroundColor: theme.form,
          borderColor: theme.border,
        }}
      >
        <View className="flex-row items-center gap-3">
          <MascotaAvatar especie={solicitud.especieMascota} grande />
          <View className="min-w-0 flex-1">
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              Mascota
            </Text>
            <Text
              className="text-xl font-bold"
              style={{ color: theme.text }}
              numberOfLines={1}
            >
              {solicitud.mascotaNombre}
            </Text>
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              Especie: {especies[solicitud.especieMascota]}
            </Text>
          </View>
          <View className="items-center gap-1">
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              Estado
            </Text>
            <EstadoChip estado={solicitud.estado} />
          </View>
        </View>

        <View className="mt-5 flex-row items-start">
          <View className="w-1/3 min-w-0 gap-1 pr-2">
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              Servicio
            </Text>
            <ServicioLabel servicio={solicitud.tipoServicio} />
          </View>
          <View
            className="w-1/3 min-w-0 items-center gap-1 border-x px-2"
            style={{ borderColor: theme.border }}
          >
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              Prioridad
            </Text>
            <View className="self-center">
              <PrioridadChip prioridad={solicitud.prioridad} />
            </View>
          </View>
          <View className="w-1/3 min-w-0 items-end gap-1 pl-2">
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              Código
            </Text>
            <Text
              className="text-right text-xs font-semibold"
              style={{ color: theme.text }}
              selectable
            >
              {solicitud.codigo}
            </Text>
          </View>
        </View>

        <View className="mt-4 border-t" style={{ borderColor: theme.border }} />
        <View className="grow justify-center py-4">
          <InfoRow
            icono="document-text-outline"
            etiqueta="Descripción"
            valor={solicitud.descripcion}
          />
        </View>
        <View className="border-t" style={{ borderColor: theme.border }} />
        <View className="grow justify-center py-4">
          <InfoRow
            icono="calendar-outline"
            etiqueta="Fecha de la cita"
            valor={formatearFecha(fechaCita, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        </View>
        <View className="border-t" style={{ borderColor: theme.border }} />
        <View className="grow justify-center py-4">
          <InfoRow
            icono="time-outline"
            etiqueta="Hora de la cita"
            valor={formatearFecha(fechaCita, {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          />
        </View>
        <View className="border-t" style={{ borderColor: theme.border }} />
        <View className="grow flex-row items-center py-4">
          <InfoRow
            icono="person-outline"
            etiqueta="Cliente"
            valor={solicitud.clienteNombre}
          />
          <View
            className="mx-3 border-l"
            style={{ borderColor: theme.border }}
          />
          <InfoRow
            icono="call-outline"
            etiqueta="Teléfono"
            valor={solicitud.telefono}
          />
        </View>
        <View className="border-t" style={{ borderColor: theme.border }} />
        <Text className="pt-3 text-xs" style={{ color: theme.textSecondary }}>
          Registrada:{" "}
          {formatearFecha(fechaRegistro, {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}
