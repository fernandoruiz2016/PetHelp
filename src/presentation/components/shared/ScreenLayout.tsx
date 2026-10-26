import { useTheme } from "@/presentation/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  areaSegura?: "completa" | "sinSuperior";
};

export function ScreenLayout({
  children,
  style,
  areaSegura = "completa",
}: Props) {
  const { theme } = useTheme();
  const g = theme.gradient;

  return (
    <LinearGradient
      colors={g.colors}
      locations={g.locations}
      start={g.start}
      end={g.end}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={[{ flex: 1, padding: 16 }, style]}
        edges={
          areaSegura === "sinSuperior" ? ["bottom", "left", "right"] : undefined
        }
      >
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}
