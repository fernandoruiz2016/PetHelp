import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SolicitudesHeaderProps {
  nombre?: string;
  isHome: boolean;
  titulo?: string;
}

export function AppHeader({
  nombre,
  isHome,
  titulo = "Gestionar Citas",
}: SolicitudesHeaderProps) {
  const { colorScheme, theme, toggleTheme } = useTheme();
  const avatarRef = useRef<View>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const abrirMenu = () => {
    avatarRef.current?.measureInWindow((x, y, _width, height) => {
      setMenuPosition({ top: y + height + 50, left: x });
    });
  };

  const cambiarTema = () => {
    toggleTheme();
    setMenuPosition(null);
  };

  return (
    <View
      className="h-36 flex-row justify-between items-center rounded-b-[30px] px-5 pt-10"
      style={{ backgroundColor: theme.headerBackground }}
    >
      {isHome ? (
        <>
          <View ref={avatarRef} collapsable={false}>
            <Pressable
              onPress={abrirMenu}
              accessibilityRole="button"
              accessibilityLabel="Abrir menú de perfil"
              accessibilityState={{ expanded: menuPosition !== null }}
            >
              <Image
                source={require("../../../../assets/images/foto-perfil.png")}
                className="h-16 w-16 rounded-full border-[3px]"
                style={{ borderColor: theme.title }}
                resizeMode="cover"
              />
            </Pressable>
          </View>

          <Modal
            visible={menuPosition !== null}
            transparent
            statusBarTranslucent
            animationType="fade"
            onRequestClose={() => setMenuPosition(null)}
          >
            <View style={{ flex: 1 }}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setMenuPosition(null)}
                accessibilityLabel="Cerrar menú de perfil"
              />
              {menuPosition && (
                <View
                  style={{
                    position: "absolute",
                    top: menuPosition.top,
                    left: menuPosition.left,
                    padding: 6,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: theme.border,
                    backgroundColor: theme.form,
                    elevation: 8,
                    shadowColor: "#000000",
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                >
                  <Pressable
                    className="h-12 w-12 items-center justify-center rounded-xl"
                    onPress={cambiarTema}
                    accessibilityRole="button"
                    accessibilityLabel={
                      colorScheme === "dark"
                        ? "Activar modo claro"
                        : "Activar modo oscuro"
                    }
                  >
                    <Ionicons
                      name={
                        colorScheme === "dark"
                          ? "sunny-outline"
                          : "moon-outline"
                      }
                      size={26}
                      color={theme.text}
                    />
                  </Pressable>
                </View>
              )}
            </View>
          </Modal>

          <View className="flex-1 flex-row items-center justify-center">
            <View className="ml-5">
              <Text
                className="text-m font-semibold"
                style={{ color: theme.title }}
                numberOfLines={1}
              >
                Bienvenido, <Text className="font-bold italic">{nombre}!</Text>
              </Text>

              <Text
                className="text-[32px]"
                style={{
                  color: theme.headerForeground,
                  fontFamily: "Fredoka_700Bold",
                }}
                numberOfLines={1}
              >
                PetHelp
              </Text>
            </View>

            <Image
              source={require("../../../../assets/images/logo/logo-sin-fondo.png")}
              className="h-14 w-14"
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center"
            onPress={() => router.replace("/login")}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
          >
            <Ionicons
              name="log-out-outline"
              size={35}
              color={theme.headerForeground}
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View className="h-14 w-14 justify-center">
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center"
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Ionicons
                name="arrow-back"
                size={35}
                color={theme.headerForeground}
              />
            </TouchableOpacity>
          </View>

          <View className="min-w-0 flex-1 items-center px-2">
            <Text
              className="text-center text-2xl font-bold"
              style={{ color: theme.headerForeground }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {titulo}
            </Text>
          </View>

          <Image
            source={require("../../../../assets/images/logo/logo-sin-fondo.png")}
            className="h-14 w-14"
            resizeMode="contain"
          />
        </>
      )}
    </View>
  );
}
