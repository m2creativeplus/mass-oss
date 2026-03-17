'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Sovereign Engine Global Loading Boundary
 * Follows the M2 Premium Institutional Aesthetic.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* Decorative Gold Ring */}
        <div className="absolute h-24 w-24 rounded-full border-t-2 border-[#D4AF37] animate-spin opacity-20" />
        
        {/* Animated Loading Icon */}
        <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37] transition-all duration-700" />
        
        {/* Institutional Label */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-sm font-medium tracking-[0.2em] text-[#D4AF37] uppercase animate-pulse">
            Sovereign Engine
          </p>
          <p className="text-[10px] tracking-widest text-[#D4AF37]/40 uppercase">
            Initializing Unified Resources...
          </p>
        </div>
      </div>
      
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
    </div>
  );
}
