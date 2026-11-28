import type { SolicitudFormData } from "@/domain/models/Solicitud";
import { sincronizarSolicitudes } from "@/infraestructure/firebase/sincronizacionFirestore";
import { createSolicitudRepository } from "@/infraestructure/repositories/solicitudRepository";
import { useAuth } from "@/presentation/context/AuthContext";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useCitasCliente() {
  const db = useSQLiteContext();
  const { sesion } = useAuth();
  const cliente = sesion.estado === "lista" && sesion.usuario.rol === "cliente"
    ? sesion.usuario
    : undefined;

  return useMemo(() => {
    if (!cliente) return null;
    const repositorio = createSolicitudRepository(db);
    const clienteNombre = [cliente.nombre, cliente.apellidos].filter(Boolean).join(" ");

    const sincronizar = async () => {
      try {
        await sincronizarSolicitudes(db, { rol: "cliente", uid: cliente.uid });
      } catch {
        // Sin conexión o error temporal: la app sigue operando con SQLite.
      }
    };

    return {
      clienteNombre,
      telefono: cliente.telefono ?? "",
      sincronizar,
      listar: async () => {
        await sincronizar();
        return repositorio.listarPorCliente(cliente.uid);
      },
      buscar: (id: number) => repositorio.buscarPorCliente(id, cliente.uid),
      consultarHorarios: repositorio.horasOcupadas,
      reservar: async (datos: SolicitudFormData) => {
        const cita = await repositorio.reservarParaCliente({ ...datos, clienteNombre }, cliente.uid);
        void sincronizar();
        return cita;
      },
    };
  }, [cliente, db]);
}
