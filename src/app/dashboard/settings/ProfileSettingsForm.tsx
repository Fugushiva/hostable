/**
 * ProfileSettingsForm Component
 * =============================
 * Client-side form for editing profile settings.
 *
 * Four sections:
 * 1. Profile Identity — firstName, lastName
 * 2. Profile Picture — file upload with preview
 * 3. Localization — country (dropdown), city (CityCombobox), language (dropdown)
 * 4. Security — email, newPassword, confirmNewPassword, currentPassword
 *
 * Uses useActionState + react-hook-form + Zod resolver.
 */

"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    profileSettingsSchema,
    type ProfileSettingsFormData,
} from "@/lib/validations/profile";
import {
    updateProfileSettings,
    type ProfileSettingsState,
} from "./actions";
import CityCombobox from "./CityCombobox";

interface Country {
    id: number;
    name: string;
    iso2: string;
}

interface Language {
    id: number;
    name: string;
}

interface UserData {
    id: bigint;
    firstname: string;
    lastname: string;
    email: string;
    profilePicture: string | null;
    countryId: number;
    cityId: number;
    languageId: number;
    country: { id: bigint; name: string; iso2: string } | null;
    city: { id: bigint; name: string } | null;
    language: { id: bigint; name: string } | null;
}

interface ProfileSettingsFormProps {
    user: UserData;
    countries: Country[];
    languages: Language[];
}

