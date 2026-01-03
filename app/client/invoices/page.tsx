"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, CreditCard, Filter } from "lucide-react"

// Mock invoice data
const invoices = [
  {
    id: "INV-2021",
    date: "Dec 12, 2025",
    vehicle: "Nissan Patrol",
    service: "Regular Service (10k)",
    amount: "$350.00",
    status: "Paid",
    dueDate: "Dec 12, 2025"
  },
  {
    id: "INV-1840",
    date: "Oct 05, 2025",
    vehicle: "Toyota Land Cruiser",
    service: "Battery Replacement",
    amount: "$120.00",
    status: "Paid",
    dueDate: "Oct 05, 2025"
  },
  {
    id: "INV-1533",
    date: "Aug 18, 2025",
    vehicle: "Toyota Land Cruiser",
    service: "Brake Pads Front",
    amount: "$85.00",
    status: "Paid",
    dueDate: "Aug 18, 2025"
  },
]

export default function ClientInvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Invoices & Payments</h1>
          <p className="text-slate-500 dark:text-slate-400">View your payment history and download receipts.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vehicle & Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium text-blue-600">{invoice.id}</TableCell>
                <TableCell className="text-slate-500">{invoice.date}</TableCell>
                <TableCell>
                  <div className="font-medium">{invoice.vehicle}</div>
                  <div className="text-xs text-slate-500">{invoice.service}</div>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {invoice.status}
                   </Badge>
                </TableCell>
                <TableCell className="text-right font-bold">{invoice.amount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4 text-slate-500" />
                    </Button>
                    {invoice.status === 'Unpaid' && (
                       <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8">
                         Pay
                       </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {/* Payment methods section - simplified */}
      <div className="mt-8">
         <h2 className="text-xl font-bold mb-4">Saved Payment Methods</h2>
         <Card className="p-6 flex items-center justify-between bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
               <div className="h-12 w-16 bg-white border rounded flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-slate-700" />
               </div>
               <div>
                  <p className="font-bold">Visa ending in 4242</p>
                  <p className="text-sm text-slate-500">Expires 12/28</p>
               </div>
            </div>
            <Button variant="outline">Remove</Button>
         </Card>
      </div>
    </div>
  )
}
