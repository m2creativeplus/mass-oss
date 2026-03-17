"use client"

import { useState } from "react"
import { ConvexAuthProvider } from "@/components/auth/convex-auth-provider"
import { ConvexLoginForm } from "@/components/auth/convex-login-form"
import { useConvexAuth } from "@/components/auth/convex-auth-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { UserMenu } from "@/components/layout/user-menu"
import dynamic from "next/dynamic"

// Import Standard Modules
import { Dashboard } from "@/components/dashboard/dashboard"
import { Customers } from "@/components/customers/customers"
import { Vehicles } from "@/components/vehicles/vehicles"
import { Appointments } from "@/components/appointments/appointments"
import { WorkOrdersKanban } from "@/components/work-orders/work-orders-kanban"
import { InventoryManagement } from "@/components/inventory/inventory-management"
import { TechnicianDashboard } from "@/components/technicians/technician-dashboard"
import { CreateEstimate } from "@/components/estimates/create-estimate" // Using CreateEstimate as main view for now
import { ReportsAnalytics } from "@/components/reports/reports-analytics"
import { AITools } from "@/components/ai-tools/ai-tools"
import { EnhancedInspectionChecklist } from "@/components/inspections/enhanced-inspection-checklist" // New Enhanced DVI

// Dynamically import optional/admin modules
const SuppliersModule = dynamic(() => import("@/components/suppliers/suppliers-module"), { ssr: false })
const SettingsModule = dynamic(() => import("@/components/settings/settings-module"), { ssr: false })
const DeliveryModule = dynamic(() => import("@/components/delivery/delivery-module"), { ssr: false })
const RemindersModule = dynamic(() => import("@/components/reminders/reminders-module"), { ssr: false })
const PartSellsModule = dynamic(() => import("@/components/pos/part-sells-module"), { ssr: false })
const AutoDiagnosticsModule = dynamic(() => import("@/components/ai-diagnostics/auto-diagnostics-module"), { ssr: false })
const CarRequestModule = dynamic(() => import("@/components/car-request/car-request-module"), { ssr: false })
const ContactModule = dynamic(() => import("@/components/contact/contact-module"), { ssr: false })
const CatalogModule = dynamic(() => import("@/components/catalog/catalog-module"), { ssr: false })
const NetworkModule = dynamic(() => import("@/components/network/network-explorer"), { ssr: false })
const DeclinedJobsTracker = dynamic(() => import("@/components/estimates/declined-jobs-tracker"), { ssr: false })
const CannedJobsLibrary = dynamic(() => import("@/components/canned-jobs/canned-jobs-library"), { ssr: false })
const InspectionTemplateBuilder = dynamic(() => import("@/components/inspections/inspection-template-builder"), { ssr: false })

import { useOrganization } from "@/components/providers/organization-provider"

function WorkshopSystemContent() {
  const { user, logout } = useConvexAuth()
  const { organization, isLoading: orgLoading } = useOrganization()
  const [activeModule, setActiveModule] = useState("dashboard")

  if (!user) {
    return <ConvexLoginForm />
  }

  if (orgLoading) {
    return <div className="flex h-screen items-center justify-center">Loading organization...</div>
  }

  if (!organization) {
    return (
        <div className="flex h-screen items-center justify-center flex-col gap-4">
            <h2 className="text-xl font-bold">No Organization Found</h2>
            <p>You are not a member of any workshop.</p>
        </div>
    )
  }

  const renderModule = () => {
    const orgId = organization._id
    
    switch (activeModule) {
      case "dashboard":
        return <Dashboard orgId={orgId} />
      case "work-orders":
        return <WorkOrdersKanban />
      case "customers":
        return <Customers orgId={orgId} />
      case "vehicles":
        return <Vehicles orgId={orgId} />
      case "appointments":
        return <Appointments />
      case "car-request":
        return <CarRequestModule />
      case "inventory":
        return <InventoryManagement />
      case "technicians":
        return <TechnicianDashboard />
      case "suppliers":
        return <SuppliersModule />
      case "network":
        return <NetworkModule />
      case "inspections":
        return <EnhancedInspectionChecklist id="" onBack={() => setActiveModule("dashboard")} onComplete={() => setActiveModule("dashboard")} />
      case "estimates":
        return <CreateEstimate onBack={() => setActiveModule("dashboard")} />
      case "reports":
        return <ReportsAnalytics />
      case "ai-tools":
        return <AITools />
      case "pos":
        return <PartSellsModule />
      case "catalog":
        return <CatalogModule />
      case "delivery":
        return <DeliveryModule />
      case "reminders":
        return <RemindersModule />
      case "diagnostics":
        return <AutoDiagnosticsModule />
      case "contact":
        return <ContactModule />
      case "settings":
        return user.role === "admin" ? <SettingsModule /> : <Dashboard orgId={orgId} />
      case "declined-jobs":
        return <DeclinedJobsTracker />
      case "canned-jobs":
        return <CannedJobsLibrary />
      case "inspection-templates":
        return <InspectionTemplateBuilder />
      default:
        return <Dashboard orgId={orgId} />
    }
  }

  const getModuleTitle = (id: string) => {
    // ... existing ...
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
      settings: "System Settings"
    }
    return titles[id] || "Dashboard"
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans antialiased text-foreground selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-orange-100">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} userRole={user.role} />
      
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300">
        {/* Glass Header */}
        <header className="absolute top-0 left-0 right-0 h-16 glass-card z-10 mx-6 mt-4 rounded-xl flex items-center justify-between px-6 shadow-sm border border-white/20 dark:border-white/5">
          <div className="flex items-center gap-2">
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
            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function MassWorkshopSystem() {
  return (
    <ConvexAuthProvider>
      <WorkshopSystemContent />
    </ConvexAuthProvider>
  )
}
