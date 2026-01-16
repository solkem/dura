import type { APIRoute } from "astro";
import { lucia } from "../../auth";
import { generateIdFromEntropySize } from "lucia";
import { Argon2id } from "oslo/password";
import { db } from "../../db";
import { users, invitations } from "../../db/schema";
import { eq } from "drizzle-orm";
import { SqliteError } from "better-sqlite3";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    const formData = await context.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const inviteToken = formData.get("invite");

    // Require invite token for signup
    if (typeof inviteToken !== "string" || !inviteToken) {
        return new Response(JSON.stringify({ error: "Invitation required to sign up" }), {
            status: 400
        });
    }

    // Validate invite token
    const invite = await db.select().from(invitations).where(eq(invitations.token, inviteToken)).get();

    if (!invite) {
        return new Response(JSON.stringify({ error: "Invalid invitation" }), { status: 400 });
    }
    if (invite.usedAt) {
        return new Response(JSON.stringify({ error: "Invitation already used" }), { status: 400 });
    }
    if (invite.expiresAt < Date.now()) {
        return new Response(JSON.stringify({ error: "Invitation expired" }), { status: 400 });
    }

    // Validate username
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return new Response(JSON.stringify({ error: "Invalid username (3-31 chars, lowercase, numbers, _ or -)" }), {
            status: 400
        });
    }

    // Validate password
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return new Response(JSON.stringify({ error: "Invalid password (minimum 6 characters)" }), {
            status: 400
        });
    }

    const passwordHash = await new Argon2id().hash(password);
    const userId = generateIdFromEntropySize(10);

    try {
        // Create user with role from invitation
        await db.insert(users).values({
            id: userId,
            username,
            password_hash: passwordHash,
            email: invite.email,
            role: invite.role,
            createdAt: Date.now()
        });

        // Mark invitation as used
        await db.update(invitations)
            .set({ usedAt: Date.now() })
            .where(eq(invitations.id, invite.id));

        // Create session
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return new Response(null, {
            status: 302,
            headers: {
                Location: "/"
            }
        });
    } catch (e) {
        if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return new Response(
                JSON.stringify({ error: "Username already taken" }),
                { status: 400 }
            );
        }
        console.error("Signup error:", e);
        return new Response(
            JSON.stringify({ error: "An unknown error occurred" }),
            { status: 500 }
        );
    }
};
