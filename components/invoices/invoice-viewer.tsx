"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer, Mail } from "lucide-react"
import { useRef } from "react"

interface InvoiceViewerProps {
  invoiceId?: string
  onBack?: () => void
}

const mockInvoice = {
  number: "INV-2024-001",
  date: "2025-12-31",
  dueDate: "2026-01-15",
  customer: { name: "Mohamed Ahmed", email: "mohamed@email.com", phone: "+252 61 234 5678", address: "Hargeisa, Somaliland" },
  vehicle: { make: "Toyota", model: "Land Cruiser 79", plate: "SL-82307-T", vin: "JTM8R5EV5JD789012" },
  items: [
    { category: "Observation Charges", description: "Tyre Condition Check", qty: 2, unitPrice: 5000, total: 10000 },
    { category: "Service Charges", description: "Oil Change Service", qty: 1, unitPrice: 3500, total: 3500 },
    { category: "MOT Test", description: "Full MOT Inspection", qty: 1, unitPrice: 0, total: 0 },
    { category: "Wash Bay", description: "Full Detail Wash", qty: 1, unitPrice: 2500, total: 2500 },
  ],
  subtotal: 16000,
  taxRate: 5,
  taxAmount: 800,
  grandTotal: 16800,
}

export function InvoiceViewer({ onBack }: InvoiceViewerProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In production, use react-pdf or html2pdf
    alert("PDF download will be implemented with react-pdf library")
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Invoice {mockInvoice.number}</h1>
            <p className="text-muted-foreground">Generated on {mockInvoice.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Mail className="mr-2 h-4 w-4" /> Send to Customer
          </Button>
        </div>
      </div>

      <Card className="glass-card print:shadow-none" ref={printRef}>
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-orange-500">MASS</h2>
              <p className="text-sm text-muted-foreground">AUTOMOTIVE</p>
              <p className="text-sm mt-2">Hargeisa, Somaliland</p>
              <p className="text-sm">info@massauto.com</p>
            </div>
            <div className="text-right">
              <Badge className="bg-emerald-100 text-emerald-700 mb-2">PAID</Badge>
              <p className="font-semibold">Invoice: {mockInvoice.number}</p>
              <p className="text-sm text-muted-foreground">Date: {mockInvoice.date}</p>
              <p className="text-sm text-muted-foreground">Due: {mockInvoice.dueDate}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Customer & Vehicle Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">BILL TO</h3>
              <p className="font-semibold">{mockInvoice.customer.name}</p>
              <p className="text-sm">{mockInvoice.customer.email}</p>
              <p className="text-sm">{mockInvoice.customer.phone}</p>
              <p className="text-sm">{mockInvoice.customer.address}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">VEHICLE</h3>
              <p className="font-semibold">{mockInvoice.vehicle.make} {mockInvoice.vehicle.model}</p>
              <p className="text-sm">Plate: {mockInvoice.vehicle.plate}</p>
              <p className="text-sm">VIN: {mockInvoice.vehicle.vin}</p>
            </div>
          </div>

          {/* Line Items */}
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoice.items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">{item.qty}</TableCell>
                  <TableCell className="text-right">{item.unitPrice.toLocaleString()} SL</TableCell>
                  <TableCell className="text-right">{item.total.toLocaleString()} SL</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="flex justify-end mt-6">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{mockInvoice.subtotal.toLocaleString()} SL</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax ({mockInvoice.taxRate}%):</span>
                <span>{mockInvoice.taxAmount.toLocaleString()} SL</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span className="text-orange-500">{mockInvoice.grandTotal.toLocaleString()} SL</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Thank you for choosing MASS Automotive!</p>
            <p>For questions, contact us at support@massauto.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InvoiceViewer
