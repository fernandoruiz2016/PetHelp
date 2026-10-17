import { createContext, ReactNode, useState } from "react";
import { Appearance } from "react-native";
import { Colors, Theme } from "../theme/theme";

type ColorScheme = "light" | "dark";

type ThemeContextType = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
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

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
