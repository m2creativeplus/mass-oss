"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Minus,
  Calculator,
  Save,
  Printer,
  Send,
  ArrowLeft,
  Trash2
} from "lucide-react"
import { useState, useEffect } from "react"

interface LineItem {
  id: string
  type: "part" | "labor"
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export function CreateEstimate() {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      type: "part",
      description: "Engine Oil Filter",
      quantity: 1,
      unitPrice: 15.00,
      total: 15.00
    }
  ])
  
  const [laborRate, setLaborRate] = useState(75.00) // Per hour
  const [taxRate, setTaxRate] = useState(10) // Percentage
  const [discount, setDiscount] = useState(0)

  const addLineItem = (type: "part" | "labor") => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      type,
      description: "",
      quantity: 1,
      unitPrice: type === "labor" ? laborRate : 0,
      total: 0
    }
    setLineItems([...lineItems, newItem])
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(items => items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        updated.total = updated.quantity * updated.unitPrice
        return updated
      }
      return item
    }))
  }

  const removeLineItem = (id: string) => {
    setLineItems(items => items.filter(item => item.id !== id))
  }

  // Calculations
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const discountAmount = subtotal * (discount / 100)
  const subtotalAfterDiscount = subtotal - discountAmount
  const taxAmount = subtotalAfterDiscount * (taxRate / 100)
  const grandTotal = subtotalAfterDiscount + taxAmount

  const partsTotal = lineItems.filter(i => i.type === "part").reduce((sum, item) => sum + item.total, 0)
  const laborTotal = lineItems.filter(i => i.type === "labor").reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Estimate</h1>
          <p className="text-muted-foreground mt-1">Generate detailed service estimates with automatic calculations</p>
        </div>
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Vehicle Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Customer & Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Select Customer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Mohamed Ahmed - Toyota Land Cruiser (ABC-1234)</SelectItem>
                    <SelectItem value="2">Sarah Hassan - Honda Civic (XYZ-5678)</SelectItem>
                    <SelectItem value="3">Ahmed Ali - Ford F-150 (DEF-9012)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Estimate Date</Label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              
              <div>
                <Label>Valid Until</Label>
                <Input type="date" />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Service Items</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => addLineItem("part")} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Part
                  </Button>
                  <Button size="sm" onClick={() => addLineItem("labor")} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Labor
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 p-4 rounded-lg bg-muted/50 items-start">
                    <div className="col-span-1 flex items-center justify-center pt-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        item.type === "part" 
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}>
                        {item.type === "part" ? "P" : "L"}
                      </div>
                    </div>
                    
                    <div className="col-span-5">
                      <Input
                        placeholder={item.type === "part" ? "Part description..." : "Labor description..."}
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, "quantity", Number(e.target.value))}
                        min="1"
                        step="0.1"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, "unitPrice", Number(e.target.value))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="col-span-1 flex items-center justify-end pt-2">
                      <p className="font-bold">${item.total.toFixed(2)}</p>
                    </div>
                    
                    <div className="col-span-1 flex items-center justify-center pt-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeLineItem(item.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {lineItems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No items added yet. Click "Add Part" or "Add Labor" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Add any special instructions, warranty information, or customer notes..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card className="glass-card sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Price Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Parts & Labor Breakdown */}
              <div className="space-y-2 pb-3 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Parts Total</span>
                  <span className="font-medium">${partsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Labor Total</span>
                  <span className="font-medium">${laborTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="1"
                />
                {discount > 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    -${discountAmount.toFixed(2)} discount applied
                  </p>
                )}
              </div>

              {/* Tax */}
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground">
                  +${taxAmount.toFixed(2)} tax
                </p>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Grand Total</span>
                  <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  <Save className="mr-2 h-4 w-4" />
                  Save Estimate
                </Button>
                <Button className="w-full" variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Send to Customer
                </Button>
                <Button className="w-full" variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Labor Rate Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm">Labor Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-xs">Hourly Rate ($)</Label>
              <Input
                type="number"
                value={laborRate}
                onChange={(e) => setLaborRate(Number(e.target.value))}
                min="0"
                step="0.01"
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
