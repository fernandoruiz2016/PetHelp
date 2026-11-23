import type { DatosVeterinario } from "@/domain/models/Veterinario";
import { VeterinarioConCitasAsignadasError } from "@/infraestructure/repositories/veterinarioRepository";
import { AppHeader } from "@/presentation/components/shared/AppHeader";
import { CustomTextInput } from "@/presentation/components/shared/CustomTextInput";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useVeterinarios } from "@/presentation/context/VeterinariosContext";
import { esCorreoValido } from "@/presentation/utils/esCorreoValido";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";

const perfilInicial: DatosVeterinario = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  activo: true,
};

export default function VeterinarioFormRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { buscar, crear, actualizar, eliminar, cargando } = useVeterinarios();
  const veterinarioExistente = id ? buscar(id) : undefined;

  const [datos, setDatos] = useState<DatosVeterinario>(perfilInicial);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string>();
  const [errores, setErrores] = useState<
    Partial<Record<keyof DatosVeterinario, string>>
  >({});
  const ocupado = useRef(false);

  useEffect(() => {
    setError(undefined);
    setErrores({});
    if (!id) {
      setDatos(perfilInicial);
      return;
    }
    if (veterinarioExistente) {
      setDatos({
        firstName: veterinarioExistente.firstName,
        lastName: veterinarioExistente.lastName,
        email: veterinarioExistente.email ?? "",
        phone: veterinarioExistente.phone ?? "",
        activo: veterinarioExistente.activo !== false,
      });
    }
  }, [id, veterinarioExistente]);

  const noEncontrado = Boolean(id) && !cargando && !veterinarioExistente;
  const bloqueado = guardando || eliminando;

  async function guardar() {
    if (ocupado.current || (id && !veterinarioExistente)) return;

    const perfil: DatosVeterinario = {
      firstName: datos.firstName.trim(),
      lastName: datos.lastName.trim(),
      email: datos.email.trim(),
      phone: datos.phone.trim(),
      activo: datos.activo,
    };

    const validacion: typeof errores = {};
    if (!perfil.firstName || perfil.firstName.length > 100) {
      validacion.firstName = "Ingresa los nombres (hasta 100 caracteres).";
    }
    if (!perfil.lastName || perfil.lastName.length > 100) {
      validacion.lastName = "Ingresa los apellidos (hasta 100 caracteres).";
    }
    if (
      perfil.email &&
      (!esCorreoValido(perfil.email) || perfil.email.length > 254)
    ) {
      validacion.email = "Ingresa un correo válido.";
    }
    if (perfil.phone.length > 30) {
      validacion.phone = "El teléfono debe tener hasta 30 caracteres.";
    }

    setErrores(validacion);
    setError(undefined);
    if (Object.keys(validacion).length) return;

    ocupado.current = true;
    setGuardando(true);
    try {
      if (id) {
        await actualizar(id, perfil);
      } else {
        await crear(perfil);
      }
      if (!navigation.isFocused()) return;
      router.dismissTo("/veterinarios/veterinarios");
      Alert.alert(
        "Veterinario guardado",
        "Los datos se guardaron correctamente.",
      );
    } catch {
      if (navigation.isFocused()) {
        setError("No se pudo guardar el veterinario. Inténtalo de nuevo.");
      }
    } finally {
      ocupado.current = false;
      setGuardando(false);
    }
  }

  async function borrarVeterinario() {
    if (!id || !veterinarioExistente || ocupado.current) return;

    ocupado.current = true;
    setEliminando(true);
    setError(undefined);
    try {
      await eliminar(id);
      if (!navigation.isFocused()) return;
      router.dismissTo("/veterinarios/veterinarios");
      Alert.alert(
        "Veterinario eliminado",
        "El registro se eliminó correctamente.",
      );
    } catch (err) {
      if (!navigation.isFocused()) return;
      if (err instanceof VeterinarioConCitasAsignadasError) {
        setError(err.message);
      } else {
        setError("No se pudo eliminar el veterinario. Inténtalo de nuevo.");
      }
    } finally {
      ocupado.current = false;
      setEliminando(false);
    }
  }

  function confirmarEliminacion() {
    if (!veterinarioExistente || bloqueado) return;
    const nombre =
      `${veterinarioExistente.firstName} ${veterinarioExistente.lastName}`.trim();
    const mensaje = `¿Eliminar al veterinario ${nombre}? Esta acción no se puede deshacer.`;

    if (Platform.OS === "web") {
      if (globalThis.confirm(mensaje)) void borrarVeterinario();
      return;
    }

    Alert.alert("Eliminar veterinario", mensaje, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => void borrarVeterinario(),
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenLayout
        style={{ padding: 0, justifyContent: "flex-start" }}
        areaSegura="sinSuperior"
      >
        <AppHeader
          titulo={id ? "Editar veterinario" : "Nuevo veterinario"}
          isHome={false}
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 24 }}
        >
          <View
            className="rounded-3xl border p-5"
            style={{ backgroundColor: theme.form, borderColor: theme.border }}
          >
            {id && cargando && !veterinarioExistente ? (
              <ActivityIndicator
                accessibilityLabel="Cargando veterinario"
                color={theme.primary}
              />
            ) : noEncontrado ? (
              <Text accessibilityRole="alert" style={{ color: theme.error }}>
                No se encontró el veterinario.
              </Text>
            ) : (
              <>
                <CustomTextInput
                  label="Nombres"
                  value={datos.firstName}
                  maxLength={100}
                  autoCapitalize="words"
                  editable={!bloqueado}
                  error={errores.firstName}
                  onChangeText={(firstName) =>
                    setDatos((actual) => ({ ...actual, firstName }))
                  }
                />
                <CustomTextInput
                  label="Apellidos"
                  value={datos.lastName}
                  maxLength={100}
                  autoCapitalize="words"
                  editable={!bloqueado}
                  error={errores.lastName}
                  onChangeText={(lastName) =>
                    setDatos((actual) => ({ ...actual, lastName }))
                  }
                />
                <CustomTextInput
                  label="Teléfono (opcional)"
                  value={datos.phone}
                  maxLength={30}
                  keyboardType="phone-pad"
                  editable={!bloqueado}
                  error={errores.phone}
                  onChangeText={(phone) =>
                    setDatos((actual) => ({ ...actual, phone }))
                  }
                />
                <CustomTextInput
                  label="Correo (opcional)"
                  value={datos.email}
                  maxLength={254}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!bloqueado}
                  error={errores.email}
                  onChangeText={(email) =>
                    setDatos((actual) => ({ ...actual, email }))
                  }
                />
                {id && (
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text
                      className="font-semibold"
                      style={{ color: theme.text }}
                    >
                      Activo
                    </Text>
                    <Switch
                      value={datos.activo}
                      disabled={bloqueado}
                      accessibilityLabel="Veterinario activo"
                      onValueChange={(activo) =>
                        setDatos((actual) => ({ ...actual, activo }))
                      }
                    />
                  </View>
                )}
                {error && (
                  <Text
                    accessibilityRole="alert"
                    className="mb-3"
                    style={{ color: theme.error }}
                  >
                    {error}
                  </Text>
                )}
                <PrimaryButton
                  title={guardando ? "Guardando…" : "Guardar veterinario"}
                  disabled={bloqueado}
                  onPress={guardar}
                />
                {id && (
                  <Pressable
                    className="mt-3 h-14 flex-row items-center justify-center gap-3 rounded-xl border"
                    style={{
                      backgroundColor: theme.form,
                      borderColor: theme.error,
                    }}
                    onPress={confirmarEliminacion}
                    disabled={bloqueado}
                    accessibilityRole="button"
                    accessibilityLabel="Eliminar veterinario"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={22}
                      color={theme.error}
                    />
                    <Text
                      className="text-base font-bold"
                      style={{ color: theme.error }}
                    >
                      {eliminando ? "Eliminando…" : "Eliminar veterinario"}
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
