"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Search, 
  Plus, 
  ShoppingCart,
  Eye,
  Pencil,
  Trash2,
  Filter,
  X,
  Check,
  AlertTriangle,
  Package,
  DollarSign,
  Hash
} from "lucide-react"

interface InventoryItem {
  id: string
  image: string
  name: string
  condition: string
  sku: string
  quantity: number
  price: number
  warranty: string
  status: string
}

// Mock inventory data
const mockInventory: InventoryItem[] = [
  { id: "P-001", image: "https://images.unsplash.com/photo-1627483262769-04d0a1401487?auto=format&fit=crop&w=150&q=80", name: "Engine Oil 5W-30", condition: "New", sku: "OIL-5W30-4L", quantity: 45, price: 45, warranty: "1 Year", status: "Active" },
  { id: "P-002", image: "https://images.unsplash.com/photo-1600003014303-375F05a00a16?auto=format&fit=crop&w=150&q=80", name: "Brake Pads (Front)", condition: "New", sku: "BP-FRONT-001", quantity: 8, price: 150, warranty: "6 Months", status: "Active" },
  { id: "P-003", image: "https://images.unsplash.com/photo-1548611716-3e488ff20023?auto=format&fit=crop&w=150&q=80", name: "Alternator (Rebuilt)", condition: "Used", sku: "ALT-REB-001", quantity: 2, price: 85, warranty: "3 Months", status: "Active" },
  { id: "P-004", image: "", name: "Air Filter", condition: "New", sku: "AF-UNV-001", quantity: 25, price: 15, warranty: "6 Months", status: "Active" },
  { id: "P-005", image: "", name: "Spark Plugs (Set of 4)", condition: "New", sku: "SP-SET4-001", quantity: 30, price: 35, warranty: "1 Year", status: "Active" },
]

const emptyPart = {
  name: "",
  sku: "",
  condition: "New",
  quantity: 0,
  price: 0,
  warranty: "6 Months",
}

const conditionOptions = ["New", "Used", "Refurbished"]
const warrantyOptions = ["None", "3 Months", "6 Months", "1 Year", "2 Years", "Lifetime"]

