"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Eye,
  Pencil,
  Trash2,
  Truck,
  Car,
  Clock,
  CheckCircle2,
  Phone,
  MapPin
} from "lucide-react"

interface Delivery {
  id: string
  workOrderId: string
  vehicle: { make: string; model: string; year: number; plate: string }
  customer: { name: string; phone: string; address: string }
  scheduledDate: string
  scheduledTime: string
  driver: string
  status: "pending" | "in-transit" | "delivered" | "cancelled"
  notes?: string
}

const mockDeliveries: Delivery[] = [
  {
    id: "DEL-001",
    workOrderId: "WO-005",
    vehicle: { make: "Hyundai", model: "Elantra", year: 2022, plate: "JKL-7890" },
    customer: { name: "Ali Yusuf", phone: "+252-63-8901234", address: "26 July District, Hargeisa" },
    scheduledDate: "2026-01-01",
    scheduledTime: "10:00 AM",
    driver: "Ibrahim Hassan",
    status: "pending"
  },
  {
    id: "DEL-002",
    workOrderId: "WO-003",
    vehicle: { make: "Nissan", model: "Patrol", year: 2021, plate: "DEF-9012" },
    customer: { name: "Said Ibrahim", phone: "+252-63-2345678", address: "Jigjiga Yar, Hargeisa" },
    scheduledDate: "2026-01-01",
    scheduledTime: "02:00 PM",
    driver: "Mohamed Abdi",
    status: "in-transit"
  },
  {
    id: "DEL-003",
    workOrderId: "WO-001",
    vehicle: { make: "Toyota", model: "Camry", year: 2020, plate: "ABC-1234" },
    customer: { name: "Ahmed Hassan", phone: "+252-63-4567890", address: "Sha'ab Area, Hargeisa" },
    scheduledDate: "2025-12-31",
    scheduledTime: "04:00 PM",
    driver: "Ibrahim Hassan",
    status: "delivered"
  },
]

export function DeliveryModule() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredDeliveries = mockDeliveries.filter(delivery => {
    const matchesSearch = 
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Delivery["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
      case "in-transit":
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Transit</Badge>
      case "delivered":
        return <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Delivery Car
        </h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="bg-[#00A65A] hover:bg-[#008d4c] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Delivery
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
          All ({mockDeliveries.length})
        </Button>
        <Button 
          size="sm" 
          variant={statusFilter === "pending" ? "default" : "outline"}
          onClick={() => setStatusFilter("pending")}
          className={statusFilter === "pending" ? "bg-amber-500" : ""}
        >
          Pending ({mockDeliveries.filter(d => d.status === "pending").length})
        </Button>
        <Button 
          size="sm" 
          variant={statusFilter === "in-transit" ? "default" : "outline"}
          onClick={() => setStatusFilter("in-transit")}
          className={statusFilter === "in-transit" ? "bg-blue-500" : ""}
        >
          In Transit ({mockDeliveries.filter(d => d.status === "in-transit").length})
        </Button>
        <Button 
          size="sm" 
          variant={statusFilter === "delivered" ? "default" : "outline"}
          onClick={() => setStatusFilter("delivered")}
          className={statusFilter === "delivered" ? "bg-green-500" : ""}
        >
          Delivered ({mockDeliveries.filter(d => d.status === "delivered").length})
        </Button>
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
              <th className="px-4 py-4 font-bold">Delivery ID</th>
              <th className="px-4 py-4 font-bold">Vehicle</th>
              <th className="px-4 py-4 font-bold">Customer</th>
              <th className="px-4 py-4 font-bold">Address</th>
              <th className="px-4 py-4 font-bold">Scheduled</th>
              <th className="px-4 py-4 font-bold">Driver</th>
              <th className="px-4 py-4 font-bold">Status</th>
              <th className="px-4 py-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredDeliveries.map((delivery) => (
              <tr key={delivery.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {/* Delivery ID */}
                <td className="px-4 py-3">
                  <div className="font-bold text-blue-600">{delivery.id}</div>
                  <div className="text-xs text-slate-500">WO: {delivery.workOrderId}</div>
                </td>
                
                {/* Vehicle */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {delivery.vehicle.year} {delivery.vehicle.make} {delivery.vehicle.model}
                      </div>
                      <div className="text-xs text-orange-600 font-mono">{delivery.vehicle.plate}</div>
                    </div>
                  </div>
                </td>
                
                {/* Customer */}
                <td className="px-4 py-3">
                  <div className="font-medium">{delivery.customer.name}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Phone className="h-3 w-3" />
                    {delivery.customer.phone}
                  </div>
                </td>
                
                {/* Address */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-red-500" />
                    {delivery.customer.address}
                  </div>
                </td>
                
                {/* Scheduled */}
                <td className="px-4 py-3 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(delivery.scheduledDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs font-semibold">{delivery.scheduledTime}</div>
                </td>
                
                {/* Driver */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-slate-400" />
                    {delivery.driver}
                  </div>
                </td>
                
                {/* Status */}
                <td className="px-4 py-3">
                  {getStatusBadge(delivery.status)}
                </td>
                
                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    {/* Green: Mark Delivered */}
                    {delivery.status !== "delivered" && (
                      <Button size="icon" className="h-7 w-7 bg-[#00A65A] hover:bg-[#008d4c] text-white rounded shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {/* Yellow: View */}
                    <Button size="icon" className="h-7 w-7 bg-[#f39c12] hover:bg-[#d58512] text-white rounded shadow-sm">
                      <Eye className="h-3 w-3" />
                    </Button>

                    {/* Light Blue: Edit */}
                    <Button size="icon" className="h-7 w-7 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded shadow-sm">
                      <Pencil className="h-3 w-3" />
                    </Button>

                    {/* Red: Cancel/Delete */}
                    <Button size="icon" className="h-7 w-7 bg-[#dd4b39] hover:bg-[#d73925] text-white rounded shadow-sm">
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
             Showing 1 to {filteredDeliveries.length} of {mockDeliveries.length} entries
           </div>
           <div className="flex gap-1">
             <Button variant="outline" size="sm" className="h-7 text-xs" disabled>Previous</Button>
             <Button size="sm" className="h-7 text-xs bg-blue-500 text-white hover:bg-blue-600">1</Button>
             <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
           </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryModule
