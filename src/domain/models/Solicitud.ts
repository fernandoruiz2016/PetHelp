import { TipoServicio } from "../enums/TipoServicio";

export type EstadoSolicitud =
  "PENDIENTE" | "EN_ATENCION" | "FINALIZADO" | "CANCELADA";

export type PrioridadSolicitud = "NORMAL" | "ALTA" | "URGENTE";

export type EspecieMascota = "PERRO" | "GATO" | "OTRO";

export interface Solicitud {
  id: string;
  clienteNombre: string;
  telefono: string;
  mascotaNombre: string;
  especieMascota: EspecieMascota;
  tipoServicio: TipoServicio;
  prioridad: PrioridadSolicitud;
  descripcion: string;
  estado: EstadoSolicitud;
  fechaCita: string;
  fechaRegistro: string;
}

export type SolicitudFormData = Omit<
  Solicitud,
  "id" | "fechaRegistro" | "estado" | "prioridad"
>;
