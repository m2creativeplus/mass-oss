import { SystemBlueprint } from "@/components/system-blueprint";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MASS OS v5 | System Architecture & Master Blueprint",
  description: "Explore the internal architecture, engines, and routing structure of MASS OS v5.",
};

export default function SystemBlueprintPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20 pb-24 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            System Blueprint v5.0
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 tracking-tighter">
            MASS OS <span className="text-orange-500">Architecture</span>
          </h1>
          <p className="text-xl text-zinc-400">
            A unified blueprint of the frontend routes, AI layers, core backend engines, and data flows powering the national automotive operating system.
          </p>
        </div>

        <SystemBlueprint />
      </div>
    </main>
  );
}
