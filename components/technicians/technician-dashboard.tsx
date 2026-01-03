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

interface Technician {
  id: string
  name: string
  role: string
  phone: string
  status: "available" | "working" | "break" | "offline"
  completedToday: number
  efficiency: number
  rating: number
  specialties: string[]
}

const mockTechnicians: Technician[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Senior Mechanic",
    phone: "+252 63 111 2222",
    status: "working",
    completedToday: 3,
    efficiency: 95,
    rating: 4.8,
    specialties: ["Engine Repair", "Brake Systems"]
  },
  {
    id: "2",
    name: "Mike Ross",
    role: "Mechanic",
    phone: "+252 63 333 4444",
    status: "available",
    completedToday: 2,
    efficiency: 88,
    rating: 4.6,
    specialties: ["Oil Service", "General Maintenance"]
  },
  {
    id: "3",
    name: "Sarah Smith",
    role: "Technician",
    phone: "+252 63 555 6666",
    status: "break",
    completedToday: 4,
    efficiency: 92,
    rating: 4.9,
    specialties: ["Electrical Systems", "Diagnostics"]
  },
  {
    id: "4",
    name: "Ahmed Hassan",
    role: "Junior Mechanic",
    phone: "+252 63 777 8888",
    status: "working",
    completedToday: 1,
    efficiency: 75,
    rating: 4.2,
    specialties: ["Tire Service", "Oil Change"]
  },
]

export function TechnicianDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTechnicians = mockTechnicians.filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: Technician["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>
      case "working":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Working</Badge>
      case "break":
        return <Badge className="bg-amber-500 hover:bg-amber-600">On Break</Badge>
      case "offline":
        return <Badge className="bg-slate-400 hover:bg-slate-500">Offline</Badge>
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
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Phone</th>
              <th className="px-6 py-4 font-bold">Jobs Today</th>
              <th className="px-6 py-4 font-bold">Efficiency</th>
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
                
                {/* Role */}
                <td className="px-6 py-3 text-slate-600">
                  {tech.role}
                </td>
                
                {/* Phone */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Phone className="h-3 w-3" />
                    {tech.phone}
                  </div>
                </td>
                
                {/* Jobs Today */}
                <td className="px-6 py-3 font-semibold text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                    {tech.completedToday}
                  </span>
                </td>
                
                {/* Efficiency */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${tech.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{tech.efficiency}%</span>
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
             Showing 1 to {filteredTechnicians.length} of {mockTechnicians.length} entries
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
