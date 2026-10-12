import { Solicitud } from "../models/Solicitud";
import { SolicitudRepository } from "../repositories/SolicitudRepository";

export class UpdateSolicitudUseCase {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  public async update(solicitud: Solicitud): Promise<void> {
    await this.solicitudRepository.update(solicitud);
  }
}
