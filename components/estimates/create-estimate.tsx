"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Minus,
  Calculator,
  Save,
  ArrowLeft,
  Trash2,
  User,
  Car,
  AlertCircle
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface LineItem {
  id: string
  type: "part" | "labor" | "service" | "misc"
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  isApproved: boolean
}

interface CreateEstimateProps {
  onBack: () => void
}

export function CreateEstimate({ onBack }: CreateEstimateProps) {
  const orgId = "mass-hargeisa"
  
  // Convex Hooks
  const customers = useQuery(api.functions.getCustomers, { orgId })
  const allVehicles = useQuery(api.functions.getVehicles, { orgId })
  const createEstimateMutation = useMutation(api.functions.createEstimate)

  // State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("")
  const [workDescription, setWorkDescription] = useState("")
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", type: "labor", description: "Standard Diagnostics", quantity: 1, unitPrice: 45, totalPrice: 45, isApproved: true }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Memoized Filtered Vehicles
  const filteredVehicles = useMemo(() => {
    if (!selectedCustomerId) return []
    return allVehicles?.filter(v => v.customerId === selectedCustomerId) || []
  }, [selectedCustomerId, allVehicles])

  // Reset vehicle when customer changes
  useEffect(() => {
    setSelectedVehicleId("")
  }, [selectedCustomerId])

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0)
    const taxAmount = subtotal * 0.05 // 5% matching backend logic
    const totalAmount = subtotal + taxAmount
    return { subtotal, taxAmount, totalAmount }
  }

  const { subtotal, taxAmount, totalAmount } = calculateTotals()

  const addLineItem = (type: LineItem["type"]) => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      isApproved: true
    }
    setLineItems([...lineItems, newItem])
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        // Recalculate total for this item
        if (field === "quantity" || field === "unitPrice") {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    }))
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return
    setLineItems(lineItems.filter(item => item.id !== id))
  }

  const handleSave = async () => {
    if (!selectedCustomerId || !selectedVehicleId) {
      toast.error("Please select a customer and vehicle")
      return
    }

    if (lineItems.some(item => !item.description || item.unitPrice <= 0)) {
      toast.error("Please complete all line items")
      return
    }

    setIsSubmitting(true)
    try {
      await createEstimateMutation({
        orgId,
        customerId: selectedCustomerId as any,
        vehicleId: selectedVehicleId as any,
        workDescription,
        lineItems: lineItems.map(({ type, description, quantity, unitPrice, totalPrice, isApproved }) => ({
          type, description, quantity, unitPrice, totalPrice, isApproved
        }))
      })
      toast.success("Estimate created successfully")
      onBack()
    } catch (error) {
      console.error(error)
      toast.error("Failed to create estimate")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotes
        </Button>
        <div className="flex gap-3">
          <Button 
            disabled={isSubmitting}
            onClick={handleSave}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/10 px-6"
          >
            {isSubmitting ? "Creating..." : (
              <><Save className="mr-2 h-4 w-4" /> Save & Send Quote</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Vehicle */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-4 w-4 text-amber-500" /> Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Customer</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Search customers..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                    {customers?.map(c => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.firstName} {c.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <AnimatePresence mode="wait">
                {selectedCustomerId && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-2 border-t border-white/5 overflow-hidden"
                  >
                    <Label className="text-xs text-muted-foreground uppercase opacity-50">Select Vehicle</Label>
                    <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select vehicle..." />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        {filteredVehicles.length > 0 ? (
                          filteredVehicles.map(v => (
                            <SelectItem key={v._id} value={v._id}>
                              {v.year} {v.make} {v.model} ({v.licensePlate})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No vehicles found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
              <CardDescription>Internal or customer-facing notes</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="What is the problem? Diagnostics needed..."
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                className="min-h-[120px] bg-white/5 border-white/10 focus:border-amber-500/50"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Line Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Line Items</CardTitle>
                <CardDescription>Parts and labor operations</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => addLineItem("labor")} className="border-white/10 hover:bg-white/5">
                  <Plus className="mr-1 h-3 w-3" /> Labor
                </Button>
                <Button size="sm" variant="outline" onClick={() => addLineItem("part")} className="border-white/10 hover:bg-white/5">
                  <Plus className="mr-1 h-3 w-3" /> Part
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {lineItems.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider opacity-50">
                            {item.type}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeLineItem(item.id)}
                            className="h-6 w-6 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 md:hidden"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input 
                          placeholder={item.type === "part" ? "Part Name / SKU" : "Labor Description"}
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                          className="bg-transparent border-none p-0 focus-visible:ring-0 text-md font-medium placeholder:opacity-30"
                        />
                      </div>
                      
                      <div className="flex gap-4 items-end">
                        <div className="w-20 space-y-1">
                          <Label className="text-[10px] uppercase opacity-50">Qty</Label>
                          <Input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                            className="bg-black/20 border-white/5 h-9"
                          />
                        </div>
                        <div className="w-28 space-y-1">
                          <Label className="text-[10px] uppercase opacity-50">Unit Price</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-muted-foreground">$</span>
                            <Input 
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                              className="bg-black/20 border-white/5 h-9 pl-6"
                            />
                          </div>
                        </div>
                        <div className="w-24 px-2 py-2 text-right">
                          <p className="text-[10px] uppercase opacity-30">Total</p>
                          <p className="font-bold text-amber-500">${item.totalPrice.toFixed(2)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeLineItem(item.id)}
                          className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center text-muted-foreground text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground text-sm">
                  <span>Tax (5.0%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5 text-amber-500" /> Total Cost
                  </span>
                  <span className="text-amber-500">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {(!selectedCustomerId || !selectedVehicleId) && (
            <div className="flex items-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
              <AlertCircle className="mr-2 h-4 w-4" />
              You must select a customer and vehicle before saving this quote.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateEstimate
