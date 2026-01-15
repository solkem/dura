import type { APIRoute } from "astro";
import { lucia } from "../../auth";
import { Argon2id } from "oslo/password";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

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
        return new Response(JSON.stringify({ error: "Invalid username" }), {
            status: 400
        });
    }
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return new Response(JSON.stringify({ error: "Invalid password" }), {
            status: 400
        });
    }

    const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
    if (!existingUser) {
        return new Response(
            JSON.stringify({
                error: "Incorrect username or password"
            }),
            {
                status: 400
            }
        );
    }

    const validPassword = await new Argon2id().verify(existingUser.password_hash, password);
    if (!validPassword) {
        return new Response(
            JSON.stringify({
                error: "Incorrect username or password"
            }),
            {
                status: 400
            }
        );
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/"
        }
    });
};
