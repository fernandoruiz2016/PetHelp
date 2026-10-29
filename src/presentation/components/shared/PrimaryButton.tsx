import { useTheme } from "@/presentation/context/ThemeContext";
import { Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

export const PrimaryButton = ({
  title,
  onPress,
  className = "",
}: PrimaryButtonProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      className={`rounded-2xl h-14 mt-2 shadow-sm justify-center items-center ${className}`}
      onPress={onPress}
      activeOpacity={0.8}
      style={{ backgroundColor: theme.primary }}
    >
      <Text className="text-white font-bold text-lg tracking-wide">
        {title}
      </Text>
    </TouchableOpacity>
  );
};
