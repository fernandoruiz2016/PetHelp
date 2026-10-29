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
      className="w-full flex-row items-center justify-center rounded-2xl border p-5"
      style={{
        backgroundColor: theme.form,
        borderColor: theme.border,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={iconName} size={28} color={theme.primary} />
      <Text
        className="ml-3 text-m font-bold"
        style={{ color: theme.text }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
