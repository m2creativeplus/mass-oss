"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Plus, 
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Smartphone,
  DollarSign,
  Receipt,
  Search,
  Package,
  CheckCircle2,
  Loader2,
  FileText,
  Download
} from "lucide-react"
import { processPayment } from "@/lib/payments"
import { generateInvoicePDF, downloadInvoice } from "@/lib/pdf-invoice"
import { AuditLog } from "@/lib/activity-logs"
import { inventoryData } from "@/lib/data"

// Use real inventory data
const partsInventory = inventoryData.map(part => ({
  id: part.id,
  name: part.name,
  sku: part.partNumber,
  price: part.price,
  stock: part.stock,
  category: part.category
}))

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

type PaymentMethod = "cash" | "zaad" | "edahab" | "card"

export function PartSellsModule() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [processing, setProcessing] = useState(false)
  const [saleComplete, setSaleComplete] = useState(false)
  const [customerPhone, setCustomerPhone] = useState("")
  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null)
  const [paymentResult, setPaymentResult] = useState<{ transactionId: string; message: string } | null>(null)

  const filteredParts = partsInventory.filter(part =>
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToCart = (part: typeof partsInventory[0]) => {
    const existing = cart.find(item => item.id === part.id)
    if (existing) {
      setCart(cart.map(item => 
        item.id === part.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { id: part.id, name: part.name, price: part.price, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.05 // 5% tax
  const total = subtotal + tax

  const processSale = async () => {
    setProcessing(true)
    setPaymentResult(null)
    
    const invoiceId = `INV-${Date.now().toString(36).toUpperCase()}`
    
    try {
      // Process payment via API
      const result = await processPayment(paymentMethod, {
        amount: total,
        currency: 'USD',
        customerPhone: customerPhone || '+252-63-0000000',
        description: `MASS Workshop - ${cart.length} items`,
        invoiceId
      })
      
      setPaymentResult({ transactionId: result.transactionId, message: result.message })
      
      // Log the activity
      AuditLog.processPayment('system', 'POS User', 'staff', invoiceId, total, paymentMethod)
      
      setLastInvoiceId(invoiceId)
      setSaleComplete(true)
      
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentResult({ transactionId: '', message: 'Payment failed. Please try again.' })
    } finally {
      setProcessing(false)
    }
  }
  
  const handleDownloadInvoice = async () => {
    if (!lastInvoiceId) return
    
    const invoiceData = {
      invoiceNumber: lastInvoiceId,
      date: new Date().toLocaleDateString(),
      dueDate: new Date().toLocaleDateString(),
      customerName: 'Walk-in Customer',
      customerPhone: customerPhone || '+252-63-0000000',
      vehiclePlate: 'N/A',
      vehicleModel: 'Parts Sale',
      items: cart.map(item => ({
        description: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity
      })),
      subtotal,
      tax,
      total,
      paymentMethod,
      notes: paymentResult?.transactionId ? `Transaction: ${paymentResult.transactionId}` : undefined
    }
    
    const blob = await generateInvoicePDF(invoiceData)
    downloadInvoice(blob, `${lastInvoiceId}.pdf`)
    
    AuditLog.printInvoice('system', 'POS User', 'staff', lastInvoiceId)
  }
  
  const resetSale = () => {
    setCart([])
    setSaleComplete(false)
    setLastInvoiceId(null)
    setPaymentResult(null)
    setCustomerPhone("")
  }

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case "cash": return <DollarSign className="h-5 w-5" />
      case "zaad": return <Smartphone className="h-5 w-5" />
      case "edahab": return <Smartphone className="h-5 w-5" />
      case "card": return <CreditCard className="h-5 w-5" />
    }
  }

  // Barcode integration logic
  const handleBarcodeScan = (code: string) => {
    const part = partsInventory.find(p => p.sku === code || p.sku.endsWith(code) || p.id === code)
    if (part) {
      addToCart(part)
      return true
    }
    return false
  }

  return (
    <div className="h-full flex bg-slate-50 dark:bg-slate-950">
      
      {/* Left Side - Product Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
            Part Sells / POS
          </h2>
        </div>

        {/* Search Bar & Barcode */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-10 h-12 text-lg" 
              placeholder="Search parts by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-1/3">
             <Input 
               className="h-12 border-orange-500/50 focus:border-orange-500" 
               placeholder="Scan Barcode (Enter SKU)"
               onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                   const success = handleBarcodeScan(e.currentTarget.value)
                   if (success) {
                      e.currentTarget.value = ''
                   }
                 }
               }}
             />
          </div>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredParts.map((part) => (
            <Card 
              key={part.id}
              className="cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all duration-200"
              onClick={() => addToCart(part)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-center h-16 bg-slate-100 dark:bg-slate-800 rounded-lg mb-3">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="font-medium text-sm line-clamp-2 mb-1">{part.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{part.sku}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-600">${part.price}</span>
                  <Badge variant="outline" className="text-xs">
                    {part.stock} in stock
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Side - Cart & Payment */}
      <div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
        
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange-500" />
            <h3 className="font-bold text-lg">Current Sale</h3>
            <Badge className="ml-auto bg-orange-500">{cart.length} items</Badge>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No items in cart</p>
              <p className="text-sm">Click on a part to add it</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-orange-600 font-semibold">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center font-bold">{item.quantity}</span>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-red-500 hover:text-red-600"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4">
          
          {/* Customer Phone for Mobile Payments */}
          {(paymentMethod === "zaad" || paymentMethod === "edahab") && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">Customer Phone</p>
              <Input 
                placeholder="+252-63-XXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="h-10"
              />
            </div>
          )}
          
          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tax (5%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-orange-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Payment Method</p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={paymentMethod === "cash" ? "default" : "outline"}
                className={paymentMethod === "cash" ? "bg-orange-500 hover:bg-orange-600" : ""}
                onClick={() => setPaymentMethod("cash")}
                disabled={saleComplete}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Cash
              </Button>
              <Button 
                variant={paymentMethod === "zaad" ? "default" : "outline"}
                className={paymentMethod === "zaad" ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setPaymentMethod("zaad")}
                disabled={saleComplete}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Zaad
              </Button>
              <Button 
                variant={paymentMethod === "edahab" ? "default" : "outline"}
                className={paymentMethod === "edahab" ? "bg-blue-600 hover:bg-blue-700" : ""}
                onClick={() => setPaymentMethod("edahab")}
                disabled={saleComplete}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                e-Dahab
              </Button>
              <Button 
                variant={paymentMethod === "card" ? "default" : "outline"}
                className={paymentMethod === "card" ? "bg-slate-800 hover:bg-slate-900" : ""}
                onClick={() => setPaymentMethod("card")}
                disabled={saleComplete}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Card
              </Button>
            </div>
          </div>

          {/* Payment Result */}
          {paymentResult && (
            <div className={`text-xs p-3 rounded ${paymentResult.transactionId ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-red-50 dark:bg-red-900/20 text-red-700'}`}>
              <p className="font-medium">{paymentResult.message}</p>
              {paymentResult.transactionId && (
                <p className="mt-1">ID: {paymentResult.transactionId}</p>
              )}
            </div>
          )}

          {/* Process Payment Button */}
          {!saleComplete ? (
            <Button 
              className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white"
              disabled={cart.length === 0 || processing}
              onClick={processSale}
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing {paymentMethod === 'zaad' ? 'Zaad' : paymentMethod === 'edahab' ? 'e-Dahab' : ''}...
                </>
              ) : (
                <>
                  <Receipt className="h-5 w-5 mr-2" />
                  Complete Sale (${total.toFixed(2)})
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button 
                className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white"
                onClick={handleDownloadInvoice}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Invoice PDF
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={resetSale}
              >
                New Sale
              </Button>
            </div>
          )}

          {/* Zaad/eDahab Payment Info */}
          {(paymentMethod === "zaad" || paymentMethod === "edahab") && !saleComplete && (
            <div className="text-xs text-center text-slate-500 p-2 bg-slate-50 dark:bg-slate-800 rounded">
              <p className="font-medium">Payment will be processed via {paymentMethod === "zaad" ? "Zaad" : "e-Dahab"}</p>
              <p>Customer will receive USSD prompt on their phone</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PartSellsModule
