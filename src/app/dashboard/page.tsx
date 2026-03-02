/**
 * Dashboard Page
 * ==============
 * Protected page — uses the DAL to verify authentication.
 * Shows a welcome message and a logout button.
 */

import { getUser } from "@/lib/dal";
import { logout } from "@/app/(auth)/logout/actions";

export const metadata = {
    title: "Dashboard — HosTable",
    description: "Your HosTable dashboard",
};

export default async function DashboardPage() {
    const user = await getUser();

    if (!user) {
        // verifySession() already redirects if not authenticated,
        // but this handles the edge case where the user was deleted from DB
        return null;
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
                    You&apos;re part of the HosTable community.
                </p>

                <div className="flex flex-col gap-3">
                    <a
                        href="/"
                        className="inline-block px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg"
                        style={{ backgroundColor: "#D4412C" }}
                    >
                        Explore Experiences
                    </a>

                    {/* Logout button */}
                    <form action={logout}>
                        <button
                            type="submit"
                            className="w-full px-6 py-3 rounded-xl font-medium transition-all border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 cursor-pointer"
                        >
                            Log out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
