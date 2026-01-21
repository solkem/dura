#!/usr/bin/env node
/**
 * Database Migration Script
 * 
 * Runs Drizzle migrations before the server starts.
 * Only runs if the database is fresh (no user table).
 * This prevents data loss on container restarts.
 */

const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const { migrate } = require('drizzle-orm/better-sqlite3/migrator');

const dbUrl = process.env.DB_URL || '/app/data/dura.db';

console.log(`[migrate] Connecting to database: ${dbUrl}`);

try {
    const sqlite = new Database(dbUrl);

    // Check if database is already initialized
    const hasUserTable = sqlite
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='user'")
        .get();

    if (hasUserTable) {
        console.log('[migrate] Database already initialized, skipping migrations.');
        sqlite.close();
        process.exit(0);
    }

    console.log('[migrate] Fresh database detected. Running migrations...');
    const db = drizzle(sqlite);
    migrate(db, { migrationsFolder: '/app/drizzle' });
    console.log('[migrate] Migrations complete!');

    sqlite.close();
    process.exit(0);
} catch (error) {
    console.error('[migrate] Migration failed:', error.message);
    // Don't reset tables - just fail and let the app handle it
    process.exit(1);
}
