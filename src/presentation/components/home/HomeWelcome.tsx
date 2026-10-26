import { useTheme } from "@/presentation/context/ThemeContext";
import { Image, Text, View } from "react-native";

interface HomeWelcomeProps {
  mensaje: string;
}

export const HomeWelcome = ({ mensaje }: HomeWelcomeProps) => {
  const { theme } = useTheme();

  return (
    <View
      className="mb-8 w-full rounded-3xl border p-5"
      style={{
        backgroundColor: theme.form,
        borderColor: theme.border,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Text
          className="text-2xl font-extrabold"
          style={{ color: theme.title }}
        >
          {mensaje}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        <Text
          className="w-3/5 text-base"
          style={{ color: theme.textSecondary }}
        >
          En el panel de control puedes acceder ver y crear solicitudes
        </Text>

        <Image
          source={require("../../../../assets/images/home.png")}
          className="h-28 w-2/5"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
