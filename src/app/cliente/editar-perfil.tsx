import type { DatosPerfil } from "@/domain/models/Usuario";
import { CamposPerfil } from "@/presentation/components/profile/CamposPerfil";
import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useAuth } from "@/presentation/context/AuthContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { mensajeErrorFirebase } from "@/presentation/utils/mensajeErrorFirebase";
import { prepararPerfil, validarPerfil, type ErroresPerfil } from "@/presentation/utils/perfilForm";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

export default function EditarPerfilRoute() {
  const { sesion, ocupado, guardarMiPerfil } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const cliente = sesion.estado === "lista" && sesion.usuario.rol === "cliente" ? sesion.usuario : undefined;
  const [perfil, setPerfil] = useState<DatosPerfil>(() => ({
    nombre: cliente?.nombre ?? "",
    apellidos: cliente?.apellidos ?? "",
    telefono: cliente?.telefono ?? "",
  }));
  const [errores, setErrores] = useState<ErroresPerfil>({});
  const [errorOperacion, setErrorOperacion] = useState<string>();

  if (!cliente) return null;

  async function guardar() {
    if (ocupado) return;
    const datos = prepararPerfil(perfil);
    const erroresPerfil = validarPerfil(datos);
    setErrores(erroresPerfil);
    setErrorOperacion(undefined);
    if (Object.keys(erroresPerfil).length > 0) return;

    try {
      await guardarMiPerfil(datos);
      if (!navigation.isFocused()) return;
      router.dismissTo("/cliente");
      Alert.alert("Perfil actualizado", "Tus cambios se guardaron.");
    } catch (error) {
      if (navigation.isFocused()) {
        setErrorOperacion(mensajeErrorFirebase(error, "No se pudo guardar el perfil. Intenta de nuevo."));
      }
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenLayout style={{ padding: 0, justifyContent: "flex-start" }} areaSegura="sinSuperior">
        <AppHeader titulo="Editar perfil" isHome={false} />
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24 }}>
          <View className="rounded-3xl border p-5" style={{ backgroundColor: theme.form, borderColor: theme.border }}>
            <View className="mb-4 gap-1">
              <Text className="font-semibold" style={{ color: theme.text }}>Correo electrónico</Text>
              <Text style={{ color: theme.textSecondary }} selectable>{cliente.email}</Text>
            </View>
            <CamposPerfil
              perfil={perfil}
              errores={errores}
              onChange={(campo, valor) => setPerfil((actual) => ({ ...actual, [campo]: valor }))}
              editable={!ocupado}
            />
            {errorOperacion && (
              <Text accessibilityRole="alert" className="mb-3" style={{ color: theme.error }}>
                {errorOperacion}
              </Text>
            )}
            <PrimaryButton
              title={ocupado ? "Guardando…" : "Guardar cambios"}
              onPress={guardar}
              disabled={ocupado}
            />
          </View>
        </ScrollView>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
