/**
 * Sign-Up Server Action
 * =====================
 * Handles the server-side registration logic:
 *
 * 1. Validate input using the shared Zod schema
 * 2. Check if email is already registered
 * 3. Hash the password with bcryptjs
 * 4. Insert the new user into the database
 * 5. Create a session (JWT cookie)
 * 6. Redirect to /dashboard
 *
 * This is a Next.js Server Action, called directly from the client
 * form component via `useActionState`.
 */

"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { signUpSchema } from "@/lib/validations/auth";

// ── Types ──────────────────────────────────────────────────────────────

/** Shape of the state returned by the action to the client form. */
export type SignUpState = {
    errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message?: string; // General server error message
};

// ── Default values for required foreign keys ───────────────────────────
// The users table has NOT NULL FK constraints for country, city, language.
// These defaults (France / Paris / French) allow a clean sign-up form.
// The user can update them later during onboarding or in their profile.
const DEFAULT_COUNTRY_ID = 76; // France
const DEFAULT_CITY_ID = 36362; // Paris
const DEFAULT_LANGUAGE_ID = 46; // French

// ── Server Action ──────────────────────────────────────────────────────

export async function signUp(
    _prevState: SignUpState,
    formData: FormData
): Promise<SignUpState> {
    // 1. Extract and validate form data using the shared Zod schema
    const rawData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const validationResult = signUpSchema.safeParse(rawData);

    if (!validationResult.success) {
        // Return field-level errors so the form can display them inline
        return {
            errors: validationResult.error.flatten().fieldErrors,
        };
    }

    const { firstName, lastName, email, password } = validationResult.data;

    try {
        // 2. Check if an account with this email already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email.toLowerCase()),
        });

        if (existingUser) {
            // Return a generic error message to avoid leaking account existence info
            return {
                message: "An account with this email already exists.",
            };
        }

        // 3. Hash the password (12 salt rounds for good security/performance balance)
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Insert the new user into the database
        const [newUser] = await db
            .insert(users)
            .values({
                firstname: firstName,
                lastname: lastName,
                email: email.toLowerCase(),
                password: hashedPassword,
                countryId: DEFAULT_COUNTRY_ID,
                cityId: DEFAULT_CITY_ID,
                languageId: DEFAULT_LANGUAGE_ID,
            })
            .returning({ id: users.id });

        // 5. Create a session for the newly registered user
        await createSession(newUser.id.toString());
    } catch (error) {
        // Log the error for debugging (visible in server logs only)
        console.error("[signUp] Registration error:", error);
        return {
            message: "Something went wrong. Please try again later.",
        };
    }

    // 6. Redirect to the dashboard (outside try/catch because redirect throws)
    redirect("/dashboard");
}
