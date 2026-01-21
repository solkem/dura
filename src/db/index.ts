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
    console.log("[DB] Running migrations...");
    try {
        migrate(db, { migrationsFolder: 'drizzle' });
        console.log("[DB] Migrations complete.");
    } catch (migrationErr: any) {
        console.error("[DB] Migration error:", migrationErr?.message || migrationErr);

        // Handle "table already exists" errors by resetting migration state
        if (migrationErr?.cause?.code === 'SQLITE_ERROR' &&
            migrationErr?.cause?.message?.includes('already exists')) {
            console.warn("[DB] Migration conflict detected. Resetting all tables...");
            try {
                // Drop the migration tracking table and all app tables
                (sqlite as Database.Database).exec(`
                    DROP TABLE IF EXISTS __drizzle_migrations;
                    DROP TABLE IF EXISTS session;
                    DROP TABLE IF EXISTS user_progress;
                    DROP TABLE IF EXISTS user_stars;
                    DROP TABLE IF EXISTS user;
                    DROP TABLE IF EXISTS papers;
                    DROP TABLE IF EXISTS invitation;
                    DROP TABLE IF EXISTS agent_logs;
                    DROP TABLE IF EXISTS pending_memories;
                `);
                console.log("[DB] Tables reset. Retrying migration...");
                migrate(db, { migrationsFolder: 'drizzle' });
                console.log("[DB] Migration retry successful.");
            } catch (resetErr: any) {
                console.error("[DB] Migration reset failed:", resetErr?.message || resetErr);
            }
        }
    }
}
