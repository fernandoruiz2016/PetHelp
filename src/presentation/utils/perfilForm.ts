import type { DatosPerfil } from "@/domain/models/Usuario";

export type ErroresPerfil = Partial<Record<keyof DatosPerfil, string>>;

export const perfilVacio: DatosPerfil = { nombre: "", apellidos: "", telefono: "" };

export function prepararPerfil({ nombre, apellidos, telefono }: DatosPerfil): DatosPerfil {
  return { nombre: nombre.trim(), apellidos: apellidos.trim(), telefono: telefono.trim() };
}

export function validarPerfil({ nombre, apellidos, telefono }: DatosPerfil): ErroresPerfil {
  const errores: ErroresPerfil = {};
  if (!nombre || nombre.length > 100) errores.nombre = "Ingresa tus nombres (hasta 100 caracteres).";
  if (!apellidos || apellidos.length > 100) errores.apellidos = "Ingresa tus apellidos (hasta 100 caracteres).";
  if (!telefono || telefono.length > 30) errores.telefono = "Ingresa tu teléfono (hasta 30 caracteres).";
  return errores;
}
