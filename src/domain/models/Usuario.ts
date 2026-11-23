export type RolUsuario = "admin" | "cliente";

export interface Usuario {
  uid: string;
  email: string;
  rol: RolUsuario;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
}

export type DatosPerfil = Required<Pick<Usuario, "nombre" | "apellidos" | "telefono">>;
