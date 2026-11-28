import { TipoServicio } from "@/domain/enums/TipoServicio";
import type { EspecieMascota, EstadoSolicitud, PrioridadSolicitud } from "@/domain/models/Solicitud";
import type { RolUsuario } from "@/domain/models/Usuario";
import * as Network from "expo-network";
import type { SQLiteDatabase } from "expo-sqlite";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore/lite";
import { firestore } from "./firebase";

type SolicitudLocalRow = {
  id: number;
  codigo: string;
  clienteId: string | null;
  veterinarioId: string | null;
  clienteNombre: string;
  telefono: string;
  mascotaNombre: string;
  especieMascota: EspecieMascota;
  razaMascota: string | null;
  tipoServicio: TipoServicio;
  prioridad: PrioridadSolicitud;
  descripcion: string;
  estado: EstadoSolicitud;
  fechaCita: string;
  fechaRegistro: string;
  sincronizado: number;
  eliminado: number;
  updatedAt: string;
};

type VeterinarioLocalRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string | null;
  activo: number;
  fechaRegistro: string;
  sincronizado: number;
  eliminado: number;
  updatedAt: string;
};

export interface ResultadoSincronizacion {
  conectado: boolean;
  subidos: number;
  descargados: number;
  errores: number;
}

const syncEnCurso = new Map<string, Promise<ResultadoSincronizacion>>();

export async function verificarConexion(): Promise<boolean> {
  try {
    const estado = await Network.getNetworkStateAsync();
    return Boolean(estado.isConnected) && estado.isInternetReachable !== false;
  } catch {
    return false;
  }
}

function ejecutarExclusivo(
  clave: string,
  tarea: () => Promise<ResultadoSincronizacion>,
): Promise<ResultadoSincronizacion> {
  const existente = syncEnCurso.get(clave);
  if (existente) return existente;

  const promesa = tarea().finally(() => {
    syncEnCurso.delete(clave);
  });
  syncEnCurso.set(clave, promesa);
  return promesa;
}

function leerTexto(valor: unknown, defecto = ""): string {
  return typeof valor === "string" ? valor : defecto;
}

function leerTextoOpcional(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim() ? valor : null;
}

const especiesValidas = new Set<string>(["PERRO", "GATO", "OTRO"]);
const estadosValidos = new Set<string>(["PENDIENTE", "EN_ATENCION", "FINALIZADO", "CANCELADA"]);
const prioridadesValidas = new Set<string>(["NORMAL", "ALTA", "URGENTE"]);
const serviciosValidos = new Set<string>(Object.values(TipoServicio));

