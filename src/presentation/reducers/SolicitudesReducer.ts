import { Solicitud, SolicitudFormData } from "@/domain/models/Solicitud";

export type SolicitudAction =
  | { type: "CREAR"; payload: Solicitud }
  | { type: "ACTUALIZAR"; payload: { id: string; datos: SolicitudFormData } }
  | { type: "ELIMINAR"; payload: string }
  | { type: "CARGAR_SOLICITUDES_INICIALES"; payload: Solicitud[] };

export function solicitudesReducer(
  state: Solicitud[],
  action: SolicitudAction,
) {
  switch (action.type) {
    case "CREAR":
      return [...state, action.payload];
    case "ACTUALIZAR":
      return state.map((solicitud) =>
        solicitud.id === action.payload.id
          ? { ...solicitud, ...action.payload.datos }
          : solicitud,
      );

    case "ELIMINAR":
      return state.filter((solicitud) => solicitud.id !== action.payload);

    case "CARGAR_SOLICITUDES_INICIALES":
      return action.payload;

    default:
      return state;
  }
}
