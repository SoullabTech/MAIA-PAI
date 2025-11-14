import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/ios-fallbacks.css";
import { ErrorOverlay } from "@/components/system/ErrorOverlay";
import { AudioUnlockBanner } from "@/components/system/AudioUnlockBanner";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import dynamic from 'next/dynamic';

// Dynamically import all client providers to avoid SSR issues
const ClientProviders = dynamic(
  () => import("@/components/ClientProviders").then(mod => ({ default: mod.ClientProviders })),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-soul-background animate-pulse" />
  }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soullab - Maya Voice Chat",
  description:
    "Sacred Mirror - Maya Voice AI companion for consciousness exploration",
  manifest: "/manifest.json",
  themeColor: "#FFD700",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Soullab",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-soul-background text-soul-textPrimary transition-colors duration-200 overflow-x-hidden`}>
        <ClientProviders>
          {/* Conditional Header */}
          <HeaderWrapper />

          {/* Main Content */}
          <main className="min-h-[calc(100vh-73px)]">
            {children}
          </main>

          <AudioUnlockBanner />
          <ErrorOverlay />
        </ClientProviders>
      </body>
    </html>
  );
}
