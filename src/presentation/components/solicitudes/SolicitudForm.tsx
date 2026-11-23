import type { Solicitud, SolicitudFormData } from "@/domain/models/Solicitud";
import { HorarioCitaNoDisponible, rangoDiaCita } from "@/domain/services/horariosCita";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useHorasOcupadas } from "@/presentation/hooks/useHorasOcupadas";
import { useSolicitudForm } from "@/presentation/hooks/useSolicitudForm";
import { type ReactNode, useMemo, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import CustomDateInput from "../shared/CustomDateInput";
import { CustomSelectInput } from "../shared/CustomSelectInput";
import { CustomTextInput } from "../shared/CustomTextInput";
import CustomTimeInput from "../shared/CustomTimeInput";
import { PrimaryButton } from "../shared/PrimaryButton";

type SolicitudFormProps = {
  initialValues?: Partial<SolicitudFormData>;
  submitLabel: string;
  onSubmit: (datos: SolicitudFormData) => Promise<void>;
  children?: ReactNode;
} & (
  | { modo?: "admin"; solicitudId?: Solicitud["id"]; citas: Solicitud[] }
  | { modo: "cliente"; consultarHorarios: (fecha: string) => Promise<number[]> }
);

export function SolicitudForm(props: SolicitudFormProps) {
  const { initialValues, submitLabel, onSubmit, children } = props;
  const esCliente = props.modo === "cliente";
  const solicitudId = esCliente ? undefined : props.solicitudId;
  const citasAdmin = esCliente ? undefined : props.citas;
  const { theme } = useTheme();
  const {
    form,
    errors,
    horaSeleccionada,
    actualizarCampo,
    actualizarFecha,
    actualizarHora,
    prepararDatos,
  } = useSolicitudForm(initialValues);

  const dia = form.fechaCita ? rangoDiaCita(form.fechaCita) : null;
  const desde = dia?.desde ?? "";
  const hasta = dia?.hasta;
  const horariosCliente = useHorasOcupadas(desde, esCliente ? props.consultarHorarios : undefined);
  const horasAdmin = useMemo(() => {
    if (!citasAdmin || !desde || !hasta) return [];

    return citasAdmin
      .filter((cita) => cita.estado !== "CANCELADA" && cita.id !== solicitudId &&
        cita.fechaCita >= desde && cita.fechaCita < hasta)
      .map(({ fechaCita }) => new Date(fechaCita).getHours());
  }, [citasAdmin, desde, hasta, solicitudId]);
  const horariosBloqueados = horariosCliente.cargando || horariosCliente.error;
  const [guardando, setGuardando] = useState(false);
  const envioEnCurso = useRef(false);

  const enviar = async () => {
    if (envioEnCurso.current || horariosBloqueados) return;
    const datos = prepararDatos();
    if (!datos) return;

    envioEnCurso.current = true;
    setGuardando(true);
    try {
      await onSubmit(datos);
    } catch (error) {
      if (error instanceof HorarioCitaNoDisponible) {
        actualizarFecha(datos.fechaCita);
        horariosCliente.recargar();
        Alert.alert("Horario no disponible", error.message);
      } else {
        Alert.alert("No se pudo guardar la cita", "Inténtalo de nuevo.");
      }
    } finally {
      envioEnCurso.current = false;
      setGuardando(false);
    }
  };

  return (
    <View>
      <CustomTextInput
        label="Nombre del cliente"
        placeholder="Ej. Carlos Pérez"
        value={form.clienteNombre}
        onChangeText={(valor) => actualizarCampo("clienteNombre", valor)}
        editable={!esCliente}
        error={errors.clienteNombre}
      />

      <CustomTextInput
        label="Teléfono"
        placeholder="Número de teléfono"
        value={form.telefono}
        onChangeText={(valor) => actualizarCampo("telefono", valor)}
        keyboardType="phone-pad"
        autoCapitalize="none"
        error={errors.telefono}
      />

      <CustomTextInput
        label="Nombre mascota"
        placeholder="Snoopy"
        value={form.mascotaNombre}
        onChangeText={(valor) => actualizarCampo("mascotaNombre", valor)}
        error={errors.mascotaNombre}
      />

      <CustomSelectInput
        label="Especie de mascota"
        value={form.especieMascota}
        options={[
          { label: "Perro", value: "PERRO" },
          { label: "Gato", value: "GATO" },
          { label: "Otro", value: "OTRO" },
        ]}
        onValueChange={(valor) => actualizarCampo("especieMascota", valor)}
        error={errors.especieMascota}
      />

      <CustomSelectInput
        label="Tipo de servicio"
        value={form.tipoServicio}
        options={[
          { label: "Consulta", value: "CONSULTA" },
          { label: "Vacunación", value: "VACUNACION" },
          { label: "Grooming", value: "GROOMING" },
          { label: "Emergencia", value: "EMERGENCIA" },
        ]}
        onValueChange={(valor) => actualizarCampo("tipoServicio", valor)}
        error={errors.tipoServicio}
      />

      {!esCliente && (
        <CustomSelectInput
          label="Prioridad"
          value={form.prioridad}
          options={[
            { label: "Normal", value: "NORMAL" },
            { label: "Alta", value: "ALTA" },
            { label: "Urgente", value: "URGENTE" },
          ]}
          onValueChange={(valor) => actualizarCampo("prioridad", valor)}
          error={errors.prioridad}
        />
      )}

      {solicitudId !== undefined && (
        <CustomSelectInput
          label="Estado"
          value={form.estado}
          options={[
            { label: "Pendiente", value: "PENDIENTE" },
            { label: "En atención", value: "EN_ATENCION" },
            { label: "Finalizado", value: "FINALIZADO" },
            { label: "Cancelada", value: "CANCELADA" },
          ]}
          onValueChange={(valor) => actualizarCampo("estado", valor)}
          error={errors.estado}
        />
      )}

      <CustomTextInput
        label="Descripción"
        placeholder="Describe el motivo de la consulta"
        value={form.descripcion}
        onChangeText={(valor) => actualizarCampo("descripcion", valor)}
        error={errors.descripcion}
        multiline
      />

      <CustomDateInput
        value={form.fechaCita}
        onChange={actualizarFecha}
        error={errors.fechaCita}
      />

      <CustomTimeInput
        value={form.fechaCita}
        onChange={actualizarHora}
        horaSeleccionada={horaSeleccionada}
        horasOcupadas={esCliente ? horariosCliente.horas : horasAdmin}
        disabled={guardando || horariosBloqueados}
        error={errors.horaCita}
      />
      {horariosCliente.cargando && (
        <Text className="mb-3" style={{ color: theme.textSecondary }}>Consultando horarios…</Text>
      )}
      {horariosCliente.error && (
        <Pressable accessibilityRole="button" className="mb-3 py-2" onPress={horariosCliente.recargar}>
          <Text style={{ color: theme.error }}>No se pudieron consultar los horarios. Reintentar</Text>
        </Pressable>
      )}

      {children}

      <PrimaryButton
        title={guardando ? "Guardando…" : submitLabel}
        onPress={enviar}
        disabled={guardando || horariosBloqueados}
      />
    </View>
  );
}
