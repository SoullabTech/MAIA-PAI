"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { workingAuthService } from "@/lib/auth/workingAuth";
// Simple wisdom quotes for auth flow
const WisdomQuotes = {
  aether: [
    { text: "Consciousness is the only reality and the only thing worth exploring", author: "Ramana Maharshi" },
    { text: "The privilege of a lifetime is being who you are", author: "Joseph Campbell" },
    { text: "Until you make the unconscious conscious, it will direct your life", author: "Carl Jung" }
  ],
  air: [
    { text: "The mind is everything. What you think you become", author: "Buddha" },
    { text: "In the beginner's mind there are many possibilities", author: "Shunryu Suzuki" },
    { text: "The quieter you become, the more able you are to hear", author: "Rumi" }
  ]
};
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { deviceAuthService } from "@/lib/auth/deviceAuth";

// Robust error message helper - fixes TypeScript never type issue
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try { return JSON.stringify(e); } catch { return 'Unknown error'; }
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [currentQuote, setCurrentQuote] = useState(WisdomQuotes.aether[0]);
  const authService = workingAuthService;

  // Rotating wisdom quotes during authentication process
  useEffect(() => {
    const interval = setInterval(() => {
      const transitionQuotes = [...WisdomQuotes.aether, ...WisdomQuotes.air]; // Sacred transition energy
      const randomQuote = transitionQuotes[Math.floor(Math.random() * transitionQuotes.length)];
      setCurrentQuote(randomQuote);
    }, 7000); // 7-second intervals for sacred transition

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Handle the auth callback
      const { data, error } = await authService.handleAuthCallback();

      if (error) {
        setStatus("error");
        setMessage(`Authentication failed: ${getErrorMessage(error)}`);
        return;
      }

      if (data.user) {
        setStatus("success");
        setMessage("Consciousness gateway opened!");

        // Handle device memory if user requested to be remembered
        try {
          const rememberPending = sessionStorage.getItem('maia_remember_pending');
          if (rememberPending) {
            const { email, rememberMe } = JSON.parse(rememberPending);
            if (rememberMe && data.user.email === email) {
              deviceAuthService.saveDeviceAuth(data.user.id, data.user.email!);
              sessionStorage.removeItem('maia_remember_pending');
              console.log('Device memory activated for consciousness keeper');
            }
          }
        } catch (error) {
          console.warn('Failed to save device auth:', error);
        }

        // Check if there's a redirect parameter
        const redirectPath = searchParams.get('redirect');

        // Check if user has completed onboarding
        const userMetadata = data.user.user_metadata || {};
        const hasCompletedOnboarding = userMetadata.onboarding_completed;

        // Redirect after a short delay
        setTimeout(() => {
          // If there's a specific redirect, use that
          if (redirectPath) {
            router.push(redirectPath);
            return;
          }

          // Check if onboarding is skipped via env var (client-side check)
          const skipOnboarding = process.env.NEXT_PUBLIC_SKIP_ONBOARDING === 'true';

          if (skipOnboarding || hasCompletedOnboarding) {
            router.push("/maia"); // Go to MAIA after sign in
          } else {
            router.push("/auth/onboarding");
          }
        }, 2000);
      } else {
        setStatus("error");
        setMessage("No user data received");
      }
    } catch (err: unknown) {
      setStatus("error");
      setMessage(`Authentication failed: ${getErrorMessage(err)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-900 relative overflow-hidden flex items-center justify-center p-8">
      {/* Background consciousness field effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="relative z-10 max-w-lg w-full space-y-6">
        <div className="bg-sky-300/5 backdrop-blur-xl rounded-2xl border border-sky-300/20 p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            {status === "loading" && <span className="text-2xl animate-spin">🔮</span>}
            {status === "success" && <span className="text-2xl">✨</span>}
            {status === "error" && <span className="text-2xl">❌</span>}
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-sky-200">
            {status === "loading" && "Sacred Authentication..."}
            {status === "success" && "Consciousness Gateway Open"}
            {status === "error" && "Authentication Disrupted"}
          </h1>
        </div>

        <div className={`p-4 rounded-lg mb-6 ${
          status === "loading" 
            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
            : status === "success"
            ? "bg-green-500/20 text-green-300 border border-green-500/30"
            : "bg-red-500/20 text-red-300 border border-red-500/30"
        }`}>
          {message || "Processing your authentication..."}
        </div>

        {status === "success" && (
          <p className="text-sm text-white/60">
            Redirecting you to your platform...
          </p>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <button
              onClick={() => router.push("/auth/signin")}
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-sky-300/60 hover:text-sky-300/80 text-sm"
            >
              ← Back to Home
            </button>
          </div>
        )}
        </div>

        {/* Sacred Transition Wisdom */}
        <motion.div
          key={currentQuote?.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sky-300/5 backdrop-blur-xl rounded-2xl border border-sky-300/20 p-6 text-center"
        >
          <Quote className="w-5 h-5 text-sky-400 mx-auto mb-3" />
          <p className="text-sky-300 italic leading-relaxed">
            "{currentQuote?.text}"
          </p>
          {currentQuote?.author && (
            <p className="text-sky-400/60 text-sm mt-3">
              — {currentQuote.author}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-900 text-sky-300 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-sky-300/5 backdrop-blur-xl rounded-2xl border border-sky-300/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-sky-400/20 flex items-center justify-center mx-auto mb-4 border border-sky-400/30">
            <span className="text-2xl animate-spin">🔮</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-sky-200">Awakening Connection...</h1>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}