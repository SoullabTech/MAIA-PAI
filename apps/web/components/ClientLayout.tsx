"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SecureAuthProvider } from "@/components/SecureAuthProvider";
import IOSFixInitializer from "@/components/system/IOSFixInitializer";
import { ToastProvider } from "@/components/system/ToastProvider";
import { ErrorOverlay } from "@/components/system/ErrorOverlay";
import { AudioUnlockBanner } from "@/components/system/AudioUnlockBanner";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
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
  );
}