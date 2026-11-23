import type { Solicitud, SolicitudFormData } from "@/domain/models/Solicitud";

export type SolicitudAction =
  | { type: "CREAR"; payload: Solicitud }
  | {
      type: "ACTUALIZAR";
      payload: {
        id: number;
        datos: SolicitudFormData;
        veterinarioId?: Solicitud["veterinarioId"] | null;
      };
    }
  | { type: "ELIMINAR"; payload: number }
  | { type: "CARGAR_SOLICITUDES_INICIALES"; payload: Solicitud[] };

export function solicitudesReducer(
  state: Solicitud[],
  action: SolicitudAction,
) {
  switch (action.type) {
    case "CREAR":
      return [...state, action.payload];
    case "ACTUALIZAR": {
      const { id, datos, veterinarioId } = action.payload;
      return state.map((solicitud) =>
        solicitud.id === id
          ? {
              ...solicitud,
              ...datos,
              veterinarioId:
                veterinarioId === undefined
                  ? solicitud.veterinarioId
                  : veterinarioId ?? undefined,
            }
          : solicitud,
      );
    }

    case "ELIMINAR":
      return state.filter((solicitud) => solicitud.id !== action.payload);

    case "CARGAR_SOLICITUDES_INICIALES":
      return action.payload;

    default:
      return state;
  }
}
