import { Solicitud } from "../models/Solicitud";
import { SolicitudRepository } from "../repositories/SolicitudRepository";

export type InputData = Omit<Solicitud, "id" | "fechaRegistro">;

export class CreateSolicitudUseCase {
  constructor(
    private readonly solicitudRepository: SolicitudRepository,
    private readonly generateId: () => string,
  ) {}
  public async create(data: InputData): Promise<void> {
    const solicitud: Solicitud = {
      id: this.generateId(),
      clienteNombre: data.clienteNombre,
      telefono: data.telefono,
      mascotaNombre: data.mascotaNombre,
      tipoServicio: data.tipoServicio,
      prioridad: data.prioridad,
      descripcion: data.descripcion,
      estado: data.estado,
      fechaRegistro: new Date(),
    };

    await this.solicitudRepository.create(solicitud);
  }
}
