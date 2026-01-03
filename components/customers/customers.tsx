"use client"

import { useState } from "react"
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
  Plus, 
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Users,
  MapPin,
  Calendar,
  X,
  Check,
  AlertTriangle
} from "lucide-react"
// Convex Imports
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  vehicles: number
  totalSpent: number
  lastVisit: string
  status: "active" | "inactive"
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    firstName: "Mohamed",
    lastName: "Ahmed",
    email: "mohamed.ahmed@email.com",
    phone: "+252 61 234 5678",
    address: "Hargeisa, Somaliland",
    vehicles: 2,
    totalSpent: 4500,
    lastVisit: "2025-12-20",
    status: "active"
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Hassan",
    email: "sarah.hassan@email.com",
    phone: "+252 63 345 6789",
    vehicles: 1,
    totalSpent: 2300,
    lastVisit: "2025-12-18",
    status: "active"
  },
  {
    id: "3",
    firstName: "Ahmed",
    lastName: "Ali",
    email: "ahmed.ali@email.com",
    phone: "+252 62 456 7890",
    vehicles: 3,
    totalSpent: 8900,
    lastVisit: "2025-11-30",
    status: "inactive"
  },
  {
    id: "4",
    firstName: "Fatima",
    lastName: "Omar",
    email: "fatima.omar@email.com",
    phone: "+252 65 567 8901",
    vehicles: 1,
    totalSpent: 1200,
    lastVisit: "2025-12-28",
    status: "active"
  },
]

// Empty customer for new entries
const emptyCustomer = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
}

