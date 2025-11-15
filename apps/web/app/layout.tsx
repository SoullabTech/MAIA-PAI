import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/ios-fallbacks.css";
import { ErrorOverlay } from "@/components/system/ErrorOverlay";
import { AudioUnlockBanner } from "@/components/system/AudioUnlockBanner";
import { ToastProvider } from "@/components/system/ToastProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Link from "next/link";
import IOSFixInitializer from "@/components/system/IOSFixInitializer";
import { SecureAuthProvider } from "@/components/SecureAuthProvider";
import dynamic from "next/dynamic";

// Dynamically import components that use Supabase client
const HeaderWrapper = dynamic(() => import("@/components/layout/HeaderWrapper").then(mod => ({ default: mod.HeaderWrapper })), {
  ssr: false,
  loading: () => <div className="h-[73px] bg-soul-background" /> // Placeholder with same height
});

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