export function sincronizarSolicitudes(
  db: SQLiteDatabase,
  opciones: { rol: RolUsuario; uid: string },
): Promise<ResultadoSincronizacion> {
  return ejecutarExclusivo(`solicitudes:${opciones.rol}:${opciones.uid}`, async () => {
    if (!firestore) return { conectado: false, subidos: 0, descargados: 0, errores: 0 };
    const conectado = await verificarConexion();
    if (!conectado) return { conectado: false, subidos: 0, descargados: 0, errores: 0 };

    const coleccion = collection(firestore, "solicitudes");
    let subidos = 0;
    let descargados = 0;
    let errores = 0;

    // 1. Subida (SQLite -> Firestore)
    const pendientes = opciones.rol === "admin"
      ? await db.getAllAsync<SolicitudLocalRow>(
          "SELECT * FROM solicitudes WHERE sincronizado = 0;",
        )
      : await db.getAllAsync<SolicitudLocalRow>(
          "SELECT * FROM solicitudes WHERE sincronizado = 0 AND clienteId = ?;",
          [opciones.uid],
        );

    for (const fila of pendientes) {
      try {
        const ref = doc(coleccion, fila.codigo);
        if (fila.eliminado === 1) {
          await deleteDoc(ref);
          await db.runAsync("DELETE FROM solicitudes WHERE id = ?;", [fila.id]);
        } else {
          await setDoc(ref, {
            codigo: fila.codigo,
            clienteId: fila.clienteId ?? null,
            veterinarioId: fila.veterinarioId ?? null,
            clienteNombre: fila.clienteNombre,
            telefono: fila.telefono,
            mascotaNombre: fila.mascotaNombre,
            especieMascota: fila.especieMascota,
            razaMascota: fila.razaMascota ?? null,
            tipoServicio: fila.tipoServicio,
            prioridad: fila.prioridad,
            descripcion: fila.descripcion,
            estado: fila.estado,
            fechaCita: fila.fechaCita,
            fechaRegistro: fila.fechaRegistro,
            updatedAt: fila.updatedAt || fila.fechaRegistro,
          });
          await db.runAsync(
            "UPDATE solicitudes SET sincronizado = 1 WHERE id = ? AND updatedAt = ?;",
            [fila.id, fila.updatedAt],
          );
        }
        subidos++;
      } catch (error) {
        errores++;
        console.warn("[SYNC solicitudes] Error al subir", fila.codigo, error);
      }
    }

    // 2. Bajada (Firestore -> SQLite)
    try {
      const consulta = opciones.rol === "admin"
        ? coleccion
        : query(coleccion, where("clienteId", "==", opciones.uid));
      const snapshot = await getDocs(consulta);
      const codigosRemotos = new Set<string>();

      for (const documento of snapshot.docs) {
        const datos = documento.data();
        const codigo = leerTexto(datos.codigo, documento.id);
        if (!codigo) continue;
        codigosRemotos.add(codigo);

        const especie = especiesValidas.has(leerTexto(datos.especieMascota))
          ? (datos.especieMascota as EspecieMascota)
          : "PERRO";
        const estado = estadosValidos.has(leerTexto(datos.estado))
          ? (datos.estado as EstadoSolicitud)
          : "PENDIENTE";
        const prioridad = prioridadesValidas.has(leerTexto(datos.prioridad))
          ? (datos.prioridad as PrioridadSolicitud)
          : "NORMAL";
        const tipoServicio = serviciosValidos.has(leerTexto(datos.tipoServicio))
          ? (datos.tipoServicio as TipoServicio)
          : TipoServicio.CONSULTA;
        const fechaRegistro = leerTexto(datos.fechaRegistro, new Date().toISOString());
        const updatedAt = leerTexto(datos.updatedAt, fechaRegistro);

        await db.runAsync(
          `
          INSERT INTO solicitudes (
            codigo, clienteId, veterinarioId, clienteNombre, telefono, mascotaNombre,
            especieMascota, razaMascota, tipoServicio, prioridad, descripcion, estado,
            fechaCita, fechaRegistro, sincronizado, eliminado, updatedAt
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)
          ON CONFLICT(codigo) DO UPDATE SET
            clienteId = excluded.clienteId,
            veterinarioId = excluded.veterinarioId,
            clienteNombre = excluded.clienteNombre,
            telefono = excluded.telefono,
            mascotaNombre = excluded.mascotaNombre,
            especieMascota = excluded.especieMascota,
            razaMascota = excluded.razaMascota,
            tipoServicio = excluded.tipoServicio,
            prioridad = excluded.prioridad,
            descripcion = excluded.descripcion,
            estado = excluded.estado,
            fechaCita = excluded.fechaCita,
            fechaRegistro = excluded.fechaRegistro,
            sincronizado = 1,
            eliminado = 0,
            updatedAt = excluded.updatedAt
          WHERE solicitudes.sincronizado = 1;
          `,
          [
            codigo,
            leerTextoOpcional(datos.clienteId),
            leerTextoOpcional(datos.veterinarioId),
            leerTexto(datos.clienteNombre),
            leerTexto(datos.telefono),
            leerTexto(datos.mascotaNombre),
            especie,
            leerTextoOpcional(datos.razaMascota),
            tipoServicio,
            prioridad,
            leerTexto(datos.descripcion),
            estado,
            leerTexto(datos.fechaCita),
            fechaRegistro,
            updatedAt,
          ],
        );
        descargados++;
      }

      // Limpiar registros locales ya sincronizados que fueron eliminados en otro dispositivo
      const localesSincronizados = opciones.rol === "admin"
        ? await db.getAllAsync<{ id: number; codigo: string }>(
            "SELECT id, codigo FROM solicitudes WHERE sincronizado = 1 AND eliminado = 0;",
          )
        : await db.getAllAsync<{ id: number; codigo: string }>(
            "SELECT id, codigo FROM solicitudes WHERE sincronizado = 1 AND eliminado = 0 AND clienteId = ?;",
            [opciones.uid],
          );

      for (const local of localesSincronizados) {
        if (!codigosRemotos.has(local.codigo)) {
          await db.runAsync("DELETE FROM solicitudes WHERE id = ? AND sincronizado = 1;", [local.id]);
        }
      }
    } catch (error) {
      errores++;
      console.warn("[SYNC solicitudes] Error al descargar", error);
    }

    return { conectado: true, subidos, descargados, errores };
  });
}

