import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

interface HomeSummaryCardProps {
  title: string;
  value: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
  backgroundColor: string;
}

export const HomeSumaryCard = ({
  title,
  value,
  icon,
  color,
  backgroundColor,
}: HomeSummaryCardProps) => {
  const { theme } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center gap-1 rounded-2xl border px-3 py-4"
      style={{
        backgroundColor,
        borderColor: theme.border,
      }}
    >
      <View
        className="mb-2 h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Ionicons name={icon} size={26} color={theme.onPrimary} />
      </View>

      <Text
        className="text-center text-3xl font-bold"
        style={{ color: theme.text }}
      >
        {value}
      </Text>
      <Text
        className="text-center text-sm"
        style={{ color: theme.textSecondary }}
      >
        {title}
      </Text>
    </View>
  );
};
