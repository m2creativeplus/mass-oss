"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Receipt, Plus, DollarSign, AlertCircle, CheckCircle2, Clock, Download } from "lucide-react"
import { motion } from "framer-motion"
import { generateInvoicePDF, downloadInvoice } from "@/lib/pdf-invoice"
import { toast } from "sonner"

export interface InvoicesDashboardProps {
  onOpen?: (id: string) => void
}

export function InvoicesDashboard({ onOpen }: InvoicesDashboardProps) {
  const orgId = "mass-hargeisa"
  const invoices = useQuery(api.functions.getInvoices, { orgId })
  const customers = useQuery(api.functions.getCustomers, { orgId })
  const vehicles = useQuery(api.functions.getVehicles, { orgId })

  const handleDownloadPDF = async (inv: any) => {
    try {
      const customer = customers?.find(c => c._id === inv.customerId)
      const vehicle = vehicles?.find(v => v._id === inv.vehicleId)
      const blob = await generateInvoicePDF({
        invoiceNumber: inv.invoiceNumber || "INV-000",
        date: inv._creationTime ? format(new Date(inv._creationTime), "MMM d, yyyy") : "N/A",
        dueDate: inv.dueDate || "On Receipt",
        customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Customer",
        customerPhone: customer?.phone || "",
        customerEmail: customer?.email,
        vehiclePlate: vehicle?.licensePlate || "",
        vehicleModel: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "",
        items: (inv.lineItems || []).map((li: any) => ({
          description: li.description || li.name || "Service",
          quantity: li.quantity || 1,
          unitPrice: li.unitPrice || li.rate || 0,
          total: (li.quantity || 1) * (li.unitPrice || li.rate || 0),
        })),
        subtotal: inv.subtotal || inv.totalAmount || 0,
        tax: inv.taxAmount || 0,
        total: inv.totalAmount || 0,
        paymentMethod: (inv.paymentMethod as any) || "cash",
        notes: inv.notes,
      })
      downloadInvoice(blob, `${inv.invoiceNumber || "invoice"}.pdf`)
      toast.success(`Downloaded ${inv.invoiceNumber}.pdf`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate PDF")
    }
  }

  // KPI Calculations
  const totalInvoiced = invoices?.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0) || 0
  const totalPaid = invoices?.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0) || 0
  const totalBalance = invoices?.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0) || 0
  const overdueCount = invoices?.filter(inv => inv.status === "overdue").length || 0

  const statusColor: Record<string, string> = {
    draft: "secondary",
    sent: "info",
    paid: "success",
    partial: "warning",
    overdue: "destructive",
    cancelled: "secondary",
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const kpis = [
    { title: "Total Invoiced", value: formatCurrency(totalInvoiced), icon: Receipt, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Collected", value: formatCurrency(totalPaid), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Outstanding Balance", value: formatCurrency(totalBalance), icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Overdue Invoices", value: overdueCount, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
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

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Invoices & Billing</h2>
          <p className="text-muted-foreground mt-1">
            Track payments, manage balances, and view financial records.
          </p>
        </div>
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
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold tracking-tight text-white">{kpi.value}</h2>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle>Billing Records</CardTitle>
          <CardDescription>All invoices generated for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices === undefined ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
              <Receipt className="h-12 w-12 mb-4 opacity-20" />
              <p>No invoices found. Generate one from an approved estimate.</p>
            </div>
          ) : (
            <div className="rounded-md border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Balance Due</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow 
                      key={inv._id} 
                      className="cursor-pointer hover:bg-white/5 border-white/5 transition-colors"
                      onClick={() => onOpen?.(inv._id)}
                    >
                      <TableCell className="font-medium text-white">{inv.invoiceNumber}</TableCell>
                      <TableCell>
                        <Badge variant={(statusColor[inv.status] as any) || "default"} className="capitalize">
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-white">
                        {formatCurrency(inv.totalAmount)}
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${inv.balanceDue > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {formatCurrency(inv.balanceDue)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {inv._creationTime ? format(new Date(inv._creationTime), "MMM d, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-amber-500/10 hover:text-amber-500 h-8 w-8 p-0"
                          onClick={(e) => { e.stopPropagation(); handleDownloadPDF(inv) }}
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

export default InvoicesDashboard
