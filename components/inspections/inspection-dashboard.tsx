"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ClipboardList, Plus, Search, Car, User, CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

interface InspectionDashboardProps {
  onOpen?: (id: string) => void
  onCreate?: () => void
}

export function InspectionDashboard({ onOpen, onCreate }: InspectionDashboardProps) {
  const orgId = "mass-hargeisa"
  const inspections = useQuery(api.functions.getInspections, { orgId })
  
  // Resolve Vehicles/Customers metadata
  const customers = useQuery(api.functions.getCustomers, { orgId })
  const vehicles = useQuery(api.functions.getVehicles, { orgId })

  const getCustomerName = (id: string) => {
    const c = customers?.find(cust => cust._id === id)
    return c ? `${c.firstName} ${c.lastName}` : "Unknown"
  }

  const getVehicleInfo = (id: string) => {
    const v = vehicles?.find(veh => veh._id === id)
    return v ? `${v.year} ${v.make} ${v.model}` : "Unknown Vehicle"
  }

  const statusColor: Record<string, string> = {
    draft: "secondary",
    "in-progress": "warning",
    completed: "success",
    shared: "info",
    approved: "success",
    declined: "destructive",
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">INSPECTION HUB</h2>
          <p className="text-muted-foreground mt-1">
            Digital vehicle health reports and safety certifications.
          </p>
        </div>
        <Button 
          onClick={onCreate}
          className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 px-8 h-12"
        >
          <Plus className="mr-2 h-5 w-5" /> Start New DVI
        </Button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-3"
      >
        <motion.div variants={item}>
            <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
                  <ClipboardList className="h-20 w-20 text-white" />
               </div>
               <CardContent className="p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Reports</p>
                  <h2 className="text-4xl font-black text-white mt-1">
                     {inspections?.filter(i => i.status === "in-progress").length || 0}
                  </h2>
               </CardContent>
            </Card>
        </motion.div>
        
        <motion.div variants={item}>
            <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
                  <CheckCircle2 className="h-20 w-20 text-emerald-500" />
               </div>
               <CardContent className="p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Completed Today</p>
                  <h2 className="text-4xl font-black text-white mt-1">
                     {inspections?.filter(i => i.status === "completed").length || 0}
                  </h2>
               </CardContent>
            </Card>
        </motion.div>

        <motion.div variants={item}>
            <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
                  <AlertTriangle className="h-20 w-20 text-amber-500" />
               </div>
               <CardContent className="p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Client Pending</p>
                  <h2 className="text-4xl font-black text-white mt-1">0</h2>
               </CardContent>
            </Card>
        </motion.div>
      </motion.div>

      <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
           <div>
              <CardTitle className="text-xl font-bold">Recent Inspections</CardTitle>
              <CardDescription>Track vehicle health history across your fleet.</CardDescription>
           </div>
           <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reports..." className="bg-white/5 border-white/5 pl-9 h-10 rounded-xl" />
           </div>
        </CardHeader>
        <CardContent>
          {inspections === undefined ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : !inspections || inspections.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
               <ClipboardList className="h-16 w-16 mx-auto mb-4 opacity-10" />
               <p className="text-lg">No inspections yet.</p>
               <Button variant="link" className="text-amber-500" onClick={onCreate}>Start your first report</Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-xs uppercase py-4">Report No.</TableHead>
                    <TableHead className="text-xs uppercase py-4">Status</TableHead>
                    <TableHead className="text-xs uppercase py-4">Customer</TableHead>
                    <TableHead className="text-xs uppercase py-4">Vehicle</TableHead>
                    <TableHead className="text-right text-xs uppercase py-4">Findings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.map((ins) => {
                     const failCount = ins.items?.filter(i => i.status === "immediate-attention").length || 0
                     const warnCount = ins.items?.filter(i => i.status === "attention").length || 0
                     
                     return (
                        <TableRow 
                          key={ins._id} 
                          className="cursor-pointer hover:bg-white/5 border-white/5 transition-all duration-300"
                          onClick={() => onOpen?.(ins._id)}
                        >
                          <TableCell className="py-4">
                             <div className="font-black text-white">{ins.inspectionNumber}</div>
                             <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="h-2 w-2" /> {format(new Date(ins._creationTime), "MMM d, h:mm a")}
                             </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={(statusColor[ins.status] as any) || "default"} className="capitalize px-3 py-0.5">
                              {ins.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/10">
                                   <User className="h-3 w-3 text-amber-500" />
                                </div>
                                <span className="text-sm font-medium text-white">{getCustomerName(ins.customerId)}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2">
                                <Car className="h-3 w-3 text-white/40" />
                                <span className="text-sm font-medium text-white">{getVehicleInfo(ins.vehicleId)}</span>
                             </div>
                          </TableCell>
                          <TableCell className="text-right">
                             <div className="flex justify-end gap-2">
                                {failCount > 0 && (
                                   <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/20 text-red-500 text-[10px] font-bold">
                                      <XCircle className="h-3 w-3" /> {failCount}
                                   </div>
                                )}
                                {warnCount > 0 && (
                                   <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/20 text-amber-500 text-[10px] font-bold">
                                      <AlertTriangle className="h-3 w-3" /> {warnCount}
                                   </div>
                                )}
                                {failCount === 0 && warnCount === 0 && ins.status === 'completed' && (
                                   <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                                      <CheckCircle2 className="h-3 w-3" /> CLEAN
                                   </div>
                                )}
                             </div>
                          </TableCell>
                        </TableRow>
                     )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default InspectionDashboard
