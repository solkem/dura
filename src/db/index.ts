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
