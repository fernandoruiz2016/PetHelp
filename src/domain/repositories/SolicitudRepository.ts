import { Solicitud } from "../models/Solicitud";

export interface SolicitudRepository {
  list(): Promise<Solicitud[]>;
  getById(id: string): Promise<Solicitud | null>;
  create(solicitud: Solicitud): Promise<void>;
  update(solicitud: Solicitud): Promise<void>;
  delete(id: string): Promise<void>;
}
