import { esCorreoValido } from "@/presentation/utils/esCorreoValido";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validar = (): boolean => {
    const e: typeof errors = {};

    if (!esCorreoValido(email)) {
      e.email = "Ingresa un correo electrónico válido";
    }
    if (password.length < 6) {
      e.password = "La contraseña debe tener mínimo 6 caracteres";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validar()) return;

    // Cuenta de demostración hasta integrar Firebase Authentication.
    if (
      email.trim().toLowerCase() === "admin@pethelp.test" &&
      password === "123456"
    ) {
      router.replace("/home");
    } else {
      Alert.alert(
        "Error de Acceso",
        "El correo o la contraseña son incorrectos.",
      );
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    handleLogin,
  };
};
