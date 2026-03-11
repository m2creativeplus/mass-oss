import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Check, ShieldCheck, Zap, Globe, Cpu } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Essential digital tools for independent workshops.",
    features: [
      "50 Vehicle Passport Limit",
      "50 Client Profiles",
      "Basic Job Cards",
      "Digital Service History",
      "Inventory Tracking (Basic)",
      "SAIP Data View",
    ],
    cta: "Start Free",
    popular: false,
    icon: Zap
  },
  {
    name: "Growth",
    price: "$29",
    period: "/mo",
    desc: "Advanced operating system for growing service centers.",
    features: [
      "Unlimited Passports",
      "Unlimited Clients",
      "Technician Management",
      "DVI Photo Inspections",
      "Online Booking Portal",
      "SMS Automation",
      "SAIP Network Node",
    ],
    cta: "Select Growth",
    popular: true,
    icon: ShieldCheck
  },
  {
    name: "Pro",
    price: "$59",
    period: "/mo",
    desc: "Full institutional intelligence for established garages.",
    features: [
      "Multi-module Dashboard",
      "Advanced Inventory AI",
      "Employee Productivity Tech",
      "Financial Reporting",
      "Priority SAIP Intelligence",
      "Ecosystem Integration",
    ],
    cta: "Select Pro",
    popular: false,
    icon: Cpu
  },
  {
    name: "Enterprise",
    price: "$129",
    period: "/mo",
    desc: "For dealerships, fleets, and automotive networks.",
    features: [
      "Unlimited Everything",
      "API Access",
      "Custom Deployment",
      "Dedicated Advisor",
      "White-label Reports",
      "Institutional Data Flow",
    ],
    cta: "Contact Sales",
    popular: false,
    icon: Globe
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30 font-sans flex flex-col relative overflow-hidden">
      <Header />
      
      <main className="flex-1 pt-32 pb-20">
        <section className="py-20 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-orange-600/10 blur-[120px] rounded-full -z-10" />
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Institutional <br /> <span className="text-orange-500">Pricing</span></h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Scale your automotive business with the industry's most powerful operating system. No hidden costs. Zero friction.
                </p>
            </div>
        </section>

        <section className="py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan, i) => (
                        <div 
                            key={i} 
                            className={`group relative rounded-[2.5rem] p-10 border transition-all duration-500 flex flex-col ${
                                plan.popular 
                                ? 'bg-orange-500 border-orange-500 shadow-2xl shadow-orange-500/20 scale-105 z-10' 
                                : 'bg-white/[0.02] border-white/5 hover:border-orange-500/30'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-orange-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
                                    Recommended
                                </div>
                            )}
                            
                            <div className="mb-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors ${
                                    plan.popular ? 'bg-white text-orange-500 border-white' : 'bg-slate-900 text-orange-500 border-white/10'
                                }`}>
                                    <plan.icon className="w-7 h-7" />
                                </div>
                                <h3 className={`text-2xl font-black mb-3 ${plan.popular ? 'text-white' : 'text-white'}`}>{plan.name}</h3>
                                <p className={`text-sm leading-relaxed ${plan.popular ? 'text-orange-50' : 'text-slate-500'}`}>{plan.desc}</p>
                            </div>

                            <div className="mb-10">
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-5xl font-black tracking-tighter ${plan.popular ? 'text-white' : 'text-white'}`}>{plan.price}</span>
                                    {plan.period && <span className={`text-sm font-bold ${plan.popular ? 'text-orange-100' : 'text-slate-500'}`}>{plan.period}</span>}
                                </div>
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feat, j) => (
                                    <div key={j} className="flex items-start gap-3">
                                        <Check className={`h-4 w-4 shrink-0 mt-1 ${plan.popular ? 'text-white' : 'text-orange-500'}`} />
                                        <span className={`text-sm font-medium ${plan.popular ? 'text-white' : 'text-slate-300'}`}>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <Button asChild className={`h-16 text-lg font-black rounded-2xl transition-all w-full ${
                                plan.popular 
                                ? 'bg-white text-orange-500 hover:bg-orange-50 shadow-xl' 
                                : 'bg-white/5 text-white hover:bg-orange-500 border border-white/10'
                            }`}>
                                <Link href="/register">
                                    {plan.cta}
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-24 mt-12 bg-black border-y border-white/5">
            <div className="container mx-auto px-6 max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Custom Enterprise Solutions</h2>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                    Managing a national fleet or a regional network? We offer custom deployment, institutional data APIs, and dedicated priority support.
                </p>
                <Button size="lg" variant="outline" asChild className="h-16 px-12 text-lg border-orange-500/20 text-white hover:bg-orange-500/5 bg-transparent rounded-2xl">
                    <Link href="/contact">
                        Contact Enterprise Team
                    </Link>
                </Button>
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
  )
}
