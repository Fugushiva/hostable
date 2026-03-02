"use client";

/**
 * LoginForm Component
 * ===================
 * A branded, client-side login form with:
 * - react-hook-form for form state management
 * - Zod integration via @hookform/resolvers for real-time validation
 * - Password visibility toggle
 * - "Remember Me" checkbox
 * - Loading state on submit button
 * - Server-side error display (from the Server Action)
 * - Links to sign-up and forgot password pages
 */

import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { signIn, type SignInState } from "./actions";

export default function LoginForm() {
    // ── Server Action state (for server-side errors) ───────────────────
    const [serverState, formAction, isPending] = useActionState<SignInState, FormData>(
        signIn,
        {}
    );

    // ── Client-side form validation via react-hook-form + Zod ──────────
    const {
        register,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
    });

    // ── Password visibility toggle ─────────────────────────────────────
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-form-container">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="form-header">
                <h1 className="form-title">Welcome back</h1>
                <p className="form-subtitle">
                    Log in to continue your food journey
                </p>
            </div>

            {/* ── Server error banner ────────────────────────────────────── */}
            {serverState.message && (
                <div className="error-banner" role="alert">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <span>{serverState.message}</span>
                </div>
            )}

            {/* ── Form ───────────────────────────────────────────────────── */}
            <form action={formAction} noValidate>
                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className={`form-input ${errors.email || serverState.errors?.email
                                ? "input-error"
                                : ""
                            }`}
                        {...register("email")}
                    />
                    {(errors.email || serverState.errors?.email) && (
                        <p className="field-error">
                            {errors.email?.message ||
                                serverState.errors?.email?.[0]}
                        </p>
                    )}
                </div>

                {/* Password with visibility toggle */}
                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className={`form-input ${errors.password || serverState.errors?.password
                                    ? "input-error"
                                    : ""
                                }`}
                            {...register("password")}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                // Eye-off icon
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                // Eye icon
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {(errors.password || serverState.errors?.password) && (
                        <p className="field-error">
                            {errors.password?.message ||
                                serverState.errors?.password?.[0]}
                        </p>
                    )}
                </div>

                {/* Remember Me + Forgot Password row */}
                <div className="form-extras-row">
                    <label className="remember-me-label" htmlFor="rememberMe">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            className="remember-me-checkbox"
                        />
                        <span>Remember me</span>
                    </label>
                    <a href="#" className="forgot-password-link">
                        Forgot password?
                    </a>
                </div>

                {/* Submit button with loading state */}
                <button
                    type="submit"
                    className="submit-button"
                    disabled={isPending}
                    id="login-submit"
                >
                    {isPending ? (
                        <>
                            <span className="spinner" />
                            Signing in...
                        </>
                    ) : (
                        "Log In"
                    )}
                </button>
            </form>

            {/* ── Footer link to sign up ──────────────────────────────────── */}
            <p className="form-footer">
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="form-link">
                    Sign up
                </a>
            </p>
        </div>
    );
}
