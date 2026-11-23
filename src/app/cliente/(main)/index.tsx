import type { Solicitud } from "@/domain/models/Solicitud";
import { HomeModuleCard } from "@/presentation/components/home/HomeModuleCard";
import { HomeScreen } from "@/presentation/components/home/HomeScreen";
import { HomeWelcome } from "@/presentation/components/home/HomeWelcome";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { SolicitudItem } from "@/presentation/components/solicitudes/SolicitudItem";
import { useAuth } from "@/presentation/context/AuthContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useCitasCliente } from "@/presentation/hooks/useCitasCliente";
import { useConsultaCitasCliente } from "@/presentation/hooks/useConsultaCitasCliente";
import { nombreUsuario } from "@/presentation/utils/nombreUsuario";
import { router, useNavigation } from "expo-router";
import type { DrawerNavigationProp } from "expo-router/drawer";
import { ActivityIndicator, Text, View } from "react-native";

function ordenarCitas(citas: Solicitud[]) {
  const ahora = Date.now();
  const proximas: Solicitud[] = [];
  const historial: Solicitud[] = [];

  // SQLite entrega las citas de la más antigua a la más reciente.
  for (const cita of citas) {
    const abierta = cita.estado === "PENDIENTE" || cita.estado === "EN_ATENCION";
    if (abierta && new Date(cita.fechaCita).getTime() >= ahora) {
      proximas.push(cita);
    } else {
      historial.push(cita);
    }
  }

  return proximas.concat(historial.reverse());
}

export default function ClienteRoute() {
  const navigation = useNavigation<DrawerNavigationProp<{ index: undefined }>>(
    "/cliente/(main)",
  );
  const { sesion } = useAuth();
  const { theme } = useTheme();
  const citas = useCitasCliente();
  const { lectura, reintentar } = useConsultaCitasCliente(citas?.listar);
  if (sesion.estado !== "lista" || sesion.usuario.rol !== "cliente") return null;

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
      <View className="mt-5 gap-6">
        <HomeModuleCard
          title="Reservar cita"
          iconName="add-circle-outline"
          onPress={() => router.push("/cliente/citas/nueva")}
        />
        <View className="gap-3">
          <Text className="text-2xl font-extrabold" style={{ color: theme.title }} accessibilityRole="header">
            Tus citas
          </Text>
          {lectura.estado === "cargando" && (
            <ActivityIndicator accessibilityLabel="Cargando citas" color={theme.primary} />
          )}
          {lectura.estado === "error" && (
            <>
              <Text style={{ color: theme.textSecondary }}>No se pudieron cargar tus citas.</Text>
              <PrimaryButton title="Reintentar" onPress={reintentar} />
            </>
          )}
          {lectura.estado === "lista" && (lectura.datos.length === 0 ? (
            <Text style={{ color: theme.textSecondary }}>Aún no tienes citas.</Text>
          ) : (
            ordenarCitas(lectura.datos).map((cita) => (
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
