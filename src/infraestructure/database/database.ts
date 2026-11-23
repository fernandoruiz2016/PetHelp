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
                veterinarioId INTEGER,
                clienteNombre TEXT NOT NULL,
                telefono TEXT NOT NULL,
                mascotaNombre TEXT NOT NULL,
                especieMascota TEXT NOT NULL,
                tipoServicio TEXT NOT NULL,
                prioridad TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                estado TEXT NOT NULL DEFAULT 'PENDIENTE',
                fechaCita TEXT NOT NULL,
                fechaRegistro TEXT NOT NULL
            );
        `);

        const columnas = await txn.getAllAsync<{ name: string }>('PRAGMA table_info(solicitudes);');
        if (!columnas.some(({ name }) => name === 'clienteId')) {
            await txn.execAsync('ALTER TABLE solicitudes ADD COLUMN clienteId TEXT;');
        }
        if (!columnas.some(({ name }) => name === 'veterinarioId')) {
            await txn.execAsync('ALTER TABLE solicitudes ADD COLUMN veterinarioId INTEGER;');
        }
        await txn.execAsync(`
            CREATE INDEX IF NOT EXISTS idx_solicitudes_cliente_fecha ON solicitudes (clienteId, fechaCita);
            CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha ON solicitudes (fechaCita);
        `);
    });
}
