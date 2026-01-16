import type { APIRoute } from "astro";
import { lucia } from "../../auth";
import { generateIdFromEntropySize } from "lucia";
import { Argon2id } from "oslo/password";
import { db } from "../../db";
import { users } from "../../db/schema";
import { SqliteError } from "better-sqlite3";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    const formData = await context.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    // basic validation
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

    const passwordHash = await new Argon2id().hash(password);
    const userId = generateIdFromEntropySize(10); // 16 characters long

    try {
        await db.insert(users).values({
            id: userId,
            username,
            password_hash: passwordHash
        });

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
                JSON.stringify({
                    error: "Username already taken"
                }),
                {
                    status: 400
                }
            );
        }
        return new Response(
            JSON.stringify({
                error: "An unknown error occurred"
            }),
            {
                status: 500
            }
        );
    }
};
