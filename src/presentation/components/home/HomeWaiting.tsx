import { useTheme } from "@/presentation/context/ThemeContext";
import { ActivityIndicator, Text, View } from "react-native";

export const HomeWaiting = () => {
  const { theme } = useTheme();

  return (
    <View className="min-h-48 items-center justify-center">
      <ActivityIndicator size="large" color={theme.primary} />
      <Text className="mt-4 text-lg" style={{ color: theme.textSecondary }}>
        Sincronizando datos...
      </Text>
    </View>
  );
};
