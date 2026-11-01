import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

interface HomeSummaryCardProps {
  title: string;
  value: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

export const HomeSumaryCard = ({
  title,
  value,
  icon,
  color,
  backgroundColor,
  onPress,
}: HomeSummaryCardProps) => {
  const { theme } = useTheme();

  return (
    <Pressable
      className="flex-1"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${value}`}
    >
      <View
        className="flex-1 flex-row items-center gap-2 rounded-2xl border px-3 py-4"
        style={{ backgroundColor, borderColor: theme.border }}
      >
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          <Ionicons name={icon} size={22} color={theme.onPrimary} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-2xl font-bold" style={{ color: theme.text }}>
            {value}
          </Text>
          <Text
            className="text-sm"
            style={{ color: theme.textSecondary }}
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
