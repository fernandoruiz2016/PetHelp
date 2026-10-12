import { Solicitud } from "../models/Solicitud";
import { SolicitudRepository } from "../repositories/SolicitudRepository";

export class GetSolicitudByIdUseCase {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  public async getById(id: string): Promise<Solicitud | null> {
    return await this.solicitudRepository.getById(id);
  }
}
