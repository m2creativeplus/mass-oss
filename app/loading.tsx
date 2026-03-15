import { Loader2 } from 'lucide-react';

/**
 * Global Loading UI for MASS VWMS.
 * Premium Institutional Aesthetic mandated by M2 Autopilot.
 */
export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#000000]">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute h-full w-full animate-ping rounded-full bg-[#D4AF37]/10 opacity-75"></div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-sm font-medium uppercase tracking-[0.4em] text-[#D4AF37]/90 animate-pulse">
          Syncing MASS Core
        </h2>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
      </div>

      <div className="absolute bottom-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30">
        Sovereign Workspace Authentication
      </div>
    </div>
  );
}
