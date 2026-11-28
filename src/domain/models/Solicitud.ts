import { TipoServicio } from "../enums/TipoServicio";
import type { Usuario } from "./Usuario";
import type { Veterinario } from "./Veterinario";

export type EstadoSolicitud =
  "PENDIENTE" | "EN_ATENCION" | "FINALIZADO" | "CANCELADA";

export type PrioridadSolicitud = "NORMAL" | "ALTA" | "URGENTE";

export type EspecieMascota = "PERRO" | "GATO" | "OTRO";

export interface Solicitud {
  id: number;
  codigo: string;
  clienteId?: Usuario["uid"];
  veterinarioId?: Veterinario["id"];
  clienteNombre: string;
  telefono: string;
  mascotaNombre: string;
  especieMascota: EspecieMascota;
  razaMascota?: string;
  tipoServicio: TipoServicio;
  prioridad: PrioridadSolicitud;
  descripcion: string;
  estado: EstadoSolicitud;
  fechaCita: string;
  fechaRegistro: string;
  sincronizado?: boolean;
}

export type SolicitudFormData = Omit<
  Solicitud,
  "id" | "codigo" | "clienteId" | "veterinarioId" | "fechaRegistro" | "sincronizado"
>;
