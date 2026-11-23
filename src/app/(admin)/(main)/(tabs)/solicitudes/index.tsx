import { TipoServicio } from "@/domain/enums/TipoServicio";
import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import {
  filtrosIniciales,
  SolicitudFilters,
  type FiltrosSolicitud,
} from "@/presentation/components/shared/SolicitudFilters";
import { SolicitudSearch } from "@/presentation/components/shared/SolicitudSearch";
import { SolicitudesList } from "@/presentation/components/shared/SolicitudesList";
import { useSolicitudes } from "@/presentation/context/SolicitudesContext";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

const estadosDeInicio: Record<string, FiltrosSolicitud["estado"]> = {
  hoy: "TODAS",
  pendientes: "PENDIENTE",
  en_atencion: "EN_ATENCION",
  finalizadas: "FINALIZADO",
};

const titulosPorEstado: Record<FiltrosSolicitud["estado"], string> = {
  TODAS: "Citas",
  PENDIENTE: "Citas pendientes",
  EN_ATENCION: "Citas en atención",
  FINALIZADO: "Citas finalizadas",
  CANCELADA: "Citas canceladas",
};

const estadosValidos: FiltrosSolicitud["estado"][] = [
  "TODAS",
  "PENDIENTE",
  "EN_ATENCION",
  "FINALIZADO",
  "CANCELADA",
];

const prioridadesValidas: FiltrosSolicitud["prioridad"][] = [
  "TODAS",
  "NORMAL",
  "ALTA",
  "URGENTE",
];

const serviciosValidos: FiltrosSolicitud["servicio"][] = [
  "TODOS",
  ...Object.values(TipoServicio),
];

const normalizarBusqueda = (texto: string) =>
  texto
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function SolicitudesRoute() {
  const { solicitudes } = useSolicitudes();
  const { filtro, estado, fecha, servicio, prioridad } = useLocalSearchParams<{
    filtro?: string;
    estado?: string;
    fecha?: string;
    servicio?: string;
    prioridad?: string;
  }>();
  const [busqueda, setBusqueda] = useState("");
  const termino = normalizarBusqueda(busqueda);
  const hoy = new Date().toDateString();

  const filtroDeInicio =
    typeof filtro === "string" &&
    Object.prototype.hasOwnProperty.call(estadosDeInicio, filtro);

  const filtros: FiltrosSolicitud = filtroDeInicio
    ? {
        ...filtrosIniciales,
        estado: estadosDeInicio[filtro],
        fecha: "HOY",
      }
    : {
        estado: estadosValidos.includes(estado as FiltrosSolicitud["estado"])
          ? (estado as FiltrosSolicitud["estado"])
          : "TODAS",
        fecha: fecha === "HOY" ? "HOY" : "TODAS",
        servicio: serviciosValidos.includes(
          servicio as FiltrosSolicitud["servicio"],
        )
          ? (servicio as FiltrosSolicitud["servicio"])
          : "TODOS",
        prioridad: prioridadesValidas.includes(
          prioridad as FiltrosSolicitud["prioridad"],
        )
          ? (prioridad as FiltrosSolicitud["prioridad"])
          : "TODAS",
      };

  const actualizarFiltros = (nuevos: FiltrosSolicitud) => {
    router.setParams({ filtro: "", ...nuevos });
  };

  const titulo =
    filtros.fecha === "HOY"
      ? `${titulosPorEstado[filtros.estado]} de hoy`
      : filtros.estado !== "TODAS"
        ? titulosPorEstado[filtros.estado]
        : "Listado de Citas";

  const hayFiltros =
    filtros.estado !== "TODAS" ||
    filtros.fecha !== "TODAS" ||
    filtros.servicio !== "TODOS" ||
    filtros.prioridad !== "TODAS";

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    if (
      filtros.fecha === "HOY" &&
      new Date(solicitud.fechaCita).toDateString() !== hoy
    )
      return false;
    if (filtros.estado !== "TODAS" && solicitud.estado !== filtros.estado)
      return false;
    if (
      filtros.servicio !== "TODOS" &&
      solicitud.tipoServicio !== filtros.servicio
    )
      return false;
    if (
      filtros.prioridad !== "TODAS" &&
      solicitud.prioridad !== filtros.prioridad
    )
      return false;

    if (!termino) return true;

    return [
      solicitud.mascotaNombre,
      solicitud.clienteNombre,
      solicitud.codigo,
    ].some((valor) => normalizarBusqueda(valor).includes(termino));
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScreenLayout
        style={{ justifyContent: "center", padding: 0 }}
        areaSegura="sinVertical"
        conFondo={false}
      >
        <AppHeader titulo={titulo} nombre="Martín" isHome={false} />

        <SolicitudSearch value={busqueda} onChangeText={setBusqueda} />
        <SolicitudFilters
          value={filtros}
          onChange={actualizarFiltros}
          total={solicitudesFiltradas.length}
        />

        <SolicitudesList
          solicitudes={solicitudesFiltradas}
          mensajeVacio={
            termino
              ? `No hay citas que coincidan con “${busqueda.trim()}”${hayFiltros ? " con los filtros actuales" : ""}.`
              : hayFiltros
                ? "No hay citas con estos filtros. Pulsa Todos para ver la lista completa."
                : undefined
          }
        />
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
