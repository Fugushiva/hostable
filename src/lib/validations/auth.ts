/**
 * Authentication Validation Schemas
 * ==================================
 * Shared Zod schemas used by both the client (react-hook-form) and the
 * server (Server Action) to ensure consistent validation rules.
 */

import { z } from "zod";

/**
 * Sign-up form validation schema.
 *
 * Rules:
 * - firstName & lastName: at least 2 characters
 * - email: must be a valid email format
 * - password: min 8 chars, must contain uppercase, lowercase, and a number
 * - confirmPassword: must match password
 */
export const signUpSchema = z
    .object({
        firstName: z
            .string()
            .min(2, "First name must be at least 2 characters")
            .max(255, "First name is too long"),
        lastName: z
            .string()
            .min(2, "Last name must be at least 2 characters")
            .max(255, "Last name is too long"),
        email: z
            .string()
            .email("Please enter a valid email address")
            .max(255, "Email is too long"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

/**
 * TypeScript type inferred from the schema.
 * Use this to type form data across components and actions.
 */
export type SignUpFormData = z.infer<typeof signUpSchema>;
