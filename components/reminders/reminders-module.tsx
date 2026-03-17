"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  Eye,
  Pencil,
  Trash2,
  Bell,
  Car,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Phone,
  Mail
} from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface Reminder {
  id: string
  type: "service" | "registration" | "insurance" | "inspection"
  vehicle: { make: string; model: string; year: number; plate: string }
  customer: { name: string; phone: string; email: string }
  dueDate: string
  status: "pending" | "sent" | "completed" | "overdue"
  lastNotified?: string
  notes?: string
}

// Removed mockReminders

const REMINDER_TYPES = {
  service: { label: "Service Due", color: "bg-blue-500", icon: Car },
  registration: { label: "Registration", color: "bg-purple-500", icon: Calendar },
  insurance: { label: "Insurance", color: "bg-amber-500", icon: AlertTriangle },
  inspection: { label: "Inspection", color: "bg-cyan-500", icon: CheckCircle2 },
}

export function RemindersModule({ orgId = "mass-hargeisa" }: { orgId?: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  
  const remindersQuery = useQuery(api.functions.getReminders)

  const mappedReminders: Reminder[] = (remindersQuery || []).map((r: any) => ({
    id: r._id,
    type: (r.type || "service") as Reminder["type"],
    vehicle: { make: r.vehicleMake || "N/A", model: r.vehicleModel || "N/A", year: r.vehicleYear || new Date().getFullYear(), plate: r.vehiclePlate || "N/A" },
    customer: { name: r.customerName || "N/A", phone: r.customerPhone || "N/A", email: r.customerEmail || "" },
    dueDate: r.dueDate,
    status: (r.status || "pending") as Reminder["status"],
    lastNotified: r.lastNotified,
    notes: r.notes
  }))

  const filteredReminders = mappedReminders.filter(reminder => {
    const matchesSearch = 
      reminder.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === "all" || reminder.type === typeFilter
    
    return matchesSearch && matchesType
  })

  const getStatusBadge = (status: Reminder["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
      case "sent":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Sent</Badge>
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "overdue":
        return <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>
    }
  }

  const getTypeBadge = (type: Reminder["type"]) => {
    const config = REMINDER_TYPES[type]
    return <Badge className={`${config.color} hover:opacity-80`}>{config.label}</Badge>
  }

  // Stats
  const overdueCount = mappedReminders.filter(r => r.status === "overdue").length
  const pendingCount = mappedReminders.filter(r => r.status === "pending").length
  const sentCount = mappedReminders.filter(r => r.status === "sent").length

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Service Reminders
        </h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
            <Send className="h-4 w-4 mr-2" />
            Send All Pending
          </Button>
          <Button className="bg-[#00A65A] hover:bg-[#008d4c] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-red-500 text-white border-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Overdue</p>
              <h3 className="text-2xl font-bold">{overdueCount}</h3>
            </div>
            <AlertTriangle className="h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-amber-500 text-white border-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Pending</p>
              <h3 className="text-2xl font-bold">{pendingCount}</h3>
            </div>
            <Clock className="h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-blue-500 text-white border-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Sent</p>
              <h3 className="text-2xl font-bold">{sentCount}</h3>
            </div>
            <Send className="h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-500 text-white border-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total</p>
              <h3 className="text-2xl font-bold">{mappedReminders.length}</h3>
            </div>
            <Bell className="h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button 
          size="sm" 
          variant={typeFilter === "all" ? "default" : "outline"}
          onClick={() => setTypeFilter("all")}
          className={typeFilter === "all" ? "bg-slate-800" : ""}
        >
          All ({mappedReminders.length})
        </Button>
        {Object.entries(REMINDER_TYPES).map(([key, value]) => (
          <Button 
            key={key}
            size="sm" 
            variant={typeFilter === key ? "default" : "outline"}
            onClick={() => setTypeFilter(key)}
            className={typeFilter === key ? value.color : ""}
          >
            {value.label} ({mappedReminders.filter(r => r.type === key).length})
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
      <div className="bg-white dark:bg-slate-900 rounded-b-lg border border-t-0 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-4 py-4 font-bold">Type</th>
              <th className="px-4 py-4 font-bold">Vehicle</th>
              <th className="px-4 py-4 font-bold">Customer</th>
              <th className="px-4 py-4 font-bold">Contact</th>
              <th className="px-4 py-4 font-bold">Due Date</th>
              <th className="px-4 py-4 font-bold">Status</th>
              <th className="px-4 py-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredReminders.map((reminder) => (
              <tr key={reminder.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${reminder.status === 'overdue' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                {/* Type */}
                <td className="px-4 py-3">
                  {getTypeBadge(reminder.type)}
                </td>
                
                {/* Vehicle */}
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {reminder.vehicle.year} {reminder.vehicle.make} {reminder.vehicle.model}
                  </div>
                  <div className="text-xs text-orange-600 font-mono">{reminder.vehicle.plate}</div>
                </td>
                
                {/* Customer */}
                <td className="px-4 py-3 font-medium">
                  {reminder.customer.name}
                </td>
                
                {/* Contact */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Phone className="h-3 w-3" />
                    {reminder.customer.phone}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Mail className="h-3 w-3" />
                    {reminder.customer.email}
                  </div>
                </td>
                
                {/* Due Date */}
                <td className="px-4 py-3">
                  <div className={`flex items-center gap-1 font-semibold ${reminder.status === 'overdue' ? 'text-red-600' : 'text-slate-700'}`}>
                    <Calendar className="h-3 w-3" />
                    {new Date(reminder.dueDate).toLocaleDateString()}
                  </div>
                  {reminder.lastNotified && (
                    <div className="text-xs text-slate-500">
                      Last sent: {new Date(reminder.lastNotified).toLocaleDateString()}
                    </div>
                  )}
                </td>
                
                {/* Status */}
                <td className="px-4 py-3">
                  {getStatusBadge(reminder.status)}
                </td>
                
                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    {/* Blue: Send Reminder */}
                    <Button size="icon" className="h-7 w-7 bg-[#00c0ef] hover:bg-[#00acd6] text-white rounded shadow-sm">
                      <Send className="h-3 w-3" />
                    </Button>
                    
                    {/* Yellow: View */}
                    <Button size="icon" className="h-7 w-7 bg-[#f39c12] hover:bg-[#d58512] text-white rounded shadow-sm">
                      <Eye className="h-3 w-3" />
                    </Button>

                    {/* Light Blue: Edit */}
                    <Button size="icon" className="h-7 w-7 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded shadow-sm">
                      <Pencil className="h-3 w-3" />
                    </Button>

                    {/* Red: Delete */}
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
             Showing {filteredReminders.length} entries
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

export default RemindersModule
