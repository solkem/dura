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
    // Check if migrations have already been applied by looking for the user table
    const hasUserTable = (sqlite as Database.Database)
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='user'")
        .get();

    if (hasUserTable) {
        console.log("[DB] Database already initialized, skipping migrations.");
    } else {
        console.log("[DB] Running migrations for fresh database...");
        try {
            migrate(db, { migrationsFolder: 'drizzle' });
            console.log("[DB] Migrations complete.");
        } catch (migrationErr: any) {
            console.error("[DB] Migration error:", migrationErr?.message || migrationErr);
            // Don't reset tables - just log the error
            // This preserves existing data if there's a migration conflict
        }
    }
}
