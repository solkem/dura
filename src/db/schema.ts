import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    password_hash: text('password_hash').notNull(),
});

export const sessions = sqliteTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: integer('expires_at').notNull()
});

export const userProgress = sqliteTable('user_progress', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().references(() => users.id),
    contentSlug: text('content_slug').notNull(),
    status: text('status').notNull(), // 'read', 'in_progress'
    updatedAt: integer('updated_at').notNull()
});

export const userStars = sqliteTable('user_stars', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().references(() => users.id),
    paperSlug: text('paper_slug').notNull(),
    createdAt: integer('created_at').notNull()
});
