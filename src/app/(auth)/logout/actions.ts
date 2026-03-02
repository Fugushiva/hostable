/**
 * Logout Server Action
 * ====================
 * Clears the session cookie and redirects to the login page.
 */

"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/auth";

export async function logout() {
    await deleteSession();
    redirect("/login");
}
