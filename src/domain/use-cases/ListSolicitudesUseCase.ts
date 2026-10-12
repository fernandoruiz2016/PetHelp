import { Solicitud } from "../models/Solicitud";
import { SolicitudRepository } from "../repositories/SolicitudRepository";

export class ListSolicitudesUseCase {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  public async list(): Promise<Solicitud[]> {
    return await this.solicitudRepository.list();
  }
}
