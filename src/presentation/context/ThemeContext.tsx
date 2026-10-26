import { createContext, ReactNode, useContext, useState } from "react";
import { Appearance } from "react-native";
import { Colors, Theme } from "../theme/theme";

type ColorScheme = "light" | "dark";

type ThemeContextType = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleTheme: () => void;
  theme: Theme;
};

const normalize = (scheme: string | null | undefined): ColorScheme =>
  scheme === "dark" ? "dark" : "light";

export const ThemeContext = createContext<ThemeContextType | null>(null);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    normalize(Appearance.getColorScheme()),
  );
  const theme = Colors[colorScheme];

  const toggleTheme = () =>
    setColorScheme(colorScheme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider
      value={{ colorScheme, setColorScheme, toggleTheme, theme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const contexTheme = useContext(ThemeContext);

  if (!contexTheme)
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return contexTheme;
}
