"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  ArrowLeft,
  User,
  Car,
  ClipboardList
} from "lucide-react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface CreateInspectionProps {
  onCancel: () => void
  onStart: (id: string) => void
}

const DEFAULT_INSPECTION_ITEMS = [
  { name: "Engine Oil Level", category: "Engine", status: "unchecked" },
  { name: "Coolant Level", category: "Engine", status: "unchecked" },
  { name: "Brake Fluid", category: "Brakes", status: "unchecked" },
  { name: "Brake Pads", category: "Brakes", status: "unchecked" },
  { name: "Tire Tread", category: "Tires", status: "unchecked" },
  { name: "Tire Pressure", category: "Tires", status: "unchecked" },
  { name: "Battery Health", category: "Electrical", status: "unchecked" },
  { name: "Headlights", category: "Electrical", status: "unchecked" },
  { name: "Suspension", category: "Undercarriage", status: "unchecked" },
  { name: "Exhaust System", category: "Undercarriage", status: "unchecked" },
]

export function CreateInspection({ onCancel, onStart }: CreateInspectionProps) {
  const orgId = "mass-hargeisa"
  
  // Convex Hooks
  const customers = useQuery(api.functions.getCustomers, { orgId })
  const allVehicles = useQuery(api.functions.getVehicles, { orgId })
  const createInspectionMutation = useMutation(api.functions.createInspection)

  // State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Memoized Filtered Vehicles
  const filteredVehicles = useMemo(() => {
    if (!selectedCustomerId) return []
    return allVehicles?.filter(v => v.customerId === selectedCustomerId) || []
  }, [selectedCustomerId, allVehicles])

  const handleStart = async () => {
    if (!selectedCustomerId || !selectedVehicleId) {
      toast.error("Please select a customer and vehicle")
      return
    }

    setIsSubmitting(true)
    try {
      const id = await createInspectionMutation({
        orgId,
        customerId: selectedCustomerId as any,
        vehicleId: selectedVehicleId as any,
        status: "in-progress",
        items: DEFAULT_INSPECTION_ITEMS as any
      })
      toast.success("Inspection started")
      onStart(id)
    } catch (error) {
      console.error(error)
      toast.error("Failed to start inspection")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-10">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </div>

      <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
            <ClipboardList className="h-6 w-6 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-black italic">NEW INSPECTION</CardTitle>
          <CardDescription>Select a vehicle to begin the digital inspection report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-6">
          <div className="space-y-3">
             <Label className="text-xs uppercase tracking-widest opacity-50">1. Select Customer</Label>
             <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger className="bg-white/5 border-white/10 h-12">
                   <SelectValue placeholder="Search customers..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                   {customers?.map(c => (
                      <SelectItem key={c._id} value={c._id}>
                         <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-amber-500/50" />
                            {c.firstName} {c.lastName}
                         </div>
                      </SelectItem>
                   ))}
                </SelectContent>
             </Select>
          </div>

          <AnimatePresence mode="wait">
            {selectedCustomerId && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <Label className="text-xs uppercase tracking-widest opacity-50">2. Select Vehicle</Label>
                <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                   <SelectTrigger className="bg-white/5 border-white/10 h-12">
                      <SelectValue placeholder="Select vehicle..." />
                   </SelectTrigger>
                   <SelectContent className="bg-zinc-900 border-white/10">
                      {filteredVehicles.length > 0 ? (
                         filteredVehicles.map(v => (
                            <SelectItem key={v._id} value={v._id}>
                               <div className="flex items-center gap-2">
                                  <Car className="h-3 w-3 text-amber-500/50" />
                                  {v.year} {v.make} {v.model} ({v.licensePlate})
                               </div>
                            </SelectItem>
                         ))
                      ) : (
                         <SelectItem value="none" disabled>No vehicles registered for this customer</SelectItem>
                      )}
                   </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            disabled={!selectedVehicleId || isSubmitting}
            onClick={handleStart}
            className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest shadow-lg shadow-amber-500/20"
          >
            {isSubmitting ? "Initializing..." : "Start Inspection"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateInspection
