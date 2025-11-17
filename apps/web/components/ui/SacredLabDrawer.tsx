'use client';

import React from 'react';

// Minimal stub for SacredLabDrawer
export interface SacredLabDrawerProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SacredLabDrawer({ children, isOpen = false, onClose }: SacredLabDrawerProps) {
  console.log('[SacredLabDrawer] stub component rendered', { isOpen });
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="fixed right-0 top-0 h-full w-80 bg-amber-950/90 border-l border-amber-600/30 p-6">
        <div className="text-amber-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SacredLabDrawer;
