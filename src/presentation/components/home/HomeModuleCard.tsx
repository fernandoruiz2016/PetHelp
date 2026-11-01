import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

interface HomeModuleCardProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const HomeModuleCard = ({
  title,
  iconName,
  onPress,
}: HomeModuleCardProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      className="w-full flex-row items-center justify-center rounded-2xl border p-5 shadow-lg shadow-black/50 elevation-8"
      style={{
        backgroundColor: theme.form,
        borderColor: theme.border,
      }}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <Ionicons name={iconName} size={28} color={theme.primary} />
      <Text
        className="ml-3 shrink text-center text-base font-bold"
        style={{ color: theme.text }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
