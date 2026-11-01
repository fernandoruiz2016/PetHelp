import { useTheme } from "@/presentation/context/ThemeContext";
import { Image, Text, View } from "react-native";

interface HomeWelcomeProps {
  mensaje: string;
}

export const HomeWelcome = ({ mensaje }: HomeWelcomeProps) => {
  const { theme } = useTheme();

  return (
    <View
      className="w-full flex-row items-center rounded-3xl border px-5 pt-4 shadow-lg shadow-black/50 elevation-8"
      style={{
        backgroundColor: theme.form,
        borderColor: theme.border,
      }}
    >
      <View className="w-3/5 items-start gap-2 pb-3">
        <Text
          className="text-2xl font-extrabold"
          style={{ color: theme.title }}
        >
          {mensaje}
        </Text>

        <Text className="text-base" style={{ color: theme.textSecondary }}>
          Aquí podrás administrar las citas
        </Text>
      </View>

      <View className="w-2/5 flex-row self-end">
        <Image
          source={require("../../../../assets/images/home.png")}
          className="h-24 flex-1"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
