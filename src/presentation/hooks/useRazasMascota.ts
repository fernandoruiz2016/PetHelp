import type { Raza } from "@/domain/models/Raza";
import type { EspecieMascota } from "@/domain/models/Solicitud";
import { listarRazasPorEspecie } from "@/infraestructure/api/razasApiService";
import { useCallback, useEffect, useRef, useState } from "react";

export function useRazasMascota(especie: EspecieMascota) {
  const [razas, setRazas] = useState<Raza[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const consultaActual = useRef(0);

  const cargar = useCallback(
    async (forzarRecarga = false) => {
      if (especie === "OTRO") {
        consultaActual.current++;
        setRazas([]);
        setCargando(false);
        setError(null);
        return;
      }

      const consulta = ++consultaActual.current;
      setCargando(true);
      setError(null);
      try {
        const lista = await listarRazasPorEspecie(especie, forzarRecarga);
        if (consulta === consultaActual.current) {
          setRazas(lista);
        }
      } catch (err) {
        if (consulta === consultaActual.current) {
          setRazas([]);
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las razas.",
          );
        }
      } finally {
        if (consulta === consultaActual.current) {
          setCargando(false);
        }
      }
    },
    [especie],
  );

  useEffect(() => {
    void cargar(false);
    return () => {
      consultaActual.current++;
    };
  }, [cargar]);

  const reintentar = useCallback(() => {
    void cargar(true);
  }, [cargar]);

  return { razas, cargando, error, reintentar };
}
