"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SacredEntryPortal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [phase, setPhase] = useState<"arrival" | "elements" | "entering">("arrival");

  // Check for returning guest
  useEffect(() => {
    const savedName = localStorage.getItem("maia_user");
    if (savedName) {
      setName(savedName);
      setIsReturning(true);
    }
  }, []);

  const handleEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsEntering(true);
    setPhase("elements");

    // Store guest
    localStorage.setItem("maia_user", name.trim());

    // Show elemental welcome
    await new Promise(resolve => setTimeout(resolve, 3000));

    setPhase("entering");
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isReturning) {
      router.push("/maia");
    } else {
      router.push("/onboarding");
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Light Teal Resort Background - Elegant and inviting like a soul journey spa */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F9F9] via-[#E0F2F1] to-[#B2DFDB]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/60 via-[#E0F2F1]/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#4DB6AC]/15 via-transparent to-transparent" />

      {/* Subtle elemental particles - elegant floating elements */}
      <motion.div
        animate={{ y: [-30, 30, -30], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-[#FF6B6B]/50 rounded-full shadow-sm"
      />
      <motion.div
        animate={{ y: [20, -20, 20], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#00695C]/50 rounded-full shadow-sm"
      />
      <motion.div
        animate={{ y: [-25, 25, -25], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[#4CAF50]/50 rounded-full shadow-sm"
      />
      <motion.div
        animate={{ y: [15, -15, 15], opacity: [0.32, 0.48, 0.32] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-2/3 right-1/3 w-2 h-2 bg-[#26A69A]/50 rounded-full shadow-sm"
      />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <AnimatePresence mode="wait">
          {phase === "arrival" && (
            <motion.div
              key="arrival"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="max-w-lg mx-auto text-center"
            >
              {/* Holoflower - Sacred Symbol */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="relative w-32 h-32 mx-auto mb-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/holoflower-sacred.svg"
                    alt="MAIA"
                    fill
                    className="object-contain opacity-80"
                  />
                </motion.div>
              </motion.div>

              {/* Personalized Welcome */}
              <form onSubmit={handleEnter} className="space-y-10">
                <AnimatePresence mode="wait">
                  {isReturning ? (
                    <motion.div
                      key="returning"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      <p className="text-[#00695C]/90 text-sm font-light tracking-widest">
                        {getTimeGreeting()}
                      </p>
                      <p className="text-[#004D40] text-2xl font-light tracking-wide">
                        Welcome back, {name}
                      </p>
                      <p className="text-[#00695C]/80 text-sm font-light">
                        Your elements await
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="new"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <p className="text-[#00695C]/90 text-sm font-light tracking-widest uppercase">
                        Welcome
                      </p>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-transparent border-b border-[#00695C]/50 focus:border-[#004D40] text-center text-3xl font-extralight text-[#004D40] placeholder:text-[#00695C]/60 outline-none py-4 transition-all duration-700"
                        disabled={isEntering}
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {name.trim() && (
                    <motion.button
                      type="submit"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      disabled={isEntering}
                      className="text-[#004D40] font-light tracking-[0.3em] text-sm uppercase hover:text-[#00695C] transition-colors duration-500"
                    >
                      {isReturning ? "Continue" : "Begin"}
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          )}

          {phase === "elements" && (
            <motion.div
              key="elements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              {/* Elemental Welcome */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <p className="text-[#004D40] text-xl font-light tracking-wide">
                  {name}, we've been expecting you
                </p>

                {/* Sacred Holoflower */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1.2, type: "spring" }}
                  className="relative w-48 h-48 mx-auto my-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src="/holoflower-sacred.svg"
                      alt="Sacred Holoflower"
                      fill
                      className="object-contain opacity-90"
                    />
                  </motion.div>
                  {/* Elemental glow aura */}
                  <motion.div
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [0.95, 1.15, 0.95]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#26A69A]/40 via-transparent to-transparent rounded-full blur-xl"
                  />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  className="text-[#00695C] text-lg font-extralight leading-relaxed"
                >
                  {isReturning
                    ? "Your journey through the elements continues..."
                    : "Let us guide you through the elements of your experience..."
                  }
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {phase === "entering" && (
            <motion.div
              key="entering"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="relative w-24 h-24 mx-auto"
              >
                <Image
                  src="/holoflower-sacred.svg"
                  alt="Entering"
                  fill
                  className="object-contain opacity-90"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
