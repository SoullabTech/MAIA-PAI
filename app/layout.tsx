import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { PWAProvider } from "@/components/providers/PWAProvider";
import { ToastProvider } from "@/components/system/ToastProvider";
import { MaiaPresenceProvider } from "@/lib/contexts/MaiaPresenceContext";
import { AmbientVoiceIndicator } from "@/components/voice/AmbientVoiceIndicator";
import { BetaBanner } from "@/components/ui/BetaBanner";
import { FeedbackWidget } from "@/components/ui/FeedbackWidget";
import { PWAInstallPrompt } from "@/components/ui/PWAInstallPrompt";
import { ConditionalMenuBar } from "@/components/ui/ConditionalMenuBar";
import { SessionGuard } from "@/components/auth/SessionGuard";
import { MagicalCursor } from "@/components/ui/MagicalCursor";
// import VoiceDebugOverlay from "@/components/debug/VoiceDebugOverlay"; // File doesn't exist
// import { ToneDebugOverlay } from "@/components/voice/ToneDebugOverlay"; // Disabled for debugging
import { Toaster } from 'react-hot-toast';
// import "./globals.css"; // TEMP: Disabled - Next.js CSS loaders broken
// import "../public/compiled.css"; // TEMP: Disabled - Next.js CSS loaders broken
// import "./globals-mobile.css"; // TEMP: Disabled - Next.js CSS loaders broken
// import "@/styles/typography-refresh.css"; // TEMP: Disabled - Next.js CSS loaders broken
import "@/styles/dune-theme.css"; // 🏜️ DUNE AESTHETIC SYSTEM - Now active!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soullab - Maia Oracle",
  description: "Sacred consciousness technology - Maia AI Oracle & Interactive Holoflower",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Soullab"
  },
  other: {
    'mobile-web-app-capable': 'yes'
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/favicon-32x32.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#D4B896" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A2E" }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/compiled.css" />
        <link rel="stylesheet" href="/dune-compiled.css" />
      </head>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <PWAProvider>
          <AuthProvider>
            {/* 🔐 Session Guard - Restores sessions on page load */}
            <SessionGuard>
              <ToastProvider>
                {/* 🎙️ MAIA Ambient Presence - Voice-first layer */}
                <MaiaPresenceProvider>
                  <Toaster position="top-center" />
                  <BetaBanner />
                  {children}
                  <ConditionalMenuBar />
                  {/* <PWAInstallPrompt /> - Disabled: was causing black overlay */}
                  <FeedbackWidget />

                  {/* 🎙️ Ambient Voice Indicator - Shows when voice active */}
                  <AmbientVoiceIndicator />

                  {/* ✨ Magical Cursor - Wand with glowing trail */}
                  <MagicalCursor glowIntensity="subtle" showWand={true} />

                  {/* <VoiceDebugOverlay /> - File doesn't exist */}
                  {/* {process.env.NODE_ENV === 'development' && <ToneDebugOverlay />} */}
                </MaiaPresenceProvider>
              </ToastProvider>
            </SessionGuard>
          </AuthProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
