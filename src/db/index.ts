import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

// In production, the DB_URL should point to a mounted volume
const dbUrl = process.env.DB_URL || './local.db';

let sqlite: Database.Database | null = null;
let isMock = false;

try {
    sqlite = new Database(dbUrl);
    console.log(`[DB] Connected to database: ${dbUrl}`);
} catch (e) {
    console.warn("[DB] Failed to load better-sqlite3, likely during build. Using mock.", e);
    isMock = true;
    const mockDb = {
        prepare: () => ({ get: () => null, run: () => null, all: () => [], bind: () => ({ all: () => [], get: () => null, run: () => null }) }),
        exec: () => null,
        pragma: () => null,
        function: () => null,
        transaction: (fn: any) => fn,
    };
    sqlite = mockDb as any;
}

export const db = drizzle(sqlite as Database.Database, { schema });

// Run migrations synchronously at startup (production only)
if (process.env.NODE_ENV === 'production' && !dbUrl.includes('local.db') && !isMock && sqlite) {
    console.log("[DB] Checking for pending migrations...");
    try {
        // Always try to run migrations - Drizzle handles idempotency
        // It tracks which migrations have been applied in __drizzle_migrations table
        migrate(db, { migrationsFolder: 'drizzle' });
        console.log("[DB] Migrations complete (or already up to date).");
    } catch (migrationErr: any) {
        // If migration fails due to "already exists" type errors, that's fine
        // Log but don't crash - the table/column already exists
        const errMsg = migrationErr?.message || String(migrationErr);
        if (errMsg.includes('already exists') || errMsg.includes('duplicate column')) {
            console.log("[DB] Migration skipped - schema already up to date.");
        } else {
            console.error("[DB] Migration error:", errMsg);
        }
    }
}
