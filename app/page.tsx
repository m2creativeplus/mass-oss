import { Header } from "@/components/header";
import { HeroPremium } from "@/components/sections/hero-premium";
import { ProblemNarrative } from "@/components/sections/problem-narrative";
import { SolutionShowcase } from "@/components/sections/solution-showcase";
import { CoreModules } from "@/components/sections/core-modules";
import { SaipDataMoat } from "@/components/sections/saip-data-moat";
import { Ecosystem } from "@/components/sections/ecosystem";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans flex flex-col relative overflow-hidden">
      <Header />
      
      <main className="flex-1">
        <HeroPremium />
        
        <div id="features">
          <ProblemNarrative />
          <SolutionShowcase />
        </div>

        <div id="solutions">
          <CoreModules />
          <SaipDataMoat />
        </div>

        <Ecosystem />

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-b from-slate-950 to-orange-950 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-8 text-white">Ready to Upgrade to the <br /> <span className="text-orange-500">Automotive Operating System?</span></h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                   <button className="h-16 px-12 bg-orange-500 hover:bg-orange-600 text-white font-black text-xl rounded-2xl shadow-2xl shadow-orange-500/40 transition-all hover:scale-105">
                       Get Started Now
                   </button>
                   <button className="h-16 px-12 bg-white/5 hover:bg-white/10 text-white font-black text-xl rounded-2xl border border-white/10 backdrop-blur-sm transition-all">
                       Contact Sales
                   </button>
                </div>
                <p className="mt-12 text-slate-500 font-bold uppercase tracking-widest text-xs">Trusted by 150+ workshops across the republic</p>
            </div>
        </section>
      </main>

      <footer className="py-12 bg-black border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-black tracking-tighter">
              <span className="text-white">MASS</span>
              <span className="text-orange-500">OSS</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500 font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
            <p className="text-slate-600 text-xs font-medium">© 2026 M2 Creative & Consulting. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
