import type { Solicitud, SolicitudFormData } from "@/domain/models/Solicitud";
import { generarCodigoCita } from "@/domain/services/generarCodigoCita";
import { sincronizarSolicitudes } from "@/infraestructure/firebase/sincronizacionFirestore";
import { createSolicitudRepository } from "@/infraestructure/repositories/solicitudRepository";
import { useAuth } from "@/presentation/context/AuthContext";
import { useSincronizacionAutomatica } from "@/presentation/hooks/useSincronizacionAutomatica";
import { useSQLiteContext } from "expo-sqlite";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { solicitudesReducer } from "../reducers/SolicitudesReducer";

interface SolicitudesContextValue {
  solicitudes: Solicitud[];
  sincronizando: boolean;
  conectado: boolean;
  crear: (
    data: SolicitudFormData,
    clienteId?: Solicitud["clienteId"],
  ) => Promise<void>;
  actualizar: (
    id: number,
    datos: SolicitudFormData,
    veterinarioId?: Solicitud["veterinarioId"] | null,
  ) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  buscar: (id: number) => Solicitud | undefined;
  sincronizar: () => Promise<void>;
}

const SolicitudesContext = createContext<SolicitudesContextValue | undefined>(
  undefined,
);

export function SolicitudProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const { sesion } = useAuth();
  const usuario = sesion.estado === "lista" ? sesion.usuario : undefined;

  const repository = useMemo(() => createSolicitudRepository(db), [db]);

  const [solicitudes, dispatch] = useReducer(solicitudesReducer, []);
  const [sincronizando, setSincronizando] = useState(false);
  const codigosReservados = useRef(new Set<string>());
  const cargaInicial = useRef<Promise<void> | undefined>(undefined);
  const montado = useRef(true);

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  const recargarDesdeSQLite = useCallback(async () => {
    const data = await repository.listar();
    if (!montado.current) return;
    codigosReservados.current = new Set(data.map((item) => item.codigo));
    dispatch({
      type: "CARGAR_SOLICITUDES_INICIALES",
      payload: data,
    });
  }, [repository]);

  const sincronizar = useCallback(async () => {
    if (!usuario) return;
    setSincronizando(true);
    try {
      await sincronizarSolicitudes(db, {
        rol: usuario.rol,
        uid: usuario.uid,
      });
      await recargarDesdeSQLite();
    } catch (error) {
      console.warn("Error al sincronizar solicitudes:", error);
    } finally {
      if (montado.current) setSincronizando(false);
    }
  }, [db, recargarDesdeSQLite, usuario]);

  const { conectado } = useSincronizacionAutomatica(
    sincronizar,
    Boolean(usuario),
  );

  useEffect(() => {
    let vigente = true;

    async function loadInitialData() {
      try {
        const data = await repository.listar();
        if (!vigente) return;

        codigosReservados.current = new Set(data.map((item) => item.codigo));
        dispatch({
          type: "CARGAR_SOLICITUDES_INICIALES",
          payload: data,
        });

        if (usuario) {
          void sincronizar();
        }
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
      }
    }

    cargaInicial.current = loadInitialData();
    return () => {
      vigente = false;
    };
  }, [repository, sincronizar, usuario]);

  const crear = async (
    datos: SolicitudFormData,
    clienteId?: Solicitud["clienteId"],
  ) => {
    await cargaInicial.current;
    const codigo = generarCodigoCita(codigosReservados.current);
    codigosReservados.current.add(codigo);

    try {
      const nuevaSolicitud = await repository.crear(datos, codigo, clienteId);

      dispatch({
        type: "CREAR",
        payload: nuevaSolicitud,
      });

      void sincronizar();
    } catch (error) {
      codigosReservados.current.delete(codigo);
      console.error("Error al crear solicitud:", error);
      throw error;
    }
  };

  const actualizar = async (
    id: number,
    datos: SolicitudFormData,
    veterinarioId?: Solicitud["veterinarioId"] | null,
  ) => {
    try {
      await repository.actualizar(id, datos, veterinarioId);

      dispatch({
        type: "ACTUALIZAR",
        payload: { id, datos, veterinarioId },
      });

      void sincronizar();
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

      void sincronizar();
    } catch (error) {
      console.error("Error al eliminar solicitud:", error);
      throw error;
    }
  };

  const buscar = (id: number) =>
    solicitudes.find((solicitud) => solicitud.id === id);

  return (
    <SolicitudesContext.Provider
      value={{
        solicitudes,
        sincronizando,
        conectado,
        crear,
        actualizar,
        eliminar,
        buscar,
        sincronizar,
      }}
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
