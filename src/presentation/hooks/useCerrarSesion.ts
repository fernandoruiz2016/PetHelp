import { useAuth } from "@/presentation/context/AuthContext";
import { Alert } from "react-native";

export function useCerrarSesion() {
  const { cerrarSesion, ocupado } = useAuth();

  async function salir() {
    try {
      await cerrarSesion();
    } catch {
      Alert.alert("No se pudo cerrar la sesión", "Intenta de nuevo.");
    }
  }

  return { salir, ocupado };
}
