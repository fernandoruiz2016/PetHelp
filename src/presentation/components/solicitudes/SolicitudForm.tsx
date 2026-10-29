// AÑADIDO: formulario reutilizado para crear y editar, con validación de campos.
import { TipoServicio } from '@/domain/enums/TipoServicio';
import { SolicitudFormData } from '@/domain/models/Solicitud';
import { useState } from 'react';
import { View } from 'react-native';
import { CustomSelectInput } from '../shared/CustomSelectInput';
import { CustomTextInput } from '../shared/CustomTextInput';
import { PrimaryButton } from '../shared/PrimaryButton';

interface SolicitudFormProps {

  initialValues?: SolicitudFormData;
  submitLabel: string;
  onSubmit: (datos: SolicitudFormData) => void;
}


type FormErrors = Partial<Record<keyof SolicitudFormData, string>>;
const valoresVacios: SolicitudFormData = { clienteNombre: '', telefono: '', mascotaNombre: '', especieMascota: 'PERRO', tipoServicio: TipoServicio.CONSULTA, descripcion: '', fechaCita: '', };


export function SolicitudForm({ initialValues = valoresVacios, submitLabel, onSubmit }: SolicitudFormProps) {

  const [form, setForm] = useState<SolicitudFormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  // Actualización inmutable de una propiedad calculada: nombre, correo o carrera.
  const actualizarCampo = (campo: keyof SolicitudFormData, valor: string) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setErrors((actuales) => ({ ...actuales, [campo]: undefined }));
  };


  const validar = () => {
    const nuevosErrores: FormErrors = {};
    if (form.clienteNombre.trim().length < 3) nuevosErrores.clienteNombre = 'Ingresa al menos 3 caracteres';
    if (!form.telefono.trim()) nuevosErrores.telefono = 'El teléfono es obligatorio';
    if (!form.mascotaNombre.trim()) nuevosErrores.mascotaNombre = 'El nombre de la mascota es obligatorio';
    if (!form.descripcion.trim()) nuevosErrores.descripcion = 'La descripción es obligatoria';
    if (!form.fechaCita.trim()) nuevosErrores.fechaCita = 'La fecha es obligatoria';

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };


  const enviar = () => {
    if (!validar()) return;
    onSubmit({
      ...form,
      clienteNombre: form.clienteNombre.trim(),
      telefono: form.telefono.trim(),
      mascotaNombre: form.mascotaNombre.trim(),
      descripcion: form.descripcion.trim(),
    });
  };

  return (
    <View>
      <CustomTextInput
        label="Nombre completo"
        placeholder="Ej. Carlos Pérez"
        value={form.clienteNombre}
        onChangeText={(valor) => actualizarCampo('clienteNombre', valor)}
        error={errors.clienteNombre} />

      <CustomTextInput
        label="Teléfono"
        placeholder="Número de teléfono"
        value={form.telefono}
        onChangeText={(valor) => actualizarCampo('telefono', valor)}
        keyboardType="numeric"
        autoCapitalize="none"
        error={errors.telefono} />

      <CustomTextInput
        label="Nombre mascota"
        placeholder="Snoopy"
        value={form.mascotaNombre}
        onChangeText={(valor) => actualizarCampo('mascotaNombre', valor)}
        error={errors.mascotaNombre} />

      <CustomSelectInput
        label="Especie de mascota"
        value={form.especieMascota}
        options={[
          { label: "Perro", value: "PERRO" },
          { label: "Gato", value: "GATO" },
          { label: "Otro", value: "OTRO" },
        ]}
        onValueChange={(valor) =>
          actualizarCampo("especieMascota", valor)
        }
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
        onValueChange={(valor) =>
          actualizarCampo("tipoServicio", valor)
        }
        error={errors.tipoServicio}
      />

      <CustomTextInput
        label="Descripción"
        placeholder="Describe el motivo de la consulta"
        value={form.descripcion}
        onChangeText={(valor) => actualizarCampo("descripcion", valor)}
        error={errors.descripcion}
        multiline
      />

      <CustomTextInput
        label="Fecha de cita"
        placeholder="Ej. 2026-11-05"
        value={form.fechaCita}
        onChangeText={(valor) => actualizarCampo("fechaCita", valor)}
        error={errors.fechaCita}
      />

      <PrimaryButton title={submitLabel} onPress={enviar} />
    </View>
  );
}
