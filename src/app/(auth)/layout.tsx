/**
 * Auth Layout
 * ===========
 * Shared layout for all authentication pages (sign-up, login, etc.).
 * Uses a split-screen design:
 * - Left side: decorative food image (hidden on mobile)
 * - Right side: auth form content (centered)
 *
 * This layout uses the (auth) route group, so it doesn't affect the URL.
 */

import Link from "next/link";
import "./auth.css";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="auth-layout">
            {/* ── Left panel: decorative image (desktop only) ─────────── */}
            <div className="auth-image-panel">
                <div className="auth-image-overlay" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"
                    alt="Fine dining experience"
                    className="auth-image"
                />
                <div className="auth-image-content">
                    <Link href="/" className="auth-logo-link">
                        <svg
                            width="36"
                            height="36"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50Z"
                                stroke="#fff"
                                strokeWidth="8"
                            />
                            <path
                                d="M70 50C70 38.9543 78.9543 30 90 30C101.046 30 110 38.9543 110 50C110 61.0457 101.046 70 90 70C78.9543 70 70 61.0457 70 50Z"
                                stroke="#fff"
                                strokeWidth="8"
                                transform="translate(-40, 0)"
                            />
                            <path
                                d="M50 50 L50 50"
                                stroke="#fff"
                                strokeWidth="8"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="auth-logo-text">HosTable</span>
                    </Link>
                    <blockquote className="auth-quote">
                        &ldquo;Food is the ingredient that binds us together.&rdquo;
                    </blockquote>
                </div>
            </div>

            {/* ── Right panel: form content ──────────────────────────────── */}
            <div className="auth-form-panel">
                <div className="auth-form-wrapper">{children}</div>
            </div>
        </div>
    );
}
