/**
 * Proxy (Next.js 16)
 * ==================
 * Lightweight optimistic auth checks — replaces the deprecated middleware.ts.
 *
 * This runs on every matched route and performs cookie-only checks (no DB calls).
 * The real auth verification happens in the Data Access Layer (dal.ts).
 *
 * - Unauthenticated users on protected routes → redirect to /login
 * - Authenticated users on auth pages → redirect to /dashboard
 *
 * @see https://nextjs.org/docs/app/building-your-application/authentication#optimistic-checks-with-proxy-optional
 */

import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session";

/** Routes that require authentication */
const PROTECTED_ROUTES = ["/dashboard"];

/** Auth pages that logged-in users should skip */
const PUBLIC_AUTH_ROUTES = ["/login", "/sign-up"];

function getSecretKey(): Uint8Array {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        throw new Error("AUTH_SECRET environment variable is not set.");
    }
    return new TextEncoder().encode(secret);
}

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isProtectedRoute = PROTECTED_ROUTES.some(
        (route) => path === route || path.startsWith(route + "/")
    );
    const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some(
        (route) => path === route || path.startsWith(route + "/")
    );

    // Read session from cookie (optimistic — no DB call)
    const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    let isAuthenticated = false;

    if (cookie) {
        try {
            await jwtVerify(cookie, getSecretKey());
            isAuthenticated = true;
        } catch {
            // Invalid or expired token — treat as unauthenticated
        }
    }

    // Redirect unauthenticated users away from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL("/login", req.nextUrl);
        loginUrl.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from auth pages
    if (isPublicAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}

// Only run proxy on relevant routes (skip static assets, images, etc.)
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|img/).*)",
    ],
};
