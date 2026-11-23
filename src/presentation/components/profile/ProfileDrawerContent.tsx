import { useAuth } from "@/presentation/context/AuthContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { nombreUsuario } from "@/presentation/utils/nombreUsuario";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "expo-router/drawer";
import { Image, Pressable, Switch, Text, View } from "react-native";

export function ProfileDrawerContent(props: DrawerContentComponentProps) {
  const { colorScheme, theme, toggleTheme } = useTheme();
  const { sesion } = useAuth();
  const usuario = sesion.estado === "lista" ? sesion.usuario : null;
  const modoOscuro = colorScheme === "dark";

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="px-3 pb-6 pt-2">
        <View className="mb-7 flex-row items-center justify-between gap-2">
          <Text
            className="flex-1 text-xl font-bold"
            style={{ color: theme.text }}
            accessibilityRole="header"
          >
            Mi cuenta
          </Text>
          <Pressable
            onPress={() => props.navigation.closeDrawer()}
            className="h-11 w-11 items-center justify-center rounded-full"
            style={({ pressed }) => ({
              backgroundColor: pressed ? theme.primarySoft : theme.form,
            })}
            accessibilityRole="button"
            accessibilityLabel="Cerrar menú de perfil"
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
        </View>

        <View className="mb-7 items-start gap-3">
          <Image
            source={require("../../../../assets/images/foto-perfil.png")}
            className="h-20 w-20 rounded-full border-[3px]"
            style={{ borderColor: theme.primary }}
            resizeMode="cover"
            accessible={false}
          />
          {usuario && (
            <View className="w-full gap-1">
              <Text className="text-2xl font-bold" style={{ color: theme.text }}>
                {nombreUsuario(usuario)}
              </Text>
              <Text style={{ color: theme.textSecondary }} selectable>{usuario.email}</Text>
            </View>
          )}
          {usuario?.rol === "cliente" && (
            <Pressable
              accessibilityRole="button"
              className="min-h-12 w-full flex-row items-center gap-3 rounded-2xl border px-3 py-2"
              style={({ pressed }) => ({
                backgroundColor: pressed ? theme.primarySoft : theme.form,
                borderColor: theme.border,
              })}
              onPress={() => {
                props.navigation.closeDrawer();
                router.push("/cliente/editar-perfil");
              }}
            >
              <Ionicons name="create-outline" size={22} color={theme.primary} />
              <Text className="flex-1 text-base font-semibold" style={{ color: theme.text }}>Editar perfil</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </Pressable>
          )}
        </View>

        <View className="mb-6 border-t" style={{ borderColor: theme.border }} />
        <Text
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: theme.textSecondary }}
          accessibilityRole="header"
        >
          Apariencia
        </Text>

        <View
          className="min-h-20 flex-row items-center gap-3 rounded-2xl border px-3 py-4"
          style={{ backgroundColor: theme.form, borderColor: theme.border }}
        >
          <View
            className="h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: theme.primarySoft }}
          >
            <Ionicons
              name={modoOscuro ? "moon-outline" : "sunny-outline"}
              size={23}
              color={theme.primary}
            />
          </View>
          <Text
            className="flex-1 text-base font-semibold"
            style={{ color: theme.text }}
          >
            Modo oscuro
          </Text>
          <Switch
            value={modoOscuro}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.inputBorder, true: theme.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={theme.inputBorder}
            accessibilityLabel="Modo oscuro"
            accessibilityHint="Cambia entre la apariencia clara y oscura"
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
