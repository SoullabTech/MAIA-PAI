'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Crown } from 'lucide-react';

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if banner has been closed before
    const bannerClosed = localStorage.getItem('betaBannerClosed');

    // Only show on home/main screens and if not previously closed
    const isMainScreen = pathname === '/' || pathname === '/maya';

    if (!bannerClosed && isMainScreen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
    // Persist that user has closed the banner
    localStorage.setItem('betaBannerClosed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 backdrop-blur-md border-b border-[#D4B896]/20">
      <div className="container mx-auto px-4 pb-2 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-4 h-4 text-[#D4B896]" />
            <p className="text-sm text-[#D4B896] font-light">
              Soul Beta Experience • Changing Our World To Soul
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-[#D4B896]/60 hover:text-[#D4B896] transition-colors"
            aria-label="Close beta banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}