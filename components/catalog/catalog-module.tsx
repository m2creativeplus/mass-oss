"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Wrench,
  Car,
  Package,
  Clock,
  DollarSign
} from "lucide-react"

interface CatalogItem {
  id: string
  name: string
  category: "service" | "part" | "package"
  description: string
  price: number
  duration?: string
  popular: boolean
}

const mockCatalog: CatalogItem[] = [
  { id: "CAT-001", name: "Full Service", category: "service", description: "Complete vehicle inspection, oil change, filter replacement", price: 150, duration: "2-3 hours", popular: true },
  { id: "CAT-002", name: "Oil Change", category: "service", description: "Engine oil and filter replacement", price: 45, duration: "30 mins", popular: true },
  { id: "CAT-003", name: "Brake Pad Replacement", category: "service", description: "Front or rear brake pad replacement", price: 120, duration: "1-2 hours", popular: false },
  { id: "CAT-004", name: "A/C Recharge", category: "service", description: "Air conditioning gas recharge", price: 75, duration: "45 mins", popular: true },
  { id: "CAT-005", name: "Tire Rotation", category: "service", description: "Rotate all four tires", price: 25, duration: "30 mins", popular: false },
  { id: "CAT-006", name: "Engine Oil 5W-30 (4L)", category: "part", description: "Premium synthetic engine oil", price: 45, popular: true },
  { id: "CAT-007", name: "Brake Pads (Set)", category: "part", description: "High-quality brake pads for most vehicles", price: 65, popular: false },
  { id: "CAT-008", name: "Air Filter", category: "part", description: "Universal air filter", price: 25, popular: false },
  { id: "CAT-009", name: "Gold Package", category: "package", description: "Full service + A/C + Tire rotation + Wash", price: 250, duration: "4 hours", popular: true },
  { id: "CAT-010", name: "Silver Package", category: "package", description: "Oil change + Tire rotation + Inspection", price: 120, duration: "1.5 hours", popular: false },
]

const CATEGORY_CONFIG = {
  service: { label: "Service", color: "bg-blue-500", icon: Wrench },
  part: { label: "Part", color: "bg-green-500", icon: Package },
  package: { label: "Package", color: "bg-purple-500", icon: Car },
}

export function CatalogModule() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredItems = mockCatalog.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
      >
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Services & Parts Catalog
        </h2>
        
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "service", "part", "package"].map((cat) => (
          <Button 
            key={cat}
            size="sm" 
            variant={categoryFilter === cat ? "default" : "outline"}
            onClick={() => setCategoryFilter(cat)}
            className={categoryFilter === cat ? (cat === "all" ? "bg-slate-800" : CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]?.color) : ""}
          >
            {cat === "all" ? "All" : CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]?.label}
            {cat !== "all" && ` (${mockCatalog.filter(i => i.category === cat).length})`}
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
              <th className="px-4 py-4 font-bold">Item</th>
              <th className="px-4 py-4 font-bold">Category</th>
              <th className="px-4 py-4 font-bold">Description</th>
              <th className="px-4 py-4 font-bold">Duration</th>
              <th className="px-4 py-4 font-bold">Price</th>
              <th className="px-4 py-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredItems.map((item, index) => {
              const config = CATEGORY_CONFIG[item.category]
              return (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-slate-900 dark:text-white">{item.name}</div>
                      {item.popular && (
                        <Badge className="bg-orange-500 text-xs">Popular</Badge>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <Badge className={`${config.color} text-white`}>
                      {config.label}
                    </Badge>
                  </td>
                  
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[250px] truncate">
                    {item.description}
                  </td>
                  
                  <td className="px-4 py-3">
                    {item.duration ? (
                      <span className="flex items-center gap-1 text-slate-600">
                        <Clock className="h-3 w-3" />
                        {item.duration}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-bold text-orange-600">
                      <DollarSign className="h-3 w-3" />
                      {item.price}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <Button size="icon" className="h-7 w-7 bg-[#f39c12] hover:bg-[#d58512] text-white rounded shadow-sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="icon" className="h-7 w-7 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded shadow-sm">
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" className="h-7 w-7 bg-[#dd4b39] hover:bg-[#d73925] text-white rounded shadow-sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Showing 1 to {filteredItems.length} of {mockCatalog.length} entries
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

export default CatalogModule
