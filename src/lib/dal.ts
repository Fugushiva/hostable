/**
 * Data Access Layer (DAL)
 * =======================
 * Centralized auth verification following Next.js 16 best practices.
 *
 * - verifySession(): reads JWT cookie, validates it, redirects if invalid.
 *   Memoized with React cache() to avoid duplicate checks per render pass.
 * - getUser(): verifies session then fetches user data from DB.
 *
 * @see https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal
 */

import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

// ── Session verification ───────────────────────────────────────────────

/**
 * Verify the current session. If no valid session exists, redirect to /login.
 * Memoized per request via React cache() — safe to call multiple times.
 */
export const verifySession = cache(async () => {
    const session = await getSession();

    if (!session?.userId) {
        redirect("/login");
    }

    return { isAuth: true, userId: session.userId };
});

// ── User data fetching ─────────────────────────────────────────────────

/**
 * Fetch the authenticated user's profile data.
 * Calls verifySession() first — will redirect if not authenticated.
 * Returns null if the user no longer exists in DB (edge case).
 */
export const getUser = cache(async () => {
    const session = await verifySession();

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, BigInt(session.userId)),
            columns: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                profilePicture: true,
            },
        });

        return user ?? null;
    } catch (error) {
        console.error("[DAL] Failed to fetch user:", error);
        return null;
    }
});
