import type { Metadata } from "next";
import { Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HosTable : L'Art de la Table",
  description: "Travel for food - La plateforme de référence pour partager et réserver des tables authentiques entre passionnés.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${roboto.variable} ${playfair.variable} font-sans antialiased text-neutral-800 bg-neutral-50`}>
        {children}
      </body>
    </html>
  );
}
