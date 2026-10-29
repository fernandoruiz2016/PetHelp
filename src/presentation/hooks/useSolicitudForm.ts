
import { TipoServicio } from "@/domain/enums/TipoServicio";
import { SolicitudFormData } from "@/domain/models/Solicitud";
import { useState } from "react";

type FormErrors = Partial<Record<keyof SolicitudFormData, string>>;

const valoresVacios: SolicitudFormData = {
  clienteNombre: "",
  telefono: "",
  mascotaNombre: "",
  especieMascota: "PERRO",
  tipoServicio: TipoServicio.CONSULTA,
  descripcion: "",
  fechaCita: "",
};

export function useSolicitudForm(
  initialValues: SolicitudFormData = valoresVacios
) {
  const [form, setForm] = useState<SolicitudFormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const actualizarCampo = (
    campo: keyof SolicitudFormData,
    valor: string
  ) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));

    setErrors((actuales) => ({
      ...actuales,
      [campo]: undefined,
    }));
  };

  const validar = () => {
    const nuevosErrores: FormErrors = {};

    if (form.clienteNombre.trim().length < 3) nuevosErrores.clienteNombre = "Ingresa al menos 3 caracteres";
    if (!form.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    if (!form.mascotaNombre.trim()) nuevosErrores.mascotaNombre = "El nombre de la mascota es obligatorio";
    if (!form.descripcion.trim()) nuevosErrores.descripcion = "La descripción es obligatoria";
    if (!form.fechaCita.trim()) nuevosErrores.fechaCita = "La fecha es obligatoria";

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
    actualizarCampo,
    validar,
    prepararDatos,
  };
}
