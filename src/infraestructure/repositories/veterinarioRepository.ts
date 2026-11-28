import type { SQLiteDatabase } from 'expo-sqlite';
import type { DatosVeterinario, Veterinario } from '../../domain/models/Veterinario';
import type { VeterinarioRepository } from '../../domain/repositories/VeterinarioRepository';

type VeterinarioSQLite = {
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

export class VeterinarioConCitasAsignadasError extends Error {
    constructor() {
        super('No se puede eliminar este veterinario porque tiene citas asignadas. Desactívalo o reasigna sus citas primero.');
        this.name = 'VeterinarioConCitasAsignadasError';
    }
}

function convertirVeterinario(fila: VeterinarioSQLite): Veterinario {
    return {
        id: fila.id,
        firstName: fila.firstName,
        lastName: fila.lastName,
        email: fila.email,
        phone: fila.phone,
        image: fila.image ?? undefined,
        activo: fila.activo !== 0,
        sincronizado: fila.sincronizado === 1,
    };
}

function generarIdVeterinario(): string {
    return `vet-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function prepararDatos({ firstName, lastName, email, phone, activo }: DatosVeterinario) {
    return {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        activo,
    };
}

export function createVeterinarioRepository(db: SQLiteDatabase): VeterinarioRepository {
    return {
        async listar() {
            const filas = await db.getAllAsync<VeterinarioSQLite>(
                'SELECT * FROM veterinarios WHERE eliminado = 0 ORDER BY firstName COLLATE NOCASE ASC, lastName COLLATE NOCASE ASC;',
            );
            return filas.map(convertirVeterinario);
        },

        async buscar(id) {
            const fila = await db.getFirstAsync<VeterinarioSQLite>(
                'SELECT * FROM veterinarios WHERE id = ? AND eliminado = 0;',
                [id],
            );
            return fila ? convertirVeterinario(fila) : null;
        },

        async crear(datos) {
            const id = generarIdVeterinario();
            const limpios = prepararDatos(datos);
            const fechaRegistro = new Date().toISOString();

            await db.runAsync(
                `
                INSERT INTO veterinarios (
                    id, firstName, lastName, email, phone, image, activo,
                    fechaRegistro, sincronizado, eliminado, updatedAt
                )
                VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 0, 0, ?);
                `,
                [
                    id,
                    limpios.firstName,
                    limpios.lastName,
                    limpios.email,
                    limpios.phone,
                    limpios.activo ? 1 : 0,
                    fechaRegistro,
                    fechaRegistro,
                ],
            );

            return {
                id,
                ...limpios,
                sincronizado: false,
            };
        },

        async actualizar(id, datos) {
            const limpios = prepararDatos(datos);
            const updatedAt = new Date().toISOString();
            const resultado = await db.runAsync(
                `
                UPDATE veterinarios
                SET
                    firstName = ?,
                    lastName = ?,
                    email = ?,
                    phone = ?,
                    activo = ?,
                    sincronizado = 0,
                    updatedAt = ?
                WHERE id = ? AND eliminado = 0;
                `,
                [
                    limpios.firstName,
                    limpios.lastName,
                    limpios.email,
                    limpios.phone,
                    limpios.activo ? 1 : 0,
                    updatedAt,
                    id,
                ],
            );

            if (resultado.changes === 0) throw new Error('El veterinario ya no existe.');
        },

        async eliminar(id) {
            await db.withExclusiveTransactionAsync(async (txn) => {
                const citaAsignada = await txn.getFirstAsync<{ id: number }>(
                    'SELECT id FROM solicitudes WHERE veterinarioId = ? AND eliminado = 0 LIMIT 1;',
                    [id],
                );
                if (citaAsignada) {
                    throw new VeterinarioConCitasAsignadasError();
                }

                const fila = await txn.getFirstAsync<{ sincronizado: number }>(
                    'SELECT sincronizado FROM veterinarios WHERE id = ? AND eliminado = 0;',
                    [id],
                );
                if (!fila) throw new Error('El veterinario ya no existe.');

                if (fila.sincronizado === 0) {
                    await txn.runAsync('DELETE FROM veterinarios WHERE id = ?;', [id]);
                } else {
                    await txn.runAsync(
                        'UPDATE veterinarios SET eliminado = 1, sincronizado = 0, updatedAt = ? WHERE id = ?;',
                        [new Date().toISOString(), id],
                    );
                }
            });
        },
    };
}
