import type { Solicitud, SolicitudFormData } from '../models/Solicitud';

export interface SolicitudRepository {
  listar(): Promise<Solicitud[]>;
  crear(
    dto: SolicitudFormData,
    codigo: string,
    clienteId?: Solicitud['clienteId'],
  ): Promise<Solicitud>;
  // Omitir el veterinario conserva la asignación. Pasar null la quita.
  actualizar(
    id: number,
    datos: SolicitudFormData,
    veterinarioId?: Solicitud['veterinarioId'] | null,
  ): Promise<void>;
  eliminar(id: number): Promise<void>;
}
