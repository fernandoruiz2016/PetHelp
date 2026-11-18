import { Solicitud, SolicitudFormData } from "@/domain/models/Solicitud";
import { generarCodigoCita } from "@/domain/services/generarCodigoCita";


import { createSolicitudRepository } from "@/infraestructure/repositories/solicitudRepository";
import { useSQLiteContext } from "expo-sqlite";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { solicitudesReducer } from "../reducers/SolicitudesReducer";

interface SolicitudesContextValue {
  solicitudes: Solicitud[];
  crear: (data: SolicitudFormData) => Promise<void>;
  actualizar: (id: number, datos: SolicitudFormData) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  buscar: (id: number) => Solicitud | undefined;
}

const SolicitudesContext = createContext<SolicitudesContextValue | undefined>(
  undefined,
);

export function SolicitudProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();

  const repository = useMemo(
    () => createSolicitudRepository(db),
    [db],
  );

  const [solicitudes, dispatch] = useReducer(solicitudesReducer, []);
  const codigosReservados = useRef(new Set<string>());

  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await repository.listar();

        data.forEach((solicitud) =>
          codigosReservados.current.add(solicitud.codigo),
        );

        dispatch({
          type: "CARGAR_SOLICITUDES_INICIALES",
          payload: data,
        });
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
      }
    }

    loadInitialData();
  }, [repository]);

  const crear = async (datos: SolicitudFormData) => {
    try {
      const codigo = generarCodigoCita(codigosReservados.current);

      const nuevaSolicitud = await repository.crear(datos, codigo);

      codigosReservados.current.add(codigo);

      dispatch({
        type: "CREAR",
        payload: nuevaSolicitud,
      });
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      throw error;
    }
  };

  const actualizar = async (id: number, datos: SolicitudFormData) => {
    try {
      await repository.actualizar(id, datos);

      dispatch({
        type: "ACTUALIZAR",
        payload: { id, datos },
      });
    } catch (error) {
      console.error("Error al actualizar solicitud:", error);
      throw error;
    }
  };

  const eliminar = async (id: number) => {
    try {
      await repository.eliminar(id);

      dispatch({
        type: "ELIMINAR",
        payload: id,
      });
    } catch (error) {
      console.error("Error al eliminar solicitud:", error);
      throw error;
    }
  };

  const buscar = (id: number) =>
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
