'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

/**
 * Global Sovereign Error Boundary for MASS VWMS.
 * Part of the Milestone 1: Institutional Hardening.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Automated event log for Orbit monitoring
    console.error('MASS_ERR_LOG:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#000000] text-white p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
        <AlertCircle className="h-10 w-10 text-destructive shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
      </div>
      
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-white font-outfit uppercase">
        System Interruption detected
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground font-inter">
        The MASS environment encountered a technical friction. Automated recovery protocols are active.
      </p>
      
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={reset}
          className="border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/5 hover:text-[#D4AF37]"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Attempt Recovery
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/'}
          className="text-muted-foreground hover:text-white"
        >
          Dashboard Return
        </Button>
      </div>

      <div className="absolute bottom-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30">
        MASS OSS Sovereign Security • Republic of Somaliland
      </div>
    </div>
  );
}
