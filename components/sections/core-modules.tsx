import { LayoutDashboard, Car, Package, ClipboardCheck, Calendar, Users, BarChart3, Settings } from "lucide-react";

const modules = [
  {
    title: "Workshop Management",
    desc: "Job cards, repair orders, and technician assignment tools.",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicle Intelligence",
    desc: "Permanent VIN-based records and service history tracking.",
    icon: Car,
  },
  {
    title: "Inventory Control",
    desc: "Real-time tracking of spare parts and supplier management.",
    icon: Package,
  },
  {
    title: "Digital Inspections",
    desc: "Photo-based inspection reports with technician notes.",
    icon: ClipboardCheck,
  },
  {
    title: "Online Booking",
    desc: "Integrated workshop calendar and automated SMS reminders.",
    icon: Calendar,
  },
  {
    title: "Customer CRM",
    desc: "Build long-term trust with comprehensive ownership profiles.",
    icon: Users,
  },
  {
    title: "Reporting & AI",
    desc: "Data-driven insights into revenue and workshop productivity.",
    icon: BarChart3,
  },
  {
    title: "Fleet Operations",
    desc: "Manage maintenance across multiple vehicles and clients.",
    icon: Settings,
  },
];

export function CoreModules() {
  return (
    <section className="py-24 bg-slate-950 border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">Core Platform</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">
              One Operating System. <br />
              <span className="text-slate-500">Infinite Possibilities.</span>
            </h3>
          </div>
          <p className="text-slate-400 max-w-sm mb-2">
            Every module is built to communicate with the others, creating a seamless data flow for your business.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-orange-500/5 hover:border-orange-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <mod.icon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">{mod.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                {mod.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
