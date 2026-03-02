"use client";

/**
 * SignUpForm Component
 * ====================
 * A branded, client-side sign-up form with:
 * - react-hook-form for form state management
 * - Zod integration via @hookform/resolvers for real-time validation
 * - Password visibility toggle
 * - Loading state on submit button
 * - Server-side error display (from the Server Action)
 * - Link to login page
 */

import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { signUp, type SignUpState } from "./actions";

export default function SignUpForm() {
    // ── Server Action state (for server-side errors) ───────────────────
    const [serverState, formAction, isPending] = useActionState<SignUpState, FormData>(
        signUp,
        {}
    );

    // ── Client-side form validation via react-hook-form + Zod ──────────
    const {
        register,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: "onTouched", // Validate on blur, then on every change
    });

    // ── Password visibility toggles ────────────────────────────────────
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="sign-up-form-container">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="form-header">
                <h1 className="form-title">Create your account</h1>
                <p className="form-subtitle">
                    Join HosTable and discover unique food experiences
                </p>
            </div>

            {/* ── Server error banner ────────────────────────────────────── */}
            {(serverState.message || serverState.errors) && (
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
                    <span>
                        {serverState.message ||
                            "Please fix the errors below and try again."}
                    </span>
                </div>
            )}

            {/* ── Form ───────────────────────────────────────────────────── */}
            <form action={formAction} noValidate>
                {/* Name fields (side by side) */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName" className="form-label">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            className={`form-input ${errors.firstName || serverState.errors?.firstName
                                    ? "input-error"
                                    : ""
                                }`}
                            {...register("firstName")}
                        />
                        {(errors.firstName || serverState.errors?.firstName) && (
                            <p className="field-error">
                                {errors.firstName?.message ||
                                    serverState.errors?.firstName?.[0]}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName" className="form-label">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            className={`form-input ${errors.lastName || serverState.errors?.lastName
                                    ? "input-error"
                                    : ""
                                }`}
                            {...register("lastName")}
                        />
                        {(errors.lastName || serverState.errors?.lastName) && (
                            <p className="field-error">
                                {errors.lastName?.message || serverState.errors?.lastName?.[0]}
                            </p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className={`form-input ${errors.email || serverState.errors?.email ? "input-error" : ""
                            }`}
                        {...register("email")}
                    />
                    {(errors.email || serverState.errors?.email) && (
                        <p className="field-error">
                            {errors.email?.message || serverState.errors?.email?.[0]}
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
                            placeholder="Min. 8 characters"
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
                            {errors.password?.message || serverState.errors?.password?.[0]}
                        </p>
                    )}
                    {/* Password strength hint */}
                    <p className="field-hint">
                        Must contain uppercase, lowercase, and a number
                    </p>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            className={`form-input ${errors.confirmPassword || serverState.errors?.confirmPassword
                                    ? "input-error"
                                    : ""
                                }`}
                            {...register("confirmPassword")}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={
                                showConfirmPassword
                                    ? "Hide confirm password"
                                    : "Show confirm password"
                            }
                        >
                            {showConfirmPassword ? (
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
                    {(errors.confirmPassword || serverState.errors?.confirmPassword) && (
                        <p className="field-error">
                            {errors.confirmPassword?.message ||
                                serverState.errors?.confirmPassword?.[0]}
                        </p>
                    )}
                </div>

                {/* Submit button with loading state */}
                <button
                    type="submit"
                    className="submit-button"
                    disabled={isPending}
                    id="sign-up-submit"
                >
                    {isPending ? (
                        <>
                            <span className="spinner" />
                            Creating account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            {/* ── Footer link to login ───────────────────────────────────── */}
            <p className="form-footer">
                Already have an account?{" "}
                <a href="/login" className="form-link">
                    Log in
                </a>
            </p>
        </div>
    );
}
