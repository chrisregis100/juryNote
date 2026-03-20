import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JuryFlow – Notation & Délibération",
  description: "Plateforme de notation des hackathons et concours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <a
          href="#main"
          className="fixed left-[-9999px] top-0 z-50 bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all focus-visible:left-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Aller au contenu principal
        </a>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
