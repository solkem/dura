import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { users } from '../../../../db/schema';
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
        const { userId, role } = await request.json();

        // Validate role
        const validRoles = ['public', 'researcher', 'contributor', 'admin'];
        if (!validRoles.includes(role)) {
            return new Response(JSON.stringify({ error: 'Invalid role' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Prevent self-demotion
        if (userId === currentUser.id && role !== 'admin') {
            return new Response(JSON.stringify({ error: 'Cannot change your own role' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Update role
        await db.update(users)
            .set({ role })
            .where(eq(users.id, userId));

        return new Response(JSON.stringify({ success: true, role }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        return new Response(JSON.stringify({ error: 'Failed to update role' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
