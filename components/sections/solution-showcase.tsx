import { Button } from "@/components/ui/button";
import { CheckCircle2, Cloud, Zap, Shield } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    title: "100% Cloud-Based",
    desc: "Access your workshop data from any device, anywhere in the world.",
    icon: Cloud,
  },
  {
    title: "Real-Time Tracking",
    desc: "See exactly which technician is working on which car right now.",
    icon: Zap,
  },
  {
    title: "Permanent Records",
    desc: "Every bolt turned and part changed is saved forever in the cloud.",
    icon: Shield,
  },
];

export function SolutionShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
        {/* Decorative background element */}
      <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
                <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                <div className="aspect-square rounded-[3rem] bg-slate-900 border border-white/5 p-4 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                    
                    {/* Abstract App Visualization */}
                    <div className="h-full border border-white/10 rounded-[2.5rem] bg-slate-950/50 p-8 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-xl">M</div>
                            <div className="space-y-1">
                                <div className="w-24 h-4 bg-white/20 rounded-full" />
                                <div className="w-16 h-2 bg-white/10 rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20" />
                                        <div className="w-32 h-3 bg-white/10 rounded-full" />
                                    </div>
                                    <div className="w-12 h-6 bg-green-500/20 rounded-full" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto grid grid-cols-2 gap-4">
                            <div className="h-32 rounded-2xl bg-white/[0.03] border border-white/5" />
                            <div className="h-32 rounded-2xl bg-white/[0.03] border border-white/5" />
                        </div>
                    </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 p-6 rounded-2xl bg-orange-500 text-white shadow-2xl animate-bounce">
                    <Zap className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-10 -left-6 p-8 rounded-full bg-slate-900 border border-white/10 shadow-2xl">
                    <p className="text-3xl font-black text-white leading-none tracking-tighter">99.9%</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black mt-1">Uptime</p>
                </div>
            </div>

            <div>
                <h2 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">The Solution</h2>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                    A Cloud-Based <br />
                    <span className="text-orange-500">Workshop Operating System</span>
                </h3>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                    MASS OSS digitizes every part of your automotive business. From the moment a vehicle enters your workshop to the final payment — everything is tracked, measured, and optimized.
                </p>

                <div className="space-y-8 mb-12">
                    {benefits.map((benefit, i) => (
                        <div key={i} className="flex gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                                <benefit.icon className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                                <p className="text-slate-400 leading-relaxed">{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Button size="lg" asChild className="h-14 px-8 text-base bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors rounded-xl">
                    <Link href="/register">
                        Build Your Digital Workshop &rarr;
                    </Link>
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
