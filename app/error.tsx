'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

/**
 * Sovereign Engine Global Error Boundary
 * Follows the M2 Premium Institutional Aesthetic.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an external service like Sentry (configured in project)
    console.error('Sovereign Engine Error:', error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 text-center backdrop-blur-md">
      <div className="relative flex max-w-md flex-col items-center gap-6">
        {/* Error Symbol */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-950/30 border border-red-500/50">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase sm:text-3xl">
            System Disruption
          </h1>
          <p className="text-sm text-slate-400">
            The Sovereign Engine encountered an unexpected operational exception. All systems remain secure, but current task was interrupted.
          </p>
        </div>

        {/* Error Details (Coded for Authored Professionalism) */}
        {error.digest && (
          <div className="w-full rounded-md bg-slate-900/50 p-3 font-mono text-[10px] text-slate-500 border border-slate-800">
            DISRUPTION_ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold uppercase tracking-widest text-xs"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Resume Engine
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex-1 border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 uppercase tracking-widest text-xs"
          >
            <Home className="mr-2 h-4 w-4" />
            Terminal Base
          </Button>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
    </div>
  );
}
