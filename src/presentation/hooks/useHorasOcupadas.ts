import { useEffect, useState } from "react";

export function useHorasOcupadas(
  fecha: string,
  consultar?: (fecha: string) => Promise<number[]>,
) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<{
    fecha: string;
    intento: number;
    horas: number[] | null;
  }>();

  useEffect(() => {
    if (!fecha || !consultar) return;
    let vigente = true;
    void consultar(fecha).then(
      (horas) => { if (vigente) setResultado({ fecha, intento, horas }); },
      () => { if (vigente) setResultado({ fecha, intento, horas: null }); },
    );
    return () => { vigente = false; };
  }, [consultar, fecha, intento]);

  const actual = resultado?.fecha === fecha && resultado.intento === intento ? resultado : undefined;
  return {
    horas: actual?.horas ?? [],
    cargando: Boolean(consultar && fecha && !actual),
    error: actual?.horas === null,
    recargar: () => setIntento((actual) => actual + 1),
  };
}
