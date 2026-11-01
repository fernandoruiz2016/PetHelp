const CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generarCodigoCita(codigosExistentes: Iterable<string>): string {
  const existentes = new Set(codigosExistentes);
  let codigo: string;

  do {
    let sufijo = "";
    for (let i = 0; i < 5; i++) {
      sufijo += CARACTERES[Math.floor(Math.random() * CARACTERES.length)];
    }
    codigo = `VET-${sufijo}`;
  } while (existentes.has(codigo));

  return codigo;
}
