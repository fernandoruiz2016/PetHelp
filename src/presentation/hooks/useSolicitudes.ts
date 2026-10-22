import { solicitudesIniciales } from "@/data/SolicitudesIniciales";

export const useSolicitudes = () => {
    const hoy = new Date().toDateString();

    const solicitudesHoy = solicitudesIniciales.filter(
        (solicitud) =>
            new Date(solicitud.fechaRegistro).toDateString() === hoy
    );

    const solicitudesPendientes = solicitudesHoy.filter(
        (solicitud) => solicitud.estado === "PENDIENTE"
    ).length;

    const solicitudesFinalizadas = solicitudesHoy.filter(
        (solicitud) => solicitud.estado === "FINALIZADO"
    ).length;

    const solicitudesEnAtencion = solicitudesHoy.filter(
        (solicitud) => solicitud.estado === "EN_ATENCION"
    ).length;

    return {
        totalHoy: solicitudesHoy.length,
        solicitudesPendientes,
        solicitudesFinalizadas,
        solicitudesEnAtencion,
    };
};