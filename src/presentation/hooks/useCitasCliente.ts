import type { SolicitudFormData } from "@/domain/models/Solicitud";
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

    return {
      clienteNombre,
      telefono: cliente.telefono ?? "",
      listar: () => repositorio.listarPorCliente(cliente.uid),
      buscar: (id: number) => repositorio.buscarPorCliente(id, cliente.uid),
      consultarHorarios: repositorio.horasOcupadas,
      reservar: (datos: SolicitudFormData) =>
        repositorio.reservarParaCliente({ ...datos, clienteNombre }, cliente.uid),
    };
  }, [cliente, db]);
}
