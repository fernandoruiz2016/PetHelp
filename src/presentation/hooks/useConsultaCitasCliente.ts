import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

type ResultadoConsultaCitas<T> = { estado: "cargando" | "error" } | { estado: "lista"; datos: T };

export function useConsultaCitasCliente<T>(consultar?: () => Promise<T>) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<{
    consultar: () => Promise<T>;
    intento: number;
    valor: ResultadoConsultaCitas<T>;
  }>();

  useFocusEffect(useCallback(() => {
    if (!consultar) return;
    let vigente = true;
    void consultar().then(
      (datos) => {
        if (vigente) setResultado({ consultar, intento, valor: { estado: "lista", datos } });
      },
      () => {
        if (vigente) setResultado({ consultar, intento, valor: { estado: "error" } });
      },
    );
    return () => { vigente = false; };
  }, [consultar, intento]));

  const lectura: ResultadoConsultaCitas<T> = resultado?.consultar === consultar && resultado?.intento === intento
    ? resultado.valor
    : { estado: "cargando" };
  return { lectura, reintentar: () => setIntento((actual) => actual + 1) };
}
