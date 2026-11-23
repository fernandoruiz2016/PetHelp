import { useTheme } from "@/presentation/context/ThemeContext";
import { useCerrarSesion } from "@/presentation/hooks/useCerrarSesion";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SolicitudesHeaderProps {
  nombre?: string;
  isHome: boolean;
  titulo?: string;
  onProfilePress?: () => void;
}

export function AppHeader({
  nombre,
  isHome,
  titulo = "Gestionar Citas",
  onProfilePress,
}: SolicitudesHeaderProps) {
  const { theme } = useTheme();
  const { salir, ocupado } = useCerrarSesion();

  return (
    <View
      className="h-36 flex-row justify-between items-center rounded-b-[30px] px-5 pt-10"
      style={{ backgroundColor: theme.headerBackground }}
    >
      {isHome ? (
        <>
          {onProfilePress && (
            <Pressable
              onPress={onProfilePress}
              accessibilityRole="button"
              accessibilityLabel="Abrir menú de perfil"
            >
              <Image
                source={require("../../../../assets/images/foto-perfil.png")}
                className="h-16 w-16 rounded-full border-[3px]"
                style={{ borderColor: theme.title }}
                resizeMode="cover"
              />
            </Pressable>
          )}

          <View className="flex-1 flex-row items-center justify-center">
            <View className="ml-5">
              <Text
                className="text-m font-semibold"
                style={{ color: theme.title }}
                numberOfLines={1}
              >
                Bienvenido, <Text className="font-bold italic">{nombre}!</Text>
              </Text>

              <Text
                className="text-[32px]"
                style={{
                  color: theme.headerForeground,
                  fontFamily: "Fredoka_700Bold",
                }}
                numberOfLines={1}
              >
                PetHelp
              </Text>
            </View>

            <Image
              source={require("../../../../assets/images/logo/logo-sin-fondo.png")}
              className="h-14 w-14"
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center"
            onPress={salir}
            disabled={ocupado}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            accessibilityState={{ disabled: ocupado }}
          >
            <Ionicons
              name="log-out-outline"
              size={35}
              color={theme.headerForeground}
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View className="h-14 w-14 justify-center">
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center"
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Ionicons
                name="arrow-back"
                size={35}
                color={theme.headerForeground}
              />
            </TouchableOpacity>
          </View>

          <View className="min-w-0 flex-1 items-center px-2">
            <Text
              className="text-center text-2xl font-bold"
              style={{ color: theme.headerForeground }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {titulo}
            </Text>
          </View>

          <Image
            source={require("../../../../assets/images/logo/logo-sin-fondo.png")}
            className="h-14 w-14"
            resizeMode="contain"
          />
        </>
      )}
    </View>
  );
}
