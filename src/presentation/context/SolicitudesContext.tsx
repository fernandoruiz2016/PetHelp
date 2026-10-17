import { container } from "@/di/container";
import { Solicitud } from "@/domain/models/Solicitud";
import { InputData } from "@/domain/use-cases/CreateSolicitudUseCase";
import { createContext, ReactNode, useEffect, useState } from "react";

type SolicitudesContextType = {
  solicitudes: Solicitud[];
  loading: boolean;
  crear: (data: InputData) => Promise<void>;
  actualizar: (solicitud: Solicitud) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
};

export const SolicitudesContext = createContext<SolicitudesContextType>({
  solicitudes: [],
  loading: true,
  crear: async () => {},
  actualizar: async () => {},
  eliminar: async () => {},
});

export const SolicitudesProvider = ({ children }: { children: ReactNode }) => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  const refrescar = async () => {
    setSolicitudes(await container.listSolicitudes.list());
  };

  useEffect(() => {
    refrescar().finally(() => setLoading(false));
  }, []);

  const crear = async (data: InputData) => {
    await container.createSolicitud.create(data);
    await refrescar();
  };

  const actualizar = async (solicitud: Solicitud) => {
    await container.updateSolicitud.update(solicitud);
    await refrescar();
  };

  const eliminar = async (id: string) => {
    await container.deleteSolicitud.delete(id);
    await refrescar();
  };

  return (
    <SolicitudesContext.Provider
      value={{ solicitudes, loading, crear, actualizar, eliminar }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
};
