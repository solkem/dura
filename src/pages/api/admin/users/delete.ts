import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { users, sessions, userProgress, userStars } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
    // Check if user is admin
    const currentUser = locals.user;
    if (!currentUser || currentUser.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { userId } = await request.json();

        // Prevent self-deletion
        if (userId === currentUser.id) {
            return new Response(JSON.stringify({ error: 'Cannot delete yourself' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Delete user's sessions first (foreign key constraint)
        await db.delete(sessions).where(eq(sessions.userId, userId));

        // Delete user's progress
        await db.delete(userProgress).where(eq(userProgress.userId, userId));

        // Delete user's stars
        await db.delete(userStars).where(eq(userStars.userId, userId));

        // Delete the user
        await db.delete(users).where(eq(users.id, userId));

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
