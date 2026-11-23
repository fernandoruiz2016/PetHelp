import type { DatosPerfil } from "@/domain/models/Usuario";
import { CamposPerfil } from "@/presentation/components/profile/CamposPerfil";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useAuth } from "@/presentation/context/AuthContext";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useCerrarSesion } from "@/presentation/hooks/useCerrarSesion";
import { mensajeErrorFirebase } from "@/presentation/utils/mensajeErrorFirebase";
import { prepararPerfil, validarPerfil, type ErroresPerfil } from "@/presentation/utils/perfilForm";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

export default function CompletarPerfilRoute() {
  const { sesion, borradorPerfil, guardarMiPerfil } = useAuth();
  const { salir, ocupado } = useCerrarSesion();
  const { theme } = useTheme();
  const usuario = sesion.estado === "perfilPendiente" ? sesion.usuario : undefined;
  const [perfil, setPerfil] = useState<DatosPerfil>(() => borradorPerfil ?? {
    nombre: usuario?.nombre ?? "",
    apellidos: usuario?.apellidos ?? "",
    telefono: usuario?.telefono ?? "",
  });
  const [errores, setErrores] = useState<ErroresPerfil>({});
  const [errorOperacion, setErrorOperacion] = useState<string>();

  if (!usuario) return null;

  async function guardar() {
    if (ocupado) return;
    const datos = prepararPerfil(perfil);
    const erroresPerfil = validarPerfil(datos);
    setErrores(erroresPerfil);
    setErrorOperacion(undefined);
    if (Object.keys(erroresPerfil).length > 0) return;

    try {
      await guardarMiPerfil(datos);
    } catch (error) {
      setErrorOperacion(mensajeErrorFirebase(error, "No se pudo guardar el perfil. Intenta de nuevo."));
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenLayout>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 24 }}>
          <View className="rounded-3xl border p-6" style={{ backgroundColor: theme.form, borderColor: theme.border }}>
            <Text accessibilityRole="header" className="mb-2 text-2xl font-bold" style={{ color: theme.text }}>
              Completa tu perfil
            </Text>
            <Text className="mb-5" style={{ color: theme.textSecondary }}>
              Guarda tus datos de contacto para continuar.
            </Text>
            <CamposPerfil
              perfil={perfil}
              errores={errores}
              onChange={(campo, valor) => setPerfil((actual) => ({ ...actual, [campo]: valor }))}
            />
            {errorOperacion && (
              <Text accessibilityRole="alert" className="mb-3" style={{ color: theme.error }}>
                {errorOperacion}
              </Text>
            )}
            <PrimaryButton title={ocupado ? "Guardando…" : "Guardar perfil"} onPress={guardar} disabled={ocupado} />
            <PrimaryButton title="Cerrar sesión" onPress={salir} disabled={ocupado} />
          </View>
        </ScrollView>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
