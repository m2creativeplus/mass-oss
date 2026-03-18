"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  PlayCircle,
  Truck,
  CheckSquare
} from "lucide-react"
import { toast } from "sonner"

export default function MechanicPortal() {
  const orgId = "mass-hargeisa"
  
  // Queries
  const workOrders = useQuery(api.functions.getWorkOrders, { orgId })
  const users = useQuery(api.functions.getUsers)
  const vehicles = useQuery(api.functions.getVehicles, { orgId })
  
  // Mutations
  const updateJobStatus = useMutation(api.functions.updateWorkOrderStatus)
  const completeJob = useMutation(api.engines.completeJob)
  const moveToQualityCheck = useMutation(api.engines.moveToQualityCheck)
  
  // Select the first mechanic for demo purposes
  const mechanic = users?.find(u => u.role === "technician")
  
  const [activeJobId, setActiveJobId] = useState<string | null>(null)

  if (workOrders === undefined || users === undefined || vehicles === undefined) {
    return <div className="p-8 text-center animate-pulse text-slate-400">Loading your jobs...</div>
  }

  if (!mechanic) {
    return <div className="p-8 text-center text-rose-500">Error: No technician profile found.</div>
  }

  // Jobs assigned to this mechanic
  const myAssignedJobs = workOrders.filter(job => 
    job.technicianId === mechanic._id && 
    ["in-progress", "inspecting", "waiting-parts", "awaiting-approval"].includes(job.status)
  )

  const handleStartJob = async (jobId: string) => {
    try {
      await updateJobStatus({ id: jobId as any, status: "in-progress" })
      toast.success("Job started successfully!")
    } catch (error) {
      toast.error("Failed to start job.")
    }
  }

  const handleNeedsParts = async (jobId: string) => {
    try {
      await updateJobStatus({ id: jobId as any, status: "waiting-parts" })
      toast.warning("Job paused. Parts requested.")
    } catch (error) {
      toast.error("Failed to update status.")
    }
  }

  const handleFinishJob = async (jobId: string) => {
    try {
      // Moves it to QC so the manager can approve it, per the workshop board logic
      await moveToQualityCheck({ workOrderId: jobId as any })
      toast.success("Job moved to Quality Check!")
    } catch (error) {
      toast.error("Failed to finish job.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress": return "bg-blue-600 text-white"
      case "waiting-parts": return "bg-rose-600 text-white"
      case "inspecting": return "bg-indigo-600 text-white"
      case "awaiting-approval": return "bg-amber-500 text-white"
      default: return "bg-slate-700 text-white"
    }
  }

  const getVehicleDisplay = (vehicleId: string) => {
    const v = vehicles.find(veh => veh._id === vehicleId)
    return v ? `${v.year} ${v.make} ${v.model} (${v.licensePlate})` : "Unknown Vehicle"
  }

  return (
    <div className="p-4 space-y-6">
      {/* Mechanic Welcome Card */}
      <Card className="bg-slate-900 border-none shadow-lg text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <div className="w-12 h-12 rounded-full border-2 border-orange-500 overflow-hidden flex items-center justify-center bg-slate-800 text-lg font-bold">
              {mechanic.firstName[0]}{mechanic.lastName[0]}
            </div>
            <div>
              <p className="text-lg">Welcome back, {mechanic.firstName}</p>
              <p className="text-sm font-normal text-slate-400">You have {myAssignedJobs.length} active jobs</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Active Jobs List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">Your Active Tasks</h3>
        
        {myAssignedJobs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 border border-dashed border-slate-700 rounded-lg">
            <CheckCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No active jobs assigned to you right now.</p>
          </div>
        ) : (
          myAssignedJobs.map(job => (
            <Card key={job._id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="border-orange-500 text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-950/20">
                    {job.jobNumber}
                  </Badge>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status.replace("-", " ")}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight text-slate-800 dark:text-white">
                  {getVehicleDisplay(job.vehicleId)}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                <div className="flex items-start gap-2">
                  <Wrench className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                  <ul className="list-disc pl-4 space-y-1">
                    {job.services.map((service, idx) => (
                      <li key={idx} className="capitalize">{service}</li>
                    ))}
                  </ul>
                </div>
                
                {job.customerComplaint && (
                  <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded text-slate-700 dark:text-slate-300">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                    <p className="italic">"{job.customerComplaint}"</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 pt-0">
                {job.status === "awaiting-approval" || job.status === "inspecting" ? (
                  <Button 
                    className="w-full bg-[#00A65A] hover:bg-[#008d4c] text-white font-bold h-12"
                    onClick={() => handleStartJob(job._id)}
                  >
                    <PlayCircle className="w-5 h-5 mr-2" /> Start Repair
                  </Button>
                ) : job.status === "in-progress" ? (
                  <>
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12"
                      onClick={() => handleFinishJob(job._id)}
                    >
                      <CheckSquare className="w-5 h-5 mr-2" /> Finish & Move to QC
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 h-10"
                      onClick={() => handleNeedsParts(job._id)}
                    >
                      <Truck className="w-4 h-4 mr-2" /> Need Parts
                    </Button>
                  </>
                ) : job.status === "waiting-parts" ? (
                  <Button 
                    className="w-full bg-[#00A65A] hover:bg-[#008d4c] text-white font-bold h-12"
                    onClick={() => handleStartJob(job._id)}
                  >
                    <PlayCircle className="w-5 h-5 mr-2" /> Resume (Parts Arrived)
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
