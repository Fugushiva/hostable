/**
 * Sign-Up Page
 * ============
 * Server component wrapper that provides SEO metadata and renders
 * the client-side SignUpForm component.
 */

import type { Metadata } from "next";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
    title: "Sign Up — HosTable",
    description:
        "Create your HosTable account and start discovering unique food experiences hosted by passionate people around the world.",
};

export default function SignUpPage() {
    return <SignUpForm />;
}
