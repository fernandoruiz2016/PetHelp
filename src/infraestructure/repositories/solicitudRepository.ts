import type { SQLiteDatabase } from 'expo-sqlite';
import type { Solicitud, SolicitudFormData } from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';
import { generarCodigoCita } from '../../domain/services/generarCodigoCita';
import { HORAS_CITA, HorarioCitaNoDisponible, rangoDiaCita } from '../../domain/services/horariosCita';

type SolicitudSQLite = Omit<Solicitud, 'clienteId' | 'veterinarioId' | 'razaMascota'> & {
    clienteId: string | null;
    veterinarioId: string | null;
    razaMascota: string | null;
};

const horarioOcupado = `fechaCita >= $desde AND fechaCita < $hasta AND estado <> 'CANCELADA'`;

function convertirSolicitud({ clienteId, veterinarioId, razaMascota, ...datos }: SolicitudSQLite): Solicitud {
    return {
        ...datos,
        clienteId: clienteId ?? undefined,
        veterinarioId: veterinarioId ?? undefined,
        razaMascota: razaMascota ?? undefined,
    };
}

export function createSolicitudRepository(db: SQLiteDatabase): SolicitudRepository {
    async function insertar(
        dto: SolicitudFormData,
        codigo: string,
        clienteId?: Solicitud['clienteId'],
        horario?: { desde: string; hasta: string },
    ): Promise<Solicitud | null> {
        const fechaRegistro = new Date().toISOString();
        const result = await db.runAsync(
            `
            INSERT INTO solicitudes (
                codigo, clienteId, clienteNombre, telefono, mascotaNombre,
                especieMascota, razaMascota, tipoServicio, prioridad, descripcion, estado,
                fechaCita, fechaRegistro
            )
            SELECT
                $codigo, $clienteId, $clienteNombre, $telefono, $mascotaNombre,
                $especieMascota, $razaMascota, $tipoServicio, $prioridad, $descripcion,
                'PENDIENTE', $fechaCita, $fechaRegistro
            WHERE $desde IS NULL OR NOT EXISTS (
                SELECT 1 FROM solicitudes WHERE ${horarioOcupado}
            )
            ON CONFLICT(codigo) DO NOTHING;
            `,
            {
                $codigo: codigo,
                $clienteId: clienteId ?? null,
                $clienteNombre: dto.clienteNombre,
                $telefono: dto.telefono,
                $mascotaNombre: dto.mascotaNombre,
                $especieMascota: dto.especieMascota,
                $razaMascota: dto.razaMascota ?? null,
                $tipoServicio: dto.tipoServicio,
                $prioridad: dto.prioridad,
                $descripcion: dto.descripcion,
                $fechaCita: dto.fechaCita,
                $fechaRegistro: fechaRegistro,
                $desde: horario?.desde ?? null,
                $hasta: horario?.hasta ?? null,
            },
        );

        if (result.changes === 0) return null;
        return {
            ...dto,
            id: result.lastInsertRowId,
            codigo,
            clienteId,
            estado: 'PENDIENTE',
            fechaRegistro,
        };
    }

    return {
        async listar() {
            const filas = await db.getAllAsync<SolicitudSQLite>('SELECT * FROM solicitudes ORDER BY id DESC;');
            return filas.map(convertirSolicitud);
        },

        async listarPorCliente(clienteId) {
            const filas = await db.getAllAsync<SolicitudSQLite>(
                'SELECT * FROM solicitudes WHERE clienteId = ? ORDER BY fechaCita ASC, id ASC;',
                [clienteId],
            );
            return filas.map(convertirSolicitud);
        },

        async buscarPorCliente(id, clienteId) {
            const fila = await db.getFirstAsync<SolicitudSQLite>(
                'SELECT * FROM solicitudes WHERE id = ? AND clienteId = ?;',
                [id, clienteId],
            );
            return fila ? convertirSolicitud(fila) : null;
        },

        async horasOcupadas(fecha) {
            const { desde, hasta } = rangoDiaCita(fecha);
            const filas = await db.getAllAsync<Pick<Solicitud, 'fechaCita'>>(
                `SELECT DISTINCT fechaCita FROM solicitudes WHERE ${horarioOcupado};`,
                { $desde: desde, $hasta: hasta },
            );
            return [...new Set(filas.map(({ fechaCita }) => new Date(fechaCita).getHours()))];
        },

        async crear(dto, codigo, clienteId) {
            const solicitud = await insertar(dto, codigo, clienteId);
            if (!solicitud) throw new Error('No se pudo generar un código de cita.');
            return solicitud;
        },

        async reservarParaCliente(dto, clienteId) {
            const fecha = new Date(dto.fechaCita);
            if (
                !HORAS_CITA.includes(fecha.getHours()) ||
                fecha.getMinutes() !== 0 || fecha.getSeconds() !== 0 || fecha.getMilliseconds() !== 0 ||
                fecha.getTime() <= Date.now()
            ) {
                throw new HorarioCitaNoDisponible();
            }

            const desde = fecha.toISOString();
            const hasta = new Date(fecha.getTime() + 60 * 60 * 1000).toISOString();
            const datos: SolicitudFormData = { ...dto, fechaCita: desde, prioridad: 'NORMAL', estado: 'PENDIENTE' };
            // El INSERT comprueba el horario y guarda la reserva en una sola operación.
            for (let intento = 0; intento < 5; intento++) {
                const reserva = await insertar(datos, generarCodigoCita([]), clienteId, { desde, hasta });
                if (reserva) return reserva;

                const ocupada = await db.getFirstAsync(
                    `SELECT 1 FROM solicitudes WHERE ${horarioOcupado} LIMIT 1;`,
                    { $desde: desde, $hasta: hasta },
                );
                if (ocupada) throw new HorarioCitaNoDisponible();
            }
            throw new Error('No se pudo generar un código de cita.');
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
                    razaMascota = ?,
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
                    datos.razaMascota ?? null,
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