export function Customers({ orgId }: { orgId: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Detemine if Demo Mode
  const isDemo = orgId.startsWith("demo-")

  // Convex Hooks
  const convexCustomers = useQuery(api.functions.getCustomers, isDemo ? "skip" : { orgId })
  const createCustomer = useMutation(api.functions.addCustomer)
  const updateCustomer = useMutation(api.functions.updateCustomer)
  const deleteCustomer = useMutation(api.functions.deleteCustomer)

  // Demo State (for demo users only)
  const [demoCustomers, setDemoCustomers] = useState(mockCustomers)

  // Effective Data
  // Map Convex _id to id for UI consistency
  const activeCustomers = isDemo ? demoCustomers : (convexCustomers || []).map(c => ({
    ...c,
    id: c._id,
    // Ensure numeric fields are numbers (Convex might return them as numbers, UI expects numbers)
    // Add missing fields if schema is optional
    vehicles: 0, // TODO: Fetch vehicle count separately or join
    totalSpent: 0, // TODO: Fetch
    lastVisit: (c as any)._creationTime ? new Date((c as any)._creationTime).toISOString() : new Date().toISOString(), 
    status: (c.isActive ? 'active' : 'inactive') as "active" | "inactive"
  }))

  const isLoading = !isDemo && convexCustomers === undefined

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  
  // Form state
  const [formData, setFormData] = useState(emptyCustomer)

  const filteredCustomers = activeCustomers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.phone || "").includes(searchQuery)
  )

  const handleCreate = () => {
    setFormData(emptyCustomer)
    setIsCreateOpen(true)
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || "",
    })
    setIsEditOpen(true)
  }

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsViewOpen(true)
  }

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteOpen(true)
  }

  const submitCreate = async () => {
    if (isDemo) {
      const newCustomer: Customer = {
        id: String(Date.now()),
        ...formData,
        vehicles: 0,
        totalSpent: 0,
        lastVisit: new Date().toISOString().split("T")[0],
        status: "active",
      }
      setDemoCustomers([...demoCustomers, newCustomer])
    } else {
      await createCustomer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        country: "Somaliland", // Default or add to form
        city: "Hargeisa",      // Default or add to form
        orgId
      })
    }
    setIsCreateOpen(false)
    setFormData(emptyCustomer)
  }

  const submitEdit = async () => {
    if (!selectedCustomer) return
    
    if (isDemo) {
      setDemoCustomers(demoCustomers.map(c => 
        c.id === selectedCustomer.id 
          ? { ...c, ...formData }
          : c
      ))
    } else {
      await updateCustomer({
        id: selectedCustomer.id as Id<"customers">,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      })
    }
    setIsEditOpen(false)
    setSelectedCustomer(null)
  }

  const submitDelete = async () => {
    if (!selectedCustomer) return
    
    if (isDemo) {
      setDemoCustomers(demoCustomers.filter(c => c.id !== selectedCustomer.id))
    } else {
      await deleteCustomer({ id: selectedCustomer.id as Id<"customers"> })
    }
    setIsDeleteOpen(false)
    setSelectedCustomer(null)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Customer List
        </h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            className="bg-[#00A65A] hover:bg-[#008d4c] text-white"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-t-lg border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Show</span>
          <select className="border border-slate-300 rounded px-2 py-1 text-sm bg-transparent">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span className="text-sm text-slate-600">entries</span>
        </div>
        
        <div className="relative w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Search:</span>
          <Input 
            className="pl-16 h-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-b-lg border border-t-0 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">Avatar</th>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Contact</th>
              <th className="px-6 py-4 font-bold">Vehicles</th>
              <th className="px-6 py-4 font-bold">Total Spent</th>
              <th className="px-6 py-4 font-bold">Last Visit</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow">
                    {customer.firstName[0]}{customer.lastName[0]}
                  </div>
                </td>
                <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">
                  {customer.firstName} {customer.lastName}
                  {customer.address && (
                    <div className="text-xs text-slate-500 font-normal">{customer.address}</div>
                  )}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold">
                    <Users className="h-4 w-4 text-blue-500" />
                    {customer.vehicles}
                  </span>
                </td>
                <td className="px-6 py-3 font-bold text-emerald-600">
                  ${customer.totalSpent.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-slate-600">
                  {new Date(customer.lastVisit).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <Badge className={customer.status === 'active' 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-slate-400 hover:bg-slate-500"
                  }>
                    {customer.status}
                  </Badge>
                </td>
                <td className="px-6 py-3">
                  <div className="flex justify-center gap-2">
                    <Button 
                      size="icon" 
                      className="h-8 w-8 bg-[#f39c12] hover:bg-[#d58512] text-white rounded shadow-sm"
                      onClick={() => handleView(customer)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="h-8 w-8 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded shadow-sm"
                      onClick={() => handleEdit(customer)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="h-8 w-8 bg-[#dd4b39] hover:bg-[#d73925] text-white rounded shadow-sm"
                      onClick={() => handleDelete(customer)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center sm:px-6">
           <div className="text-xs text-slate-500">
             Showing 1 to {filteredCustomers.length} of {customers.length} entries
           </div>
           <div className="flex gap-1">
             <Button variant="outline" size="sm" className="h-7 text-xs" disabled>Previous</Button>
             <Button size="sm" className="h-7 text-xs bg-blue-500 text-white hover:bg-blue-600">1</Button>
             <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
           </div>
        </div>
      </div>

      {/* CREATE CUSTOMER DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-500" />
              Add New Customer
            </DialogTitle>
            <DialogDescription>
              Enter customer details to create a new record
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="Mohamed"
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Ahmed"
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="customer@email.com"
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+252 63 XXX XXXX"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Hargeisa, Somaliland"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={submitCreate}
              disabled={!formData.firstName || !formData.lastName || !formData.phone}
            >
              <Check className="h-4 w-4 mr-2" /> Create Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT CUSTOMER DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-blue-500" />
              Edit Customer
            </DialogTitle>
            <DialogDescription>
              Update customer information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={submitEdit}
            >
              <Check className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW CUSTOMER DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-500" />
              Customer Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                  {selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                  <Badge className={selectedCustomer.status === 'active' ? "bg-green-500" : "bg-slate-400"}>
                    {selectedCustomer.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-sm">{selectedCustomer.phone}</span>
                </div>
                {selectedCustomer.address && (
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{selectedCustomer.address}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">{selectedCustomer.vehicles}</p>
                  <p className="text-xs text-slate-500">Vehicles</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-500">${selectedCustomer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">{new Date(selectedCustomer.lastVisit).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-500">Last Visit</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                setIsViewOpen(false)
                if (selectedCustomer) handleEdit(selectedCustomer)
              }}
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer?
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="py-4">
              <p className="font-semibold">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
              <p className="text-sm text-slate-500">{selectedCustomer.email}</p>
              <p className="text-xs text-red-500 mt-2">This action cannot be undone.</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600"
              onClick={submitDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

