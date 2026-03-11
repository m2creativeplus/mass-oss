import { ShoppingBag, Brain, FileCode, Landmark, Activity } from "lucide-react";

const futureItems = [
  {
    title: "MASS Parts Marketplace",
    desc: "Direct integration with local and international parts suppliers.",
    icon: ShoppingBag,
  },
  {
    title: "Vehicle Valuation AI",
    desc: "Proprietary algorithm based on regional fleet data.",
    icon: Brain,
  },
  {
    title: "Automotive Data API",
    desc: "Institutional access to anonymous vehicle trends.",
    icon: FileCode,
  },
  {
    title: "Workshop Financing",
    desc: "Capital access for workshops based on performance data.",
    icon: Landmark,
  },
  {
    title: "Predictive Maintenance",
    desc: "AI alerts for workshops and fleets before failures occur.",
    icon: Activity,
  },
];

export function Ecosystem() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">Future Vision</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">The MASS Ecosystem</h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Building the infrastructure for the next generation of automotive excellence.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureItems.map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 text-orange-500">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                            {item.desc}
                        </p>
                        <div className="mt-6 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Development Phase</span>
                        </div>
                    </div>
                </div>
            ))}
            <div className="p-8 rounded-3xl bg-orange-500 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-orange-600 transition-colors">
                <h4 className="text-2xl font-black text-white mb-4 leading-tight">Join the Automotive <br /> Revolution</h4>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                     <LandmarkIcon className="w-6 h-6" />
                </div>
                <p className="text-white/80 text-sm mt-6 font-bold uppercase tracking-widest">Early Access</p>
            </div>
        </div>
      </div>
    </section>
  );
}

function LandmarkIcon({ className }: { className?: string }) {
    return <Landmark className={className} />;
}
