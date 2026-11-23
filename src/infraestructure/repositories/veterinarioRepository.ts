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
                'SELECT * FROM veterinarios ORDER BY firstName COLLATE NOCASE ASC, lastName COLLATE NOCASE ASC;',
            );
            return filas.map(convertirVeterinario);
        },

        async buscar(id) {
            const fila = await db.getFirstAsync<VeterinarioSQLite>(
                'SELECT * FROM veterinarios WHERE id = ?;',
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
                    id, firstName, lastName, email, phone, image, activo, fechaRegistro
                )
                VALUES (?, ?, ?, ?, ?, NULL, ?, ?);
                `,
                [
                    id,
                    limpios.firstName,
                    limpios.lastName,
                    limpios.email,
                    limpios.phone,
                    limpios.activo ? 1 : 0,
                    fechaRegistro,
                ],
            );

            return {
                id,
                ...limpios,
            };
        },

        async actualizar(id, datos) {
            const limpios = prepararDatos(datos);
            const resultado = await db.runAsync(
                `
                UPDATE veterinarios
                SET
                    firstName = ?,
                    lastName = ?,
                    email = ?,
                    phone = ?,
                    activo = ?
                WHERE id = ?;
                `,
                [
                    limpios.firstName,
                    limpios.lastName,
                    limpios.email,
                    limpios.phone,
                    limpios.activo ? 1 : 0,
                    id,
                ],
            );

            if (resultado.changes === 0) throw new Error('El veterinario ya no existe.');
        },

        async eliminar(id) {
            await db.withExclusiveTransactionAsync(async (txn) => {
                const citaAsignada = await txn.getFirstAsync<{ id: number }>(
                    'SELECT id FROM solicitudes WHERE veterinarioId = ? LIMIT 1;',
                    [id],
                );
                if (citaAsignada) {
                    throw new VeterinarioConCitasAsignadasError();
                }

                const resultado = await txn.runAsync(
                    'DELETE FROM veterinarios WHERE id = ?;',
                    [id],
                );
                if (resultado.changes === 0) throw new Error('El veterinario ya no existe.');
            });
        },
    };
}
