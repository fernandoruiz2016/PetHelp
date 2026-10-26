import { useTheme } from "@/presentation/context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
  onPress: () => void;
}

export const HomeHeader = ({ onPress }: HomeHeaderProps) => {
  const { theme } = useTheme();

  return (
    <View className="mb-8 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Text
          className="text-3xl font-extrabold"
          style={{ color: theme.title }}
        >
          PetHelp
        </Text>
      </View>

      <TouchableOpacity
        className="rounded-xl px-3 py-2"
        style={{ backgroundColor: theme.accentSoft }}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text className="text-sm font-bold" style={{ color: theme.text }}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};
