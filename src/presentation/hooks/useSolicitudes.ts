import { useSolicitudes as useSolicitudesContext } from "@/presentation/context/SolicitudesContext";

export const useSolicitudes = () => {
  const { solicitudes } = useSolicitudesContext();
  const hoy = new Date().toDateString();

  const solicitudesHoy = solicitudes.filter(
    (solicitud) => new Date(solicitud.fechaRegistro).toDateString() === hoy,
  );

  return {
    totalHoy: solicitudesHoy.length,
    solicitudesPendientes: solicitudesHoy.filter(
      (solicitud) => solicitud.estado === "PENDIENTE",
    ).length,
    solicitudesEnAtencion: solicitudesHoy.filter(
      (solicitud) => solicitud.estado === "EN_ATENCION",
    ).length,
    solicitudesFinalizadas: solicitudesHoy.filter(
      (solicitud) => solicitud.estado === "FINALIZADO",
    ).length,
  };
};
