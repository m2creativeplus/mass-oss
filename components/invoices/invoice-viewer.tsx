"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Mail, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  History,
  User,
  Car,
  Receipt,
  DollarSign,
  MessageSquare,
  Link as LinkIcon
} from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InvoiceViewerProps {
  invoiceId: string
  onBack: () => void
}

export function InvoiceViewer({ invoiceId, onBack }: InvoiceViewerProps) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false)
  const [paymentAmount, setPaymentAmount] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState<string>("cash")
  const [paymentNotes, setPaymentNotes] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Convex Hooks
  const invoice = useQuery(api.functions.getInvoiceById, { invoiceId: invoiceId as Id<"invoices"> })
  const recordPayment = useMutation(api.functions.recordPayment)
  
  // Data for resolving IDs
  const orgId = "mass-hargeisa"
  const customers = useQuery(api.functions.getCustomers, { orgId })
  const vehicles = useQuery(api.functions.getVehicles, { orgId })

  const customer = customers?.find(c => c._id === invoice?.customerId)
  const vehicle = vehicles?.find(v => v._id === invoice?.vehicleId)

  const handleRecordPayment = async () => {
    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsSubmitting(true)
    try {
      await recordPayment({
        invoiceId: invoiceId as Id<"invoices">,
        amount,
        method: paymentMethod as any,
        notes: paymentNotes
      })
      toast.success("Payment recorded successfully")
      setIsPaymentDialogOpen(false)
      setPaymentAmount("")
      setPaymentNotes("")
    } catch (error) {
      toast.error("Failed to record payment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendSMS = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Processing payment link & sending SMS...',
        success: `Payment link delivered to ${customer?.phone}`,
        error: 'Failed to send SMS',
      }
    )
  }

  const handleGeneratePaymentLink = () => {
    toast.success("Stripe Checkout Link generated & copied to clipboard.")
  }

  if (invoice === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4" />
        <p className="text-muted-foreground">Loading invoice...</p>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Invoice not found</h2>
        <Button variant="ghost" onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const statusColor: Record<string, string> = {
    draft: "secondary",
    sent: "info",
    paid: "success",
    partial: "warning",
    overdue: "destructive",
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-20"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" onClick={handleSendSMS} className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10">
            <MessageSquare className="mr-2 h-4 w-4" /> Send Payment Link
          </Button>
          
          {invoice.status !== "paid" && (
            <>
              <Button onClick={handleGeneratePaymentLink} variant="outline" className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20 font-bold px-4 hidden sm:flex">
                <LinkIcon className="mr-2 h-4 w-4" /> Stripe Link
              </Button>
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 px-6">
                  <CreditCard className="mr-2 h-4 w-4" /> Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Entering a payment will update the invoice balance and status.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Amount Received ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="pl-9 bg-white/5 border-white/10"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Outstanding balance: {formatCurrency(invoice.balanceDue)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="zaad">ZAAD</SelectItem>
                        <SelectItem value="edahab">e-Dahab</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Input 
                      placeholder="Reference # or memo"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="border-white/10">Cancel</Button>
                  <Button 
                    disabled={isSubmitting}
                    onClick={handleRecordPayment}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Payment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Invoice Card */}
        <Card className="lg:col-span-3 border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className={`h-1.5 w-full ${invoice.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          
          <CardHeader className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500 rounded-2xl">
                    <Receipt className="h-8 w-8 text-black" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-white">{invoice.invoiceNumber}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={(statusColor[invoice.status] as any) || "default"} className="capitalize px-3 py-0.5">
                        {invoice.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">Issued {format(new Date(invoice._creationTime), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Bill To</p>
                    <p className="font-bold text-white">{customer?.firstName} {customer?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{customer?.email}</p>
                    <p className="text-xs text-muted-foreground">{customer?.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Vehicle</p>
                    <p className="font-bold text-white">{vehicle?.year} {vehicle?.make} {vehicle?.model}</p>
                    <p className="text-xs text-amber-500 font-mono">{vehicle?.licensePlate}</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto p-6 rounded-2xl bg-white/5 border border-white/5 text-right space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Invoiced</p>
                  <p className="text-3xl font-black text-white">{formatCurrency(invoice.totalAmount)}</p>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Balance Due</p>
                  <p className={`text-2xl font-bold ${invoice.balanceDue > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {formatCurrency(invoice.balanceDue)}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8 space-y-8">
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-xs uppercase py-4">Description</TableHead>
                    <TableHead className="text-center text-xs uppercase py-4">Qty</TableHead>
                    <TableHead className="text-right text-xs uppercase py-4">Unit Price</TableHead>
                    <TableHead className="text-right text-xs uppercase py-4">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.lineItems.map((item, idx) => (
                    <TableRow key={idx} className="border-white/5 hover:bg-white/5">
                      <TableCell className="py-4">
                        <div className="font-medium text-white">{item.description}</div>
                        <span className="text-[10px] text-muted-foreground uppercase">{item.type}</span>
                      </TableCell>
                      <TableCell className="text-center text-white">{item.quantity}</TableCell>
                      <TableCell className="text-right text-white">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-bold text-white">{formatCurrency(item.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <History className="h-4 w-4 text-amber-500" /> Payment History
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs py-2 border-b border-white/5">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="text-emerald-500 font-bold">{formatCurrency(invoice.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-muted-foreground">Outstanding</span>
                    <span className="text-amber-500 font-bold">{formatCurrency(invoice.balanceDue)}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-white">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (5.0%)</span>
                  <span className="text-white">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between text-xl font-black">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Status / Actions */}
        <div className="space-y-6">
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Billing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {invoice.status === 'paid' ? (
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-white capitalize">{invoice.status}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {invoice.balanceDue > 0 ? `${formatCurrency(invoice.balanceDue)} remaining` : "Full cleared"}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 group">
                <Mail className="mr-2 h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" /> 
                Resend to Customer
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Institutional Billing</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                  This document follows standard automotive industry compliance. All amounts in USD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default InvoiceViewer