export default function ProfileSettingsForm({
    user,
    countries,
    languages,
}: ProfileSettingsFormProps) {
    // ── Server Action state ────────────────────────────────────────────
    const [serverState, formAction, isPending] =
        useActionState<ProfileSettingsState, FormData>(updateProfileSettings, {});

    // ── Client-side validation ─────────────────────────────────────────
    const {
        register,
        formState: { errors },
        watch,
    } = useForm<ProfileSettingsFormData>({
        resolver: zodResolver(profileSettingsSchema),
        mode: "onTouched",
        defaultValues: {
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
            countryId: user.countryId,
            cityId: user.cityId,
            languageId: user.languageId,
        },
    });

    // ── Country tracking for CityCombobox ──────────────────────────────
    const selectedCountryId = watch("countryId");
    const [countryCode, setCountryCode] = useState(
        user.country?.iso2 || ""
    );

    useEffect(() => {
        const country = countries.find(
            (c) => c.id === Number(selectedCountryId)
        );
        if (country) {
            setCountryCode(country.iso2);
        }
    }, [selectedCountryId, countries]);

    // ── Password visibility toggles ────────────────────────────────────
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    // ── Avatar preview ─────────────────────────────────────────────────
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.profilePicture
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // ── Eye icon SVGs ──────────────────────────────────────────────────
    const EyeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const EyeOffIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    return (
        <form action={formAction} noValidate>
            {/* ── Success Banner ─────────────────────────────────────────── */}
            {serverState.success && (
                <div className="success-banner" role="status">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{serverState.message}</span>
                </div>
            )}

            {/* ── Error Banner ───────────────────────────────────────────── */}
            {serverState.message && !serverState.success && (
                <div className="error-banner" role="alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <span>{serverState.message}</span>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                Section 1: Profile Identity
                ══════════════════════════════════════════════════════════ */}
            <div className="settings-section">
                <div className="section-header">
                    <div className="section-icon identity">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="section-title">Profile Identity</h2>
                        <p className="section-description">Your public name</p>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            className={`form-input ${errors.firstName || serverState.errors?.firstName ? "input-error" : ""}`}
                            {...register("firstName")}
                        />
                        {(errors.firstName || serverState.errors?.firstName) && (
                            <p className="field-error">
                                {errors.firstName?.message || serverState.errors?.firstName?.[0]}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            className={`form-input ${errors.lastName || serverState.errors?.lastName ? "input-error" : ""}`}
                            {...register("lastName")}
                        />
                        {(errors.lastName || serverState.errors?.lastName) && (
                            <p className="field-error">
                                {errors.lastName?.message || serverState.errors?.lastName?.[0]}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                Section 2: Profile Picture
                ══════════════════════════════════════════════════════════ */}
            <div className="settings-section">
                <div className="section-header">
                    <div className="section-icon media">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="section-title">Profile Picture</h2>
                        <p className="section-description">Upload your avatar</p>
                    </div>
                </div>

                <div className="avatar-upload">
                    <div className="avatar-preview">
                        {avatarPreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarPreview} alt="Profile preview" />
                        ) : (
                            <div className="avatar-placeholder">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="avatar-actions">
                        <button
                            type="button"
                            className="upload-button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Choose file
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="profilePicture"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="file-input-hidden"
                            onChange={handleAvatarChange}
                        />
                        <p>JPEG, PNG, WebP or GIF. Max 5MB.</p>
                        {serverState.errors?.profilePicture && (
                            <p className="field-error">{serverState.errors.profilePicture[0]}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                Section 3: Localization
                ══════════════════════════════════════════════════════════ */}
            <div className="settings-section">
                <div className="section-header">
                    <div className="section-icon localization">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="section-title">Localization</h2>
                        <p className="section-description">Your location and language preferences</p>
                    </div>
                </div>

                {/* Country */}
                <div className="form-group">
                    <label htmlFor="countryId" className="form-label">Country</label>
                    <select
                        id="countryId"
                        className={`form-select ${errors.countryId || serverState.errors?.countryId ? "input-error" : ""}`}
                        {...register("countryId", { valueAsNumber: true })}
                    >
                        <option value="">Select a country</option>
                        {countries.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {(errors.countryId || serverState.errors?.countryId) && (
                        <p className="field-error">
                            {errors.countryId?.message || serverState.errors?.countryId?.[0]}
                        </p>
                    )}
                </div>

                {/* City (Combobox) */}
                <div className="form-group">
                    <label htmlFor="city-search" className="form-label">City</label>
                    <CityCombobox
                        countryCode={countryCode}
                        initialCityId={user.cityId}
                        initialCityName={user.city?.name || ""}
                        hasError={!!errors.cityId || !!serverState.errors?.cityId}
                    />
                    {(errors.cityId || serverState.errors?.cityId) && (
                        <p className="field-error">
                            {errors.cityId?.message || serverState.errors?.cityId?.[0]}
                        </p>
                    )}
                </div>

                {/* Language */}
                <div className="form-group">
                    <label htmlFor="languageId" className="form-label">Language</label>
                    <select
                        id="languageId"
                        className={`form-select ${errors.languageId || serverState.errors?.languageId ? "input-error" : ""}`}
                        {...register("languageId", { valueAsNumber: true })}
                    >
                        <option value="">Select a language</option>
                        {languages.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.name}
                            </option>
                        ))}
                    </select>
                    {(errors.languageId || serverState.errors?.languageId) && (
                        <p className="field-error">
                            {errors.languageId?.message || serverState.errors?.languageId?.[0]}
                        </p>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                Section 4: Security
                ══════════════════════════════════════════════════════════ */}
            <div className="settings-section">
                <div className="section-header">
                    <div className="section-icon security">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="section-title">Security</h2>
                        <p className="section-description">Email and password settings</p>
                    </div>
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        className={`form-input ${errors.email || serverState.errors?.email ? "input-error" : ""}`}
                        {...register("email")}
                    />
                    {(errors.email || serverState.errors?.email) && (
                        <p className="field-error">
                            {errors.email?.message || serverState.errors?.email?.[0]}
                        </p>
                    )}
                </div>

                {/* New Password */}
                <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className="input-wrapper">
                        <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Leave blank to keep current"
                            className={`form-input ${errors.newPassword || serverState.errors?.newPassword ? "input-error" : ""}`}
                            {...register("newPassword")}
                        />
                        <button type="button" className="toggle-password" onClick={() => setShowNewPassword(!showNewPassword)} aria-label={showNewPassword ? "Hide password" : "Show password"}>
                            {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {(errors.newPassword || serverState.errors?.newPassword) && (
                        <p className="field-error">
                            {errors.newPassword?.message || serverState.errors?.newPassword?.[0]}
                        </p>
                    )}
                    <p className="field-hint">Must contain uppercase, lowercase, and a number</p>
                </div>

                {/* Confirm New Password */}
                <div className="form-group">
                    <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                    <div className="input-wrapper">
                        <input
                            id="confirmNewPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter new password"
                            className={`form-input ${errors.confirmNewPassword || serverState.errors?.confirmNewPassword ? "input-error" : ""}`}
                            {...register("confirmNewPassword")}
                        />
                        <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {(errors.confirmNewPassword || serverState.errors?.confirmNewPassword) && (
                        <p className="field-error">
                            {errors.confirmNewPassword?.message || serverState.errors?.confirmNewPassword?.[0]}
                        </p>
                    )}
                </div>

                {/* Current Password */}
                <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <div className="input-wrapper">
                        <input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Required to change email or password"
                            className={`form-input ${errors.currentPassword || serverState.errors?.currentPassword ? "input-error" : ""}`}
                            {...register("currentPassword")}
                        />
                        <button type="button" className="toggle-password" onClick={() => setShowCurrentPassword(!showCurrentPassword)} aria-label={showCurrentPassword ? "Hide password" : "Show password"}>
                            {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {(errors.currentPassword || serverState.errors?.currentPassword) && (
                        <p className="field-error">
                            {errors.currentPassword?.message || serverState.errors?.currentPassword?.[0]}
                        </p>
                    )}
                    <p className="field-hint">Only required when changing email or password</p>
                </div>
            </div>

            {/* ── Submit ─────────────────────────────────────────────────── */}
            <div className="settings-actions">
                <button
                    type="submit"
                    className="submit-button"
                    disabled={isPending}
                    id="settings-submit"
                >
                    {isPending ? (
                        <>
                            <span className="spinner" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </div>
        </form>
    );
}
