import { router } from "expo-router";

export const estadosDeInicio = {
  hoy: "TODAS",
  pendientes: "PENDIENTE",
  en_atencion: "EN_ATENCION",
  finalizadas: "FINALIZADO",
} as const;

type FiltroResumenCitas = keyof typeof estadosDeInicio;

export function esFiltroResumenCitas(valor: unknown): valor is FiltroResumenCitas {
  return typeof valor === "string" && Object.prototype.hasOwnProperty.call(estadosDeInicio, valor);
}

export function abrirCitasAdmin(filtro?: FiltroResumenCitas) {
  router.navigate({
    pathname: "/solicitudes",
    params: { filtro: filtro ?? "", estado: "", fecha: "", servicio: "", prioridad: "" },
  });
}
