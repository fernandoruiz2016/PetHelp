export const HORAS_CITA = Array.from({ length: 10 }, (_, i) => i + 8);

export function rangoDiaCita(fecha: string) {
  const inicio = new Date(fecha);
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);
  return { desde: inicio.toISOString(), hasta: fin.toISOString() };
}

export class HorarioCitaNoDisponible extends Error {
  constructor() {
    super("Selecciona otra hora disponible para la cita.");
    this.name = "HorarioCitaNoDisponible";
  }
}
