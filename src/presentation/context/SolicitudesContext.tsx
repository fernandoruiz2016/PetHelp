import { initialData } from "@/data/SolicitudesIniciales";
import { Solicitud, SolicitudFormData } from "@/domain/models/Solicitud";
import { generarCodigoCita } from "@/domain/services/generarCodigoCita";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { solicitudesReducer } from "../reducers/SolicitudesReducer";

interface SolicitudesContextValue {
  solicitudes: Solicitud[];
  crear: (data: SolicitudFormData) => void;
  actualizar: (id: string, datos: SolicitudFormData) => void;
  eliminar: (id: string) => void;
  buscar: (id: string) => Solicitud | undefined;
}

const SolicitudesContext = createContext<SolicitudesContextValue | undefined>(
  undefined,
);

export function SolicitudProvider({ children }: PropsWithChildren) {
  const [solicitudes, dispatch] = useReducer(solicitudesReducer, []);
  const codigosReservados = useRef(new Set<string>());

  useEffect(() => {
    async function loadInitialData() {
      const data = await initialData();
      data.forEach((solicitud) =>
        codigosReservados.current.add(solicitud.codigo),
      );
      dispatch({ type: "CARGAR_SOLICITUDES_INICIALES", payload: data });
    }

    loadInitialData();
  }, []);

  const crear = (datos: SolicitudFormData) => {
    const codigo = generarCodigoCita(codigosReservados.current);
    codigosReservados.current.add(codigo);
    const nuevaSolicitud: Solicitud = {
      ...datos,
      id: Date.now().toString(),
      codigo,
      fechaRegistro: new Date().toISOString(),
      estado: "PENDIENTE",
    };
    dispatch({
      type: "CREAR",
      payload: nuevaSolicitud,
    });
  };
  const actualizar = (id: string, datos: SolicitudFormData) => {
    dispatch({
      type: "ACTUALIZAR",
      payload: { id, datos },
    });
  };
  const eliminar = (id: string) => {
    dispatch({
      type: "ELIMINAR",
      payload: id,
    });
  };

  const buscar = (id: string) =>
    solicitudes.find((solicitud) => solicitud.id === id);

  return (
    <SolicitudesContext.Provider
      value={{ solicitudes, crear, actualizar, eliminar, buscar }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
}

export function useSolicitudes() {
  const context = useContext(SolicitudesContext);
  if (!context) {
    throw new Error("Debe utilizarse dentro del provider");
  }
  return context;
}
