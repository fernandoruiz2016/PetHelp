import { useTheme } from "@/presentation/context/ThemeContext";
import { Image, Text, View } from "react-native";

interface HomeWelcomeProps {
  mensaje: string;
}

export const HomeWelcome = ({ mensaje }: HomeWelcomeProps) => {
  const { theme } = useTheme();

  return (
    <View
      className="mb-8 w-full rounded-3xl border p-5 pb-0 flex-row"
      style={{
        backgroundColor: theme.form,
        borderColor: theme.border,
      }}
    >
      <View className="flex-col items-start gap-3 w-3/5 ">
        <Text
          className="text-2xl font-extrabold"
          style={{ color: theme.title }}
        >
          {mensaje}
        </Text>

        <Text
          className="text-base"
          style={{ color: theme.textSecondary }}
        >
          En el panel de control puedes ver y crear citas
        </Text>
      </View>

      <View className="mt-0 flex-row items-center gap-2 w-2/5">
        

        <Image
          source={require("../../../../assets/images/home.png")}
          className="h-32 flex-1"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
