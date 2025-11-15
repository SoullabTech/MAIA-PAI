import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/ios-fallbacks.css";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import dynamicImport from 'next/dynamic';

// NUCLEAR: Disable static generation globally to fix useContext SSR errors
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Dynamically import all client providers to avoid SSR issues
const ClientProviders = dynamicImport(
  () => import("@/components/ClientProviders").then(mod => ({ default: mod.ClientProviders })),
  {
    loading: () => <div className="min-h-screen bg-soul-background animate-pulse" />
  }
);

// Dynamically import header to prevent SSR issues
const DynamicHeaderWrapper = dynamicImport(
  () => import("@/components/layout/HeaderWrapper").then(mod => ({ default: mod.HeaderWrapper }))
);

// Dynamically import system components to prevent SSR issues
const DynamicAudioUnlockBanner = dynamicImport(
  () => import("@/components/system/AudioUnlockBanner").then(mod => ({ default: mod.AudioUnlockBanner }))
);

const DynamicErrorOverlay = dynamicImport(
  () => import("@/components/system/ErrorOverlay").then(mod => ({ default: mod.ErrorOverlay }))
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soullab - Maya Voice Chat",
  description:
    "Sacred Mirror - Maya Voice AI companion for consciousness exploration",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Soullab",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#FFD700",
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
          <DynamicHeaderWrapper />

          {/* Main Content */}
          <main className="min-h-[calc(100vh-73px)]">
            {children}
          </main>

          <DynamicAudioUnlockBanner />
          <DynamicErrorOverlay />
        </ClientProviders>
      </body>
    </html>
  );
}
