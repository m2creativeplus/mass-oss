"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, Edit, Printer, Clock, CheckCircle2, AlertCircle, Wrench } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface JobCard {
  id: string
  jobNumber: string
  vehicle: string
  customer: string
  technician: string
  status: "draft" | "in-progress" | "completed" | "invoiced"
  startDate: string
  estimatedCost: number
}

// Removed mockJobCards

const statusConfig = {
  draft: { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: Clock, label: "Draft" },
  "in-progress": { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Wrench, label: "In Progress" },
  completed: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2, label: "Completed" },
  invoiced: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: AlertCircle, label: "Invoiced" },
}

interface JobCardDashboardProps {
  onCreate?: () => void
  onView?: (id: string) => void
  onEdit?: (id: string) => void
}

export function JobCardDashboard({ onCreate, onView, onEdit, orgId = "mass-hargeisa" }: JobCardDashboardProps & { orgId?: string }) {
  const workOrdersQuery = useQuery(api.functions.getWorkOrders, { orgId });
  
  const mappedJobCards: JobCard[] = (workOrdersQuery || []).map((w: any) => {
    let mappedStatus: JobCard["status"] = "draft";
    if (["in-progress", "waiting-parts"].includes(w.status)) mappedStatus = "in-progress";
    if (w.status === "complete") mappedStatus = "completed";
    if (w.status === "invoiced") mappedStatus = "invoiced";
    
    return {
      id: w._id,
      jobNumber: w.jobNumber,
      vehicle: "Vehicle Info Pending", // Needs populated join
      customer: "Customer Info Pending", // Needs populated join
      technician: "Technician Pending", // Needs populated join
      status: mappedStatus,
      startDate: new Date(w._creationTime).toLocaleDateString(),
      estimatedCost: 0
    }
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Cards</h1>
          <p className="text-muted-foreground">Manage workshop job cards and repair orders</p>
        </div>
        <Button onClick={onCreate} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Job Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = mappedJobCards.filter(j => j.status === status).length
          const Icon = config.icon
          return (
            <Card key={status} className="glass-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{config.label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <Icon className="h-8 w-8 text-muted-foreground" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Job Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job #</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappedJobCards.map((job) => {
                const config = statusConfig[job.status]
                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.jobNumber}</TableCell>
                    <TableCell>{job.vehicle}</TableCell>
                    <TableCell>{job.customer}</TableCell>
                    <TableCell>{job.technician}</TableCell>
                    <TableCell>
                      <Badge className={config.color}>{config.label}</Badge>
                    </TableCell>
                    <TableCell>{job.startDate}</TableCell>
                    <TableCell className="text-right">${job.estimatedCost}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onView?.(job.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit?.(job.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default JobCardDashboard
