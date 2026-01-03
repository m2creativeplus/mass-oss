"use client"

import { useState, useEffect } from "react"
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
  Wrench,
  Car,
  Clock,
  CheckCircle2,
  User,
  AlertTriangle,
  X,
  Check,
  Phone
} from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

// Work Order statuses with colors
const STATUSES: Record<string, { label: string; color: string }> = {
  "check-in": { label: "Check-In", color: "bg-blue-500" },
  "inspecting": { label: "Inspecting", color: "bg-yellow-500" },
  "awaiting-approval": { label: "Awaiting Approval", color: "bg-orange-500" },
  "in-progress": { label: "In Progress", color: "bg-purple-500" },
  "waiting-parts": { label: "Waiting Parts", color: "bg-indigo-500" },
  "complete": { label: "Complete", color: "bg-green-500" },
  "invoiced": { label: "Invoiced", color: "bg-emerald-600" },
  "cancelled": { label: "Cancelled", color: "bg-red-500" },
}

interface WorkOrder {
  id: string
  _id?: string
  status: string
  vehicle: { make: string; model: string; year: number; plate: string }
  customer: { name: string; phone: string }
  checkinDate: string
  services: string[]
  assignedTech: string
  priority: "low" | "normal" | "high" | "urgent"
  estimate?: number
}

// Mock work orders data for demo mode
const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-001",
    status: "check-in",
    vehicle: { make: "Toyota", model: "Camry", year: 2020, plate: "ABC-1234" },
    customer: { name: "Ahmed Hassan", phone: "+252-63-4567890" },
    checkinDate: "2024-12-26",
    services: ["Oil Change", "Brake Inspection"],
    assignedTech: "Mohamed Ali",
    priority: "normal"
  },
  {
    id: "WO-002",
    status: "inspecting",
    vehicle: { make: "Honda", model: "Civic", year: 2019, plate: "XYZ-5678" },
    customer: { name: "Fatima Omar", phone: "+252-63-7890123" },
    checkinDate: "2024-12-25",
    services: ["Full Service", "A/C Repair"],
    assignedTech: "Abdi Kareem",
    priority: "high"
  },
  {
    id: "WO-003",
    status: "in-progress",
    vehicle: { make: "Nissan", model: "Patrol", year: 2021, plate: "DEF-9012" },
    customer: { name: "Said Ibrahim", phone: "+252-63-2345678" },
    checkinDate: "2024-12-24",
    services: ["Engine Diagnostics", "Transmission Service"],
    assignedTech: "Mohamed Ali",
    priority: "urgent",
    estimate: 4500
  },
  {
    id: "WO-004",
    status: "awaiting-approval",
    vehicle: { make: "Toyota", model: "Land Cruiser", year: 2018, plate: "GHI-3456" },
    customer: { name: "Khadija Jama", phone: "+252-63-5678901" },
    checkinDate: "2024-12-25",
    services: ["Brake Replacement", "Tire Alignment"],
    assignedTech: "Abdi Kareem",
    priority: "normal",
    estimate: 2800
  },
  {
    id: "WO-005",
    status: "complete",
    vehicle: { make: "Hyundai", model: "Elantra", year: 2022, plate: "JKL-7890" },
    customer: { name: "Ali Yusuf", phone: "+252-63-8901234" },
    checkinDate: "2024-12-24",
    services: ["Oil Change", "Filter Replacement"],
    assignedTech: "Mohamed Ali",
    priority: "normal",
    estimate: 850
  },
]

// Available services
const availableServices = [
  "Oil Change", "Brake Inspection", "Brake Replacement", "Tire Alignment", 
  "A/C Repair", "A/C Service", "Engine Diagnostics", "Transmission Service",
  "Full Service", "Filter Replacement", "Battery Replacement", "Suspension Repair"
]

// Mock technicians
const technicians = ["Mohamed Ali", "Abdi Kareem", "Hassan Yusuf", "Ibrahim Ahmed"]

// Empty form state
const emptyForm = {
  customer: { name: "", phone: "" },
  vehicle: { make: "", model: "", year: new Date().getFullYear(), plate: "" },
  services: [] as string[],
  assignedTech: "",
  priority: "normal" as const,
  estimate: 0,
}

interface WorkOrdersKanbanProps {
  orgId?: string
}

