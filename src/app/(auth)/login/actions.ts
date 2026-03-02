/**
 * Login Server Action
 * ===================
 * Handles the server-side authentication logic:
 *
 * 1. Validate input using the shared Zod login schema
 * 2. Query user by email (case-insensitive)
 * 3. Verify password with bcrypt
 * 4. Create a session (JWT cookie) with optional "Remember Me"
 * 5. Redirect to /dashboard
 *
 * Security:
 * - Generic error messages to prevent account enumeration
 * - Rate limiting placeholder for brute-force protection
 */

"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

// ── Types ──────────────────────────────────────────────────────────────

/** Shape of the state returned by the action to the client form. */
export type SignInState = {
    errors?: {
        email?: string[];
        password?: string[];
    };
    message?: string; // General server error message
};

// ── Server Action ──────────────────────────────────────────────────────

export async function signIn(
    _prevState: SignInState,
    formData: FormData
): Promise<SignInState> {
    // ── Rate Limiting (placeholder) ────────────────────────────────────
    // TODO: Implement rate limiting here to prevent brute-force attacks.
    // Recommended: Use @upstash/ratelimit with a sliding window of
    // 5 attempts per 15 minutes, keyed by IP address.
    //
    // Example:
    // const ip = headers().get("x-forwarded-for") ?? "unknown";
    // const { success } = await ratelimit.limit(ip);
    // if (!success) {
    //     return { message: "Too many login attempts. Please try again later." };
    // }
    // ───────────────────────────────────────────────────────────────────

    // 1. Extract and validate form data using the shared Zod schema
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const validationResult = loginSchema.safeParse(rawData);

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validationResult.data;
    const rememberMe = formData.get("rememberMe") === "on";

    try {
        // 2. Query user by email (case-insensitive)
        const user = await db.query.users.findFirst({
            where: eq(users.email, email.toLowerCase()),
        });

        // 3. Verify password — use generic error to prevent account enumeration
        if (!user) {
            return {
                message: "Invalid email or password.",
            };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return {
                message: "Invalid email or password.",
            };
        }

        // 4. Create a session for the authenticated user
        await createSession(user.id.toString(), rememberMe);
    } catch (error) {
        console.error("[signIn] Authentication error:", error);
        return {
            message: "Something went wrong. Please try again later.",
        };
    }

    // 5. Redirect to the dashboard (outside try/catch because redirect throws)
    redirect("/dashboard");
}
