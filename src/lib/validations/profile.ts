/**
 * Profile Settings Validation Schema
 * ====================================
 * Shared Zod schema for the profile settings form.
 *
 * Rules:
 * - firstName & lastName: required, min 2 chars
 * - countryId, cityId, languageId: required numbers
 * - email: valid email format
 * - newPassword: optional, but if provided must meet strength rules
 * - confirmNewPassword: must match newPassword
 * - currentPassword: required ONLY when email or password is being changed
 */

import { z } from "zod";

export const profileSettingsSchema = z
    .object({
        firstName: z
            .string()
            .min(2, "First name must be at least 2 characters")
            .max(255, "First name is too long"),
        lastName: z
            .string()
            .min(2, "Last name must be at least 2 characters")
            .max(255, "Last name is too long"),
        countryId: z
            .number({ error: "Please select a country" })
            .int()
            .positive("Please select a country"),
        cityId: z
            .number({ error: "Please select a city" })
            .int()
            .positive("Please select a city"),
        languageId: z
            .number({ error: "Please select a language" })
            .int()
            .positive("Please select a language"),
        email: z
            .string()
            .email("Please enter a valid email address")
            .max(255, "Email is too long"),
        newPassword: z
            .string()
            .optional()
            .refine(
                (val) => {
                    if (!val || val.length === 0) return true;
                    return val.length >= 8;
                },
                { message: "Password must be at least 8 characters" }
            )
            .refine(
                (val) => {
                    if (!val || val.length === 0) return true;
                    return /[A-Z]/.test(val);
                },
                { message: "Password must contain at least one uppercase letter" }
            )
            .refine(
                (val) => {
                    if (!val || val.length === 0) return true;
                    return /[a-z]/.test(val);
                },
                { message: "Password must contain at least one lowercase letter" }
            )
            .refine(
                (val) => {
                    if (!val || val.length === 0) return true;
                    return /[0-9]/.test(val);
                },
                { message: "Password must contain at least one number" }
            ),
        confirmNewPassword: z.string().optional(),
        currentPassword: z.string().optional(),
    })
    .refine(
        (data) => {
            // If newPassword is provided, confirmNewPassword must match
            if (data.newPassword && data.newPassword.length > 0) {
                return data.confirmNewPassword === data.newPassword;
            }
            return true;
        },
        {
            message: "Passwords don't match",
            path: ["confirmNewPassword"],
        }
    )
    .refine(
        (data) => {
            // currentPassword is required when changing email or password
            const isChangingSecurity =
                (data.newPassword && data.newPassword.length > 0);
            // Note: email change is checked server-side by comparing with DB value
            if (isChangingSecurity) {
                return !!data.currentPassword && data.currentPassword.length > 0;
            }
            return true;
        },
        {
            message: "Current password is required to change your password",
            path: ["currentPassword"],
        }
    );

/**
 * TypeScript type inferred from the schema.
 */
export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;
