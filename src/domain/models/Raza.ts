import type { EspecieMascota } from "./Solicitud";

export type EspecieConRaza = Extract<EspecieMascota, "PERRO" | "GATO">;

export interface Raza {
  id: string;
  nombre: string;
  especie: EspecieConRaza;
}
