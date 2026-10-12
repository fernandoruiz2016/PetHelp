import { TipoServicio } from "../enums/TipoServicio";

export type EstadoSolicitud = "PENDIENTE" | "EN_ATENCION" | "FINALIZADO";

export type PrioridadSolicitud = "BAJA" | "MEDIA" | "ALTA" | "URGENTE";

export interface Solicitud {
  id: string;
  clienteNombre: string;
  telefono: string;
  mascotaNombre: string;
  tipoServicio: TipoServicio;
  prioridad: PrioridadSolicitud;
  descripcion: string;
  estado: EstadoSolicitud;
  fechaRegistro: Date;
}
