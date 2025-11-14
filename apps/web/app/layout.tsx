import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/ios-fallbacks.css";
import { ErrorOverlay } from "@/components/system/ErrorOverlay";
import { AudioUnlockBanner } from "@/components/system/AudioUnlockBanner";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import IOSFixInitializer from "@/components/system/IOSFixInitializer";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import dynamic from 'next/dynamic';

// Dynamically import client-side providers to avoid SSR issues
const ThemeProvider = dynamic(
  () => import("@/components/providers/ThemeProvider").then(mod => ({ default: mod.ThemeProvider })),
  { ssr: false }
);

const ToastProvider = dynamic(
  () => import("@/components/system/ToastProvider").then(mod => ({ default: mod.ToastProvider })),
  { ssr: false }
);

const SecureAuthProvider = dynamic(
  () => import("@/components/SecureAuthProvider").then(mod => ({ default: mod.SecureAuthProvider })),
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
        <ThemeProvider>
          <SecureAuthProvider>
            <IOSFixInitializer />
            <ToastProvider>
              {/* Conditional Header */}
              <HeaderWrapper />

              {/* Main Content */}
              <main className="min-h-[calc(100vh-73px)]">
                {children}
              </main>

              <AudioUnlockBanner />
              <ErrorOverlay />
            </ToastProvider>
          </SecureAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
