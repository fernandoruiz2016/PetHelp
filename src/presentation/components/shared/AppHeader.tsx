import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface SolicitudesHeaderProps {
  nombre?: string;
  isHome: boolean;
  titulo?: string;
}

export function AppHeader({ nombre, isHome, titulo="Gestionar Citas" }: SolicitudesHeaderProps) {
  const { theme } = useTheme();

  return (

    <View
      className="h-36 flex-row justify-between items-center rounded-b-[30px] px-5 pt-4"
      style={{ backgroundColor: theme.primary }}
    >

      {isHome ? (
        <>
          <Image
            source={require("../../../../assets/images/foto-perfil.png")}
            className="h-16 w-16 rounded-full border-[3px]"
            style={{ borderColor: theme.title }}
            resizeMode="cover"
          />

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
                className="text-[32px] font-bold"
                style={{ color: theme.onPrimary }}
                numberOfLines={1}
              >
                VetHelp
              </Text>
            </View>

            <Image
              source={require("../../../../assets/images/logo/logo-sin-fondo.png")}
              className="h-14 w-14"
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Ionicons name="log-out-outline" size={35} color={theme.onPrimary} />
          </TouchableOpacity>
        </>
      ) : (
        <>


          <View className="flex-1 flex-row items-center justify-center pl-12">

            <TouchableOpacity className="absolute left-0" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={35} color={theme.onPrimary} />
            </TouchableOpacity>

            <Text
              className="text-3xl font-bold"
              style={{ color: theme.onPrimary }}
              numberOfLines={1}
            >
              {titulo}
            </Text>

            <Image
              source={require("../../../../assets/images/logo/logo-sin-fondo.png")}
              className="h-14 w-14"
              resizeMode="contain"
            />
          </View>


        </>
      )}


    </View>
  );
}
