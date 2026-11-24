import type { EspecieConRaza, Raza } from "@/domain/models/Raza";
import { catApiClient, dogApiClient } from "./razasClient";

interface BreedApiDto {
  id: number | string;
  name?: string;
}

const cacheRazas = new Map<EspecieConRaza, Raza[]>();

export async function listarRazasPorEspecie(
  especie: EspecieConRaza,
  forzarRecarga = false,
): Promise<Raza[]> {
  if (!forzarRecarga) {
    const enCache = cacheRazas.get(especie);
    if (enCache) return enCache;
  }

  const client = especie === "PERRO" ? dogApiClient : catApiClient;
  const response = await client.get<BreedApiDto[]>("/breeds");
  const datos = Array.isArray(response.data) ? response.data : [];

  const nombresVistos = new Set<string>();
  const razas: Raza[] = [];

  for (const item of datos) {
    const nombre = typeof item.name === "string" ? item.name.trim() : "";
    if (!nombre) continue;
    const clave = nombre.toLowerCase();
    if (nombresVistos.has(clave)) continue;
    nombresVistos.add(clave);
    razas.push({
      id: `${especie}-${String(item.id)}`,
      nombre,
      especie,
    });
  }

  razas.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  cacheRazas.set(especie, razas);
  return razas;
}
