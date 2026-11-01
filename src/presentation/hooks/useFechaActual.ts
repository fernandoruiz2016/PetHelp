import { useEffect, useState } from "react";
import { AppState } from "react-native";

export function useFechaActual() {
  const [fechaActual, setFechaActual] = useState(() => new Date());

  useEffect(() => {
    const actualizarFecha = () => {
      const ahora = new Date();
      setFechaActual((anterior) =>
        anterior.toDateString() === ahora.toDateString() ? anterior : ahora,
      );
    };

    const intervalo = setInterval(actualizarFecha, 60_000);
    const suscripcion = AppState.addEventListener("change", (estado) => {
      if (estado === "active") actualizarFecha();
    });

    return () => {
      clearInterval(intervalo);
      suscripcion.remove();
    };
  }, []);

  return fechaActual;
}
