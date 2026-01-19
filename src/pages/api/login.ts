import type { APIRoute } from "astro";
import { lucia } from "../../auth";
import { Argon2id } from "oslo/password";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    const formData = await context.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return new Response(null, {
            status: 302,
            headers: { Location: "/login?error=Invalid%20username" }
        });
    }
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return new Response(null, {
            status: 302,
            headers: { Location: "/login?error=Invalid%20password" }
        });
    }

    const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
    if (!existingUser) {
        return new Response(null, {
            status: 302,
            headers: { Location: "/login?error=Incorrect%20username%20or%20password" }
        });
    }

    const validPassword = await new Argon2id().verify(existingUser.password_hash, password);
    if (!validPassword) {
        return new Response(null, {
            status: 302,
            headers: { Location: "/login?error=Incorrect%20username%20or%20password" }
        });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    const serializedCookie = sessionCookie.serialize();

    // Log for debugging
    console.log('Session created:', session.id);
    console.log('Cookie:', sessionCookie.name, '=', sessionCookie.value);
    console.log('Cookie attributes:', sessionCookie.attributes);
    console.log('Serialized Set-Cookie:', serializedCookie);

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/",
            "Set-Cookie": serializedCookie
        }
    });
};
