import { SolicitudesProvider } from "@/presentation/context/SolicitudesContext";
import { ThemeProvider } from "@/presentation/context/ThemeContext";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SolicitudesProvider>
        <Stack />
      </SolicitudesProvider>
    </ThemeProvider>
  );
}
