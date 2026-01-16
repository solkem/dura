import type { APIRoute } from "astro";
import { db } from "../../db";
import { userStars } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    if (!context.locals.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { slug } = await context.request.json();
    if (!slug) return new Response(JSON.stringify({ error: "Missing slug" }), { status: 400 });

    const userId = context.locals.user.id;
    const existing = await db.select().from(userStars).where(
        and(eq(userStars.userId, userId), eq(userStars.paperSlug, slug))
    ).get();

    if (existing) {
        await db.delete(userStars).where(eq(userStars.id, existing.id));
        return new Response(JSON.stringify({ starred: false }));
    } else {
        await db.insert(userStars).values({
            userId,
            paperSlug: slug,
            createdAt: Date.now()
        });
        return new Response(JSON.stringify({ starred: true }));
    }
};

export const GET: APIRoute = async (context) => {
    if (!context.locals.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const slug = context.url.searchParams.get("slug");

    // If slug provided, check specific status
    if (slug) {
        const star = await db.select().from(userStars).where(
            and(eq(userStars.userId, context.locals.user.id), eq(userStars.paperSlug, slug))
        ).get();
        return new Response(JSON.stringify({ starred: !!star }));
    }

    // Otherwise return all starred slugs
    const stars = await db.select().from(userStars).where(
        eq(userStars.userId, context.locals.user.id)
    );
    return new Response(JSON.stringify({ stars: stars.map(s => s.paperSlug) }));
}
