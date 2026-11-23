import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { Fredoka_700Bold } from "@expo-google-fonts/fredoka";
import { useFonts } from "expo-font";
import type { ComponentProps, ReactNode } from "react";
import { ScrollView } from "react-native";
import { HomeWaiting } from "./HomeWaiting";

interface HomeScreenProps extends Pick<ComponentProps<typeof ScreenLayout>, "areaSegura" | "conFondo"> {
  nombre: string;
  abrirPerfil: () => void;
  children: ReactNode;
}

export function HomeScreen({ nombre, abrirPerfil, areaSegura, conFondo, children }: HomeScreenProps) {
  const [fuenteCargada, errorFuente] = useFonts({ Fredoka_700Bold });

  return (
    <ScreenLayout
      style={{ justifyContent: "flex-start", padding: 0 }}
      areaSegura={areaSegura}
      conFondo={conFondo}
    >
      {!fuenteCargada && !errorFuente ? (
        <HomeWaiting fullScreen />
      ) : (
        <>
          <AppHeader nombre={nombre} isHome onProfilePress={abrirPerfil} />
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingTop: 32 }}
          >
            {children}
          </ScrollView>
        </>
      )}
    </ScreenLayout>
  );
}
