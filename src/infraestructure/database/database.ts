import type { SQLiteDatabase } from 'expo-sqlite';

export async function inicializarBaseDatos(db: SQLiteDatabase) {
    console.log('[TODO DB INIT] Crear tabla solicitudes', db.databasePath);

    await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS solicitudes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT NOT NULL UNIQUE,
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
}
