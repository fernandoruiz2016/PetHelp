import { useTheme } from "@/presentation/context/ThemeContext";
import { Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
}

export const PrimaryButton = ({
  title,
  onPress,
  className = "",
  disabled = false,
}: PrimaryButtonProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      className={`rounded-2xl h-14 mt-2 shadow-sm justify-center items-center ${className}`}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      activeOpacity={0.8}
      style={{ backgroundColor: theme.primary, opacity: disabled ? 0.6 : 1 }}
    >
      <Text
        className="font-bold text-lg tracking-wide"
        style={{ color: theme.onPrimary }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