export function WorkOrdersKanban({ orgId = "demo" }: WorkOrdersKanbanProps) {
  const isDemo = orgId.startsWith("demo-")
  
  // Convex Hooks
  const convexWorkOrders = useQuery(api.functions.getWorkOrders, isDemo ? "skip" : { orgId })
  const createWorkOrder = useMutation(api.functions.createWorkOrder)
  const updateWorkOrderStatus = useMutation(api.functions.updateWorkOrderStatus)
  const deleteWorkOrder = useMutation(api.functions.deleteWorkOrder)
  
  // Local State (for Demo Mode)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [localWorkOrders, setLocalWorkOrders] = useState(mockWorkOrders)
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null)
  
  // Form state
  const [formData, setFormData] = useState(emptyForm)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Effective Work Orders (Merge Demo + Real)
  const activeWorkOrders = isDemo ? localWorkOrders : (convexWorkOrders || []).map((wo: any) => ({
    id: wo.jobNumber || wo._id,
    _id: wo._id,
    status: wo.status,
    priority: wo.priority,
    checkinDate: wo.checkinDate,
    services: wo.services || [],
    assignedTech: wo.technicianId || "Unassigned", // TODO: Fetch User Name
    // Placeholder data until joins are implemented
    vehicle: { make: "Vehicle", model: "Info", year: 0, plate: "PLATE-123" }, 
    customer: { name: "Customer", phone: "555-0123" },
    estimate: wo.totalAmount || 0
  }))

  // NOTE: In a real implementation, we would need to join with Vehicle and Customer tables
  // For now, in real mode, we display basic info. Enhancing this would require backend joins or separate queries.

  const filteredOrders = activeWorkOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-500 hover:bg-red-600">Urgent</Badge>
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
      default:
        return <Badge className="bg-slate-400 hover:bg-slate-500">Normal</Badge>
    }
  }

  const handleCreate = () => {
    setFormData(emptyForm)
    setSelectedServices([])
    setIsCreateOpen(true)
  }

  const handleEdit = (order: WorkOrder) => {
    setSelectedOrder(order)
    setFormData({
      customer: { ...order.customer },
      vehicle: { ...order.vehicle },
      services: [...order.services],
      assignedTech: order.assignedTech,
      priority: order.priority,
      estimate: order.estimate || 0,
    })
    setSelectedServices(order.services)
    setIsEditOpen(true)
  }

  const handleView = (order: WorkOrder) => {
    setSelectedOrder(order)
    setIsViewOpen(true)
  }

  const handleDelete = (order: WorkOrder) => {
    setSelectedOrder(order)
    setIsDeleteOpen(true)
  }

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service))
    } else {
      setSelectedServices([...selectedServices, service])
    }
  }

  const submitCreate = async () => {
    if (isDemo) {
      const newOrder: WorkOrder = {
        id: `WO-${String(Date.now()).slice(-4)}`,
        status: "check-in",
        customer: formData.customer,
        vehicle: formData.vehicle,
        services: selectedServices,
        assignedTech: formData.assignedTech,
        priority: formData.priority,
        checkinDate: new Date().toISOString().split("T")[0],
        estimate: formData.estimate || undefined,
      }
      setLocalWorkOrders([newOrder, ...localWorkOrders])
    } else {
      // Real mutation TODO: Requires valid customerId and vehicleId from selection
      // For this task, we'll alert as we don't have vehicle/customer selection UI wired up fully yet
      alert("In full mode, you need to select existing customer/vehicle. This form needs expanding.")
      return
    }
    setIsCreateOpen(false)
    setFormData(emptyForm)
    setSelectedServices([])
  }

  const submitEdit = async () => {
    if (!selectedOrder) return
    
    if (isDemo) {
      setLocalWorkOrders(localWorkOrders.map(o => 
        o.id === selectedOrder.id 
          ? { 
              ...o, 
              customer: formData.customer,
              vehicle: formData.vehicle,
              services: selectedServices,
              assignedTech: formData.assignedTech,
              priority: formData.priority,
              estimate: formData.estimate || undefined,
            }
          : o
      ))
    } else {
       // Real mutation logic (simplified update)
       if (selectedOrder._id) {
         // await updateWorkOrder({ id: selectedOrder._id as Id<"workOrders">, ... })
       }
    }
    setIsEditOpen(false)
    setSelectedOrder(null)
  }

  const submitDelete = async () => {
    if (!selectedOrder) return
    
    if (isDemo) {
      setLocalWorkOrders(localWorkOrders.filter(o => o.id !== selectedOrder.id))
    } else {
      if (selectedOrder._id) {
        await deleteWorkOrder({ id: selectedOrder._id as Id<"workOrders"> })
      }
    }
    setIsDeleteOpen(false)
    setSelectedOrder(null)
  }

  const updateStatus = async (order: WorkOrder, newStatus: string) => {
    if (isDemo) {
      setLocalWorkOrders(localWorkOrders.map(o => 
        o.id === order.id ? { ...o, status: newStatus } : o
      ))
    } else {
      if (order._id) {
        await updateWorkOrderStatus({ id: order._id as Id<"workOrders">, status: newStatus as any })
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
            Repair Car / Work Orders
          </h2>
          {isDemo && <Badge variant="outline" className="mt-1 text-xs border-orange-500 text-orange-500">Demo Mode</Badge>}
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            className="bg-[#00A65A] hover:bg-[#008d4c] text-white"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Repair
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button 
          size="sm" 
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
          className={statusFilter === "all" ? "bg-slate-800" : ""}
        >
          All ({filteredOrders.length})
        </Button>
        {Object.entries(STATUSES).map(([key, value]) => (
          <Button 
            key={key}
            size="sm" 
            variant={statusFilter === key ? "default" : "outline"}
            onClick={() => setStatusFilter(key)}
            className={statusFilter === key ? value.color : ""}
          >
            {value.label} ({activeWorkOrders.filter(o => o.status === key).length})
          </Button>
        ))}
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
      <div className="bg-white dark:bg-slate-900 rounded-b-lg border border-t-0 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-4 py-4 font-bold">Order ID</th>
              <th className="px-4 py-4 font-bold">Vehicle</th>
              <th className="px-4 py-4 font-bold">Customer</th>
              <th className="px-4 py-4 font-bold">Services</th>
              <th className="px-4 py-4 font-bold">Technician</th>
              <th className="px-4 py-4 font-bold">Check-In</th>
              <th className="px-4 py-4 font-bold">Priority</th>
              <th className="px-4 py-4 font-bold">Status</th>
              <th className="px-4 py-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 font-bold text-blue-600">
                  {order.id}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {order.vehicle.year} {order.vehicle.make} {order.vehicle.model}
                      </div>
                      <div className="text-xs text-orange-600 font-mono">{order.vehicle.plate}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{order.customer.name}</div>
                  <div className="text-xs text-slate-500">{order.customer.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {order.services.slice(0, 2).map((service, i) => (
                      <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                        {service}
                      </span>
                    ))}
                    {order.services.length > 2 && (
                      <span className="text-xs text-slate-500">+{order.services.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
                    {order.assignedTech}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(order.checkinDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {getPriorityBadge(order.priority)}
                </td>
                <td className="px-4 py-3">
                  <Badge className={`${STATUSES[order.status]?.color || 'bg-gray-500'} hover:opacity-80`}>
                    {STATUSES[order.status]?.label || order.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    <Button 
                      size="icon" 
                      className="h-7 w-7 bg-[#00c0ef] hover:bg-[#00acd6] text-white rounded shadow-sm"
                      onClick={() => handleView(order)}
                    >
                      {order.status === "complete" ? <CheckCircle2 className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
                    </Button>
                    <Button 
                      size="icon" 
                      className="h-7 w-7 bg-[#f39c12] hover:bg-[#d58512] text-white rounded shadow-sm"
                      onClick={() => handleView(order)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="h-7 w-7 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded shadow-sm"
                      onClick={() => handleEdit(order)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="h-7 w-7 bg-[#dd4b39] hover:bg-[#d73925] text-white rounded shadow-sm"
                      onClick={() => handleDelete(order)}
                    >
                      <Trash2 className="h-3 w-3" />
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
             Showing 1 to {filteredOrders.length} of {activeWorkOrders.length} entries
           </div>
           <div className="flex gap-1">
             <Button variant="outline" size="sm" className="h-7 text-xs" disabled>Previous</Button>
             <Button size="sm" className="h-7 text-xs bg-blue-500 text-white hover:bg-blue-600">1</Button>
             <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
           </div>
        </div>
      </div>

      {/* CREATE WORK ORDER DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-500" />
              Create New Repair Order
            </DialogTitle>
            <DialogDescription>
              Enter vehicle and customer details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Customer Info */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" /> Customer Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name *</Label>
                  <Input 
                    value={formData.customer.name}
                    onChange={(e) => setFormData({
                      ...formData, 
                      customer: {...formData.customer, name: e.target.value}
                    })}
                    placeholder="Ahmed Hassan"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input 
                    value={formData.customer.phone}
                    onChange={(e) => setFormData({
                      ...formData, 
                      customer: {...formData.customer, phone: e.target.value}
                    })}
                    placeholder="+252-63-XXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Car className="h-4 w-4" /> Vehicle Information
              </h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Make *</Label>
                  <Input 
                    value={formData.vehicle.make}
                    onChange={(e) => setFormData({
                      ...formData, 
                      vehicle: {...formData.vehicle, make: e.target.value}
                    })}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <Label>Model *</Label>
                  <Input 
                    value={formData.vehicle.model}
                    onChange={(e) => setFormData({
                      ...formData, 
                      vehicle: {...formData.vehicle, model: e.target.value}
                    })}
                    placeholder="Camry"
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input 
                    type="number"
                    value={formData.vehicle.year}
                    onChange={(e) => setFormData({
                      ...formData, 
                      vehicle: {...formData.vehicle, year: parseInt(e.target.value)}
                    })}
                  />
                </div>
                <div>
                  <Label>Plate *</Label>
                  <Input 
                    value={formData.vehicle.plate}
                    onChange={(e) => setFormData({
                      ...formData, 
                      vehicle: {...formData.vehicle, plate: e.target.value}
                    })}
                    placeholder="ABC-1234"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4" /> Select Services
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableServices.map(service => (
                  <Button
                    key={service}
                    size="sm"
                    variant={selectedServices.includes(service) ? "default" : "outline"}
                    className={selectedServices.includes(service) ? "bg-orange-500 hover:bg-orange-600" : ""}
                    onClick={() => toggleService(service)}
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>

            {/* Assignment */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Assign Technician</Label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={formData.assignedTech}
                  onChange={(e) => setFormData({...formData, assignedTech: e.target.value})}
                >
                  <option value="">Select...</option>
                  {technicians.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <Label>Estimate (SL)</Label>
                <Input 
                  type="number"
                  value={formData.estimate || ""}
                  onChange={(e) => setFormData({...formData, estimate: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={submitCreate}
              disabled={!formData.customer.name || !formData.vehicle.make || !formData.vehicle.plate}
            >
              <Check className="h-4 w-4 mr-2" /> Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT WORK ORDER DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-blue-500" />
              Edit Work Order {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Name</Label>
                <Input 
                  value={formData.customer.name}
                  onChange={(e) => setFormData({
                    ...formData, 
                    customer: {...formData.customer, name: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  value={formData.customer.phone}
                  onChange={(e) => setFormData({
                    ...formData, 
                    customer: {...formData.customer, phone: e.target.value}
                  })}
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <Label>Services</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableServices.map(service => (
                  <Button
                    key={service}
                    size="sm"
                    variant={selectedServices.includes(service) ? "default" : "outline"}
                    className={selectedServices.includes(service) ? "bg-orange-500 hover:bg-orange-600" : ""}
                    onClick={() => toggleService(service)}
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>

            {/* Assignment */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Technician</Label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={formData.assignedTech}
                  onChange={(e) => setFormData({...formData, assignedTech: e.target.value})}
                >
                  {technicians.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <Label>Estimate (SL)</Label>
                <Input 
                  type="number"
                  value={formData.estimate || ""}
                  onChange={(e) => setFormData({...formData, estimate: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={submitEdit}>
              <Check className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW WORK ORDER DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-500" />
              Work Order Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">{selectedOrder.id}</h3>
                  <p className="text-sm text-slate-500">Created: {new Date(selectedOrder.checkinDate).toLocaleDateString()}</p>
                </div>
                <Badge className={`${STATUSES[selectedOrder.status]?.color} text-lg px-3 py-1`}>
                  {STATUSES[selectedOrder.status]?.label}
                </Badge>
              </div>

              {/* Vehicle */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Car className="h-8 w-8 text-slate-400" />
                  <div>
                    <p className="font-bold text-lg">
                      {selectedOrder.vehicle.year} {selectedOrder.vehicle.make} {selectedOrder.vehicle.model}
                    </p>
                    <p className="text-orange-500 font-mono">{selectedOrder.vehicle.plate}</p>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {selectedOrder.customer.phone}
                  </p>
                </div>
              </div>

              {/* Services */}
              <div>
                <p className="text-sm text-slate-500 mb-2">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.services.map((s, i) => (
                    <Badge key={i} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-slate-500">Technician</p>
                  <p className="font-medium">{selectedOrder.assignedTech}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Priority</p>
                  {getPriorityBadge(selectedOrder.priority)}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Estimate</p>
                  <p className="font-bold text-emerald-500">
                    {selectedOrder.estimate ? `$${selectedOrder.estimate.toLocaleString()}` : "N/A"}
                  </p>
                </div>
              </div>

              {/* Status Change */}
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-500 mb-2">Change Status:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUSES).map(([key, value]) => (
                    <Button
                      key={key}
                      size="sm"
                      className={`${value.color} hover:opacity-80`}
                      onClick={() => {
                        updateStatus(selectedOrder, key)
                        setSelectedOrder({...selectedOrder, status: key})
                      }}
                    >
                      {value.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {isDeleteOpen ? (
               <div className="flex gap-2 w-full">
                  <Button variant="destructive" className="w-full" onClick={submitDelete}>
                    Confirm Delete
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </Button>
               </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* DELETE CONFIRMATION DIALOG (Separate for clarity) */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
             Are you sure you want to delete Work Order <b>{selectedOrder?.id}</b>?
             This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={submitDelete}>Delete Work Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
