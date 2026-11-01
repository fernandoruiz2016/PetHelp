import { TipoServicio } from "@/domain/enums/TipoServicio";
import { SolicitudFormData } from "@/domain/models/Solicitud";
import { useState } from "react";

type FormErrors = Partial<Record<keyof SolicitudFormData | "horaCita", string>>;

const valoresVacios: SolicitudFormData = {
  clienteNombre: "",
  telefono: "",
  mascotaNombre: "",
  especieMascota: "PERRO",
  tipoServicio: TipoServicio.CONSULTA,
  prioridad: "NORMAL",
  estado: "PENDIENTE",
  descripcion: "",
  fechaCita: "",
};

export function useSolicitudForm(
  initialValues: SolicitudFormData = valoresVacios,
) {
  const [form, setForm] = useState<SolicitudFormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [horaSeleccionada, setHoraSeleccionada] = useState(
    Boolean(initialValues.fechaCita),
  );

  const actualizarCampo = (campo: keyof SolicitudFormData, valor: string) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));

    setErrors((actuales) => ({
      ...actuales,
      [campo]: undefined,
    }));
  };

  const actualizarFecha = (fecha: string) => {
    setHoraSeleccionada(false);
    actualizarCampo("fechaCita", fecha);
  };

  const actualizarHora = (fecha: string) => {
    setHoraSeleccionada(true);
    actualizarCampo("fechaCita", fecha);
    setErrors((actuales) => ({ ...actuales, horaCita: undefined }));
  };

  const validar = () => {
    const nuevosErrores: FormErrors = {};

    if (form.clienteNombre.trim().length < 3)
      nuevosErrores.clienteNombre = "Ingresa al menos 3 caracteres";
    if (!form.telefono.trim())
      nuevosErrores.telefono = "El teléfono es obligatorio";
    if (!form.mascotaNombre.trim())
      nuevosErrores.mascotaNombre = "El nombre de la mascota es obligatorio";
    if (!form.descripcion.trim())
      nuevosErrores.descripcion = "La descripción es obligatoria";
    if (!form.fechaCita.trim())
      nuevosErrores.fechaCita = "La fecha es obligatoria";
    else if (!horaSeleccionada)
      nuevosErrores.horaCita = "Selecciona una hora para la cita";
    if (!["NORMAL", "ALTA", "URGENTE"].includes(form.prioridad)) {
      nuevosErrores.prioridad = "Selecciona una prioridad válida";
    }

    setErrors(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const prepararDatos = (): SolicitudFormData | null => {
    if (!validar()) return null;

    return {
      ...form,
      clienteNombre: form.clienteNombre.trim(),
      telefono: form.telefono.trim(),
      mascotaNombre: form.mascotaNombre.trim(),
      descripcion: form.descripcion.trim(),
    };
  };

  return {
    form,
    errors,
    horaSeleccionada,
    actualizarCampo,
    actualizarFecha,
    actualizarHora,
    validar,
    prepararDatos,
  };
}
