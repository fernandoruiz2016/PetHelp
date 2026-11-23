import type { DatosVeterinario, Veterinario } from '../models/Veterinario';

export interface VeterinarioRepository {
    listar(): Promise<Veterinario[]>;
    buscar(id: string): Promise<Veterinario | null>;
    crear(datos: DatosVeterinario): Promise<Veterinario>;
    actualizar(id: string, datos: DatosVeterinario): Promise<void>;
    eliminar(id: string): Promise<void>;
}
