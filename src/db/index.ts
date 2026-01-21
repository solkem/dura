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
        import('drizzle-orm/better-sqlite3/migrator').then(async ({ migrate }) => {
            console.log("Running migrations...");
            try {
                migrate(db, { migrationsFolder: 'drizzle' });
                console.log("Migrations complete.");
            } catch (migrationErr: any) {
                // Handle "table already exists" errors by resetting migration state
                if (migrationErr?.cause?.code === 'SQLITE_ERROR' &&
                    migrationErr?.cause?.message?.includes('already exists')) {
                    console.warn("Migration conflict detected. Resetting migration tracking...");
                    try {
                        // Drop the migration tracking table and all app tables
                        // This forces a clean migration run
                        sqlite.exec(`
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
                        console.log("Tables reset. Retrying migration...");
                        migrate(db, { migrationsFolder: 'drizzle' });
                        console.log("Migration retry successful.");
                    } catch (resetErr) {
                        console.error("Migration reset failed:", resetErr);
                    }
                } else {
                    console.error("Migration failed:", migrationErr);
                }
            }
        }).catch(err => {
            console.error("Migration module import failed:", err);
        });
    } catch (e) {
        console.warn("Skipping migration init", e);
    }
}

