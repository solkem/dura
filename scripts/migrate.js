#!/usr/bin/env node
/**
 * Database Migration Script
 * 
 * Runs Drizzle migrations before the server starts.
 * This is called from the Docker entrypoint.
 */

const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const { migrate } = require('drizzle-orm/better-sqlite3/migrator');

const dbUrl = process.env.DB_URL || '/app/data/dura.db';

console.log(`[migrate] Connecting to database: ${dbUrl}`);

try {
    const sqlite = new Database(dbUrl);
    const db = drizzle(sqlite);

    console.log('[migrate] Running migrations...');
    migrate(db, { migrationsFolder: '/app/drizzle' });
    console.log('[migrate] Migrations complete!');

    sqlite.close();
    process.exit(0);
} catch (error) {
    console.error('[migrate] Migration failed:', error.message);

    // If "table already exists" error, try to recover
    if (error.cause?.message?.includes('already exists')) {
        console.log('[migrate] Table conflict detected - resetting...');
        try {
            const sqlite = new Database(dbUrl);
            sqlite.exec(`
                DROP TABLE IF EXISTS __drizzle_migrations;
                DROP TABLE IF EXISTS session;
                DROP TABLE IF EXISTS user_progress;
                DROP TABLE IF EXISTS user_stars;
                DROP TABLE IF EXISTS user;
                DROP TABLE IF EXISTS papers;
                DROP TABLE IF EXISTS paper_relations;
                DROP TABLE IF EXISTS invitation;
                DROP TABLE IF EXISTS agent_logs;
                DROP TABLE IF EXISTS pending_memories;
            `);

            const db = drizzle(sqlite);
            migrate(db, { migrationsFolder: '/app/drizzle' });
            console.log('[migrate] Recovery successful!');
            sqlite.close();
            process.exit(0);
        } catch (retryError) {
            console.error('[migrate] Recovery failed:', retryError.message);
            process.exit(1);
        }
    }

    process.exit(1);
}
