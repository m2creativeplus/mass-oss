"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Download,
  Printer,
  ArrowLeft,
  Mail,
  ShieldCheck,
  MessageSquare,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface DviReviewProps {
  id: string
  onBack: () => void
}

export function DviReview({ id, onBack }: DviReviewProps) {
  const inspection = useQuery(api.functions.getInspectionById, { inspectionId: id as Id<"inspections"> })
  const updateStatus = useMutation(api.functions.updateInspectionStatus)

  // Meta
  const vehicles = useQuery(api.functions.getVehicles, { orgId: "mass-hargeisa" })
  const vehicle = vehicles?.find(v => v._id === inspection?.vehicleId)

  const handleShare = async () => {
    try {
       await updateStatus({
          inspectionId: id as Id<"inspections">,
          status: "completed"
       })
       toast.success("Inspection report shared with customer!")
    } catch (error) {
       toast.error("Failed to share report")
    }
  }

  if (!inspection) return null

  const failItems = inspection.items.filter(i => i.status === "immediate-attention")
  const warnItems = inspection.items.filter(i => i.status === "attention")
  const okItems = inspection.items.filter(i => i.status === "ok")

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-6 pb-20"
    >
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Edit Inspection
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-4 w-4" /> Share with Client
          </Button>
        </div>
      </div>

      <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
        <CardHeader className="p-8 text-center">
           <div className="mx-auto h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
           </div>
           <CardTitle className="text-3xl font-black uppercase italic tracking-tighter">Inspection Summary</CardTitle>
           <CardDescription>
              Vehicle Health Overview for {vehicle?.year} {vehicle?.make} {vehicle?.model}
           </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-10 space-y-10">
           {/* Severity Breakdown */}
           <div className="grid grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/10 text-center">
                 <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                 <p className="text-2xl font-black text-white">{failItems.length}</p>
                 <p className="text-[10px] uppercase font-bold text-red-400 opacity-80">Urgent Repairs</p>
              </div>
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/10 text-center">
                 <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                 <p className="text-2xl font-black text-white">{warnItems.length}</p>
                 <p className="text-[10px] uppercase font-bold text-amber-400 opacity-80">Observations</p>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 text-center">
                 <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                 <p className="text-2xl font-black text-white">{okItems.length}</p>
                 <p className="text-[10px] uppercase font-bold text-emerald-400 opacity-80">Passed Points</p>
              </div>
           </div>

           <Separator className="bg-white/5" />

           {/* Detailed Findings */}
           <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                 <MessageSquare className="h-5 w-5 text-amber-500" /> Critical Findings
              </h3>
              
              {failItems.length === 0 && warnItems.length === 0 ? (
                 <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-20" />
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Vehicle is in perfect condition</p>
                 </div>
              ) : (
                 <div className="space-y-4">
                    {failItems.map(item => (
                       <div key={item.name} className="flex gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                          <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                             <p className="font-bold text-white uppercase text-sm italic">{item.name}</p>
                             <p className="text-xs text-red-200/60 mt-1">{item.notes || "No additional nodes provided by technician."}</p>
                          </div>
                       </div>
                    ))}
                    {warnItems.map(item => (
                       <div key={item.name} className="flex gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                             <p className="font-bold text-white uppercase text-sm italic">{item.name}</p>
                             <p className="text-xs text-amber-200/60 mt-1">{item.notes || "Monitor this component for future maintenance."}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>

           <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <Mail className="h-6 w-6 text-amber-500/50" />
                 <div>
                    <p className="text-sm font-bold text-white">Client Notification</p>
                    <p className="text-xs text-muted-foreground">This report will be sent to the customer via SMS & Email.</p>
                 </div>
              </div>
              <Badge variant="outline" className="border-amber-500/20 text-amber-500 uppercase text-[10px]">Ready to Share</Badge>
           </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default DviReview
