import type { Veterinario } from '../models/Veterinario';

export interface VeterinarioRepository {
    listar(): Promise<Veterinario[]>;
}
