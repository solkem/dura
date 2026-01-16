import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// In production, the DB_URL should point to a mounted volume
const dbUrl = process.env.DB_URL || './local.db';

let sqlite;
try {
    sqlite = new Database(dbUrl);
} catch (e) {
    console.warn("Failed to load better-sqlite3, likely during build. Using mock.", e);
    const mockDb = {
        prepare: () => ({ get: () => null, run: () => null, all: () => [], bind: () => ({ all: () => [], get: () => null, run: () => null }) }),
        exec: () => null,
        pragma: () => null,
        function: () => null,
        transaction: (fn: any) => fn,
    };
    sqlite = mockDb as any;
}

export const db = drizzle(sqlite, { schema });

// Auto-migrate in production (or when DB_URL is set and we're not building)
if (process.env.NODE_ENV === 'production' && !dbUrl.includes('local.db') && sqlite.prepare) {
    try {
        // Dynamic import to avoid build-time issues
        import('drizzle-orm/better-sqlite3/migrator').then(({ migrate }) => {
            console.log("Running migrations...");
            migrate(db, { migrationsFolder: 'drizzle' });
            console.log("Migrations complete.");
        }).catch(err => {
            console.error("Migration failed:", err);
        });
    } catch (e) {
        console.warn("Skipping migration init", e);
    }
}
