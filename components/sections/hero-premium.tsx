import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Wrench, ShieldCheck, Globe } from "lucide-react";

export function HeroPremium() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-orange-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
          <ShieldCheck className="w-3.5 h-3.5" />
          The Automotive Operating System for Emerging Markets
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8">
          MASS <span className="text-orange-500">OSS</span>
        </h1>

        <p className="text-2xl md:text-3xl font-semibold text-slate-200 mb-6 max-w-4xl mx-auto leading-tight">
          Run your entire garage from one intelligent platform.
        </p>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Manage customers, vehicles, technicians, inventory, inspections, and payments — all in one place.
          Built for workshops, service centers, and automotive networks.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10">
          <Button size="lg" asChild className="h-16 px-10 text-lg bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-2xl shadow-orange-500/20 group">
            <Link href="/register">
              Start Free
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-16 px-10 text-lg border-white/10 text-white hover:bg-white/5 bg-slate-900/50 backdrop-blur-sm rounded-xl">
            <Link href="#demo">
              Book Demo
            </Link>
          </Button>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="flex items-center gap-2">
             <Globe className="w-6 h-6" />
             <span className="font-bold text-xl tracking-tighter">AFRILYNX</span>
           </div>
           <div className="flex items-center gap-2">
             <Wrench className="w-6 h-6" />
             <span className="font-bold text-xl tracking-tighter">TECHSPEC</span>
           </div>
           <div className="font-black text-2xl tracking-tighter">SOMAUTO</div>
        </div>
      </div>

      {/* Hero Visual Element (Abstract UI) */}
      <div className="mt-24 w-full max-w-6xl mx-auto px-6">
        <div className="relative aspect-[16/9] rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent" />
            {/* Abstract UI Elements */}
            <div className="p-8 h-full flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div className="w-32 h-4 bg-white/10 rounded-full" />
                    <div className="flex gap-2">
                         <div className="w-8 h-8 rounded-lg bg-white/5" />
                         <div className="w-8 h-8 rounded-lg bg-white/5" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6 flex-1">
                    <div className="col-span-2 rounded-2xl bg-white/5 border border-white/5 p-6 space-y-4">
                        <div className="w-3/4 h-8 bg-white/10 rounded-lg" />
                        <div className="w-full h-32 bg-orange-500/5 border border-orange-500/10 rounded-xl" />
                        <div className="grid grid-cols-2 gap-4 mt-auto">
                             <div className="h-12 bg-white/5 rounded-lg" />
                             <div className="h-12 bg-white/5 rounded-lg" />
                        </div>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-6 space-y-6">
                        <div className="w-1/2 h-6 bg-white/10 rounded-lg" />
                        <div className="space-y-3">
                             <div className="w-full h-3 bg-white/5 rounded-full" />
                             <div className="w-full h-3 bg-white/5 rounded-full" />
                             <div className="w-2/3 h-3 bg-white/5 rounded-full" />
                        </div>
                        <div className="mt-auto pt-6 border-t border-white/5">
                             <div className="w-full h-10 bg-orange-500 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