export function sincronizarVeterinarios(
  db: SQLiteDatabase,
): Promise<ResultadoSincronizacion> {
  return ejecutarExclusivo("veterinarios", async () => {
    if (!firestore) return { conectado: false, subidos: 0, descargados: 0, errores: 0 };
    const conectado = await verificarConexion();
    if (!conectado) return { conectado: false, subidos: 0, descargados: 0, errores: 0 };

    const coleccion = collection(firestore, "veterinarios");
    let subidos = 0;
    let descargados = 0;
    let errores = 0;

    // 1. Subida (SQLite -> Firestore)
    const pendientes = await db.getAllAsync<VeterinarioLocalRow>(
      "SELECT * FROM veterinarios WHERE sincronizado = 0;",
    );

    for (const fila of pendientes) {
      try {
        const ref = doc(coleccion, fila.id);
        if (fila.eliminado === 1) {
          await deleteDoc(ref);
          await db.runAsync("DELETE FROM veterinarios WHERE id = ?;", [fila.id]);
        } else {
          await setDoc(ref, {
            firstName: fila.firstName,
            lastName: fila.lastName,
            email: fila.email,
            phone: fila.phone,
            image: fila.image ?? null,
            activo: fila.activo !== 0,
            fechaRegistro: fila.fechaRegistro,
            updatedAt: fila.updatedAt || fila.fechaRegistro,
          });
          await db.runAsync(
            "UPDATE veterinarios SET sincronizado = 1 WHERE id = ? AND updatedAt = ?;",
            [fila.id, fila.updatedAt],
          );
        }
        subidos++;
      } catch (error) {
        errores++;
        console.warn("[SYNC veterinarios] Error al subir", fila.id, error);
      }
    }

    // 2. Bajada (Firestore -> SQLite)
    try {
      const snapshot = await getDocs(coleccion);
      const idsRemotos = new Set<string>();

      for (const documento of snapshot.docs) {
        const datos = documento.data();
        const id = documento.id;
        idsRemotos.add(id);

        const fechaRegistro = leerTexto(datos.fechaRegistro, new Date().toISOString());
        const updatedAt = leerTexto(datos.updatedAt, fechaRegistro);

        await db.runAsync(
          `
          INSERT INTO veterinarios (
            id, firstName, lastName, email, phone, image, activo,
            fechaRegistro, sincronizado, eliminado, updatedAt
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)
          ON CONFLICT(id) DO UPDATE SET
            firstName = excluded.firstName,
            lastName = excluded.lastName,
            email = excluded.email,
            phone = excluded.phone,
            image = excluded.image,
            activo = excluded.activo,
            fechaRegistro = excluded.fechaRegistro,
            sincronizado = 1,
            eliminado = 0,
            updatedAt = excluded.updatedAt
          WHERE veterinarios.sincronizado = 1;
          `,
          [
            id,
            leerTexto(datos.firstName),
            leerTexto(datos.lastName),
            leerTexto(datos.email),
            leerTexto(datos.phone),
            leerTextoOpcional(datos.image),
            datos.activo === false ? 0 : 1,
            fechaRegistro,
            updatedAt,
          ],
        );
        descargados++;
      }

      const localesSincronizados = await db.getAllAsync<{ id: string }>(
        "SELECT id FROM veterinarios WHERE sincronizado = 1 AND eliminado = 0;",
      );
      for (const local of localesSincronizados) {
        if (!idsRemotos.has(local.id)) {
          await db.runAsync("DELETE FROM veterinarios WHERE id = ? AND sincronizado = 1;", [local.id]);
        }
      }
    } catch (error) {
      errores++;
      console.warn("[SYNC veterinarios] Error al descargar", error);
    }

    return { conectado: true, subidos, descargados, errores };
  });
}
