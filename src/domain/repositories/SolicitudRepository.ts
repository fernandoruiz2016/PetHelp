import type { Solicitud, SolicitudFormData } from '../models/Solicitud';

export interface SolicitudRepository{
  listar():Promise<Solicitud[]>;
  crear(dto: SolicitudFormData, codigo: string):Promise<Solicitud>;
  actualizar(id: number, datos: SolicitudFormData):Promise<void>;
  eliminar(id: number):Promise<void>;
}