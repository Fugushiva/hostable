/**
 * Dashboard Page (Placeholder)
 * ============================
 * After successful sign-up, users are redirected here.
 * Reads the session to display a personalized welcome message.
 * This is a minimal placeholder — the real dashboard will be built later.
 */

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
    title: "Dashboard — HosTable",
    description: "Your HosTable dashboard",
};

export default async function DashboardPage() {
    // Read the session; redirect to sign-up if not authenticated
    const session = await getSession();

    if (!session) {
        redirect("/sign-up");
    }

    // Fetch the user's name from the database
    const user = await db.query.users.findFirst({
        where: eq(users.id, BigInt(session.userId)),
        columns: {
            firstname: true,
            lastname: true,
            email: true,
        },
    });

    if (!user) {
        redirect("/sign-up");
    }

    return (
        <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
            <div className="text-center p-10 bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
                {/* Success check icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>

                <h1
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                    Welcome, {user.firstname}! 🎉
                </h1>
                <p className="text-neutral-500 mb-6">
                    Your account has been created successfully. You&apos;re now part of
                    the HosTable community.
                </p>

                <a
                    href="/"
                    className="inline-block px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg"
                    style={{ backgroundColor: "#D4412C" }}
                >
                    Explore Experiences
                </a>
            </div>
        </div>
    );
}
