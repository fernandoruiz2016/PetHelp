import type { EspecieMascota } from "@/domain/models/Solicitud";
import { useTheme } from "@/presentation/context/ThemeContext";
import { Image, type ImageSourcePropType } from "react-native";

const avatares: Record<EspecieMascota, ImageSourcePropType> = {
  PERRO: require("../../../../assets/images/mascotas/perro.png"),
  GATO: require("../../../../assets/images/mascotas/gato.png"),
  OTRO: require("../../../../assets/images/mascotas/otro.png"),
};

export function MascotaAvatar({
  especie,
  grande = false,
}: {
  especie: EspecieMascota;
  grande?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <Image
      source={avatares[especie]}
      className={`${grande ? "h-16 w-16" : "h-12 w-12"} rounded-full border-2`}
      style={{ borderColor: theme.accent }}
      resizeMode="cover"
      accessible={false}
    />
  );
}