export function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [inventory, setInventory] = useState(mockInventory)
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [formData, setFormData] = useState(emptyPart)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    setFormData(emptyPart)
    setIsCreateOpen(true)
  }

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      sku: item.sku,
      condition: item.condition,
      quantity: item.quantity,
      price: item.price,
      warranty: item.warranty,
    })
    setIsEditOpen(true)
  }

  const handleView = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsViewOpen(true)
  }

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  const submitCreate = () => {
    const newItem: InventoryItem = {
      id: `P-${String(Date.now()).slice(-4)}`,
      image: "",
      ...formData,
      status: "Active",
    }
    setInventory([...inventory, newItem])
    setIsCreateOpen(false)
    setFormData(emptyPart)
  }

  const submitEdit = () => {
    if (!selectedItem) return
    setInventory(inventory.map(i => 
      i.id === selectedItem.id ? { ...i, ...formData } : i
    ))
    setIsEditOpen(false)
    setSelectedItem(null)
  }

  const submitDelete = () => {
    if (!selectedItem) return
    setInventory(inventory.filter(i => i.id !== selectedItem.id))
    setIsDeleteOpen(false)
    setSelectedItem(null)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Parts Stock List
        </h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Parts
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-t-lg border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Show</span>
          <select className="border border-slate-300 rounded px-2 py-1 text-sm bg-transparent">
            <option>10</option><option>25</option><option>50</option>
          </select>
          <span className="text-sm text-slate-600">entries</span>
        </div>
        <div className="relative w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Search:</span>
          <Input className="pl-16 h-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-b-lg border border-t-0 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">Image</th>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Condition</th>
              <th className="px-6 py-4 font-bold">Quantity</th>
              <th className="px-6 py-4 font-bold">Sell Price</th>
              <th className="px-6 py-4 font-bold">Warranty</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-3">
                  <div className="h-10 w-10 rounded overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-slate-400" />}
                  </div>
                </td>
                <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">
                  {item.name}
                  <div className="text-xs text-slate-500 font-normal">{item.sku}</div>
                </td>
                <td className="px-6 py-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${item.condition === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-6 py-3 font-semibold">{item.quantity}</td>
                <td className="px-6 py-3 font-bold text-emerald-600">${item.price}</td>
                <td className="px-6 py-3 text-slate-600">{item.warranty}</td>
                <td className="px-6 py-3"><Badge className="bg-green-500 hover:bg-green-600">{item.status}</Badge></td>
                <td className="px-6 py-3">
                  <div className="flex justify-center gap-2">
                    <Button size="icon" className="h-8 w-8 bg-[#00c0ef] hover:bg-[#00acd6] text-white rounded shadow-sm" onClick={() => handleView(item)}>
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-8 w-8 bg-[#f39c12] hover:bg-[#d58512] text-white rounded shadow-sm" onClick={() => handleView(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-8 w-8 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded shadow-sm" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-8 w-8 bg-[#dd4b39] hover:bg-[#d73925] text-white rounded shadow-sm" onClick={() => handleDelete(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center sm:px-6">
          <div className="text-xs text-slate-500">Showing 1 to {filteredInventory.length} of {inventory.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs" disabled>Previous</Button>
            <Button size="sm" className="h-7 text-xs bg-blue-500 text-white hover:bg-blue-600">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
          </div>
        </div>
      </div>

      {/* CREATE PART DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-green-500" /> Add New Part</DialogTitle>
            <DialogDescription>Enter part details to add to inventory</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div><Label>Part Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Engine Oil 5W-30" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>SKU *</Label><Input value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} placeholder="OIL-5W30-4L" /></div>
              <div><Label>Condition</Label><select className="w-full border rounded-md p-2" value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}>{conditionOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Quantity</Label><Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} /></div>
              <div><Label>Price ($)</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})} /></div>
              <div><Label>Warranty</Label><select className="w-full border rounded-md p-2" value={formData.warranty} onChange={(e) => setFormData({...formData, warranty: e.target.value})}>{warrantyOptions.map(w => <option key={w} value={w}>{w}</option>)}</select></div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}><X className="h-4 w-4 mr-2" /> Cancel</Button>
            <Button className="bg-green-500 hover:bg-green-600" onClick={submitCreate} disabled={!formData.name || !formData.sku}>
              <Check className="h-4 w-4 mr-2" /> Add Part
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT PART DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Pencil className="h-5 w-5 text-blue-500" /> Edit Part</DialogTitle></DialogHeader>
          
          <div className="space-y-4 py-4">
            <div><Label>Part Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Quantity</Label><Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} /></div>
              <div><Label>Price ($)</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})} /></div>
              <div><Label>Warranty</Label><select className="w-full border rounded-md p-2" value={formData.warranty} onChange={(e) => setFormData({...formData, warranty: e.target.value})}>{warrantyOptions.map(w => <option key={w} value={w}>{w}</option>)}</select></div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={submitEdit}><Check className="h-4 w-4 mr-2" /> Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW PART DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-orange-500" /> Part Details</DialogTitle></DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center">
                  {selectedItem.image ? <img src={selectedItem.image} alt="" className="h-full w-full object-cover rounded-lg" /> : <Package className="h-8 w-8 text-slate-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedItem.name}</h3>
                  <p className="text-sm text-slate-500 font-mono">{selectedItem.sku}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div><p className="text-xs text-slate-500">Quantity</p><p className="text-xl font-bold">{selectedItem.quantity}</p></div>
                <div><p className="text-xs text-slate-500">Price</p><p className="text-xl font-bold text-emerald-500">${selectedItem.price}</p></div>
                <div><p className="text-xs text-slate-500">Condition</p><p className="font-medium">{selectedItem.condition}</p></div>
                <div><p className="text-xs text-slate-500">Warranty</p><p className="font-medium">{selectedItem.warranty}</p></div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => { setIsViewOpen(false); if (selectedItem) handleEdit(selectedItem); }}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500"><AlertTriangle className="h-5 w-5" /> Delete Part</DialogTitle>
            <DialogDescription>Are you sure you want to remove this item from inventory?</DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="py-4">
              <p className="font-bold">{selectedItem.name}</p>
              <p className="text-sm text-slate-500 font-mono">{selectedItem.sku}</p>
              <p className="text-xs text-red-500 mt-2">This action cannot be undone.</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={submitDelete}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

