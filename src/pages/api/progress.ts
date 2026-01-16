import type { APIRoute } from "astro";
import { db } from "../../db";
import { userProgress } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const prerender = false;

// POST /api/progress - Update progress
export const POST: APIRoute = async (context) => {
    if (!context.locals.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await context.request.json();
    const { slug, status } = body;

    if (!slug || !status) {
        return new Response(JSON.stringify({ error: "Missing slug or status" }), { status: 400 });
    }

    const userId = context.locals.user.id;
    const now = Date.now();

    // Check if entry exists
    const existing = await db.select().from(userProgress).where(
        and(eq(userProgress.userId, userId), eq(userProgress.contentSlug, slug))
    ).get();

    if (existing) {
        await db.update(userProgress)
            .set({ status, updatedAt: now })
            .where(eq(userProgress.id, existing.id));
    } else {
        await db.insert(userProgress).values({
            userId,
            contentSlug: slug,
            status,
            updatedAt: now
        });
    }

    return new Response(JSON.stringify({ success: true }));
};

// GET /api/progress?slug=... - Get progress for specific slug
export const GET: APIRoute = async (context) => {
    if (!context.locals.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const slug = context.url.searchParams.get("slug");
    if (!slug) {
        return new Response(JSON.stringify({ error: "Missing slug" }), { status: 400 });
    }

    const progress = await db.select().from(userProgress).where(
        and(eq(userProgress.userId, context.locals.user.id), eq(userProgress.contentSlug, slug))
    ).get();

    return new Response(JSON.stringify({ status: progress?.status || 'unread' }));
}
