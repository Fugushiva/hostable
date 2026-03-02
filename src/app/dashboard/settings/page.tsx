/**
 * Profile Settings Page
 * =====================
 * Server component that:
 * 1. Fetches authenticated user data with relations
 * 2. Fetches reference data (countries, languages)
 * 3. Passes everything to the client ProfileSettingsForm
 */

import { getFullUser, getCountries, getLanguages } from "@/lib/dal";
import ProfileSettingsForm from "./ProfileSettingsForm";
import Link from "next/link";
import "./settings.css";

export const metadata = {
    title: "Profile Settings — HosTable",
    description: "Manage your HosTable profile, localization, and security settings.",
};

export default async function SettingsPage() {
    const [user, countries, languages] = await Promise.all([
        getFullUser(),
        getCountries(),
        getLanguages(),
    ]);

    if (!user) {
        return null;
    }

    // Serialize user data for the client component
    const userData = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profilePicture: user.profilePicture,
        countryId: Number(user.countryId),
        cityId: Number(user.cityId),
        languageId: Number(user.languageId),
        country: user.country,
        city: user.city,
        language: user.language,
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                {/* Back link */}
                <Link href="/dashboard" className="settings-back-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Dashboard
                </Link>

                {/* Page header */}
                <div className="settings-header">
                    <h1 className="settings-title">Profile Settings</h1>
                    <p className="settings-subtitle">
                        Manage your identity, location, and security preferences
                    </p>
                </div>

                {/* Form */}
                <ProfileSettingsForm
                    user={userData}
                    countries={countries}
                    languages={languages}
                />
            </div>
        </div>
    );
}
