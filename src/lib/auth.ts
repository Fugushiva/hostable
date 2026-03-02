/**
 * Authentication Session Utilities
 * ================================
 * Lightweight JWT-based session management using `jose`.
 *
 * Flow:
 * 1. On sign-up/login, `createSession(userId)` signs a JWT and stores it
 *    in an httpOnly cookie named "session".
 * 2. On every protected request, `getSession()` reads the cookie, verifies
 *    the JWT signature, and returns the payload (userId).
 * 3. On logout, `deleteSession()` clears the cookie.
 *
 * This approach avoids database-backed sessions for now, keeping things
 * simple. The JWT expires after 7 days.
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ── Constants ──────────────────────────────────────────────────────────
const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
const REMEMBER_ME_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Encode the AUTH_SECRET env var into a Uint8Array for jose.
 * Falls back to a dev-only key if AUTH_SECRET is not set (never in prod).
 */
function getSecretKey(): Uint8Array {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        throw new Error(
            "AUTH_SECRET environment variable is not set. Please add it to .env.local"
        );
    }
    return new TextEncoder().encode(secret);
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Create a session for the given user and set it as an httpOnly cookie.
 * Call this after a successful sign-up or login.
 *
 * @param userId - The ID of the authenticated user
 * @param rememberMe - If true, extend session to 30 days (default: 7 days)
 */
export async function createSession(userId: string, rememberMe = false): Promise<void> {
    const duration = rememberMe ? REMEMBER_ME_DURATION_SECONDS : SESSION_DURATION_SECONDS;
    const expiresAt = new Date(Date.now() + duration * 1000);

    // Sign a JWT containing the userId
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(getSecretKey());

    // Store in an httpOnly cookie so JavaScript cannot read it (XSS protection)
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });
}

/**
 * Read and verify the current session from the cookie.
 * Returns the session payload or null if no valid session exists.
 */
export async function getSession(): Promise<{ userId: string } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return { userId: payload.userId as string };
    } catch {
        // Token is expired or invalid — treat as not authenticated
        return null;
    }
}

/**
 * Delete the session cookie (log out).
 */
export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
