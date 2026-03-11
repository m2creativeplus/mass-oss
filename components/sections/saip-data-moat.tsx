import { Database, Search, Network, Cpu, Share2 } from "lucide-react";

export function SaipDataMoat() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent -z-10" />

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-4">
              Intelligence Infrastructure
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              The <span className="text-orange-500">SAIP</span> Data Network
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
                MASS OSS workshops aren't just standalone apps. They are nodes in the **Somaliland Automotive Intel Platform** — the largest automotive data network in emerging markets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
                <div className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                        <Database className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">Automotive Moat</h4>
                        <p className="text-slate-500 leading-relaxed">Build a competitive advantage using data from workshops, spare parts markets, and social media activity.</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                        <Search className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">Market Intelligence</h4>
                        <p className="text-slate-500 leading-relaxed">Real-time vehicle valuation AI powered by millions of local and regional automotive records.</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                        <Network className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">Global Connectivity</h4>
                        <p className="text-slate-500 leading-relaxed">Connect with global spare parts suppliers and service networks seamlessly.</p>
                    </div>
                </div>
            </div>

            <div className="relative p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                     <Share2 className="w-6 h-6 text-orange-500/20" />
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="flex justify-center">
                         <div className="relative">
                            <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20" />
                            <div className="w-32 h-32 rounded-3xl bg-slate-900 border border-orange-500/30 flex items-center justify-center relative">
                                <Cpu className="w-16 h-16 text-orange-500 animate-pulse" />
                            </div>
                         </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full w-[70%] bg-orange-500 animate-[shimmer_2s_infinite]" />
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                            <span>Ingesting Data</span>
                            <span>98.2% Accuracy</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                            <p className="text-xl font-black text-white leading-none">2.4M</p>
                            <p className="text-[10px] text-slate-500 uppercase mt-1">Records</p>
                         </div>
                         <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                            <p className="text-xl font-black text-white leading-none">150+</p>
                            <p className="text-[10px] text-slate-500 uppercase mt-1">Nodes</p>
                         </div>
                    </div>
                </div>
                
                {/* Decorative dots */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0 p-12 opacity-[0.03] pointer-events-none">
                     {[...Array(64)].map((_, i) => (
                        <div key={i} className="flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                     ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
