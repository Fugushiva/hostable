/**
 * Profile Settings Server Action
 * ===============================
 * Handles updating the user's profile settings:
 *
 * 1. Validate session (must be authenticated)
 * 2. Parse and validate form data with Zod
 * 3. If changing email/password → verify currentPassword
 * 4. If profile picture uploaded → save to public/uploads/avatars/
 * 5. Validate city belongs to country (server-side DB check)
 * 6. Update user record
 * 7. Revalidate path so navbar/global identity updates
 */

"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { users, cities } from "@/db/schema";
import { verifySession } from "@/lib/dal";
import { profileSettingsSchema } from "@/lib/validations/profile";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ── Types ──────────────────────────────────────────────────────────────

export type ProfileSettingsState = {
    errors?: Record<string, string[]>;
    message?: string;
    success?: boolean;
};

// ── Server Action ──────────────────────────────────────────────────────

export async function updateProfileSettings(
    _prevState: ProfileSettingsState,
    formData: FormData
): Promise<ProfileSettingsState> {
    // 1. Authenticate
    const session = await verifySession();
    const userId = BigInt(session.userId);

    // 2. Extract form fields
    const rawData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        countryId: Number(formData.get("countryId")),
        cityId: Number(formData.get("cityId")),
        languageId: Number(formData.get("languageId")),
        email: formData.get("email") as string,
        newPassword: (formData.get("newPassword") as string) || undefined,
        confirmNewPassword: (formData.get("confirmNewPassword") as string) || undefined,
        currentPassword: (formData.get("currentPassword") as string) || undefined,
    };

    // 3. Validate with Zod
    const validationResult = profileSettingsSchema.safeParse(rawData);
    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    const data = validationResult.data;

    try {
        // 4. Fetch current user from DB for comparisons
        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
                email: true,
                password: true,
            },
        });

        if (!currentUser) {
            return { message: "User not found." };
        }

        // 5. If email is changing or password is being set → verify currentPassword
        const isEmailChanging = data.email.toLowerCase() !== currentUser.email.toLowerCase();
        const isPasswordChanging = !!data.newPassword && data.newPassword.length > 0;

        if (isEmailChanging || isPasswordChanging) {
            if (!data.currentPassword) {
                return {
                    errors: {
                        currentPassword: ["Current password is required to change email or password"],
                    },
                };
            }

            const isPasswordValid = await bcrypt.compare(
                data.currentPassword,
                currentUser.password
            );

            if (!isPasswordValid) {
                return {
                    errors: {
                        currentPassword: ["Current password is incorrect"],
                    },
                };
            }

            // Check if new email is already taken
            if (isEmailChanging) {
                const existingUser = await db.query.users.findFirst({
                    where: eq(users.email, data.email.toLowerCase()),
                });

                if (existingUser) {
                    return {
                        errors: {
                            email: ["This email is already in use by another account"],
                        },
                    };
                }
            }
        }

        // 6. Validate city belongs to country
        const cityRecord = await db.query.cities.findFirst({
            where: and(
                eq(cities.id, BigInt(data.cityId)),
                eq(cities.countryId, data.countryId)
            ),
        });

        if (!cityRecord) {
            return {
                errors: {
                    cityId: ["The selected city does not belong to the selected country"],
                },
            };
        }

        // 7. Handle profile picture upload
        let profilePictureUrl: string | undefined;
        const profilePicFile = formData.get("profilePicture") as File | null;

        if (profilePicFile && profilePicFile.size > 0) {
            // Validate file type
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
            if (!allowedTypes.includes(profilePicFile.type)) {
                return {
                    errors: {
                        profilePicture: ["Only JPEG, PNG, WebP, and GIF images are allowed"],
                    },
                };
            }

            // Validate file size (max 5MB)
            if (profilePicFile.size > 5 * 1024 * 1024) {
                return {
                    errors: {
                        profilePicture: ["Image must be smaller than 5MB"],
                    },
                };
            }

            // Save file
            const ext = profilePicFile.name.split(".").pop() || "jpg";
            const fileName = `${session.userId}-${Date.now()}.${ext}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
            await mkdir(uploadDir, { recursive: true });

            const bytes = await profilePicFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(path.join(uploadDir, fileName), buffer);

            profilePictureUrl = `/uploads/avatars/${fileName}`;
        }

        // 8. Build update payload
        const updatePayload: Record<string, unknown> = {
            firstname: data.firstName,
            lastname: data.lastName,
            countryId: data.countryId,
            cityId: data.cityId,
            languageId: data.languageId,
            email: data.email.toLowerCase(),
            updatedAt: new Date().toISOString(),
        };

        if (profilePictureUrl) {
            updatePayload.profilePicture = profilePictureUrl;
        }

        if (isPasswordChanging && data.newPassword) {
            updatePayload.password = await bcrypt.hash(data.newPassword, 12);
        }

        // 9. Update user
        await db
            .update(users)
            .set(updatePayload)
            .where(eq(users.id, userId));

        // 10. Revalidate paths so navbar and other pages reflect changes
        revalidatePath("/");

        return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
        console.error("[updateProfileSettings] Error:", error);
        return { message: "Something went wrong. Please try again later." };
    }
}
