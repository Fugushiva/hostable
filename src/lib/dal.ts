/**
 * Data Access Layer (DAL)
 * =======================
 * Centralized auth verification following Next.js 16 best practices.
 *
 * - verifySession(): reads JWT cookie, validates it, redirects if invalid.
 *   Memoized with React cache() to avoid duplicate checks per render pass.
 * - getUser(): verifies session then fetches user data from DB.
 * - getFullUser(): fetches user with country/city/language relations.
 * - getCountries(): returns all countries for dropdowns.
 * - getLanguages(): returns all languages for dropdowns.
 *
 * @see https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal
 */

import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users, countries, languages } from "@/db/schema";

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
 * Fetch the authenticated user's basic profile data (navbar, etc.).
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

/**
 * Fetch the authenticated user's full profile data with relations.
 * Used by the profile settings page to pre-populate the form.
 */
export const getFullUser = cache(async () => {
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
                countryId: true,
                cityId: true,
                languageId: true,
            },
            with: {
                country: { columns: { id: true, name: true, iso2: true } },
                city: { columns: { id: true, name: true } },
                language: { columns: { id: true, name: true } },
            },
        });

        return user ?? null;
    } catch (error) {
        console.error("[DAL] Failed to fetch full user:", error);
        return null;
    }
});

// ── Reference data fetching ────────────────────────────────────────────

/**
 * Fetch all countries, ordered by name.
 * Used for the country dropdown in the profile settings form.
 */
export const getCountries = cache(async () => {
    try {
        const results = await db
            .select({
                id: countries.id,
                name: countries.name,
                iso2: countries.iso2,
            })
            .from(countries)
            .orderBy(asc(countries.name));

        return results.map((c) => ({
            id: Number(c.id),
            name: c.name,
            iso2: c.iso2,
        }));
    } catch (error) {
        console.error("[DAL] Failed to fetch countries:", error);
        return [];
    }
});

/**
 * Fetch all languages, ordered by name.
 * Used for the language dropdown in the profile settings form.
 */
export const getLanguages = cache(async () => {
    try {
        const results = await db
            .select({
                id: languages.id,
                name: languages.name,
            })
            .from(languages)
            .orderBy(asc(languages.name));

        return results.map((l) => ({
            id: Number(l.id),
            name: l.name,
        }));
    } catch (error) {
        console.error("[DAL] Failed to fetch languages:", error);
        return [];
    }
});
