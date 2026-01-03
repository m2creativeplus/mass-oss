"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  ClipboardList,
  Package,
  UserCheck,
  Building2,
  ClipboardCheck,
  FileText,
  BarChart3,
  Bot,
  Database,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Menu,
  Truck,
  Bell,
  ShoppingCart,
  Wrench,
  Phone,
  BookOpen,
  CarFront,
  Network,
} from "lucide-react"
import { useConvexAuth } from "@/components/auth/convex-auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/theme-toggle"

interface SidebarProps {
  activeModule: string
  onModuleChange: (module: string) => void
  userRole?: string
  className?: string
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "staff", "technician", "customer"] },
  { id: "work-orders", label: "Work Orders", icon: Wrench, roles: ["admin", "staff", "technician"] },
  { id: "customers", label: "Customers", icon: Users, roles: ["admin", "staff"] },
  { id: "vehicles", label: "Vehicles", icon: Car, roles: ["admin", "staff", "technician", "customer"] },
  { id: "appointments", label: "Appointments", icon: Calendar, roles: ["admin", "staff", "technician", "customer"] },
  { id: "car-request", label: "Car Request", icon: CarFront, roles: ["admin", "staff", "customer"] },
  { id: "inventory", label: "Parts Stock", icon: Package, roles: ["admin", "staff"] },
  { id: "pos", label: "Part Sells", icon: ShoppingCart, roles: ["admin", "staff"] },
  { id: "canned-jobs", label: "Canned Jobs", icon: ClipboardList, roles: ["admin", "staff"] },
  { id: "inspection-templates", label: "DVI Templates", icon: ClipboardCheck, roles: ["admin", "staff"] },
  { id: "declined-jobs", label: "Declined Jobs", icon: FileText, roles: ["admin", "staff"] },
  { id: "catalog", label: "Catalog", icon: BookOpen, roles: ["admin", "staff"] },
  { id: "delivery", label: "Delivery", icon: Truck, roles: ["admin", "staff"] },
  { id: "reminders", label: "Reminders", icon: Bell, roles: ["admin", "staff"] },
  { id: "technicians", label: "Mechanics", icon: UserCheck, roles: ["admin", "staff"] },
  { id: "suppliers", label: "Suppliers", icon: Building2, roles: ["admin", "staff"] },
  { id: "network", label: "Network", icon: Network, roles: ["admin", "staff"] },
  { id: "inspections", label: "DVI Inspections", icon: ClipboardCheck, roles: ["admin", "staff", "technician"] },
  { id: "diagnostics", label: "AI Diagnostics", icon: Bot, roles: ["admin", "staff", "technician"] },
  { id: "estimates", label: "Estimates & Invoices", icon: FileText, roles: ["admin", "staff", "technician"] },
  { id: "reports", label: "Reports", icon: BarChart3, roles: ["admin", "staff"] },
  { id: "ai-tools", label: "AI Assistant", icon: Bot, roles: ["admin", "staff", "technician"] },
  { id: "contact", label: "Contact", icon: Phone, roles: ["admin", "staff"] },
  { id: "settings", label: "Settings", icon: Settings, roles: ["admin"] },
]

export function Sidebar({ activeModule, onModuleChange, userRole, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, hasPermission } = useConvexAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredMenuItems = menuItems.filter((item) => {
    // If userRole prop is passed, use it, otherwise fall back to user object or allow all if neither
    const role = userRole || user?.role || "admin" 
    
    // Check role inclusion - simplified to just role-based filtering
    return !item.roles || item.roles.includes(role)
  })

  return (
    <div
      className={cn(
        "flex flex-col h-full sidebar-premium border-r border-sidebar-border transition-all duration-300 shadow-2xl z-50",
        isCollapsed ? "w-[80px]" : "w-[280px]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center p-6 mb-2">
        <div className={cn("flex items-center gap-3 transition-opacity duration-200", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight">MASS</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Automotive</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 ml-auto"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1.5">
          {filteredMenuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeModule === item.id
            const href = item.id === "dashboard" ? "/dashboard" : `/dashboard/${item.id}`

            return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  "sidebar-item w-full group relative block", // Added block for Link
                  isActive && "sidebar-item-active",
                  isCollapsed && "flex justify-center px-0 py-4" // adjusted spacing
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "flex items-center transition-colors duration-200 w-full h-full px-3 py-2", // Inner container
                   isCollapsed ? "justify-center px-0" : ""
                )}>
                  <div className={cn(
                    "flex items-center justify-center shrink-0",
                    isActive ? "text-orange-500" : "text-slate-400 group-hover:text-white"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {!isCollapsed && (
                    <span className={cn(
                      "font-medium text-sm ml-3 transition-colors duration-200 truncate",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}>
                      {item.label}
                    </span>
                  )}
                </div>

                {/* Hover Glow Effect */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                )}
                
                {/* Active Indicator for Collapsed Mode */}
                {isCollapsed && isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Profile Footer */}
      <div className="p-4 mt-auto space-y-2">
        {!isCollapsed && (
           <div className="flex justify-between items-center px-1"> 
             <span className="text-xs text-slate-500 font-medium tracking-wider dark:text-slate-400">THEME</span>
             <ModeToggle />
           </div>
        )}
        {isCollapsed && (
           <div className="flex justify-center mb-2">
             <ModeToggle />
           </div>
        )}

        <div className={cn(
          "rounded-xl bg-white/5 border border-white/10 p-3 transition-all duration-300 hover:bg-white/10 hover:border-white/20 cursor-pointer overflow-hidden",
          isCollapsed ? "items-center justify-center flex" : ""
        )}>
          <div className="flex items-center gap-3">
             <Avatar className="h-9 w-9 border-2 border-orange-500/20">
              <AvatarFallback className="bg-orange-500 text-white font-bold">
                {user?.role?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName?.[0]}.` : "Current User"}
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {user?.role || "Administrator"}
                </span>
              </div>
            )}
            
            {!isCollapsed && (
              <LogOut className="h-4 w-4 text-slate-400 ml-auto hover:text-red-400 transition-colors" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
