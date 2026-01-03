import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Basic",
    price: "Free",
    desc: "For small garages just starting out",
    features: [
      "50 User Limit",
      "50 Client Limit",
      "50 Employee Limit",
      "Logged History",
      "Inventory Management",
      "Basic Reporting"
    ],
    missing: ["Coupons/Discounts", "API Access", "Priority Support"],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Premium",
    price: "$29",
    period: "/mo",
    desc: "Perfect for growing workshops",
    features: [
      "20 User Limit (Higher Tier)",
      "Unlimited Clients",
      "Unlimited Employees",
      "Logged History",
      "Coupons/Discounts",
      "DVI Inspections",
      "Online Booking"
    ],
    missing: ["API Access", "White Labeling"],
    cta: "Get Premium",
    popular: true
  },
  {
    name: "Standard",
    price: "$49",
    period: "/mo",
    desc: "For established service centers",
    features: [
      "30 User Limit",
      "Unlimited Clients",
      "Unlimited Employees",
      "All Premium Features",
      "Priority Support",
      "Multi-location Support"
    ],
    missing: [],
    cta: "Get Standard",
    popular: false
  },
  {
    name: "Advance",
    price: "$99",
    period: "/mo",
    desc: "For large chains and franchises",
    features: [
      "Unlimited Users",
      "Unlimited Clients",
      "Unlimited Employees",
      "All Features Included",
      "Dedicated Account Manager",
      "API Access",
      "Custom Comp Domain"
    ],
    missing: [],
    cta: "Contact Sales",
    popular: false
  }
]

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      <section className="py-20 bg-slate-950 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Transparent <span className="text-orange-500">Pricing</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your workshop size. No hidden fees.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border flex flex-col ${plan.popular ? 'bg-white/10 border-orange-500 shadow-2xl shadow-orange-500/10' : 'bg-white/5 border-white/10'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-400 min-h-[40px]">{plan.desc}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400">{plan.period}</span>}
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  {plan.missing.map((feat, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm text-slate-600">
                      <X className="h-4 w-4 text-slate-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link href="/register" className="w-full">
                  <Button className={`w-full ${plan.popular ? 'bg-orange-500 hover:bg-orange-600' : 'bg-white/10 hover:bg-white/20'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10 bg-white/5">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Enterprise Needs?</h2>
            <p className="text-slate-400 mb-8">Need custom integrations, SLA support, or on-premise deployment?</p>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/5">
                Contact Our Sales Team
              </Button>
            </Link>
        </div>
      </section>
    </div>
  )
}
