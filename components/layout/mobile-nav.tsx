"use client"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  
  // Close sheet when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-slate-500">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-transparent border-none w-[300px]">
        {/* Force sidebar to be expanded and full width within the sheet */}
        <Sidebar 
          activeModule={pathname?.split("/")[2] || "dashboard"} 
          onModuleChange={() => {}} 
          className="w-full h-full border-none"
        />
      </SheetContent>
    </Sheet>
  )
}
