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
  Wrench,
  Star,
  Phone
} from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface Technician {
  id: string
  name: string
  role: string
  phone: string
  status: "available" | "working" | "break" | "offline" | "diagnosing" | "repairing" | "waiting_parts" | "quality_check"
  completedToday: number
  efficiency: number
  rating: number
  specialties: string[]
  currentLoad: number
  maxCapacity: number
}

// Removed mockTechnicians

export function TechnicianDashboard({ orgId = "mass-hargeisa" }: { orgId?: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const users = useQuery(api.functions.getUsers)
  
  // Transform DB users to Technician format, strictly filtering for technicians
  const techniciansData: Technician[] = (users || [])
    .filter(u => u.role === "technician")
    .map(user => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      role: "Mechanic",
      phone: user.phone || "N/A",
      status: (user as any).status || "available",
      completedToday: (user as any).completedToday || 0,
      efficiency: user.efficiency || 85,
      rating: 4.5,
      specialties: user.specialties || ["Mechanical"],
      currentLoad: user.currentLoad || 0,
      maxCapacity: user.maxCapacity || 3
    }))

  const filteredTechnicians = techniciansData.filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: Technician["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Available</Badge>
      case "working":
      case "repairing":
        return <Badge className="bg-blue-600 hover:bg-blue-700 animate-pulse">Repairing</Badge>
      case "diagnosing":
        return <Badge className="bg-indigo-500 hover:bg-indigo-600">Diagnosing</Badge>
      case "waiting_parts":
        return <Badge className="bg-rose-500 hover:bg-rose-600">Waiting Parts</Badge>
      case "break":
        return <Badge className="bg-amber-400 hover:bg-amber-500">On Break</Badge>
      case "offline":
        return <Badge className="bg-slate-400 hover:bg-slate-500">Offline</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header Controls (Sakosys Style) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Mechanics List
        </h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="bg-[#00A65A] hover:bg-[#008d4c] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Mechanic
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

      {/* Data Table (Sakosys AdminLTE Style) */}
      <div className="bg-white dark:bg-slate-900 rounded-b-lg border border-t-0 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">Avatar</th>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Current Load</th>
              <th className="px-6 py-4 font-bold">Utilization</th>
              <th className="px-6 py-4 font-bold">Rating</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredTechnicians.map((tech) => (
              <tr key={tech.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {/* Avatar */}
                <td className="px-6 py-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow">
                    {tech.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </td>
                
                {/* Name */}
                <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">
                  {tech.name}
                  <div className="text-xs text-slate-500 flex flex-wrap gap-1 mt-1">
                    {tech.specialties.map((s, i) => (
                      <span key={i} className="bg-slate-100 dark:bg-slate-700 px-1 rounded">{s}</span>
                    ))}
                  </div>
                </td>
                
                {/* Load */}
                <td className="px-6 py-3 font-semibold text-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    tech.currentLoad >= tech.maxCapacity ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {tech.currentLoad}/{tech.maxCapacity}
                  </span>
                </td>
                
                {/* Utilization */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          (tech.currentLoad / (tech.maxCapacity || 1)) > 0.8 ? 'bg-orange-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${(tech.currentLoad / (tech.maxCapacity || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">
                      {Math.round((tech.currentLoad / (tech.maxCapacity || 1)) * 100)}%
                    </span>
                  </div>
                </td>
                
                {/* Rating */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{tech.rating}</span>
                  </div>
                </td>
                
                {/* Status */}
                <td className="px-6 py-3">
                  {getStatusBadge(tech.status)}
                </td>
                
                {/* Actions (4 color buttons) */}
                <td className="px-6 py-3">
                  <div className="flex justify-center gap-2">
                    {/* Blue: Assign */}
                    <Button size="icon" className="h-8 w-8 bg-[#00c0ef] hover:bg-[#00acd6] text-white rounded shadow-sm">
                      <Wrench className="h-4 w-4" />
                    </Button>
                    
                    {/* Yellow: View */}
                    <Button size="icon" className="h-8 w-8 bg-[#f39c12] hover:bg-[#d58512] text-white rounded shadow-sm">
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Light Blue: Edit */}
                    <Button size="icon" className="h-8 w-8 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded shadow-sm">
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {/* Red: Delete */}
                    <Button size="icon" className="h-8 w-8 bg-[#dd4b39] hover:bg-[#d73925] text-white rounded shadow-sm">
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
             Showing {filteredTechnicians.length} entries
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
