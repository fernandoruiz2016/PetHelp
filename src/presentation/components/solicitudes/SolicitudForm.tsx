// AÑADIDO: formulario reutilizado para crear y editar, con validación de campos.
import type { Solicitud, SolicitudFormData } from "@/domain/models/Solicitud";
import { useSolicitudes } from "@/presentation/context/SolicitudesContext";
import { useSolicitudForm } from "@/presentation/hooks/useSolicitudForm";
import { type ReactNode, useRef, useState } from "react";
import { Alert, View } from "react-native";
import CustomDateInput from "../shared/CustomDateInput";
import { CustomSelectInput } from "../shared/CustomSelectInput";
import { CustomTextInput } from "../shared/CustomTextInput";
import CustomTimeInput from "../shared/CustomTimeInput";
import { PrimaryButton } from "../shared/PrimaryButton";

interface SolicitudFormProps {
  initialValues?: SolicitudFormData;
  solicitudId?: Solicitud["id"];
  submitLabel: string;
  onSubmit: (datos: SolicitudFormData) => Promise<void>;
  children?: ReactNode;
}

export function SolicitudForm({
  initialValues,
  solicitudId,
  submitLabel,
  onSubmit,
  children,
}: SolicitudFormProps) {
  const {
    form,
    errors,
    horaSeleccionada,
    actualizarCampo,
    actualizarFecha,
    actualizarHora,
    prepararDatos,
  } = useSolicitudForm(initialValues);

  const { solicitudes } = useSolicitudes();
  const [guardando, setGuardando] = useState(false);
  const envioEnCurso = useRef(false);

  const enviar = async () => {
    if (envioEnCurso.current) return;
    const datos = prepararDatos();
    if (!datos) return;

    envioEnCurso.current = true;
    setGuardando(true);
    try {
      await onSubmit(datos);
    } catch {
      Alert.alert("No se pudo guardar la cita", "Inténtalo de nuevo.");
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
        citas={solicitudes}
        excluirSolicitudId={solicitudId}
        error={errors.horaCita}
      />

      {children}

      <PrimaryButton
        title={guardando ? "Guardando…" : submitLabel}
        onPress={enviar}
        disabled={guardando}
      />
    </View>
  );
}
