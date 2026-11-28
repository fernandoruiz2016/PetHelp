import type { Solicitud } from "@/domain/models/Solicitud";
import { HomeModuleCard } from "@/presentation/components/home/HomeModuleCard";
import { HomeScreen } from "@/presentation/components/home/HomeScreen";
import { HomeWelcome } from "@/presentation/components/home/HomeWelcome";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { SyncStatusBanner } from "@/presentation/components/shared/SyncStatusBanner";
import { SolicitudItem } from "@/presentation/components/solicitudes/SolicitudItem";
import { useAuth } from "@/presentation/context/AuthContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useCitasCliente } from "@/presentation/hooks/useCitasCliente";
import { useConsultaCitasCliente } from "@/presentation/hooks/useConsultaCitasCliente";
import { useFechaActual } from "@/presentation/hooks/useFechaActual";
import { useSincronizacionAutomatica } from "@/presentation/hooks/useSincronizacionAutomatica";
import { nombreUsuario } from "@/presentation/utils/nombreUsuario";
import { router, useNavigation } from "expo-router";
import type { DrawerNavigationProp } from "expo-router/drawer";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const filtrosCitas = [
  { valor: "hoy", etiqueta: "Hoy", mensajeVacio: "No tienes citas para hoy." },
  { valor: "proximas", etiqueta: "Próximas", mensajeVacio: "Aún no tienes citas próximas." },
  { valor: "historial", etiqueta: "Historial", mensajeVacio: "Aún no tienes citas en tu historial." },
] as const;

function agruparCitas(citas: Solicitud[], fechaActual: Date) {
  const ahora = Date.now();
  const diaActual = fechaActual.toDateString();
  const hoy: Solicitud[] = [];
  const proximas: Solicitud[] = [];
  const historial: Solicitud[] = [];

  // SQLite entrega las citas de la más antigua a la más reciente.
  for (const cita of citas) {
    const fechaCita = new Date(cita.fechaCita);
    const esHoy = fechaCita.toDateString() === diaActual;
    const abierta = cita.estado === "PENDIENTE" || cita.estado === "EN_ATENCION";

    if (esHoy) hoy.push(cita);
    if (!abierta || fechaCita.getTime() < ahora) {
      historial.push(cita);
    } else if (!esHoy) {
      proximas.push(cita);
    }
  }

  return { hoy, proximas, historial: historial.reverse() };
}

export default function ClienteRoute() {
  const navigation = useNavigation<DrawerNavigationProp<{ index: undefined }>>(
    "/cliente/(main)",
  );
  const { sesion } = useAuth();
  const { theme } = useTheme();
  const fechaActual = useFechaActual();
  const citas = useCitasCliente();
  const { lectura, reintentar } = useConsultaCitasCliente(citas?.listar);
  const { conectado } = useSincronizacionAutomatica(reintentar, Boolean(citas));
  const [filtro, setFiltro] = useState<(typeof filtrosCitas)[number]>(filtrosCitas[0]);
  if (sesion.estado !== "lista" || sesion.usuario.rol !== "cliente") return null;

  const citasVisibles = lectura.estado === "lista" ? agruparCitas(lectura.datos, fechaActual)[filtro.valor] : [];
  const pendientes = lectura.estado === "lista" ? lectura.datos.filter((item) => !item.sincronizado).length : 0;

  return (
    <HomeScreen
      nombre={nombreUsuario(sesion.usuario)}
      abrirPerfil={() => navigation.openDrawer()}
      areaSegura="sinSuperior"
    >
      <HomeWelcome
        mensaje="¡Nos alegra que estés aquí!"
        descripcion="Aquí podrás reservar y consultar tus citas"
      />
      <SyncStatusBanner
        conectado={conectado}
        pendientes={pendientes}
        onSincronizar={reintentar}
      />
      <View className="mt-5 gap-6">
        <HomeModuleCard
          title="Reservar cita"
          iconName="add-circle-outline"
          onPress={() => {
            setFiltro(filtrosCitas[0]);
            router.push("/cliente/citas/nueva");
          }}
        />
        <View className="gap-3">
          <Text className="text-center text-2xl font-extrabold" style={{ color: theme.title }} accessibilityRole="header">
            Tus citas
          </Text>
          <View className="flex-row flex-wrap justify-center gap-2">
            {filtrosCitas.map((opcion) => {
              const seleccionado = filtro.valor === opcion.valor;

              return (
                <Pressable
                  key={opcion.valor}
                  accessibilityRole="button"
                  accessibilityState={{ selected: seleccionado }}
                  className="min-h-11 items-center justify-center rounded-full px-3.5 py-2"
                  style={{ backgroundColor: seleccionado ? theme.filterSelectedBackground : theme.filterBackground }}
                  onPress={() => setFiltro(opcion)}
                >
                  <Text
                    className={seleccionado ? "text-sm font-bold" : "text-sm font-semibold"}
                    style={{ color: seleccionado ? theme.filterSelectedText : theme.filterText }}
                  >
                    {opcion.etiqueta}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {lectura.estado === "cargando" && (
            <ActivityIndicator accessibilityLabel="Cargando citas" color={theme.primary} />
          )}
          {lectura.estado === "error" && (
            <>
              <Text className="text-center" style={{ color: theme.textSecondary }}>No se pudieron cargar tus citas.</Text>
              <PrimaryButton className="self-center px-6" title="Reintentar" onPress={reintentar} />
            </>
          )}
          {lectura.estado === "lista" && (citasVisibles.length === 0 ? (
            <Text className="text-center" style={{ color: theme.textSecondary }}>{filtro.mensajeVacio}</Text>
          ) : (
            citasVisibles.map((cita) => (
              <SolicitudItem
                key={cita.id}
                solicitud={cita}
                mostrarPrioridad={false}
                onVerDetalles={(id) => router.push({ pathname: "/cliente/citas/[id]", params: { id } })}
              />
            ))
          ))}
        </View>
      </View>
    </HomeScreen>
  );
}
