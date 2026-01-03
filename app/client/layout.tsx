"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Wrench, 
  FileText, 
  User, 
  LogOut, 
  Menu,
  Car,
  Calendar,
  CreditCard
} from "lucide-react"
import { cn } from "@/lib/utils"
import { RoleGuard } from "@/components/auth/role-guard"

const clientMenu = [
  { href: "/client", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/repairs", label: "My Repairs", icon: Wrench },
  { href: "/client/vehicles", label: "My Vehicles", icon: Car },
  { href: "/client/appointments", label: "Appointments", icon: Calendar },
  { href: "/client/invoices", label: "Invoices & Payments", icon: FileText },
  { href: "/client/profile", label: "My Profile", icon: User },
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <RoleGuard allowedRoles={["customer"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-slate-900 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
               <User className="h-4 w-4 text-white" />
             </div>
             <span className="font-bold text-white">Client Portal</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">Client Portal</h1>
                <p className="text-xs text-slate-400">Welcome back, John</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {clientMenu.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start gap-3 h-12 text-slate-300 hover:text-white hover:bg-white/10",
                      isActive && "bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md shadow-blue-500/20"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
            <Link href="/login">
              <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/30">
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto p-4 md:p-8 max-w-6xl">
             {children}
          </div>
        </main>
        
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </div>
    </RoleGuard>
  )
}
