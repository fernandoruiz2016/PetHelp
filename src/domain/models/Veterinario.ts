export interface Veterinario {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  image?: string;
  activo?: boolean;
}

export type DatosVeterinario = Pick<Veterinario, "firstName" | "lastName"> & {
  email: string;
  phone: string;
  activo: boolean;
};
