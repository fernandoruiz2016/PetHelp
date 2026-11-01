import { useTheme } from "@/presentation/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  areaSegura?: "completa" | "sinSuperior" | "sinVertical";
  conFondo?: boolean;
};

export function ScreenLayout({
  children,
  style,
  areaSegura = "completa",
  conFondo = true,
}: Props) {
  const { theme } = useTheme();
  const g = theme.gradient;

  const contenido = (
    <SafeAreaView
      style={[{ flex: 1, padding: 16 }, style]}
      edges={
        areaSegura === "sinVertical"
          ? ["left", "right"]
          : areaSegura === "sinSuperior"
            ? ["bottom", "left", "right"]
            : undefined
      }
    >
      {children}
    </SafeAreaView>
  );

  return conFondo ? (
    <LinearGradient
      colors={g.colors}
      locations={g.locations}
      start={g.start}
      end={g.end}
      style={{ flex: 1 }}
    >
      {contenido}
    </LinearGradient>
  ) : (
    contenido
  );
}
