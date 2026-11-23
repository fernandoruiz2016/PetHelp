import type { DatosPerfil } from "@/domain/models/Usuario";
import { useAuth } from "@/presentation/context/AuthContext";
import { esCorreoValido } from "@/presentation/utils/esCorreoValido";
import { mensajeErrorFirebase } from "@/presentation/utils/mensajeErrorFirebase";
import { perfilVacio, prepararPerfil, validarPerfil, type ErroresPerfil } from "@/presentation/utils/perfilForm";
import { useState } from "react";

export const useRegisterForm = () => {
  const { registrar, ocupado } = useAuth();
  const [perfil, setPerfil] = useState(perfilVacio);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errorOperacion, setErrorOperacion] = useState<string>();
  const [errors, setErrors] = useState<ErroresPerfil & {
    email?: string;
    password?: string;
    confirmar?: string;
  }>({});

  const actualizarPerfil = (campo: keyof DatosPerfil, valor: string) =>
    setPerfil((actual) => ({ ...actual, [campo]: valor }));

  const handleRegistro = async () => {
    if (ocupado) return;
    setErrorOperacion(undefined);
    const datos = prepararPerfil(perfil);
    const e: typeof errors = validarPerfil(datos);
    if (!esCorreoValido(email)) e.email = "Ingresa un correo electrónico válido";
    if (password.length < 6)
      e.password = "La contraseña requiere mínimo 6 caracteres";
    if (password !== confirmar) e.confirmar = "Las contraseñas no coinciden";

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      await registrar(email.trim(), password, datos);
    } catch (error) {
      setErrorOperacion(
        mensajeErrorFirebase(error, "No se pudo crear la cuenta. Intenta de nuevo."),
      );
    }
  };

  return {
    perfil,
    actualizarPerfil,
    email,
    setEmail,
    password,
    setPassword,
    confirmar,
    setConfirmar,
    errors,
    errorOperacion,
    ocupado,
    handleRegistro,
  };
};
