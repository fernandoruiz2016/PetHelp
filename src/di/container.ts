import { SolicitudMemoryRepository } from "@/data/repositories/SolicitudMemoryRepository";
import { CreateSolicitudUseCase } from "@/domain/use-cases/CreateSolicitudUseCase";
import { DeleteSolicitudUseCase } from "@/domain/use-cases/DeleteSolicitudUseCase";
import { GetSolicitudByIdUseCase } from "@/domain/use-cases/GetSolicitudUseCase";
import { ListSolicitudesUseCase } from "@/domain/use-cases/ListSolicitudesUseCase";
import { UpdateSolicitudUseCase } from "@/domain/use-cases/UpdateSolicitudUseCase";

const repository = new SolicitudMemoryRepository();

export const container = {
  listSolicitudes: new ListSolicitudesUseCase(repository),
  createSolicitud: new CreateSolicitudUseCase(repository, () =>
    Date.now().toString(),
  ),
  updateSolicitud: new UpdateSolicitudUseCase(repository),
  deleteSolicitud: new DeleteSolicitudUseCase(repository),
  getSolicitud: new GetSolicitudByIdUseCase(repository),
};
