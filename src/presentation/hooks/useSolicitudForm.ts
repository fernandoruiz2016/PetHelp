import { TipoServicio } from "@/domain/enums/TipoServicio";
import { Solicitud, SolicitudFormData } from "@/domain/models/Solicitud";
import { useState } from "react";
import { Alert } from "react-native";
import { useSolicitudes } from "../context/SolicitudesContext";

export function useSolicitudForm() {
  const { crear, actualizar } = useSolicitudes();
  const [clienteNombre, setClienteNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mascotaNombre, setMascotaNombre] = useState("");
  const [tipoServicio, setTipoServicio] = useState<TipoServicio | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [fechaCita, setFechaCita] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const limpiar = () => {
    setClienteNombre("");
    setTelefono("");
    setMascotaNombre("");
    setTipoServicio(null);
    setDescripcion("");
    setFechaCita("");
    setEditandoId(null);
  };

  const guardar = () => {
    if (
      !clienteNombre.trim() ||
      !telefono.trim() ||
      !mascotaNombre.trim() ||
      tipoServicio === null ||
      !descripcion.trim() ||
      !fechaCita.trim() ||
      Number.isNaN(Date.parse(fechaCita))
    ) {
      Alert.alert("Datos incompletos", "Llena todos los campos");
      return;
    }
    const datos: SolicitudFormData = {
      clienteNombre: clienteNombre.trim(),
      telefono: telefono.trim(),
      mascotaNombre: mascotaNombre.trim(),
      tipoServicio,
      descripcion: descripcion.trim(),
      fechaCita,
    };
    if (editandoId) actualizar(editandoId, datos);
    else crear(datos);
    limpiar();
  };

  const comenzarEdicion = (solicitud: Solicitud) => {
    (setClienteNombre(solicitud.clienteNombre),
      setTelefono(solicitud.telefono),
      setMascotaNombre(solicitud.mascotaNombre),
      setTipoServicio(solicitud.tipoServicio),
      setDescripcion(solicitud.descripcion),
      setFechaCita(solicitud.fechaCita),
      setEditandoId(solicitud.id));
  };

  return {
    clienteNombre,
    setClienteNombre,
    telefono,
    setTelefono,
    mascotaNombre,
    setMascotaNombre,
    tipoServicio,
    setTipoServicio,
    descripcion,
    setDescripcion,
    fechaCita,
    setFechaCita,
    editandoId,
    guardar,
    limpiar,
    comenzarEdicion,
  };
}
