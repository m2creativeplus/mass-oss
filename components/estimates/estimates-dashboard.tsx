"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { FileText, Plus, TrendingUp, CheckCircle, Clock, XCircle, Download } from "lucide-react"
import { motion } from "framer-motion"
import { generateEstimatePDF, downloadEstimate } from "@/lib/pdf-estimate"
import { toast } from "sonner"

export interface EstimatesDashboardProps {
  onCreate?: () => void
  onOpen?: (id: string) => void
}

export function EstimatesDashboard({ onCreate, onOpen }: EstimatesDashboardProps) {
  // Use a fixed orgId for the demo (matching MASS OSS org created in seed)
  const orgId = "mass-hargeisa" // In a real app this would come from auth context

  const estimates = useQuery(api.functions.getEstimates, { orgId })
  const customers = useQuery(api.functions.getCustomers, { orgId })
  const vehicles = useQuery(api.functions.getVehicles, { orgId })

  const handleDownloadPDF = async (est: any) => {
    try {
      const customer = customers?.find(c => c._id === est.customerId)
      const vehicle = vehicles?.find(v => v._id === est.vehicleId)
      const blob = await generateEstimatePDF({
        estimateNumber: est.estimateNumber || "EST-000",
        date: est._creationTime ? format(new Date(est._creationTime), "MMM d, yyyy") : "N/A",
        validUntil: est.validUntil || "30 days",
        customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Customer",
        customerPhone: customer?.phone || "",
        customerEmail: customer?.email,
        vehiclePlate: vehicle?.licensePlate || "",
        vehicleModel: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "",
        items: (est.lineItems || []).map((li: any) => ({
          description: li.description || li.name || "Service",
          quantity: li.quantity || 1,
          unitPrice: li.unitPrice || li.rate || 0,
          total: (li.quantity || 1) * (li.unitPrice || li.rate || 0),
          type: li.type || "labor",
        })),
        subtotal: est.subtotal || est.totalAmount || 0,
        tax: est.taxAmount || 0,
        total: est.totalAmount || 0,
        notes: est.notes,
        status: est.status || "draft",
      })
      downloadEstimate(blob, `${est.estimateNumber || "estimate"}.pdf`)
      toast.success(`Downloaded ${est.estimateNumber}.pdf`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate PDF")
    }
  }

  // KPI Calculations
  const totalEstimates = estimates?.length || 0
  const totalValue = estimates?.reduce((sum, est) => sum + (est.totalAmount || 0), 0) || 0
  const approvedCount = estimates?.filter(e => e.status === "approved").length || 0
  const pendingCount = estimates?.filter(e => e.status === "sent" || e.status === "viewed" || e.status === "draft").length || 0

  const statusColor: Record<string, string> = {
    draft: "secondary",
    sent: "warning",
    viewed: "info",
    approved: "success",
    declined: "destructive",
    expired: "destructive",
    revised: "secondary",
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const kpis = [
    { title: "Total Estimates", value: totalEstimates, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Value Pipeline", value: formatCurrency(totalValue), icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Approved", value: approvedCount, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Pending Response", value: pendingCount, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
          <h2 className="text-3xl font-bold tracking-tight">Estimates & Quotes</h2>
          <p className="text-muted-foreground mt-1">
            Manage customer quotes, approvals, and service estimates.
          </p>
        </div>
        <Button onClick={onCreate} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-lg shadow-amber-500/20">
          <Plus className="mr-2 h-4 w-4" /> New Estimate
        </Button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {kpis.map((kpi, index) => (
          <motion.div key={index} variants={item}>
            <Card className="border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold tracking-tight">{kpi.value}</h2>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle>Recent Estimates</CardTitle>
          <CardDescription>A list of the most recent estimates created in your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {estimates === undefined ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : estimates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
              <FileText className="h-12 w-12 mb-4 opacity-20" />
              <p>No estimates found.</p>
              <Button variant="link" onClick={onCreate} className="mt-2 text-amber-500">Create your first estimate</Button>
            </div>
          ) : (
            <div className="rounded-md border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Estimate No.</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Vehicle ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estimates.map((est) => (
                    <TableRow 
                      key={est._id} 
                      className="cursor-pointer hover:bg-white/5 border-white/5 transition-colors"
                      onClick={() => onOpen?.(est._id)}
                    >
                      <TableCell className="font-medium">{est.estimateNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{est.customerId}</TableCell>
                      <TableCell className="text-muted-foreground">{est.vehicleId}</TableCell>
                      <TableCell>
                        <Badge variant={(statusColor[est.status] as any) || "default"} className="capitalize">
                          {est.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize ${est.priority === 'urgent' ? 'border-red-500 text-red-500' : ''}`}>
                          {est.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(est.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {est._creationTime ? format(new Date(est._creationTime), "MMM d, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-amber-500/10 hover:text-amber-500 h-8 w-8 p-0"
                          onClick={(e) => { e.stopPropagation(); handleDownloadPDF(est) }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EstimatesDashboard
