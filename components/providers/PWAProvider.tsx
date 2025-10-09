'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw-enhanced.js')
          .then((reg) => {
            console.log('✅ PWA Service Worker registered:', reg.scope);
            setRegistration(reg);

            // Check for updates periodically
            setInterval(() => {
              reg.update();
            }, 60 * 60 * 1000); // Check every hour

            // Handle updates
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                    console.log('🆕 New version available! Refresh to update.');
                    setUpdateAvailable(true);
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('❌ PWA Service Worker registration failed:', error);
          });
      });
    }

    // iOS specific: Check if running in standalone mode
    if ((window.navigator as any).standalone && document?.documentElement) {
      document.documentElement.classList.add('ios-standalone');
    }

    // Add install state to body for CSS hooks
    if (window.matchMedia('(display-mode: standalone)').matches && document?.documentElement) {
      document.documentElement.classList.add('pwa-installed');
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return (
    <>
      {children}

      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-8 md:w-96"
          >
            <div className="bg-gradient-to-r from-amber-900/95 to-amber-800/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✨</div>
                <div className="flex-1">
                  <h3 className="text-amber-50 font-light text-sm mb-1">
                    New version available
                  </h3>
                  <p className="text-amber-200/70 text-xs font-light">
                    Updates won't interrupt your journey. Your data is safe.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-amber-500/90 hover:bg-amber-500 text-black px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  Update now
                </button>
                <button
                  onClick={() => setUpdateAvailable(false)}
                  className="px-4 py-2 text-amber-200/60 hover:text-amber-200 text-xs font-light transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}