"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  CheckCircle, 
  XCircle, 
  Printer, 
  Download, 
  ArrowLeft, 
  Clock, 
  User, 
  Car, 
  FileText,
  Calendar,
  ShieldCheck,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface EstimateViewerProps {
  estimateId: string
  onBack: () => void
}

export function EstimateViewer({ estimateId, onBack }: EstimateViewerProps) {
  // Convex Hooks
  const estimate = useQuery(api.functions.getEstimateById, { estimateId: estimateId as Id<"estimates"> })
  const updateStatus = useMutation(api.functions.updateEstimateStatus)
  
  // Data for resolving IDs
  const orgId = "mass-hargeisa"
  const customers = useQuery(api.functions.getCustomers, { orgId })
  const vehicles = useQuery(api.functions.getVehicles, { orgId })

  const customer = customers?.find(c => c._id === estimate?.customerId)
  const vehicle = vehicles?.find(v => v._id === estimate?.vehicleId)

  const handleStatusUpdate = async (status: "approved" | "declined") => {
    try {
      await updateStatus({ estimateId: estimateId as Id<"estimates">, status })
      toast.success(`Estimate ${status} successfully`)
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  if (estimate === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Clock className="h-10 w-10 text-amber-500 mb-4 h-spin" />
        <p className="text-muted-foreground">Loading estimate details...</p>
      </div>
    )
  }

  if (!estimate) {
    return (
      <Card className="max-w-md mx-auto mt-20 border-red-500/20 bg-red-500/5">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold">Estimate not found</h3>
          <p className="text-muted-foreground mb-4">The estimate you are trying to view no longer exists.</p>
          <Button onClick={onBack} variant="outline">Back to Dashboard</Button>
        </CardContent>
      </Card>
    )
  }

  const statusColor: Record<string, string> = {
    draft: "secondary",
    sent: "warning",
    viewed: "info",
    approved: "success",
    declined: "destructive",
    expired: "destructive",
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Estimates
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          {estimate.status !== "approved" && estimate.status !== "declined" && (
            <>
              <Button 
                variant="destructive" 
                onClick={() => handleStatusUpdate("declined")}
                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"
              >
                <XCircle className="mr-2 h-4 w-4" /> Decline
              </Button>
              <Button 
                onClick={() => handleStatusUpdate("approved")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
          <CardHeader className="flex flex-row justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl font-bold">{estimate.estimateNumber}</CardTitle>
                <Badge variant={(statusColor[estimate.status] as any) || "default"} className="capitalize">
                  {estimate.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" /> 
                Created on {format(new Date(estimate._creationTime), "MMMM d, yyyy")}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Amount</p>
              <p className="text-3xl font-black text-amber-500">{formatCurrency(estimate.totalAmount)}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-[50%]">Item & Description</TableHead>
                  <TableHead className="text-center">Qty/Hrs</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimate.lineItems.map((item: any, idx: number) => (
                  <TableRow key={idx} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="font-medium">{item.description}</div>
                      <Badge variant="outline" className="text-[10px] uppercase mt-1 opacity-50">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono">{item.quantity}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right font-bold text-white">{formatCurrency(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <div className="w-full sm:w-64 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(estimate.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (5.0%)</span>
                  <span>{formatCurrency(estimate.taxAmount)}</span>
                </div>
                <Separator className="bg-white/10 my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Due</span>
                  <span className="text-amber-500">{formatCurrency(estimate.totalAmount)}</span>
                </div>
              </div>
            </div>

            {estimate.workDescription && (
              <div className="pt-6 border-t border-white/5 space-y-2">
                <h4 className="text-sm font-semibold flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-amber-500/50" /> Notes & Work Description
                </h4>
                <p className="text-sm text-muted-foreground bg-white/5 p-4 rounded-xl border border-white/5 italic">
                  "{estimate.workDescription}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="mr-2 h-4 w-4 text-amber-500/50" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer ? (
                <div className="space-y-1">
                  <p className="font-bold text-lg">{customer.firstName} {customer.lastName}</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  <p className="text-xs text-muted-foreground mt-2 opacity-50">{customer.address}</p>
                </div>
              ) : (
                <div className="animate-pulse h-12 bg-white/5 rounded-md" />
              )}
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Car className="mr-2 h-4 w-4 text-amber-500/50" /> Vehicle Detail
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle ? (
                <div className="space-y-1">
                  <p className="font-bold text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-amber-500 font-mono">{vehicle.licensePlate}</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-[10px] text-muted-foreground uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Inspected by Tech
                  </div>
                </div>
              ) : (
                <div className="animate-pulse h-12 bg-white/5 rounded-md" />
              )}
            </CardContent>
          </Card>
          
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-4">
             <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                   <p className="text-sm font-bold text-amber-200">Quote Accuracy Guarantee</p>
                   <p className="text-xs text-amber-200/60 leading-relaxed mt-1">
                      This estimate is valid for 15 days. Final price may vary slightly based on unforeseen mechanical discoveries.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EstimateViewer
