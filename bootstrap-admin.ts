/**
 * Bootstrap Admin User Script
 * Run this to create an admin user in production
 * 
 * Usage inside Docker container:
 *   node --loader ts-node/esm bootstrap-admin.ts
 * 
 * Or with environment:
 *   ADMIN_USERNAME=solomonkembo ADMIN_PASSWORD=yourpassword ADMIN_EMAIL=you@example.com node bootstrap-admin.js
 */

import 'dotenv/config';
import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';
import { Argon2id } from 'oslo/password';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'solomonkembo';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dura.dev';

async function bootstrapAdmin() {
    console.log('🔧 Bootstrap Admin User');
    console.log('========================');

    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.username, ADMIN_USERNAME)).get();

    if (existing) {
        console.log(`⚠️  User '${ADMIN_USERNAME}' already exists with ID: ${existing.id}`);
        console.log('   If you need to reset the password, delete the user first.');
        process.exit(0);
    }

    // Hash password
    const passwordHash = await new Argon2id().hash(ADMIN_PASSWORD);

    // Create user
    const userId = nanoid();

    await db.insert(users).values({
        id: userId,
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password_hash: passwordHash,
        role: 'admin',
        createdAt: Date.now(),
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Role: admin`);
    console.log(`   ID: ${userId}`);
    console.log('');
    console.log(`🔐 You can now login at /login with your credentials.`);
}

bootstrapAdmin().catch((err) => {
    console.error('❌ Failed to create admin user:', err);
    process.exit(1);
});
