import { AlertCircle, Ban, Clock, TrendingDown } from "lucide-react";

const problems = [
  {
    title: "Paper Notebooks",
    desc: "Illegible job cards and lost repair orders lead to billing errors.",
    icon: Ban,
  },
  {
    title: "WhatsApp Chaos",
    desc: "Managing customer communications across personal chats is impossible to scale.",
    icon: AlertCircle,
  },
  {
    title: "Excel Maintenance",
    desc: "Manual inventory tracking leads to part theft and stockouts.",
    icon: TrendingDown,
  },
  {
    title: "No History",
    desc: "Garages have no memory of what was done to a vehicle last month.",
    icon: Clock,
  },
];

export function ProblemNarrative() {
  return (
    <section className="py-24 bg-slate-950 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">The Problem</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Traditional Garages are <br />
            <span className="text-slate-500">Running on Legacy Systems</span>
          </h3>
          <p className="text-xl text-slate-400">
            Most workshops are held back by manual processes that create revenue leakages and poor customer trust.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((prob, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-500 group">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <prob.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{prob.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {prob.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[2.5rem] bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 max-w-4xl mx-auto text-center">
            <p className="text-2xl font-bold text-red-400 mb-2">The Result?</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-6">
                <div className="text-center">
                    <p className="text-3xl font-black text-white">-30%</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">Lost Revenue</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-black text-white">LOW</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">Customer Trust</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-black text-white">ZERO</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">Data Insights</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
