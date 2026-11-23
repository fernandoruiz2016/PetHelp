import { useAuth } from "@/presentation/context/AuthContext";
import { esCorreoValido } from "@/presentation/utils/esCorreoValido";
import { mensajeErrorFirebase } from "@/presentation/utils/mensajeErrorFirebase";
import { useState } from "react";

export const useLoginForm = () => {
  const { iniciarSesion, ocupado } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorOperacion, setErrorOperacion] = useState<string>();

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validar = (): boolean => {
    const e: typeof errors = {};

    if (!esCorreoValido(email)) {
      e.email = "Ingresa un correo electrónico válido";
    }
    if (!password) {
      e.password = "Ingresa tu contraseña";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (ocupado) return;
    setErrorOperacion(undefined);
    if (!validar()) return;

    try {
      await iniciarSesion(email.trim(), password);
    } catch (error) {
      setErrorOperacion(
        mensajeErrorFirebase(error, "No se pudo iniciar sesión. Intenta de nuevo."),
      );
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    errorOperacion,
    ocupado,
    handleLogin,
  };
};
