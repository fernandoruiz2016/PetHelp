import type { Solicitud, SolicitudFormData } from '../models/Solicitud';
import type { Usuario } from '../models/Usuario';

export interface SolicitudRepository {
  listar(): Promise<Solicitud[]>;
  listarPorCliente(clienteId: Usuario['uid']): Promise<Solicitud[]>;
  buscarPorCliente(id: Solicitud['id'], clienteId: Usuario['uid']): Promise<Solicitud | null>;
  horasOcupadas(fecha: string): Promise<number[]>;
  reservarParaCliente(dto: SolicitudFormData, clienteId: Usuario['uid']): Promise<Solicitud>;
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
