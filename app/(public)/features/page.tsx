import { Button } from "@/components/ui/button"
import { CheckCircle2, Zap, Shield, Globe, BarChart3, Users, Wrench, Calendar, Truck, Package, FileText, Bell } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Wrench,
    title: "Job Management",
    desc: "Create, track, and manage repair jobs from intake to invoice. Real-time status updates and technician assignment."
  },
  {
    icon: Users,
    title: "CRM",
    desc: "Complete customer profiles with service history, vehicle details, and communication logs."
  },
  {
    icon: Package,
    title: "Inventory Control",
    desc: "Track parts in real-time. Low stock alerts, supplier management, and automatic quantity updates."
  },
  {
    icon: Calendar,
    title: "Scheduling",
    desc: "Visual calendar for appointments. Drag-and-drop rescheduling and automated SMS reminders."
  },
  {
    icon: Shield,
    title: "Digital Inspections (DVI)",
    desc: "Build trust with photo/video inspections. Send reports directly to customers for digital approval."
  },
  {
    icon: FileText,
    title: "Estimates & Invoicing",
    desc: "Professional templates. Convert estimates to invoices in one click. Support for tax and discounts."
  },
  {
    icon: Globe,
    title: "Online Booking",
    desc: "24/7 self-service booking portal for your customers. Customizable slots and services."
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    desc: "Understand your business with detailed reports on revenue, technician efficiency, and parts usage."
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    desc: "Send service due reminders, appointment confirmations, and pickup notifications automatically."
  },
  {
    icon: Truck,
    title: "Fleet Management",
    desc: "Specialized tools for managing fleet accounts, bulk billing, and vehicle tracking."
  },
]

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 bg-slate-950 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Power-Packed <span className="text-orange-500">Features</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Tools designed by mechanics, for mechanics. Everything you need to scale your workshop.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-6">Stop Chasing Paperwork</h2>
              <ul className="space-y-4">
                {[
                  "Eliminate lost repair orders",
                  "Reduce phone calls by 40%",
                  "Get paid faster with digital invoices",
                  "Access your shop from anywhere"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Start Modernizing Today
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Visual placeholder */}
            <div className="flex-1 w-full aspect-video rounded-xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-slate-500 font-mono">[ Interface Screenshot ]</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
