import type { Usuario } from "@/domain/models/Usuario";

export function nombreUsuario(usuario: Usuario) {
  return [usuario.nombre, usuario.apellidos].filter(Boolean).join(" ") ||
    (usuario.rol === "admin" ? "Admin" : "Cliente");
}
