import { MassOsSimulator } from "@/components/mass-os-simulator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MASS OS v5 | Interactive System Simulator",
  description: "Live interactive simulator demonstrating RBX roles, MTL flows, and core engines in MASS OS v5.",
};

export default function SimulatorPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20 pb-24 px-4 sm:px-6 relative overflow-hidden">
       {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Interactive Agentic Map
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 tracking-tighter">
            MASS OS <span className="text-orange-500">Live Simulator</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl">
            Simulate live interactions, workflows, and multi-role logic. Switch between RBX profiles to view dynamic modules, track job flows across the intelligence layer, and test offline IndexedDB syncing.
          </p>
        </div>

        <MassOsSimulator />
      </div>
    </main>
  );
}
