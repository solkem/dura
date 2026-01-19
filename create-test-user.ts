/**
 * Create a test admin user
 * Run with: npx tsx create-test-user.ts
 */
import 'dotenv/config';
import { Argon2id } from 'oslo/password';
import { nanoid } from 'nanoid';
import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';

const TEST_USERNAME = 'admin';
const TEST_PASSWORD = 'dura2024';
const TEST_ROLE = 'admin';

async function createTestUser() {
    console.log('Creating test admin user...\n');

    const passwordHash = await new Argon2id().hash(TEST_PASSWORD);
    const userId = nanoid();

    try {
        await db.insert(users).values({
            id: userId,
            username: TEST_USERNAME,
            password_hash: passwordHash,
            email: 'admin@dura.dev',
            role: TEST_ROLE,
            createdAt: Date.now()
        });

        console.log('✓ Test user created successfully!\n');
        console.log('  Username: ' + TEST_USERNAME);
        console.log('  Password: ' + TEST_PASSWORD);
        console.log('  Role: ' + TEST_ROLE);
        console.log('\nYou can now login at /login');

    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            console.log('User "' + TEST_USERNAME + '" already exists.');
        } else {
            console.error('Error:', error);
        }
    }
}

createTestUser();
