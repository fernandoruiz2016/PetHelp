import { useTheme } from "@/presentation/context/ThemeContext";
import { ActivityIndicator, Text, View } from "react-native";

interface HomeWaitingProps {
  fullScreen?: boolean;
}

export const HomeWaiting = ({ fullScreen }: HomeWaitingProps) => {
  const { theme } = useTheme();

  return (
    <View
      className="items-center justify-center"
      style={fullScreen ? { flex: 1 } : { minHeight: 192 }}
    >
      <ActivityIndicator size="large" color={theme.primary} />
      <Text className="mt-4 text-lg" style={{ color: theme.textSecondary }}>
        Sincronizando datos...
      </Text>
    </View>
  );
};
