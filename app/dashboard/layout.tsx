"use client"

import { useState } from "react"
import { useConvexAuth } from "@/components/auth/convex-auth-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { UserMenu } from "@/components/layout/user-menu"
import { OrganizationProvider, useOrganization } from "@/components/providers/organization-provider"
import { usePathname, useRouter } from "next/navigation"
import { MobileNav } from "@/components/layout/mobile-nav"

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading: authLoading } = useConvexAuth()
  const { organization, isLoading: orgLoading } = useOrganization()
  const pathname = usePathname()

  // Debug logging to trace the issue
  console.log("[DashboardLayout] State:", { 
    authLoading, 
    hasUser: !!user, 
    userId: user?.id, 
    orgLoading, 
    hasOrg: !!organization 
  })

  // Helper to extract active module from pathname
  // e.g., /dashboard/work-orders -> work-orders
  const activeModule = pathname?.split("/")[2] || "dashboard"

  const getModuleTitle = (path: string) => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard Overview",
      "work-orders": "Work Orders",
      customers: "Customer Management",
      vehicles: "Vehicle Registry",
      appointments: "Service Schedule",
      inventory: "Inventory Management",
      pos: "Part Sells / POS",
      delivery: "Delivery Car",
      reminders: "Service Reminders",
      diagnostics: "AI Auto-Diagnostics",
      technicians: "Technician Portal",
      suppliers: "Supplier Directory",
      network: "Stakeholder Network",
      inspections: "Digital Vehicle Inspections",
      estimates: "Estimates & Invoices",
      reports: "Analytics & Reports",
      "ai-tools": "AI Assistant",
      settings: "System Settings",
      "canned-jobs": "Canned Jobs Library",
      "inspection-templates": "DVI Templates",
      "declined-jobs": "Declined Jobs Tracker",
      "catalog": "Parts Catalog",
      "contact": "Contact Support"
    }
    // Handle dynamic ID matching if needed, for now exact match
    return titles[path] || "Dashboard"
  }

  const router = useRouter()

  if (!user) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      router.replace("/login")
    }
    return <div className="flex h-screen items-center justify-center">Redirecting to login...</div>
  }

  if (orgLoading) {
    return <div className="flex h-screen items-center justify-center">Loading organization (DEBUG CHECK)...</div>
  }


  if (!organization) {
    return (
        <div className="flex h-screen items-center justify-center flex-col gap-4">
            <h2 className="text-xl font-bold">No Organization Found</h2>
            <p>You are not a member of any workshop.</p>
        </div>
    )
  }


  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans antialiased text-foreground selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-orange-100">
      {/* Desktop Sidebar: Hidden on mobile (md:hidden) */}
      <div className="hidden md:flex h-full"> 
        <Sidebar activeModule={activeModule} onModuleChange={() => {}} userRole={user.role} />
      </div>
      
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300">
        {/* Glass Header */}
        <header className="absolute top-0 left-0 right-0 h-16 glass-card z-10 mx-6 mt-4 rounded-xl flex items-center justify-between px-6 shadow-sm border border-white/20 dark:border-white/5">
          <div className="flex items-center gap-2">
            {/* Mobile Nav Trigger: Visible only on mobile */}
            <MobileNav />
            
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              {getModuleTitle(activeModule)}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 font-medium">
               {organization.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
             <UserMenu />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 pt-24 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OrganizationProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </OrganizationProvider>
  )
}
