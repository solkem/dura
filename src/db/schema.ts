import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    password_hash: text('password_hash').notNull(),
    email: text('email'),
    role: text('role').notNull().default('public'), // 'public', 'researcher', 'contributor', 'admin'
    createdAt: integer('created_at').notNull().default(Date.now())
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

export const invitations = sqliteTable('invitation', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    role: text('role').notNull().default('researcher'), // 'researcher', 'contributor'
    invitedBy: text('invited_by').references(() => users.id),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at').notNull(),
    usedAt: integer('used_at') // null if unused
});

