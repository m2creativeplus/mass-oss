import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, BarChart3, Users, Zap, Shield, Globe } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            v2.0 is now live
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
            The Modern Operating System for <span className="text-orange-500">Vehicle Repair</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Streamline your workshop operations, impress customers, and boost efficiency with our all-in-one cloud platform. No paperwork, just profit.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8 text-base shadow-lg shadow-orange-500/25">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 text-white hover:bg-white/5">
                View Features
              </Button>
            </Link>
          </div>

          {/* Hero Image Mockup placeholder - replaced with CSS visual for now */}
          <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur shadow-2xl overflow-hidden aspect-video group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            
            {/* Abstract UI representation */}
            <div className="w-full h-full p-4 flex gap-4 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
               <div className="w-64 h-full bg-slate-800/50 rounded-lg border border-white/5" />
               <div className="flex-1 h-full flex flex-col gap-4">
                  <div className="h-16 w-full bg-slate-800/50 rounded-lg border border-white/5" />
                  <div className="flex-1 w-full bg-slate-800/30 rounded-lg border border-white/5 flex gap-4 p-4">
                     <div className="flex-1 bg-slate-700/20 rounded" />
                     <div className="flex-1 bg-slate-700/20 rounded" />
                     <div className="flex-1 bg-slate-700/20 rounded" />
                  </div>
               </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center z-20">
               <span className="text-slate-500 font-mono text-sm">[ Dashboard Preview Visualization ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y border-white/5 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-slate-400">Workshops</div>
             </div>
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1M+</div>
                <div className="text-sm text-slate-400">Repairs Logged</div>
             </div>
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-sm text-slate-400">Uptime</div>
             </div>
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-slate-400">Support</div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to run your garage</h2>
            <p className="text-slate-400">From booking to billing, we've got your entire workflow covered with powerful, easy-to-use tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: "Smart Scheduling", 
                desc: "Drag-and-drop calendar tailored for mechanics. Reduce no-shows with automated SMS reminders." 
              },
              { 
                icon: Users, 
                title: "CRM & History", 
                desc: "Keep detailed records of every customer and vehicle. Access service history in one click." 
              },
              { 
                icon: BarChart3, 
                title: "Parts Inventory", 
                desc: "Real-time stock tracking with low-level alerts. Never run out of critical parts again." 
              },
              { 
                icon: Shield, 
                title: "Digital Inspections", 
                desc: "Build trust with photo/video inspections sent directly to customers for approval." 
              },
              { 
                icon: Globe, 
                title: "Online Booking", 
                desc: "Let customers book appointments 24/7 directly from your custom-branded page." 
              },
              { 
                icon: CheckCircle2, 
                title: "Estimates & Invoices", 
                desc: "Create professional quotes and invoices in seconds. Accept payments online." 
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to upgrade your workshop?</h2>
           <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Join hundreds of modern garages using MASS to grow their business.</p>
           <Link href="/register">
             <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100 font-bold h-14 px-10 text-lg">
               Get Started for Free
             </Button>
           </Link>
           <p className="mt-4 text-sm text-slate-400">No credit card required · 14-day free trial</p>
        </div>
      </section>
    </div>
  )
}
