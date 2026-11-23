import type { SQLiteDatabase } from 'expo-sqlite';
import type { Solicitud } from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

type SolicitudSQLite = Omit<Solicitud, 'clienteId' | 'veterinarioId'> & {
    clienteId: string | null;
    veterinarioId: number | null;
};

export function createSolicitudRepository(db: SQLiteDatabase): SolicitudRepository {
    return {
        async listar() {
            const filas = await db.getAllAsync<SolicitudSQLite>(`
            SELECT
                id,
                codigo,
                clienteId,
                veterinarioId,
                clienteNombre,
                telefono,
                mascotaNombre,
                especieMascota,
                tipoServicio,
                prioridad,
                descripcion,
                estado,
                fechaCita,
                fechaRegistro
            FROM solicitudes
            ORDER BY id DESC;
            `);
            return filas.map(({ clienteId, veterinarioId, ...datos }) => ({
                ...datos,
                clienteId: clienteId ?? undefined,
                veterinarioId: veterinarioId ?? undefined,
            }));
        },

        async crear(dto, codigo, clienteId) {
            const fechaRegistro = new Date().toISOString();
            const result = await db.runAsync(
                `
                INSERT INTO solicitudes (
                    codigo,
                    clienteId,
                    clienteNombre,
                    telefono,
                    mascotaNombre,
                    especieMascota,
                    tipoServicio,
                    prioridad,
                    descripcion,
                    estado,
                    fechaCita,
                    fechaRegistro
                )
                VALUES (
                    $codigo, $clienteId, $clienteNombre, $telefono, $mascotaNombre,
                    $especieMascota, $tipoServicio, $prioridad, $descripcion,
                    'PENDIENTE', $fechaCita, $fechaRegistro
                );
                `,
                {
                    $codigo: codigo,
                    $clienteId: clienteId ?? null,
                    $clienteNombre: dto.clienteNombre,
                    $telefono: dto.telefono,
                    $mascotaNombre: dto.mascotaNombre,
                    $especieMascota: dto.especieMascota,
                    $tipoServicio: dto.tipoServicio,
                    $prioridad: dto.prioridad,
                    $descripcion: dto.descripcion,
                    $fechaCita: dto.fechaCita,
                    $fechaRegistro: fechaRegistro,
                }
            );

            const nuevaSolicitud: Solicitud = {
                ...dto,
                id: result.lastInsertRowId,
                codigo,
                clienteId,
                estado: 'PENDIENTE',
                fechaRegistro
            };

            return nuevaSolicitud;
        },

        async actualizar(id, datos, veterinarioId) {
            const resultado = await db.runAsync(
                `
                UPDATE solicitudes
                SET
                    veterinarioId = CASE WHEN ? THEN ? ELSE veterinarioId END,
                    clienteNombre = ?,
                    telefono = ?,
                    mascotaNombre = ?,
                    especieMascota = ?,
                    tipoServicio = ?,
                    prioridad = ?,
                    descripcion = ?,
                    estado = ?,
                    fechaCita = ?
                WHERE id = ?;
                `,
                [
                    veterinarioId !== undefined,
                    veterinarioId ?? null,
                    datos.clienteNombre,
                    datos.telefono,
                    datos.mascotaNombre,
                    datos.especieMascota,
                    datos.tipoServicio,
                    datos.prioridad,
                    datos.descripcion,
                    datos.estado,
                    datos.fechaCita,
                    id,
                ],
            );
            if (resultado.changes === 0) throw new Error('La cita ya no existe.');
        },

        async eliminar(id) {
            const resultado = await db.runAsync(
                `
                DELETE FROM solicitudes
                WHERE id=?;
                `,
                [id],
            );
            if (resultado.changes === 0) throw new Error('La cita ya no existe.');
        }
    }

}
