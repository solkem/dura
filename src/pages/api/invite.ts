import type { APIRoute } from "astro";
import { lucia } from "../../auth";
import { generateIdFromEntropySize } from "lucia";
import { db } from "../../db";
import { invitations, users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

// POST /api/invite - Create a new invitation (admin only)
export const POST: APIRoute = async (context) => {
    // Check if user is authenticated and is admin
    const user = context.locals.user;
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    if (user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), { status: 403 });
    }

    const formData = await context.request.formData();
    const email = formData.get("email");
    const role = formData.get("role") || "researcher";

    // Validate email
    if (typeof email !== "string" || !email.includes("@")) {
        return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }

    // Validate role
    const validRoles = ["researcher", "contributor"];
    if (typeof role !== "string" || !validRoles.includes(role)) {
        return new Response(JSON.stringify({ error: "Invalid role. Must be 'researcher' or 'contributor'" }), { status: 400 });
    }

    // Generate invite token
    const inviteId = generateIdFromEntropySize(10);
    const token = generateIdFromEntropySize(16); // 32-character token
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

    try {
        await db.insert(invitations).values({
            id: inviteId,
            email,
            role,
            invitedBy: user.id,
            token,
            expiresAt
        });

        // Generate the invite link
        const baseUrl = context.url.origin;
        const inviteLink = `${baseUrl}/signup?invite=${token}`;

        return new Response(JSON.stringify({
            success: true,
            inviteLink,
            email,
            role,
            expiresAt: new Date(expiresAt).toISOString()
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        console.error("Invite creation error:", e);
        return new Response(JSON.stringify({ error: "Failed to create invitation" }), { status: 500 });
    }
};

// GET /api/invite?token=XXX - Validate an invite token
export const GET: APIRoute = async (context) => {
    const token = context.url.searchParams.get("token");

    if (!token) {
        return new Response(JSON.stringify({ valid: false, error: "No token provided" }), { status: 400 });
    }

    const invite = await db.select().from(invitations).where(eq(invitations.token, token)).get();

    if (!invite) {
        return new Response(JSON.stringify({ valid: false, error: "Invalid token" }), { status: 404 });
    }

    if (invite.usedAt) {
        return new Response(JSON.stringify({ valid: false, error: "Token already used" }), { status: 400 });
    }

    if (invite.expiresAt < Date.now()) {
        return new Response(JSON.stringify({ valid: false, error: "Token expired" }), { status: 400 });
    }

    return new Response(JSON.stringify({
        valid: true,
        email: invite.email,
        role: invite.role
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
};
