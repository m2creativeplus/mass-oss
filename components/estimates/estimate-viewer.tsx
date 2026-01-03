"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Printer, Download, ArrowLeft, Clock } from "lucide-react"

// Types
interface EstimateViewerProps {
  estimateId?: string
  onBack?: () => void
}

interface EstimateItem {
  id: string
  type: "part" | "labor" | "service"
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  approved: boolean
}

interface EstimateData {
  id: string
  number: string
  customerName: string
  vehicleInfo: string
  date: string
  expiryDate: string
  status: "draft" | "sent" | "viewed" | "approved" | "declined" | "expired"
  subtotal: number
  tax: number
  total: number
  items: EstimateItem[]
  notes?: string
}

// Mock data
const mockEstimate: EstimateData = {
  id: "est-001",
  number: "EST-2023-001",
  customerName: "Ahmed Hassan",
  vehicleInfo: "2018 Toyota Camry • Black • SOM-1234",
  date: "2023-06-15",
  expiryDate: "2023-06-30",
  status: "sent",
  subtotal: 285.0,
  tax: 14.25,
  total: 299.25,
  items: [
    {
      id: "item-1",
      type: "service",
      description: "Oil Change Service",
      quantity: 1,
      unitPrice: 45.0,
      totalPrice: 45.0,
      approved: false,
    },
    {
      id: "item-2",
      type: "part",
      description: "Oil Filter",
      quantity: 1,
      unitPrice: 15.0,
      totalPrice: 15.0,
      approved: false,
    },
    {
      id: "item-3",
      type: "labor",
      description: "Brake Inspection",
      quantity: 1,
      unitPrice: 75.0,
      totalPrice: 75.0,
      approved: false,
    },
    {
      id: "item-4",
      type: "part",
      description: "Front Brake Pads",
      quantity: 1,
      unitPrice: 150.0,
      totalPrice: 150.0,
      approved: false,
    },
  ],
  notes: "Customer requested to be notified before any additional work.",
}

// Status badge component
const StatusBadge = ({ status }: { status: EstimateData["status"] }) => {
  const statusConfig = {
    draft: { label: "Draft", variant: "outline" },
    sent: { label: "Sent", variant: "secondary" },
    viewed: { label: "Viewed", variant: "secondary" },
    approved: { label: "Approved", variant: "success" },
    declined: { label: "Declined", variant: "destructive" },
    expired: { label: "Expired", variant: "outline" },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant as any}>{config.label}</Badge>
}

// Main component
export function EstimateViewer({ estimateId, onBack }: EstimateViewerProps) {
  const [estimate] = useState<EstimateData>(mockEstimate)
  const [approvedItems, setApprovedItems] = useState<string[]>([])

  // In a real app, we would fetch the estimate data based on estimateId

  const handleApproveItem = (itemId: string) => {
    setApprovedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleApproveAll = () => {
    setApprovedItems(estimate.items.map((item) => item.id))
  }

  const handleDeclineAll = () => {
    setApprovedItems([])
  }

  const isItemApproved = (itemId: string) => approvedItems.includes(itemId)

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Estimate #{estimate.number}</h1>
          <StatusBadge status={estimate.status} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Customer Information</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{estimate.customerName}</p>
              <p className="text-sm text-muted-foreground">{estimate.vehicleInfo}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Created: {estimate.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Expires: {estimate.expiryDate}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Approve</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimate.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.totalPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant={isItemApproved(item.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleApproveItem(item.id)}
                    >
                      {isItemApproved(item.id) ? <CheckCircle className="h-4 w-4" /> : "Approve"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>${estimate.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax (5%):</span>
                <span>${estimate.tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2 font-bold">
                <span>Total:</span>
                <span>${estimate.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {estimate.notes && (
            <div className="mt-6 bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-sm">{estimate.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDeclineAll}>
            <XCircle className="mr-2 h-4 w-4" />
            Decline All
          </Button>
          <Button onClick={handleApproveAll}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve All
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Default export
export default EstimateViewer
