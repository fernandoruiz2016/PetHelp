import { Solicitud } from "@/domain/models/Solicitud";
import { SolicitudRepository } from "@/domain/repositories/SolicitudRepository";
import { solicitudesIniciales } from "../SolicitudesIniciales";

export class SolicitudMemoryRepository implements SolicitudRepository {
  private solicitudes: Solicitud[] = [...solicitudesIniciales];

  public async list() {
    return [...this.solicitudes];
  }

  public async getById(id: string) {
    return this.solicitudes.find((s) => s.id === id) ?? null;
  }

  public async create(solicitud: Solicitud) {
    this.solicitudes = [solicitud, ...this.solicitudes];
  }

  public async update(solicitud: Solicitud) {
    this.solicitudes = this.solicitudes.map((s) =>
      s.id === solicitud.id ? solicitud : s,
    );
  }

  public async delete(id: string) {
    this.solicitudes = this.solicitudes.filter((s) => s.id !== id);
  }
}
