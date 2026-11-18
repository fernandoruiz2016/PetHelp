import type { SQLiteDatabase } from 'expo-sqlite';
import type { Solicitud, SolicitudFormData } from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export function createSolicitudRepository(db: SQLiteDatabase): SolicitudRepository {
    return {
        async listar(): Promise<Solicitud[]> {
            console.log('Listando solicitudes');

            return db.getAllAsync<Solicitud>(`
            SELECT
                id,
                codigo,
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
        },

        async crear(dto: SolicitudFormData, codigo: string): Promise<Solicitud> {
            const fechaRegistro = new Date().toISOString();
            const result = await db.runAsync(
                `
                INSERT INTO solicitudes (
                    codigo,
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
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                `,
                [
                    codigo,
                    dto.clienteNombre,
                    dto.telefono,
                    dto.mascotaNombre,
                    dto.especieMascota,
                    dto.tipoServicio,
                    dto.prioridad,
                    dto.descripcion,
                    'PENDIENTE',
                    dto.fechaCita,
                    fechaRegistro
                ]
            );

            const nuevaSolicitud: Solicitud = {
                ...dto,
                id: result.lastInsertRowId,
                codigo,
                estado: 'PENDIENTE',
                fechaRegistro
            };

            return nuevaSolicitud;
        },

        async actualizar(id: number, datos: SolicitudFormData): Promise<void> {
            console.log('Actulizando registro', { id, datos });

            await db.runAsync(
                `
                UPDATE solicitudes
                SET
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
                datos.clienteNombre,
                datos.telefono,
                datos.mascotaNombre,
                datos.especieMascota,
                datos.tipoServicio,
                datos.prioridad,
                datos.descripcion,
                datos.estado,
                datos.fechaCita,
                id
            ]
        );
        },

        async eliminar(id: number): Promise<void> {
            console.log('Eliminado solicitud', { id });
            await db.runAsync(
                `
                DELETE FROM solicitudes
                WHERE id=?;
                `,
                [id],
            )
        }
    }

}