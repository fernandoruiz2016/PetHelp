import { esCorreoValido } from "@/presentation/utils/esCorreoValido";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useRegisterForm = (onRegistroCompletado?: () => void) => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errors, setErrors] = useState<{
    nombre?: string;
    apellidos?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmar?: string;
  }>({});

  const validar = (): boolean => {
    const e: typeof errors = {};

    if (nombre.trim().length === 0) e.nombre = "Tu nombre es requerido";
    if (apellidos.trim().length === 0) e.apellidos = "Ingresa tus apellidos";
    if (!esCorreoValido(email)) e.email = "Ingresa un correo electrónico válido";
    if (phone.trim().length === 0)
      e.phone = "Tu número de teléfono es requerido";
    if (password.length < 6)
      e.password = "La contraseña requiere mínimo 6 caracteres";
    if (password !== confirmar) e.confirmar = "Las contraseñas no coinciden";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegistro = () => {
    if (!validar()) return;

    Alert.alert(
      "Registro de demostración",
      "Los datos del formulario son válidos.",
      [
        {
          text: "Ir al Login",
          onPress: () => {
            if (onRegistroCompletado) {
              onRegistroCompletado();
            } else {
              router.replace("/login");
            }
          },
        },
      ],
    );
  };

  return {
    nombre,
    setNombre,
    apellidos,
    setApellidos,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmar,
    setConfirmar,
    errors,
    handleRegistro,
  };
};
