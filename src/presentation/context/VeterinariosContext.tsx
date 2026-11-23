import type { DatosVeterinario, Veterinario } from "@/domain/models/Veterinario";
import { createVeterinarioRepository } from "@/infraestructure/repositories/veterinarioRepository";
import { useSQLiteContext } from "expo-sqlite";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { veterinariosReducer } from "../reducers/VeterinariosReducer";

interface VeterinariosContextValue {
  veterinarios: Veterinario[];
  cargando: boolean;
  crear: (datos: DatosVeterinario) => Promise<Veterinario>;
  actualizar: (id: string, datos: DatosVeterinario) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
  buscar: (id: string) => Veterinario | undefined;
  recargar: () => Promise<void>;
}

const VeterinariosContext = createContext<VeterinariosContextValue | undefined>(
  undefined,
);

export function VeterinariosProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const repository = useMemo(() => createVeterinarioRepository(db), [db]);

  const [veterinarios, dispatch] = useReducer(veterinariosReducer, []);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await repository.listar();
      dispatch({
        type: "CARGAR_VETERINARIOS_INICIALES",
        payload: data,
      });
    } catch (error) {
      console.error("Error al cargar veterinarios:", error);
      throw error;
    } finally {
      setCargando(false);
    }
  }, [repository]);

  useEffect(() => {
    let vigente = true;

    async function loadInitialData() {
      setCargando(true);
      try {
        const data = await repository.listar();
        if (!vigente) return;
        dispatch({
          type: "CARGAR_VETERINARIOS_INICIALES",
          payload: data,
        });
      } catch (error) {
        console.error("Error al cargar veterinarios:", error);
      } finally {
        if (vigente) setCargando(false);
      }
    }

    void loadInitialData();
    return () => {
      vigente = false;
    };
  }, [repository]);

  const crear = useCallback(
    async (datos: DatosVeterinario) => {
      try {
        const nuevo = await repository.crear(datos);
        dispatch({
          type: "CREAR",
          payload: nuevo,
        });
        return nuevo;
      } catch (error) {
        console.error("Error al crear veterinario:", error);
        throw error;
      }
    },
    [repository],
  );

  const actualizar = useCallback(
    async (id: string, datos: DatosVeterinario) => {
      try {
        await repository.actualizar(id, datos);
        dispatch({
          type: "ACTUALIZAR",
          payload: { id, datos },
        });
      } catch (error) {
        console.error("Error al actualizar veterinario:", error);
        throw error;
      }
    },
    [repository],
  );

  const eliminar = useCallback(
    async (id: string) => {
      try {
        await repository.eliminar(id);
        dispatch({
          type: "ELIMINAR",
          payload: id,
        });
      } catch (error) {
        console.error("Error al eliminar veterinario:", error);
        throw error;
      }
    },
    [repository],
  );

  const buscar = useCallback(
    (id: string) => veterinarios.find((veterinario) => veterinario.id === id),
    [veterinarios],
  );

  return (
    <VeterinariosContext.Provider
      value={{
        veterinarios,
        cargando,
        crear,
        actualizar,
        eliminar,
        buscar,
        recargar,
      }}
    >
      {children}
    </VeterinariosContext.Provider>
  );
}

export function useVeterinarios() {
  const context = useContext(VeterinariosContext);
  if (!context) {
    throw new Error("Debe utilizarse dentro de VeterinariosProvider");
  }
  return context;
}
