import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/ios-fallbacks.css";
import { ClientLayout } from "@/components/ClientLayout";

// NUCLEAR: Disable static generation globally to fix useContext SSR errors
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
