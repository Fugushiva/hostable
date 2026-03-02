/**
 * Login Page
 * ==========
 * Server component wrapper that provides SEO metadata and renders
 * the client-side LoginForm component.
 */

import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
    title: "Log In — HosTable",
    description:
        "Log in to your HosTable account to discover and host unique food experiences.",
};

export default function LoginPage() {
    return <LoginForm />;
}
