import { useTheme } from "@/presentation/context/ThemeContext";
import { Image, Text, View } from "react-native";

interface SolicitudesHeaderProps {
  nombre: string;
}

export function SolicitudesHeader({ nombre }: SolicitudesHeaderProps) {
  const { theme } = useTheme();

  return (
    <View
      className="h-40 flex-row items-center rounded-b-[30px] px-5 pt-12"
      style={{ backgroundColor: theme.primary }}
    >
      <Image
        source={require("../../../../assets/images/foto-perfil.png")}
        className="h-16 w-16 rounded-full border-[3px]"
        style={{ borderColor: theme.title }}
        resizeMode="cover"
      />

      <View className="mx-3 flex-1">
        <Text
          className="text-sm font-semibold"
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
  );
}
