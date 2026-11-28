import type { SQLiteDatabase } from 'expo-sqlite';

export const NOMBRE_BASE_DATOS = 'vethelp.db';

export async function inicializarBaseDatos(db: SQLiteDatabase) {
    await db.execAsync('PRAGMA journal_mode = WAL;');

    await db.withExclusiveTransactionAsync(async (txn) => {
        await txn.execAsync(`
            CREATE TABLE IF NOT EXISTS solicitudes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT NOT NULL UNIQUE,
                clienteId TEXT,
                veterinarioId TEXT,
                clienteNombre TEXT NOT NULL,
                telefono TEXT NOT NULL,
                mascotaNombre TEXT NOT NULL,
                especieMascota TEXT NOT NULL,
                razaMascota TEXT,
                tipoServicio TEXT NOT NULL,
                prioridad TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                estado TEXT NOT NULL DEFAULT 'PENDIENTE',
                fechaCita TEXT NOT NULL,
                fechaRegistro TEXT NOT NULL,
                sincronizado INTEGER NOT NULL DEFAULT 0,
                eliminado INTEGER NOT NULL DEFAULT 0,
                updatedAt TEXT NOT NULL DEFAULT ''
            );
        `);

        const columnasSolicitudes = await txn.getAllAsync<{ name: string; type: string }>('PRAGMA table_info(solicitudes);');
        if (!columnasSolicitudes.some(({ name }) => name === 'clienteId')) {
            await txn.execAsync('ALTER TABLE solicitudes ADD COLUMN clienteId TEXT;');
        }
        if (!columnasSolicitudes.some(({ name }) => name === 'razaMascota')) {
            await txn.execAsync('ALTER TABLE solicitudes ADD COLUMN razaMascota TEXT;');
        }
        if (!columnasSolicitudes.some(({ name }) => name === 'veterinarioId')) {
            await txn.execAsync('ALTER TABLE solicitudes ADD COLUMN veterinarioId TEXT;');
        } else if (columnasSolicitudes.find(({ name }) => name === 'veterinarioId')?.type.toUpperCase() !== 'TEXT') {
            await txn.execAsync(`
                ALTER TABLE solicitudes RENAME COLUMN veterinarioId TO veterinarioIdAnterior;
                ALTER TABLE solicitudes ADD COLUMN veterinarioId TEXT;
                UPDATE solicitudes SET veterinarioId = 'legacy-api:' || CAST(veterinarioIdAnterior AS TEXT)
                    WHERE veterinarioIdAnterior IS NOT NULL;
                ALTER TABLE solicitudes DROP COLUMN veterinarioIdAnterior;
            `);
        }
        if (!columnasSolicitudes.some(({ name }) => name === 'sincronizado')) {
            await txn.execAsync('ALTER TABLE solicitudes ADD COLUMN sincronizado INTEGER NOT NULL DEFAULT 0;');
        }
        if (!columnasSolicitudes.some(({ name }) => name === 'eliminado')) {
            await txn.execAsync('ALTER TABLE solicitudes ADD COLUMN eliminado INTEGER NOT NULL DEFAULT 0;');
        }
        if (!columnasSolicitudes.some(({ name }) => name === 'updatedAt')) {
            await txn.execAsync("ALTER TABLE solicitudes ADD COLUMN updatedAt TEXT NOT NULL DEFAULT '';");
            await txn.execAsync("UPDATE solicitudes SET updatedAt = fechaRegistro WHERE updatedAt = '';");
        }

        await txn.execAsync(`
            CREATE TABLE IF NOT EXISTS veterinarios (
                id TEXT PRIMARY KEY,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                email TEXT NOT NULL DEFAULT '',
                phone TEXT NOT NULL DEFAULT '',
                image TEXT,
                activo INTEGER NOT NULL DEFAULT 1,
                fechaRegistro TEXT NOT NULL,
                sincronizado INTEGER NOT NULL DEFAULT 0,
                eliminado INTEGER NOT NULL DEFAULT 0,
                updatedAt TEXT NOT NULL DEFAULT ''
            );
        `);

        const columnasVeterinarios = await txn.getAllAsync<{ name: string; type: string }>('PRAGMA table_info(veterinarios);');
        if (!columnasVeterinarios.some(({ name }) => name === 'sincronizado')) {
            await txn.execAsync('ALTER TABLE veterinarios ADD COLUMN sincronizado INTEGER NOT NULL DEFAULT 0;');
        }
        if (!columnasVeterinarios.some(({ name }) => name === 'eliminado')) {
            await txn.execAsync('ALTER TABLE veterinarios ADD COLUMN eliminado INTEGER NOT NULL DEFAULT 0;');
        }
        if (!columnasVeterinarios.some(({ name }) => name === 'updatedAt')) {
            await txn.execAsync("ALTER TABLE veterinarios ADD COLUMN updatedAt TEXT NOT NULL DEFAULT '';");
            await txn.execAsync("UPDATE veterinarios SET updatedAt = fechaRegistro WHERE updatedAt = '';");
        }

        await txn.execAsync(`
            CREATE INDEX IF NOT EXISTS idx_solicitudes_cliente_fecha ON solicitudes (clienteId, fechaCita);
            CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha ON solicitudes (fechaCita);
            CREATE INDEX IF NOT EXISTS idx_solicitudes_veterinario ON solicitudes (veterinarioId);
            CREATE INDEX IF NOT EXISTS idx_solicitudes_sync ON solicitudes (sincronizado, eliminado);
            CREATE INDEX IF NOT EXISTS idx_veterinarios_sync ON veterinarios (sincronizado, eliminado);
        `);
    });
}
