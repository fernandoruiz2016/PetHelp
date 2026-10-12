import { SolicitudRepository } from "../repositories/SolicitudRepository";

export class DeleteSolicitudUseCase {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  public async delete(id: string): Promise<void> {
    await this.solicitudRepository.delete(id);
  }
}
