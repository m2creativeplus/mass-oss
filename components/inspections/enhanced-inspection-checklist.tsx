"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Camera, 
  Video,
  Upload,
  Wrench,
  Settings,
  Gauge,
  Car,
  ArrowLeft,
  ArrowRight,
  Save,
  Square,
  ClipboardCheck,
  Zap,
  ShieldCheck,
  AlertTriangle
} from "lucide-react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface InspectionChecklistProps {
  id: string
  onBack: () => void
  onComplete: () => void
}

const inspectionCategories = [
  { id: "Exterior", label: "Exterior", icon: Car },
  { id: "Interior", label: "Interior", icon: Settings },
  { id: "Engine", label: "Engine", icon: Wrench },
  { id: "Brakes", label: "Brakes", icon: ShieldCheck },
  { id: "Tires", label: "Tires", icon: Square },
  { id: "Electrical", label: "Electrical", icon: Zap },
  { id: "Undercarriage", label: "Bottom", icon: Gauge },
]

export function EnhancedInspectionChecklist({ id, onBack, onComplete }: InspectionChecklistProps) {
  const [activeCategory, setActiveCategory] = useState("Exterior")
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)
  
  // Convex Hooks
  const inspection = useQuery(api.functions.getInspectionById, { inspectionId: id as Id<"inspections"> })
  const updateItem = useMutation(api.functions.updateInspectionItem)
  const updateStatus = useMutation(api.functions.updateInspectionStatus)

  // Resolve Vehicle details
  const vehicles = useQuery(api.functions.getVehicles, { orgId: "mass-hargeisa" })
  const vehicle = vehicles?.find(v => v._id === inspection?.vehicleId)

  const handleUpdateStatus = async (itemName: string, status: any) => {
    try {
      await updateItem({
        inspectionId: id as Id<"inspections">,
        itemName,
        status,
      })
      // toast.success(`Updated ${itemName}`) // Too noisy for quick taps
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const handleUpdateNotes = async (itemName: string, notes: string) => {
    try {
      await updateItem({
        inspectionId: id as Id<"inspections">,
        itemName,
        status: inspection?.items.find(i => i.name === itemName)?.status as any,
        notes
      })
      toast.success("Note saved")
    } catch (error) {
      toast.error("Failed to save note")
    }
  }

  const handleComplete = async () => {
     try {
        await updateStatus({
           inspectionId: id as Id<"inspections">,
           status: "completed"
        })
        toast.success("Inspection completed!")
        onComplete()
     } catch (error) {
        toast.error("Failed to complete inspection")
     }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ok":
        return { 
          icon: CheckCircle2, 
          color: "text-emerald-500", 
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          label: "Good"
        }
      case "attention":
        return { 
          icon: AlertTriangle, 
          color: "text-amber-500", 
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          label: "Attention"
        }
      case "immediate-attention":
        return { 
          icon: XCircle, 
          color: "text-red-500", 
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          label: "Urgent"
        }
      default:
        return { 
          icon: AlertCircle, 
          color: "text-zinc-500", 
          bg: "bg-white/5",
          border: "border-white/5",
          label: "Not Checked"
        }
    }
  }

  if (inspection === undefined) {
    return (
       <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4" />
          <p className="text-muted-foreground">Loading inspection checklist...</p>
       </div>
    )
  }

  const progress = inspection?.items.filter(p => p.status !== "not-applicable" && p.status !== "unchecked" && (p.status as any) !== "pending").length || 0
  const total = inspection?.items.length || 0
  const progressPercent = total > 0 ? Math.round((progress / total) * 100) : 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header with Progress */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-white/10">
               <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
               <h2 className="text-3xl font-black tracking-tight text-white flex items-center">
                  <ClipboardCheck className="mr-2 h-7 w-7 text-amber-500" /> DVI REPORT
               </h2>
               <p className="text-sm text-muted-foreground">
                  Vehicle: <span className="font-bold text-amber-500/80">{vehicle?.year} {vehicle?.make} {vehicle?.model}</span> ({vehicle?.licensePlate})
               </p>
            </div>
         </div>
         <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between items-end">
               <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Inspection Progress</span>
               <span className="text-xl font-black text-amber-500">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progressPercent}%` }}
                 className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
               />
            </div>
         </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 h-auto bg-black/40 border border-white/5 p-1 rounded-2xl">
          {inspectionCategories.map(category => {
            const CategoryIcon = category.icon
            const catPoints = inspection?.items.filter(p => p.category === category.id) || []
            const catProgress = catPoints.filter(p => p.status !== "not-applicable" && p.status !== "unchecked").length
            
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center gap-1 py-4 data-[state=active]:bg-amber-500 data-[state=active]:text-black transition-all rounded-xl"
              >
                <CategoryIcon className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase hidden md:inline">{category.label}</span>
                <span className="text-[9px] opacity-60">
                  {catProgress}/{catPoints.length}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {inspectionCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-8">
            <div className="grid gap-4 md:grid-cols-1">
              {inspection?.items.filter(p => p.category === category.id).map((point, index) => {
                const config = getStatusConfig(point.status)
                const StatusIcon = config.icon
                
                return (
                  <Card 
                    key={point.name}
                    className={cn(
                      "border-white/5 bg-black/40 backdrop-blur-xl hover:bg-white/5 transition-all duration-300",
                      selectedPoint === point.name && "border-amber-500/50 shadow-lg shadow-amber-500/5"
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 flex-1 w-full" onClick={() => setSelectedPoint(selectedPoint === point.name ? null : point.name)}>
                          <div className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500",
                            config.bg,
                            config.border
                          )}>
                            <StatusIcon className={cn("h-7 w-7", config.color)} />
                          </div>
                          
                          <div className="flex-1">
                             <h4 className="font-bold text-md text-white">{point.name}</h4>
                             <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{category.label}</p>
                          </div>
                        </div>

                        {/* Status Buttons */}
                        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                          <div className="flex gap-2">
                             <Button
                               size="sm"
                               variant="outline"
                               className={cn(
                                 "h-10 px-4 rounded-xl border-white/10",
                                 point.status === "ok" && "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                               )}
                               onClick={() => handleUpdateStatus(point.name, "ok")}
                             >
                               <CheckCircle2 className="h-4 w-4 mr-2" /> OK
                             </Button>
                             
                             <Button
                               size="sm"
                               variant="outline"
                               className={cn(
                                 "h-10 px-4 rounded-xl border-white/10",
                                 point.status === "attention" && "bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
                               )}
                               onClick={() => handleUpdateStatus(point.name, "attention")}
                             >
                               <AlertTriangle className="h-4 w-4 mr-2" /> NOTE
                             </Button>
                             
                             <Button
                               size="sm"
                               variant="outline"
                               className={cn(
                                 "h-10 px-4 rounded-xl border-white/10",
                                 point.status === "immediate-attention" && "bg-red-500 text-white border-red-500 hover:bg-red-600"
                               )}
                               onClick={() => handleUpdateStatus(point.name, "immediate-attention")}
                             >
                               <XCircle className="h-4 w-4 mr-2" /> FAIL
                             </Button>
                          </div>

                          <Separator orientation="vertical" className="h-8 bg-white/10 hidden md:block" />

                          <div className="flex gap-1.5">
                             <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-amber-500/10 hover:text-amber-500">
                               <Camera className="h-4 w-4" />
                             </Button>
                             <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-amber-500/10 hover:text-amber-500">
                               <Plus className="h-4 w-4" />
                             </Button>
                          </div>
                        </div>
                      </div>

                      {/* Notes Section - Shows when selected */}
                      <AnimatePresence>
                        {selectedPoint === point.name && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Technician Notes</Label>
                                 <textarea
                                   defaultValue={point.notes}
                                   placeholder="Describe findings, measurements, or needed repairs..."
                                   className="w-full p-4 rounded-2xl border border-white/10 bg-black/40 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 min-h-[100px]"
                                   onBlur={(e) => handleUpdateNotes(point.name, e.target.value)}
                                 />
                              </div>
                              
                              <div className="flex gap-3">
                                <div className="flex-1 h-32 rounded-2xl border-2 border-dashed border-white/5 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Upload Photos</span>
                                </div>
                                <div className="flex-1 h-32 rounded-2xl border-2 border-dashed border-white/5 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                                  <Video className="h-6 w-6 text-muted-foreground mb-2" />
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Record Video</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-10 border-t border-white/5">
        <Button variant="ghost" onClick={onBack} className="hover:bg-white/5 h-12 px-8">
           Save as Draft
        </Button>
        <Button 
          onClick={handleComplete}
          className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest h-12 px-10 shadow-xl shadow-amber-500/20"
        >
          Complete & Generate Report
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

export default EnhancedInspectionChecklist
